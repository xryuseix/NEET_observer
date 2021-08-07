/** @format */

// req.user が使えるようにする。
declare namespace Express {
  export interface Request {
    file: any;
    send: any;
    status: any;
  }
}
