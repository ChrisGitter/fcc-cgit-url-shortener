import JsonDB from "node-json-db";
import { RequestHandler, Response } from "express";

var db = new JsonDB("data/db", true, false);

/*
    searches the database for the matching url
    and redirects the user to the requested site
*/

const notFound = (res: Response) => res.status(404).send("Sorry, not found :(");

const redirect: RequestHandler = (req, res) => {
  const data: Data.DB = db.getData("/");
  const shortUrl = req.path.split("/")[1];

  if (
    typeof data.urls == "undefined" ||
    !Array.isArray(data.urls) ||
    !shortUrl
  ) {
    // no data yet, return error
    return notFound(res);
  }

  const foundData = data.urls.find(url => url.short_url === shortUrl);

  if (!foundData) {
    return notFound(res);
  }

  res.redirect(foundData.original_url);
};

export default redirect;
