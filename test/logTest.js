var tools = require('../common/tools');
var moment = require('moment');
var config = require('../config');
var validator = require('validator');
var _ = require('lodash');
var User = require('../proxy').User;

//console.log(tools.encrypt('1111111111111111', '156156165152165156156', 'i7cslg3pa7kpci7b'));

console.log(tools.decrypt('1485072453850724', 'VmbogqWAMfiOqSiTEzre5n0O4PmBkfaLF6V7X3v6E3X3ZE1EuN7vtXPb04PPSw44', 'FUBCTIJOQAUG9KGS'));

console.log(tools.genOauthNonce());
console.log(tools.dateDiff(parseInt(1485066636 + '000'), moment()));
console.log(tools.genTimestamp());
console.log(tools.generateRand(16));

var user = User.buildUser({user_name: '18612700346', password: '123456', token: '123'});
user.save().then(function(user_tmp) {
  console.log(user_tmp, '=====');
});
