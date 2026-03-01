import logging
log = logging.getLogger("fingerprint")


class FingerprintService:
    def __init__(self, ip: str, port: int = 4370, timeout: int = 10):
        self.ip      = ip
        self.port    = port
        self.timeout = timeout

    def _get_zk(self):
        try:
            from zk import ZK
            return ZK(self.ip, port=self.port, timeout=self.timeout,
                      password=0, force_udp=False, ommit_ping=False)
        except ImportError:
            raise RuntimeError(
                "Library pyzk belum terinstall. Jalankan: pip install pyzk")

    def test_connection(self) -> tuple[bool, str]:
        conn = None
        try:
            zk = self._get_zk(); conn = zk.connect(); conn.disconnect()
            return True, f"Koneksi ke {self.ip}:{self.port} berhasil ✓"
        except Exception as e:
            return False, f"Gagal: {e}"

    def get_attendance(self) -> tuple[bool, list | None, str]:
        conn = None
        try:
            zk = self._get_zk(); conn = zk.connect()
            conn.disable_device()
            data = conn.get_attendance()
            conn.enable_device(); conn.disconnect()
            log.info(f"[{self.ip}] {len(data)} record diambil")
            return True, data, "OK"
        except Exception as e:
            log.error(f"[{self.ip}] get_attendance error: {e}")
            try:
                if conn: conn.enable_device(); conn.disconnect()
            except Exception:
                pass
            return False, None, str(e)