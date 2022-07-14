require("dotenv").config();
const express = require("express");
require("express-async-errors");
const mongoose = require("mongoose");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const urlMongo = process.env.MONGODB_URL;

const app = express();
app.use(morgan("dev", { immediate: true }));
app.use(morgan("dev", { immediate: false }));
app.use(cors());
app.use(helmet());
app.use(express.json());

const statusDB = mongoose
  .connect(urlMongo, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  statusDB.then(() => next()).catch(() => next(new Error("DB not found"))),
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
});

app.use("/api/auth", require("./routes/user"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", require("./routes/sauces"));

app.use((req, res, next) => {
  res.status(404).json({ message: "NOT_FOUND" });
});

app.use((err, req, res, next) => {
  if (!(err instanceof Error)) return;
  console.log(err);
  res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
});

module.exports = app;
