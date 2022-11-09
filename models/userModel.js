const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuidv1')

const user_schema = mongoose.Schema({
    user_name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
    },
    hashed_password: {
        type: String,
        required: true,
    },
    // number: {
    //     type: Number,
    //     required: true
    // },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: Number,
        default: 0,

    },
    salt: String

}, { timeStamps: true })

//virtual field

user_schema.virtual('password')
    .set(function (password) {
        this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptedPassword(this._password)

    })
    .get(() => {
        return this._password

    })
  
user_schema.methods = {
    encryptedPassword: function (password) {
        if (password == null) {
            return ''
        }
        try {
            return (this.hashed_password = crypto.createHmac('sha256', this.salt).update(password).digest('hex'))
        }
        catch {
            return ''
        }
    },
    authenticate: function(password){
        return this.hashed_password === this.encryptedPassword(password)
    }
}

module.exports = mongoose.model('User_model',user_schema)

