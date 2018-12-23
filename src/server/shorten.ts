import { RequestHandler, Request } from "express";
import JsonDB from "node-json-db";
import { generate } from "shortid";
import { ParsedRequest } from "./parse";

const db = new JsonDB("data/db", true, false);

const getShortUrl = (url: Data.UrlInfo, req: Request) =>
  `${req.protocol}://${req.hostname}/${url.short_url}`;

const findUrl = (data: Data.DB, inputUrl: string): Data.UrlInfo | undefined =>
  data.urls.find(url => url.original_url === inputUrl);

const shortenURL: RequestHandler = (req, res) => {
  let data: Data.DB = db.getData("/");

  const inputUrl = (req as ParsedRequest).context.inputUrl;

  // if database is empty, create a new array
  if (!data.urls || !Array.isArray(data.urls)) {
    data = { urls: [] };
  }

  const foundUrl = findUrl(data, inputUrl);
  if (foundUrl) {
    // url already shortened
    return res.json({
      original_url: foundUrl.original_url,
      short_url: getShortUrl(foundUrl, req)
    });
  }
  // url is new

  // create a secure id that is unique in the database
  var newId = generate();

  // filter out data that is older than 24h ( or 86.400.000 ms )
  var now = new Date().getTime();
  const filteredUrls = data.urls.filter(url => now - url.timestamp > 86400000);

  if (data.urls.length !== filteredUrls.length) {
    data.urls = filteredUrls;
  }

  // create new object, save it and send it back
  var newObj = {
    original_url: req.params.inputUrl,
    short_url: newId,
    timestamp: now
  };
  data.urls.push(newObj);

  // if data object is over 9000 -> delete first item
  data.urls.length > 9000 && data.urls.shift();

  db.push("/", data);
  res.json({
    original_url: newObj.original_url,
    short_url: getShortUrl(newObj, req)
  });
};

export default shortenURL;
