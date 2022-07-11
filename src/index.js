const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/routes");
const app = express();
const { default: mongoose } = require("mongoose");

app.use(bodyParser.json());

const url =
  "mongodb+srv://bookManagemnt:QqtAVRV2r76yCnD2@cluster0.4vjcpm9.mongodb.net/group39Database";
const port = process.env.PORT || 3000;

mongoose
  .connect(url, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, function () {
  console.log("Express is running on port " + port);
});
