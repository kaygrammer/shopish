const express = require("express");
const router = express.Router();
const {createUser, login, getalluser, getAUser, deleteAUser, updateUser, blockUser, unblockUser} = require("../controller/user")
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")

router.post('/register',createUser);
router.post('/login',login);
router.get('/all', getalluser);
router.get('/:id', authmiddleware,isAdmin,getAUser);
router.delete('/:id', deleteAUser);
router.put('/edit-user', authmiddleware, updateUser);
router.put('/block-user/:id', authmiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authmiddleware, isAdmin, unblockUser);


module.exports = router;

