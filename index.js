const express = require("express");
const cors = require("cors"); //ngăn chặn việc truy cập tài nguyên của các domain khác một cách vô tội vạ.
const dotenv = require("dotenv"); //thao tác với file .env
const app = express();

app.use(express.json());
app.use(cors()); // ngăn chặn các webside khác truy cập api của web này
dotenv.config();

require("./routes/routes")(app);
const db = require("./configs/db.config");

db.sequelize
  .sync()
  .then(async () => {
    console.log("Sequelize is Running");
  })
  .catch((err) => {
    console.log(err.message);
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
