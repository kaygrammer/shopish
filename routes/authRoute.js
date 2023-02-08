const express = require("express");
const router = express.Router();
const {createUser, login, getalluser, getAUser, deleteAUser} = require("../controller/user")

router.post('/register',createUser);
router.post('/login',login);
router.get('/all', getalluser);
router.get('/:id', getAUser);
router.delete('/:id', deleteAUser);

module.exports = router;

