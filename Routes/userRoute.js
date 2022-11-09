const express = require('express');
const { addUser, confirmUser, resendConfirmation, forgetPassword, resetPassword, signIn, userList, userDetail, userDetailByEmail, updateUser, deleteUser } = require('../Controller/userController');
const { validation, userCheck } = require('../Validation');

const router = express.Router()

router.post('/register', userCheck,validation,addUser);
router.get('/confirmuser/:token', confirmUser);
router.post('/resendverification', resendConfirmation);
router.post('/forgetpassword', forgetPassword);
router.post('/resetpassword/:token', resetPassword);
router.post('/signin', signIn);
router.get('/userlist', userList);
router.get('/userdetails/:id', userDetail);
router.post('/userbyemail', userDetailByEmail);
router.put('/updateuser/:id', updateUser);
router.delete('/deleteuser/:id', deleteUser);


module.exports = router