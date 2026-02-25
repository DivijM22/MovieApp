const express=require('express');
const {registerUser,loginUser,refreshToken,logoutUser}=require('./auth.controller')
const router=express.Router();

router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/refresh',refreshToken);
router.get('/logout',logoutUser);

module.exports=router;