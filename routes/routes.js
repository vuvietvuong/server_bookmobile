const multer = require("multer");
const path = require("path");

module.exports = (app) => {
  const authJwt = require("./verifyToken");
  const user = require("../controllers/user.controller");
  const admin = require("../controllers/admin.controller");
  const book = require("../controllers/book.controller");
  const imageUploader = multer({ dest: "images/" });
  const fileUpload = multer({ dest: "upload/" });

  app.post("/api/login", user.Login);

  app.post("/api/register", user.Register);

  // ADMIN

  app.post("/api/create-book", admin.CreateBook);

  app.post("/api/create-chapter", admin.CreateChapter);

  app.post(
    "/api/upload/image",
    [imageUploader.single("file")],
    admin.uploadImageBook
  );

  app.post("/api/upload/pdf", [fileUpload.single("file")], admin.UploadFilePDF);

  app.get("/api/image/:name", (req, res) => {
    const fileName = req.params.name;
    if (!fileName) {
      return res.status(400).send({
        success: false,
        data: "No filename specified",
      });
    }
    res.status(200).sendFile(path.resolve(`./images/${fileName}`));
  });

  app.get("/api/file/:name", (req, res) => {
    const fileName = req.params.name;
    if (!fileName) {
      return res.status(500).send({
        status: false,
        message: "no filename specified",
      });
    }
    res.contentType("application/pdf");
    res.status(200).sendFile(path.resolve(`./upload/${fileName}`));
  });

  // BOOK

  app.get("/api/list-book", book.getListBook);

  app.post("/api/create-comment", [authJwt.verifyToken], book.createComment);

  app.post("/api/vote", [authJwt.verifyToken], book.createVote);

  app.post("/api/create-read", [authJwt.verifyToken], book.createReadChapter);

  app.get("/api/read", [authJwt.verifyToken], book.getReadChapter);
};
