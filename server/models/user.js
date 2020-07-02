const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const userSchema = mongoose.Schema({
//     email: '',
//     password: ''
// });
const userSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    token:{
        type: String
    }
});

userSchema.pre('save', function(next){
    var user = this;

    if(user.isModified('password'))
    {
        bcrypt.genSalt((err, salt) => {

            if(err) return next(err);
        
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) return next(err);
        
                user.password = hash;
                next();
            });
        
        });
    }
    else
    {
        next();   
    }
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) throw cb(err);
        
        cb(null, isMatch);
    })
};

userSchema.methods.generateToken = function(cb){
    var user = this;
    /* Never ever use password or secrets in code. Store them is files not accessible to public. */
    var token = jwt.sign(user._id.toHexString(), 'supersecret');

    user.token = token;

    user.save((err, user) => {
        if(err) return cb(err);
        cb(null, user);
    })
};

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    jwt.verify(token, 'supersecret', function(err, id){
        if(err) return cb(err);
        user.findOne({'_id':id, 'token':token}, (err, user) => {
            if(err) return cb(err);
            cb(null, user);
        });
    })
};

const User = mongoose.model('User', userSchema);


module.exports = { User };