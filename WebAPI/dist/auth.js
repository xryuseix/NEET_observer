"use strict";
const auth = require('basic-auth');
const admins = {
    'testuser': { password: 'passwd' },
};
module.exports = (req, res, next) => {
    const user = auth(req);
    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).send();
    }
    return next();
};
//# sourceMappingURL=auth.js.map