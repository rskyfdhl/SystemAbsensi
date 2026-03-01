from flask import Blueprint, request, session
from database import query
from helpers import ok, err, require_fields
import bcrypt

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/auth/login", methods=["POST"])
def login():
    d = request.get_json(silent=True) or {}
    valid, resp = require_fields(d, "username", "password")
    if not valid:
        return resp

    user = query(
        "SELECT * FROM user_admin WHERE username=%s AND aktif=1",
        (d["username"],), fetchone=True)

    if not user:
        return err("Username atau password salah", 401)

    if not bcrypt.checkpw(
        d["password"].encode("utf-8"),
        user["password"].encode("utf-8")
    ):
        return err("Username atau password salah", 401)

    session["user_id"]  = user["id"]
    session["username"] = user["username"]
    session["nama"]     = user["nama"]
    session["role"]     = user["role"]
    session.permanent   = True

    return ok({
        "id":       user["id"],
        "username": user["username"],
        "nama":     user["nama"],
        "role":     user["role"],
    }, msg="Login berhasil")


@auth_bp.route("/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return ok(msg="Logout berhasil")


@auth_bp.route("/auth/me")
def me():
    if "user_id" not in session:
        return err("Belum login", 401)
    return ok({
        "id":       session["user_id"],
        "username": session["username"],
        "nama":     session["nama"],
        "role":     session["role"],
    })


@auth_bp.route("/auth/change-password", methods=["POST"])
def change_password():
    if "user_id" not in session:
        return err("Belum login", 401)

    d = request.get_json(silent=True) or {}
    valid, resp = require_fields(d, "password_lama", "password_baru")
    if not valid:
        return resp

    user = query(
        "SELECT password FROM user_admin WHERE id=%s",
        (session["user_id"],), fetchone=True)

    if not bcrypt.checkpw(
        d["password_lama"].encode("utf-8"),
        user["password"].encode("utf-8")
    ):
        return err("Password lama salah", 400)

    new_hash = bcrypt.hashpw(
        d["password_baru"].encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    query("UPDATE user_admin SET password=%s WHERE id=%s",
          (new_hash, session["user_id"]), commit=True)

    return ok(msg="Password berhasil diubah")