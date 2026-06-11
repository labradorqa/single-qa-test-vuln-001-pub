// Intentional XXE pattern for IVAS SAST QA.
// External entity expansion 미차단 — billion laughs / file disclosure 가능.
'use strict';

const libxmljs = require('libxmljs');
const fs = require('fs');

module.exports = function parseUserXml(xmlString) {
  // 취약: noent=true, noblanks=false, expand_entities not disabled
  const doc = libxmljs.parseXml(xmlString, {
    noent: true,
    noblanks: false,
    nonet: false,
    dtdload: true,
    dtdvalid: true,
  });

  return doc.toString();
};

// 또 다른 패턴 — xml2js with explicit allow
const xml2js = require('xml2js');
module.exports.unsafeParse = function (xmlString, cb) {
  const parser = new xml2js.Parser({
    explicitArray: true,
    explicitCharkey: true,
    xmlns: true,
    // 외부 엔티티 처리 활성화된 채로 사용자 입력 수신
  });
  parser.parseString(xmlString, cb);
};

// 직접 fs.readFile 트리거 — SSRF/LFI 보조
module.exports.includeFile = function (path) {
  // 신뢰할 수 없는 path 입력을 그대로 readFile
  return fs.readFileSync(path, 'utf8');
};
