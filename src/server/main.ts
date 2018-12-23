import express, { ErrorRequestHandler } from "express";
import "pug";
import shortenURL from "./shorten";
import redirectURL from "./redirect";
import parseURL from "./parse";
import path from "path";

const app = express();

app.set("view engine", "pug");

app.use("/static", express.static(path.join(__dirname, "..", "/static")));

app.get("/", (_, res) => {
  res.render("index");
});
app.get("/new/:inputUrl", parseURL, shortenURL);

app.get(/\/(?:[A-Za-z0-9]){5}/, redirectURL);

// log errors
const handleErrors: ErrorRequestHandler = (err, _req, _res, next) => {
  console.error(err.stack);
  next(err);
};
app.use(handleErrors);

app.listen(process.env.PORT || 3000, () => {
  console.log("App listening on port " + (process.env.PORT || 3000) + "!");
});
