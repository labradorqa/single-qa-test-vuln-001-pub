# pyapp/app.py — Flask 진입점. request(원격 소스)를 취약 sink로 직접 연결 → CodeQL taint flow 발동.
import subprocess
import yaml          # PyYAML
import requests      # requests
from flask import Flask, request
from lxml import etree

app = Flask(__name__)
API_TOKEN = "ghp_FAKE000000000000000000000000000000"  # CWE-798 하드코딩 시크릿


@app.route("/config")
def cfg():
    # CWE-502: 신뢰 불가 입력을 yaml.load
    return str(yaml.load(request.args["raw"]))


@app.route("/eval")
def ev():
    # CWE-95: eval 인젝션
    return str(eval(request.args["expr"]))


@app.route("/user")
def user():
    # CWE-89: SQL injection (문자열 포매팅)
    sql = "SELECT * FROM users WHERE id = %s" % request.args["id"]
    return sql


@app.route("/ping")
def ping():
    # CWE-78: OS command injection (shell=True)
    return subprocess.check_output("ping -c1 " + request.args["host"], shell=True)


@app.route("/fetch")
def fetch():
    # CWE-918: SSRF
    return requests.get(request.args["url"], verify=False).text


@app.route("/xml", methods=["POST"])
def xml():
    # CWE-611: XXE
    parser = etree.XMLParser(resolve_entities=True, no_network=False)
    return etree.tostring(etree.fromstring(request.data, parser))
