# base-vuln

Vulnerable baseline for IVAS QA — `samsungfire-qa-base-vuln` GitHub 리포의 source.

## 의도된 취약점

### SCA — JavaScript / Node (package.json)
- `lodash@4.17.10` — Prototype pollution (CVE-2018-3721, CVE-2019-10744)
- `minimist@0.0.8` — Prototype pollution (CVE-2020-7598)
- `qs@6.5.1` — Prototype pollution (CVE-2017-1000048)
- `express@4.16.0` — 옛 버전 (다수 의존성 취약)
- `moment@2.24.0` — Regex DoS (CVE-2017-18214)
- `axios@0.18.0` — SSRF / 인젝션
- `node-serialize@0.0.4` — Insecure deserialization (CVE-2017-5941)
- `debug@2.0.0` — Regex DoS
- `jsonwebtoken@0.4.0` — none algorithm 허용
- `ms@0.7.0`, `marked@0.3.6`, `request@2.81.0`, `tar@2.0.0`
- `xml2js@0.4.19` — Prototype pollution (CVE-2023-0842)
- `ejs@3.1.6` — RCE via template (CVE-2022-29078)
- `handlebars@4.0.13` — Prototype pollution (CVE-2019-19919)
- `mongoose@5.7.5` — search injection 위험 버전
- `node-forge@0.9.0` — multiple CVEs
- `shelljs@0.8.4` — command injection 위험
- `validator@10.4.0`, `mysql@2.16.0`, `yargs-parser@5.0.0` — known issues
- `y18n@3.2.1` — Prototype pollution (CVE-2020-7774)
- `fastify@2.0.0` — older
- `libxmljs@0.19.7` — XXE 미차단

### SCA — Java / Maven (pom.xml) 신규
- `log4j-core@2.14.0` — **Log4Shell** (CVE-2021-44228)
- `spring-webmvc@5.3.16` — **Spring4Shell** (CVE-2022-22965)
- `spring-cloud-function-context@3.1.6` — CVE-2022-22963
- `jackson-databind@2.9.8` — RCE
- `commons-text@1.9` — **Text4Shell** (CVE-2022-42889)
- `struts2-core@2.3.32` — RCE (CVE-2017-5638)
- `snakeyaml@1.29` — deserialization (CVE-2022-1471)
- `tomcat-embed-core@9.0.30` — Ghostcat (CVE-2020-1938)
- `hibernate-core@5.4.18`, `guava@24.1.1-jre`

### SCA — Python / pip (requirements.txt) 신규
Django 2.2.0, Flask 0.12.2, requests 2.19.1, urllib3 1.24.1, PyYAML 3.13, Jinja2 2.7.2, Werkzeug 0.11.10, SQLAlchemy 1.2.18, Pillow 8.1.0, cryptography 2.3, pycrypto 2.6.1, paramiko 2.4.1, lxml 4.6.2.

### SCA — Ruby / Bundler (Gemfile) 신규
Rails 5.2.0, Nokogiri 1.10.4, devise 4.5.0, rack 2.0.5, rubyzip 1.2.1 (Zip Slip), loofah 2.2.0.

### IaC (Dockerfile) 신규
- Outdated base image (`node:10.13.0-alpine`)
- root 실행 + sudo NOPASSWD 추가
- 하드코딩 secret (AWS keys, DB password) ENV 노출
- curl-pipe-sh 패턴
- `ADD` 원격 URL 다운로드
- `chmod 777`, 모든 포트 EXPOSE
- `--unsafe-perm` npm install

### Secret patterns (`.env.example`, `keys/dev-key.pem`) 신규
- AWS access key / secret pattern
- GitHub PAT, Slack token, Stripe key, npm token, Google API key pattern
- DB URL credentials inline
- RSA private key block (fixture)

### SAST (코드 패턴)
- 하드코딩 시크릿
- `eval()` / 사용자 입력 조립
- Command Injection (`exec(req.query.host)`)
- SQL Injection (raw concat / template literal) + `mysql`
- Path Traversal (`fs.readFile(userPath)`)
- SSRF (`axios.get(req.query.url)`, `request(target).pipe(res)`)
- Insecure Deserialization (`node-serialize.unserialize`)
- JWT none algorithm sign
- 약한 해시 (md5)
- Prototype Pollution (`_.merge({}, qs.parse(...))`)
- Markdown XSS (옛 버전 `marked`)
- **XXE** (`src/xxe.js` — `libxmljs.parseXml({noent:true})`, `xml2js`) 신규
- **SSTI** (`src/template.js` — `ejs.render(req.body.template)`) 신규
- **NoSQL injection** (`User.findOne({name: req.body.username})`) 신규
- **LDAP injection** (`(uid=${req.query.uid})`) 신규
- **Open redirect** (`res.redirect(req.query.next)`) 신규

## 사용

이 코드는 `~/Desktop/work/test_repo/samsungfire-qa-test-vuln-001(-pub)`에 복사되어 사용. 갱신이 필요하면 해당 로컬 폴더에서 직접 복사·commit·push.
