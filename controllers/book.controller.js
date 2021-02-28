const db = require("../configs/db.config");

const User = db.user;
const Book = db.book;
const Chapter = db.chapter;
const Comment = db.comment;
const Vote = db.vote;
const Read = db.read;
const Op = db.Sequelize.Op;

exports.getListBook = async (req, res) => {
  try {
    let listBook = await Book.findAll({
      where: {
        name: {
          [Op.like]: `%${req.query.name}%`,
        },
        author: {
          [Op.like]: `%${req.query.author}%`,
        },
      },
      include: [
        {
          model: Chapter,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["name"],
            },
          ],
        },
        {
          model: Vote,
        },
      ],
    });
    res.status(200).send({ success: true, data: listBook });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.createComment = async (req, res) => {
  try {
    if (!req.body.comment)
      return res
        .status(400)
        .send({ success: false, message: "Required comment!" });
    if (!req.body.bookId)
      return res
        .status(400)
        .send({ success: false, message: "Required bookId!" });
    let newComment = await Comment.create({
      comment: req.body.comment,
      bookId: req.body.bookId,
      userId: req.userId,
    });
    res.status(200).send({ success: true, data: newComment });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.createVote = async (req, res) => {
  try {
    try {
      if (!req.body.vote)
        return res
          .status(400)
          .send({ success: false, message: "Required vote!" });
      if (!req.body.bookId)
        return res
          .status(400)
          .send({ success: false, message: "Required bookId!" });

      let vote = await Vote.findOne({
        where: {
          bookId: req.body.bookId,
          userId: req.userId,
        },
      });
      if (vote) {
        let newVote = await Vote.update(
          {
            vote: req.body.vote,
          },
          {
            where: {
              bookId: req.body.bookId,
              userId: req.userId,
            },
          }
        );
        return res.status(200).send({ success: true, data: newVote });
      }

      let newVote = await Vote.create({
        vote: req.body.vote,
        bookId: req.body.bookId,
        userId: req.userId,
      });
      res.status(200).send({ success: true, data: newVote });
    } catch (error) {
      res.status(500).send({ success: false, message: error.message });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.createReadChapter = async (req, res) => {
  try {
    let chapterId = req.body.chapterId;
    let chapter = await Chapter.findOne({
      where: {
        id: chapterId,
      },
    });
    let read = await Read.findOne({
      where: {
        userId: req.userId,
        bookId: chapter.bookId,
      },
    });
    if (!read) {
      Read.create({
        lastReading: new Date(Date.now() + 7 * 60 * 60 * 1000),
        userId: req.userId,
        bookId: chapter.bookId,
        chapterId: chapterId,
      });
      return res
        .status(200)
        .send({ success: true, data: "Create reading success!" });
    } else {
      Read.update(
        {
          lastReading: new Date(Date.now() + 7 * 60 * 60 * 1000),
          chapterId: chapterId,
        },
        {
          where: {
            userId: req.userId,
            bookId: chapter.bookId,
          },
        }
      );
      return res
        .status(200)
        .send({ success: true, data: "Update reading success!" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

exports.getReadChapter = async (req, res) => {
  try {
    let listRead = await Read.findAll({
      where: {
        userId: req.userId,
      },
      attributes: ["id", "lastReading"],
      include: [
        {
          model: Chapter,
        },
        {
          model: Book,
        },
      ],
    });
    res.status(200).send({ success: true, data: listRead });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};
