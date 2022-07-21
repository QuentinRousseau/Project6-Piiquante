const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const Ctrl = require("../controllers/sauces");


router.get("/",          auth,          Ctrl.getAllSauces);
router.get("/:id",       auth,          Ctrl.getOneSauce);
router.post("/",         auth, multer,  Ctrl.createSauce);
router.put("/:id",       auth, multer,  Ctrl.modifySauce);
router.delete("/:id",    auth,          Ctrl.deleteSauce);
router.post("/:id/like", auth,          Ctrl.likeOrDislike);

module.exports = router;
