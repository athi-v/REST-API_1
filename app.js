//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
 
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/studentsDB", 
{useNewUrlParser: true,
    useUnifiedTopology: true});

const studentSchema = {
    firstName: String,
    lastName: String
};

const Student = mongoose.model("Student", studentSchema)

//////All Students/////////////////////////
app.route("/students")

.get(function(req, res){
    Student.find(function(err, foundStudents){
        if(!err) {
            res.send(foundStudents)
        }
        else 
        {
            res.send(err)
        }
    })    
    })
    .post(function(req, res) {
        const newStudent = new Student({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });
        newStudent.save(function (err) {
          if(!err) {
              res.send("Successfully added a new student");
          }  
          else
          {
              res.send(err);
          }
        })
        })
    .delete(function(req, res) {
         Student.deleteMany(function(err) {
            if(!err) {
                res.send("Successfully deleted all students")
                }
                else
                {
                    res.send(err)
                }
            })
        });

//////Specific All Students/////////////////////////
app.route("/students/:studentName")
.get(function(req, res) {
    Student.findOne({firstName: req.params.studentName}, function(err, foundStudent) {
        if(foundStudent) {
            res.send(foundStudent);
        }
        else {
            res.send("No students matching that First Name")
        }
    }
    );
})

.put(function(req, res) {
    Student.update(
        {firstName: req.params.studentName},
        {firstName: req.body.firstName, lastName: req.body.lastName}, 
        {overwrite: true},
        function(err) {
            if(!err) {
            res.send("Successfully updated student")
            }
        }
    );
})

.patch(function(req, res) {
    Student.update(
        {firstName: req.params.studentName},
        {$set: req.body}, 
        function(err) {
            if(!err) {
            res.send("Successfully updated student")
            }
            else {
                res.send(err);
            }
        }
    )
})

.delete(function(req, res) {
Student.deleteOne(
    {firstName: req.params.studentName },
    function(err) {
        if(!err) {
        res.send("Successfully deleted student")
        }
        else {
            res.send(err);
        }
    }
);
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
  }); 