const bcrypt = require('bcrypt');
const {MD5} = require('crypto-js');
const jwt = require('jsonwebtoken');

bcrypt.genSalt((err, salt) => {

    if(err) return next(err);

    bcrypt.hash('password123', salt, (err, hash) => {
        if(err) return next(err);

        console.log('Salt by Bcrypt '+hash);
    });

});

const secret = 'secretpassword';
const secretSalt = 'D3fiieosesss';

const user = {
    id: 2,
    token: MD5('sdfsdfsdfsdf').toString() + secretSalt
}

const receivedToken = '39c8e9953fe8ea40ff1c59876e0e2f28D3fiieosesss';

if(receivedToken === user.token)
{
    console.log('Move On');
}

console.log(user);

const id = 22;
const secretjwt = 'supersecret';

const receivedJwt = 'eyJhbGciOiJIUzI1NiJ9.MjI.frtJ7WoX_EuBIvqXUHxSUc6qNKWxSd0VEpauYvR4rz8';

//const token = jwt.sign(id, secretjwt);
const decoded = jwt.verify(receivedJwt, secretjwt);
console.log('JWT '+decoded);