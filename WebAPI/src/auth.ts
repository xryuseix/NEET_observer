/** @format */

const auth = require("basic-auth");
const fs = require("fs");

interface StringKeyObject {
  [key: string]: any;
}
const admins: StringKeyObject = JSON.parse(
  fs.readFileSync("./userList.json", "utf8")
);

module.exports = (req: any, res: any, next: any) => {
  const user = auth(req);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    res.set("WWW-Authenticate", 'Basic realm="example"');
    return res.status(401).send();
  }
  return next();
};
