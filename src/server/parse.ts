import url from "url";
import { RequestHandler, Request } from "express";

export interface ParsedRequest extends Request {
  context: {
    inputUrl: string;
  };
}

const parse: RequestHandler = (req, _res, next) => {
  // decode the encoded url
  const inputUrl = url.parse(req.params.inputUrl).href;

  if (!inputUrl) {
    return next(new Error("Invalid input url"));
  }

  (req as ParsedRequest).context = {
    inputUrl
  };

  next();
};

export default parse;
