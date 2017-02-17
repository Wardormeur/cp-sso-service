'use strict';

module.exports = function (seneca) {
  seneca.listen()
    .client({type: 'web', port: 10303, pin: {role: 'cd-users', cmd: '*'}})
    .client({type: 'web', port: 10303, pin: {role: 'cd-agreements', cmd: '*'}})
    .client({type: 'web', port: 10303, pin: {role: 'cd-profiles', cmd: '*'}})
    .client({type: 'web', port: 10303, pin: {role: 'cd-user-profile', cmd: '*'}})
    .client({type: 'web', port: 10301, pin: {role: 'cd-dojos', cmd: '*'}});
};
