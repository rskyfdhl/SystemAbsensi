from flask import jsonify
from datetime import date, datetime, timedelta
from decimal import Decimal
import json


# ── JSON SERIALIZER ───────────────────────────────────────────

def _serialize(obj):
    """Ubah tipe Python yang tidak bisa di-JSON-kan."""
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, timedelta):
        return str(obj)
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError(f"Type {type(obj)} not serializable")


def to_json(data):
    """Convert data (list/dict) yang mungkin berisi date/datetime ke JSON-safe."""
    return json.loads(json.dumps(data, default=_serialize))


# ── RESPONSE HELPERS ──────────────────────────────────────────

def ok(data=None, msg="OK", code=200, **kw):
    """Return response sukses."""
    payload = {"status": "ok", "msg": msg}
    if data is not None:
        payload["data"] = to_json(data) if data else data
    payload.update(kw)
    return jsonify(payload), code


def err(msg: str, code: int = 400):
    """Return response error."""
    return jsonify({"status": "error", "msg": msg}), code


# ── REQUEST VALIDATOR ─────────────────────────────────────────

def require_fields(data: dict, *fields: str):
    """
    Cek apakah field wajib ada di request body.
    Return (True, None) jika OK, (False, response) jika ada yang kurang.
    """
    missing = [f for f in fields if not data.get(f)]
    if missing:
        return False, err(f"Field wajib tidak lengkap: {', '.join(missing)}")
    return True, None