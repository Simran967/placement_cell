const Student = require('../models/student');
const Interview = require('../models/interview');
const Result = require('../models/result');
const {json2csvAsync } = require('json-2-csv');

// create student
module.exports.create = async function(req,res){
    try{
        let student = await Student.create({
            email: req.body.email, 
            name: req.body.name, 
            age: req.body.age, 
            college: req.body.college, 
            status: req.body.status,
            batch: req.body.batch,
            dsa:req.body.dsa,
            node_js:req.body.node_js,
            react:req.body.react
        });
        if (req.xhr){
            
            return res.status(200).json({
                data: {
                    student: student
                },
                message: "Student created!"
            });
        } 
        return res.redirect('back');

    }catch(err){

        console.log(err);
        return res.redirect('back');
    }
}

// create interview
module.exports.createInterview = async function(req,res){
    try{
        let interview = await Interview.create({
            studentId: req.body.studentId,
            company: req.body.company,
            date: req.body.date
        });
        await Student.update({_id: req.body.studentId}, {$push:{interviews:interview._id}})
        if (req.xhr){
            return res.status(200).json({
                data: {
                    interview: interview
                },
                message: "Interview Schdeuled!"
            });
        }
        return res.redirect('back');

    }catch(err){
        console.log(err);
        return res.redirect('back');
    }
    
}

// schedule interview
module.exports.interview = async function(req,res){
    try{
        let student = await Student.findById(req.params.id);
        let interviews =  await Interview.find({"studentId":student._id}).populate('resultId');

        return res.render('interview',{
             title: "Placement Cell | Home",
            student: student,
            interviews: interviews
        });
        

    }catch(err){

        console.log(err);
        return res.redirect('back');
    }
}

// update result
module.exports.updateResult = async function(req, res){
    try{
        let result = await Result.findOneAndUpdate(
            { 
                interviewId : req.body.interviewId
            },{
                result: req.body.status
            },{ 
                upsert: true 
            }
        );
        if(!result){
            result = await Result.find(
                { 
                    interviewId : req.body.interviewId
                }
            );
            result = result[0];
        }
        
        let interview = await Interview.update(
            { 
                _id : req.body.interviewId
            },{
                resultId: result._id
            }
        );
        if (req.xhr){
            return res.status(200).json({
                data: {
                    result: result
                },
                message: "interview Schdeuled!"
            });
        }
        
        return res.redirect('back');

    }catch(err){

        console.log(err);
        return res.redirect('back');
    }
}

// download data in csv
module.exports.downloadData  = async function(req, res){
    try{
        let students = await Student.find({}).populate({path:'interviews', populate:{path:"resultId"}}).lean();
        console.log(students)
        let jsonData = convertStudentObjectToJson(students);
        let csvData = await json2csvAsync(jsonData);
        return res.send(csvData);
    }catch(err)
    {
        return res.redirect('back');
    }
}

// convert object data to json
function convertStudentObjectToJson(data){
    let result = [];
    console.log(data)
    for(let i=0;i<data.length; i++){
        let tempData = {...data[i]};
        delete tempData.interviews;
        delete tempData.__v;
        delete tempData.updatedAt;
        delete tempData.createdAt;

        let interviews = data[i].interviews;
        if(interviews.length >0){
            for(j=0;j<interviews.length;j++){
                let newData = {...tempData};
                newData.interviewCompany = interviews[j].company;
                newData.interviewDate = interviews[j].date;
                if(interviews[j].resultId){
                    newData.interviewResult = interviews[j].resultId.result;
                }else{
                    newData.interviewResult = 'NA';
                }
                result.push(newData);
            }
        }else{
            tempData.interviewCompany = "-";
            tempData.interviewResult = "-";
            result.push(tempData);
        }
    }
    return result;
}