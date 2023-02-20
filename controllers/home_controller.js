const Student = require('../models/student');

module.exports.home = function(req, res){
    Student.find({}, function(err, students){
        return res.render('home', {
            title: 'Placement Cell | Home',
            students: students
        })
    })
    
}