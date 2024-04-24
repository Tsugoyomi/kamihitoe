var express = require("express");
var app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json());

const {
  getList,
  getDetail,
  searchAnimeQuery,
  searchAnime
}  = require('./anime');

const {
  getListManga,
  getDetailManga,
  getDetailChapter,
  searchManga
} = require('./manga');

app.get("/anime/list/common", async (req, res, next) => {
  const result = await getList();

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

app.post("/anime/detail/episode", async (req, res, next) => {
  const {
    url
  } = req.body;

  const result = await getDetail(url, 'eps');

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

app.post("/anime/detail", async (req, res, next) => {
  const {
    url
  } = req.body;

  const result = await getDetail(url, 'anime');

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

// Ini kepake kalo menggunakan Autocomplete
app.post("/anime/search/query", async (req, res, next) => {
  const {
    name
  } = req.body;

  const result = await searchAnimeQuery(name);

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

app.post("/anime/search", async (req, res, next) => {
  const {
    name
  } = req.body;

  const result = await searchAnime(name);

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

// Manga
app.get("/manga/list/new", async (req, res, next) => {
  const result = await getListManga();

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

app.post("/manga/detail", async (req, res, next) => {
  const {
    url
  } = req.body;

  const result = await getDetailManga(url);

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

app.post("/manga/detail/chapter", async (req, res, next) => {
  const {
    url
  } = req.body;

  const result = await getDetailChapter(url);

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

app.post("/manga/search", async (req, res, next) => {
  const {
    name
  } = req.body;

  const result = await searchManga(name);

  res.send({
    statusCode: 200,
    message: 'Success',
    data: result
  });
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});