const { User } = require('../models/user');

const auth = function(req, res, next){

    var token = req.cookies.auth;

    User.findByToken(token, (err, user) => {
        if(err) res.status(400).send(err);
        if(!user) return res.status(400).send('No Access');

        // res.status(200).send('You have access');
        req.token = token;
        next();
    })
}

module.exports = { auth };