const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/auth`);

const { User } = require('./models/user'); 
const { auth } = require('./middlewares/auth');

app.post('/api/user', (req, res) => {

    const user = User({
        email: req.body.email,
        password: req.body.password
    });

    user.save((err,doc) => {
        if(err) return res.status(400).send(err);
        res.status(200).send(doc);
    });
});

app.post('/api/user/login', (req, res) => {

    User.findOne({email: req.body.email}, (err, user) => {
        if(!user) return res.json({message: 'Auth failed, user not found'});
        
        // bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        //     if(err) throw err;
            
        //     res.send(isMatch).status(200);
        // })

        user.comparePassword(req.body.password, (err, isMatch) => {
            if(err) throw err; 
            
            if(!isMatch)
            return res.status(400).json({
                message: "Wrong Password"
            });

            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                
                return res.cookie('auth', user.token).send('ok'); 
            })

            // res.status(200).send(isMatch);
        });
    });

});

app.post('/api/user/profile', auth, (req, res) => {
    res.status(200).send(req.token);
    //res.status(200).send('ok');
});

const port = process.env.PORT || 3000;



app.listen(port, () => {
    console.log(`Started server on port ${port}`);
})


