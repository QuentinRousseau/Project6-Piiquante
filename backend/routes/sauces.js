const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("multer");

const saucesCtrl = require("../controllers/sauces");

//CreateSauce
router.post("/", auth, multer, saucesCtrl.createSauce);

//getOneSauce
router.get("/:id", auth, saucesCtrl.getOneSauce);

// modifySauce
router.put("/:id", auth, saucesCtrl.modifySauce);

// deleteSauce
router.delete("/:id", auth, saucesCtrl.deleteSauce);

// getAllSauce
router.get("/", auth, saucesCtrl.getAllSauces);

module.exports = router;
