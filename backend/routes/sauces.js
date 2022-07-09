const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controllers/sauces");

//CreateSauce
router.post("/", auth, multer, saucesCtrl.createSauce);

//getOneSauce
router.get("/:id", auth, saucesCtrl.getOneSauce);

// modifySauce
router.put("/:id", auth, multer, saucesCtrl.modifySauce);

// deleteSauce
router.delete("/:id", auth, saucesCtrl.deleteSauce);

// getAllSauce
router.get("/", auth, saucesCtrl.getAllSauces);

//Likes & Dislikes
router.post("/:id/like", auth, saucesCtrl.likeOrDislike);

module.exports = router;
