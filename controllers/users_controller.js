const User = require('../models/user')

// action to render signup page
module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: 'User Sign Up'
    })
}

// action to render signin page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: 'User Sign In'
    })
}

// get the sign up data
module.exports.create = function(req,res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user)
    {
        if(err){
            console.log('Error in finding user in signing up');
            return;
        }

        if(!user){
            console.log('inside user')
            User.create(req.body, function(err, user){
                if(err){
                    console.log('Error in creating user while signing up');
                    return;
                }
                return res.redirect('/users/sign-in');
            }) 
        }
        else{
            return res.redirect('back');
        }
    });
}

// sign in and create the session for user
module.exports.createSession = function(req,res){
    
    return res.redirect('/');
}

// logout from session
module.exports.destroySession = function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
}