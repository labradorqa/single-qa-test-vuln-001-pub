// Server-Side Template Injection (SSTI) + NoSQL injection patterns.
// IVAS SAST QA용.
'use strict';

const ejs = require('ejs');
const handlebars = require('handlebars');

// 1) SSTI — 사용자 입력을 그대로 template으로 컴파일
module.exports.renderUserTemplate = function (req, res) {
  const userTemplate = req.body.template; // 신뢰 불가
  const html = ejs.render(userTemplate, { user: req.session.user });
  res.send(html);
};

// 2) handlebars unescaped helper로 XSS 유도
handlebars.registerHelper('raw', function (text) {
  return new handlebars.SafeString(text); // user input을 safe 처리
});

// 3) NoSQL injection — req.body를 mongoose query에 그대로
const mongoose = require('mongoose');
const User = mongoose.model('User', new mongoose.Schema({ name: String, password: String }));

module.exports.unsafeLogin = function (req, res) {
  // username/password 객체 그대로 — { $gt: '' } 같은 operator 주입 가능
  User.findOne({
    name: req.body.username,
    password: req.body.password,
  }).then((u) => res.json(u));
};

// 4) where() 사용 — js code execution on MongoDB
module.exports.runSearch = function (req, res) {
  User.find({}).where(req.query.condition).exec((err, docs) => res.json(docs));
};

// 5) Open redirect
module.exports.redirect = function (req, res) {
  res.redirect(req.query.next); // 검증 없는 redirect
};

// 6) LDAP injection
const ldap = require('ldapjs');
module.exports.ldapSearch = function (req, res) {
  const client = ldap.createClient({ url: 'ldap://internal:389' });
  // filter에 user 입력 그대로 concat
  client.search('ou=users,dc=samsungfire,dc=co,dc=kr', {
    filter: `(uid=${req.query.uid})`,
    scope: 'sub',
  }, (err, sres) => {
    /* ... */
  });
};
