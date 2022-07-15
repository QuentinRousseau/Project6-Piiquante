const express = require("express");
require("express-async-errors");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
app.use(morgan("dev", { immediate: true }));
app.use(morgan("dev", { immediate: false }));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(require("./middleware/statusDB"));

app.use("/api/auth", require("./routes/user"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", require("./routes/sauces"));

app.use((req, res, next) => {
  res.status(404).json({ message: "NOT_FOUND" });
});

app.use((err, req, res, next) => {
  //gestion d'erreur par le throw
  if (!(err instanceof Error)) return;
  console.log(err);
  res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
});

module.exports = app;
