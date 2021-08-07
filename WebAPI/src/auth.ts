const auth = require('basic-auth');

interface StringKeyObject {
  // 今回はstring
  [key: string]: any;
}
const admins: StringKeyObject = {
  'testuser': { password: 'passwd' },
};

module.exports = (req:any, res:any, next:any) => {
  const user = auth(req);
  if (!user || !admins[user.name] || admins[user.name].password !== user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send();
  }
  return next();
};