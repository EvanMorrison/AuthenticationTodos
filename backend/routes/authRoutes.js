var express = require('express');
var authRoutes = express.Router();
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config');

authRoutes.post("/login", function (req, res) {

    // Try to find the user with the submitted username
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) res.status(500).send(err);

        // If that user isn't in the database:
        if (!user) {
            res.status(401).json({
                success: false,
                cause: 'username',
                message: "User with the provided username was not found"
            })
        } else if (user) {

            // Check if the submitted password is the same as the one saved in the database
            user.checkPassword(req.body.password, function (err, match) {
                if (err) throw (err);
                if (!match) res.status(401).json({
                    success: false,
                    cause: 'password',
                    message: "Incorrect password"
                });
                else {
                    var token = jwt.sign(user.toObject(), config.secret, {
                        expiresIn: "24h"
                    });
                    res.json({
                        user: user.withoutPassword(),
                        token: token,
                        success: true,
                        message: "Here's your token!"
                    })
                }

                // Send the token back to the client app.
            });
        }
    });
});

authRoutes.post('/signup', function (req, res) {
    User.find({
        username: req.body.username
    }, function (err, existingUser) {
        if (err) res.status(500).send(err);
        if (existingUser.length) res.send({
            success: false,
            message: "That username is already taken."
        });
        else {
            var newUser = new User(req.body);
            newUser.save(function (err, userObj) {
                if (err) res.status(500).send(err);
                res.send({
                    user: userObj,
                    message: "Successfully created new user.",
                    success: true
                });
            });
        }
    })
});

module.exports = authRoutes;