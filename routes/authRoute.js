const express = require("express");
const router = express.Router();
const {createUser, login, getalluser, getAUser, deleteAUser, updateUser, blockUser, unblockUser, handleRefreshToken, logout, test, updatePassword, forgotPasswordToken, resetPassword} = require("../controller/user")
const {authmiddleware, isAdmin} = require("../middlewares/authMiddleware")

router.post('/register',createUser);
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/password', authmiddleware,updatePassword)
router.post('/login',login);
router.get('/all', getalluser);
router.get('/refresh', handleRefreshToken);
router.get('/logout', logout);
router.get('/:id', authmiddleware,isAdmin,getAUser);
router.delete('/:id', deleteAUser);
router.put('/edit-user', authmiddleware, updateUser);
router.put('/block-user/:id', authmiddleware, isAdmin, blockUser);
router.get('/unblock-user/:id', authmiddleware, isAdmin, unblockUser);


router.get('/test', test)




module.exports = router;

