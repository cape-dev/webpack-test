var _ = require("lodash");
var t = {};
_.set(t, 'test', "I am a/b/c/test1.js lalala");
module.exports.test = t.test;