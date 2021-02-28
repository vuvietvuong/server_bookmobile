const fs = require("fs");
const path = require("path");
const db = require("../configs/db.config");
const Book = db.book;
const Chapter = db.chapter;
require("dotenv").config();

exports.CreateBook = async (req, res) => {
  try {
    if (!req.body.name)
      return res
        .status(400)
        .send({ success: false, message: "Required book name!" });
    if (!req.body.description)
      return res
        .status(400)
        .send({ success: false, message: "Require book description!" });
    if (!req.body.author)
      return res
        .status(400)
        .send({ success: false, message: "Required book author!" });
    if (!req.body.imageUrl)
      return res
        .status(400)
        .send({ success: false, message: "Required book image!" });
    let newShop = await Book.create({
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
      imageUrl: req.body.imageUrl,
    });
    res.status(200).send({ success: true, data: newShop });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.CreateChapter = async (req, res) => {
  try {
    if (!req.body.name)
      return res
        .status(400)
        .send({ success: false, message: "Required chapter name!" });
    if (!req.body.linkPdf)
      return res
        .status(400)
        .send({ success: false, message: "Required pdf file!" });
    if (!req.body.bookId)
      return res
        .status(400)
        .send({ success: false, message: "Required bookId!" });
    let newChapter = await Chapter.create({
      name: req.body.name,
      linkPdf: req.body.linkPdf,
      bookId: req.body.bookId,
    });
    res.status(200).send({ success: true, data: newChapter });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.uploadImageBook = (req, res) => {
  const processedFile = req.file || {};
  let orgName = processedFile.originalname || "";
  orgName = orgName.trim().replace(/ /g, "-");
  const fullPathInServ = processedFile.path;
  const newFullPath = `${fullPathInServ}-${orgName}`;
  fs.renameSync(fullPathInServ, newFullPath);

  var fileString = path.basename(newFullPath);
  var filePath = `${process.env.SERVER_HOST}/api/image/` + fileString;

  res.status(200).send({ success: true, url: filePath });
};

exports.UploadFilePDF = (req, res) => {
  const processedFile = req.file || {};
  let orgName = processedFile.originalname || "";
  orgName = orgName.trim().replace(/ /g, "-");
  const fullPathInServ = processedFile.path;
  const newFullPath = `${fullPathInServ}-${orgName}`;
  fs.renameSync(fullPathInServ, newFullPath);

  var fileString = path.basename(newFullPath);
  var filePath = `${process.env.SERVER_HOST}/api/file/` + fileString;

  res.status(200).send({ success: true, file: filePath });
};
