const statusDB = require("../managers/mongoDB");

module.exports = (req, res, next) => {
  statusDB.then(() => next()).catch(() => next(new Error("DB not found"))),
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
};
