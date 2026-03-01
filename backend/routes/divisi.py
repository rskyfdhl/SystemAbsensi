from flask import Blueprint
from database import query
from helpers import ok

divisi_bp = Blueprint("divisi", __name__)

@divisi_bp.route("/divisi")
def list_divisi():
    return ok(query("SELECT * FROM divisi ORDER BY nama"))