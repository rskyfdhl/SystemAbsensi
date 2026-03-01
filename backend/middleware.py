from functools import wraps
from flask import session
from helpers import err


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return err("Sesi habis, silakan login kembali", 401)
        return f(*args, **kwargs)
    return decorated


def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if "user_id" not in session:
                return err("Sesi habis, silakan login kembali", 401)
            if session.get("role") not in roles:
                return err("Akses ditolak", 403)
            return f(*args, **kwargs)
        return decorated
    return decorator