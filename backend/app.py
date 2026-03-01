import logging
import os
from datetime import timedelta
from flask import Flask, send_from_directory, abort
from flask_cors import CORS

from config import Config
from database import init_pool

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s — %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("app")


def create_app() -> Flask:
    static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

    # ── PENTING: static_folder=None ──────────────────────────
    # Matikan static handler bawaan Flask agar tidak
    # mengambil alih route sebelum serve_react dipanggil
    app = Flask(__name__, static_folder=None)

    app.config.from_object(Config)
    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["PERMANENT_SESSION_LIFETIME"] = timedelta(hours=8)

    CORS(app, resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True)

    with app.app_context():
        try:
            init_pool()
        except Exception as e:
            log.error(f"Gagal inisialisasi DB: {e}")

    # ── REGISTER BLUEPRINTS ───────────────────────────────────
    from routes.auth      import auth_bp
    from routes.dashboard import dashboard_bp
    from routes.absensi   import absensi_bp
    from routes.karyawan  import karyawan_bp
    from routes.shift     import shift_bp
    from routes.divisi    import divisi_bp
    from routes.perangkat import perangkat_bp
    from routes.sync      import sync_bp
    from routes.laporan   import laporan_bp

    for bp in [auth_bp, dashboard_bp, absensi_bp, karyawan_bp,
               shift_bp, divisi_bp, perangkat_bp, sync_bp, laporan_bp]:
        app.register_blueprint(bp, url_prefix="/api")

    # ── SERVE REACT ───────────────────────────────────────────
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_react(path):
        # Jangan tangani /api/* — sudah ditangani blueprint
        if path.startswith("api/"):
            abort(404)

        # File statis nyata (js/css/assets/vite.svg) → serve langsung
        full = os.path.join(static_dir, path)
        if path and os.path.exists(full):
            return send_from_directory(static_dir, path)

        # Semua route React (/absensi /karyawan dst)
        # → return index.html, React Router yang handle navigasi
        return send_from_directory(static_dir, "index.html")

    # ── AUTO-SYNC BACKGROUND THREAD ───────────────────────────
    if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        from services.autosync import start_autosync
        start_autosync(app, interval_seconds=Config.FP_SYNC_INTERVAL)

    log.info(f"✓ Flask app siap — static: {static_dir}")
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=Config.DEBUG)