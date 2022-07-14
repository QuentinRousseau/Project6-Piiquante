const dotenv = require("dotenv");

module.exports = {
  ...dotenv.config({ path: ".env" }).parsed,
  ...dotenv.config({ path: ".env.local" }).parsed,
};
