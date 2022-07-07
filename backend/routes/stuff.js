const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');

//CreateSauce
router.post('/',auth, stuffCtrl.createSauce);

//getOneSauce
router.get('/:id',auth, stuffCtrl.getOneSauce);

// modifySauce
router.put('/:id',auth, stuffCtrl.modifySauce);

// deleteSauce
router.delete('/:id',auth,  stuffCtrl.deleteSauce);

// getAllSauce
router.get('/' ,auth, stuffCtrl.getAllSauces);

module.exports = router;