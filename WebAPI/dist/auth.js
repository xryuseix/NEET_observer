"use strict";
/** @format */
const auth = require("basic-auth");
const fs = require("fs");
const admins = JSON.parse(fs.readFileSync("./userList.json", "utf8"));
module.exports = (req, res, next) => {
    const user = auth(req);
    if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
        res.set("WWW-Authenticate", 'Basic realm="example"');
        return res.status(401).send();
    }
    return next();
};
//# sourceMappingURL=auth.js.map