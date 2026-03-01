import threading
import time
import logging

log = logging.getLogger("autosync")


def start_autosync(app, interval_seconds: int = 300) -> None:
    def _loop():
        time.sleep(20)  
        log.info(f"Auto-sync aktif — interval {interval_seconds}s")
        while True:
            try:
                with app.app_context():
                    _sync_all()
            except Exception as e:
                log.error(f"Auto-sync error: {e}")
            time.sleep(interval_seconds)

    t = threading.Thread(target=_loop, daemon=True, name="AutoSync")
    t.start()


def _sync_all() -> None:
    from database import query, query_many
    from services.fingerprint import FingerprintService
    from services.processor import proses_log_fp

    perangkats = query("SELECT * FROM perangkat_fp WHERE aktif=1")
    if not perangkats:
        return

    log.info(f"Auto-sync: {len(perangkats)} perangkat")
    total_baru = 0

    for p in perangkats:
        try:
            fp = FingerprintService(p["ip_address"], p["port"])
            ok, attendances, msg = fp.get_attendance()
            if not ok:
                log.warning(f"[{p['nama']}] {msg}")
                continue

            if attendances:
                rows = [(p["id"], a.user_id, a.timestamp, a.punch)
                        for a in attendances]
                inserted = query_many("""
                    INSERT IGNORE INTO log_fingerprint
                      (perangkat_id, fingerprint_uid, waktu_tap, tipe)
                    VALUES (%s,%s,%s,%s)
                """, rows)
                total_baru += inserted
                if inserted:
                    log.info(f"[{p['nama']}] {inserted} record baru")

            query("UPDATE perangkat_fp SET terakhir_sync=NOW() WHERE id=%s",
                  (p["id"],), commit=True)

        except Exception as e:
            log.error(f"[{p['nama']}] sync error: {e}")

    if total_baru > 0:
        proses_log_fp()
        log.info(f"Auto-sync selesai: {total_baru} record baru diproses")