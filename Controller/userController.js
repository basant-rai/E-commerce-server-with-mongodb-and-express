const User_model = require('../models/userModel');
const Token_model = require('../models/tokenModel')
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const {expressjwt} = require('express-jwt')


exports.addUser = async (req, res) => {
    let unique_user = await User_model.findOne({ email: req.body.email })
    if (!unique_user) {
        let user = new User_model({
            user_name: req.body.user_name,
            email: req.body.email,
            password: req.body.password,
            // number: req.body.number

        })
        //generate token and send in email
        let token = new Token_model({
            token: crypto.randomBytes(16).toString('hex'),
            user: user._id
        })
        token = await token.save()
        if (!token) {
            return res.status(400).json({ error: "failed to generate token" })
        }    // ...req.body,password:hash


        //send email
        // const url = `http://localhost:5000/api/confirmuser/${token.token}`
        const url = `${process.env.FRONTEND_URL}/confirmuser/${token.token}`
        sendEmail({
            from: 'infoabc@gmail.com',
            to: user.email,
            subject: 'verfication Email',
            text: `<h5>Please click to verify account. ${url}</h5>`,
            html: `<a href="${url}"><button>Verify Account</button></a>`
        })


        user = await user.save()
        if (!user) {
            return res.status(400).json({ error: 'ERROR' })
        }
        res.send(user)
    }
    else {
        return res.status(400).json({ error: "Email already exist" })
    }
}


exports.confirmUser = async (req, res) => {
    const token_check = await Token_model.findOne({ token: req.params.token })
    if (!token_check) {
        return res.status(400).json({ error: 'Token not found or has been expired' })
    }
    let user_check = await User_model.findById(token_check.user)
    if (!user_check) {
        return res.status(400).json({ error: 'user not found' })

    }
    if (user_check.isVerified) {
        return res.status(200).json({ message: 'please login to continue' })
    }
    user_check.isVerified = true
    user_check = await user_check.save()
    if (!user_check) {
        return res.status(400).json({ error: 'fails to verify' })

    } else {
        return res.status(200).json({ message: 'Verified successfully' })

    }
}

//resend confirmation

exports.resendConfirmation = async (req, res) => {

    let user = await User_model.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: 'email is not registered' })
    }
    if (user.isVerified) {
        return res.status(400).json({ error: 'already verfied' })
    }

    let token = new Token_model({
        token: crypto.randomBytes(16).toString('hex'),
        user: user._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "failed to generate token" })
    }

    //send email
    const url = `http://localhost:5000/api/confirmuser/${token.token}`
    sendEmail({
        from: 'infoabc@gmail.com',
        to: user.email,
        subject: 'verfication Email',
        text: `<h5>Please click to verify account. ${url}</h5>`,
        html: `<a href="${url}"><button>Verify Account</button></a>`
    })
    res.status(200).json({ message: 'verification link has been sent to your email' })

}


//forget password

exports.forgetPassword = async (req, res) => {
    let user_password = await User_model.findOne({ email: req.body.email })
    if (!user_password) {
        return res.status(400).json({ error: 'email not found' })
    }

    let token = new Token_model({
        token: crypto.randomBytes(16).toString('hex'),
        user: user_password._id
    })
    token = await token.save()
    if (!token) {
        return res.status(400).json({ error: "failed to generate token" })
    }

    //send email
    // const url = `http://localhost:5000/api/resetpassword/${token.token}`
    const url = `${process.env.FRONTEND_URL}/resetpassword/${token.token}`
    
    sendEmail({
        from: 'infoabc@gmail.com',
        to: user_password.email,
        subject: 'Reset password',
        text: `<h5>Please click to reset password. ${url}</h5>`,
        html: `<a href="${url}"><button>RESET</button></a>`
    })
    res.status(200).json({ message: 'Reset password link has been sent to your email' })
}

exports.resetPassword = async (req, res) => {
    let token = await Token_model.findOne({ token: req.params.token })
    console.log(token)
    if (!token) {
        return res.status(400).json({ error: 'token not found or may have expired' })
    }
    let user = await User_model.findOne({ _id: token.user })
    if (!user) {
        return res.status(400).json({ error: 'user not found' })
    }
    user.password = req.body.password
    user = await user.save()
    if (!user) {
        return res.status(400).json({ error: "password not saved" })
    }
    return res.status(200).json({ message: "password has been reset successfully" })
}

//sign in

exports.signIn = async (req, res) => {
    const { email, password } = req.body
    let user_email = await User_model.findOne({ email: email })
    if (!user_email) {
        return res.status(400).json({ error: "Email not register" })
    }
    if (!user_email.authenticate(password)) {
        return res.status(400).json({ error: "Incorrect password.Please try again" })
    }
    if (!user_email.isVerified) {
        return res.status(400).json({ error: "Email is not verified" })
    }

    const token = jwt.sign({ _id: user_email._id, role: user_email.role }, process.env.JWT_SECRETKEY)

    res.cookie('cookie_name', token, { expire: Date.now() + 86400 })

    const { _id, username, role } = user_email
    res.json({ token, user:{_id, username, role, email} })


}

//user list

exports.userList = async (req, res) => {

    let user_list = await User_model.find().select('-hashed_password').select('-salt')
    if (!user_list) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(user_list)
}
//user details
exports.userDetail = async (req, res) => {
    let user_details = await User_model.findById(req.params.id).select('-hashed_password').select('-salt')

    if (!user_details) {
        return res.status(400).json({ error: "User not found" })
    }
    res.send(user_details)

}

//find user by email
exports.userDetailByEmail = async (req, res) => {
    let user_byemail = await User_model.findOne({ email: req.body.email }).select('-hashed_password').select('-salt')

    if (!user_byemail) {
        return res.status(400).json({ error: "Invalid email.User not found" })
    }
    res.send(user_byemail)

}

//update

exports.updateUser = async(req, res) => {
    let user_update = await User_model.findByIdAndUpdate(req.params.id, {
        user_name: req.body.user_name,
        email: req.body.email,
        password: req.body.password,
        role:req.body.role,
        number: req.body.number
    },{new:true})
    if(!user_update){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(user_update)
}
//delete user
exports.deleteUser = async(req, res) => {
    let user_delete = await User_model.findByIdAndRemove(req.params.id)
       
    if(!user_delete){
        return res.status(400).json({error:"Oops!user not found"})
    }
    else{
        return res.status(200).json({message:"user has been deleted successfully"})
    }
}

//Authorization

exports.requireSignIn= expressjwt({
    secret:process.env.JWT_SECRETKEY,
    algorithms: ["HS256"]
})


