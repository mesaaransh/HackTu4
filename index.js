const express = require('express')
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const dotenv = require('dotenv')
dotenv.config()

const bcrypt = require('bcrypt');
const saltRounds = 10;

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://mesaaransh:' + process.env.pass + '@cluster0.x2j4nhi.mongodb.net/HackTu?retryWrites=true&w=majority')



const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set('view engine', 'ejs')

const userSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    password: String,
    dob: Date,
    email: String,
    phone: String,
    dateCreated: Date
})

const userTable = mongoose.model("User", userSchema)

app.get("/", function(req, res){
    res.render("index")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})


app.post("/login", function(req, res){

    const body = req.body;

    const {pass, email} = body
    var encpass

    userTable.find({email: email}, (err, list) => {
        if(err){
            res.send('err');
        } else {
            encpass = list[0].pass;
        }
    })

    bcrypt.compare(pass, encpass, function(err, result) {
        if(result){
            
        } else{
            res.send('User Not Authenticated')
        }
    });

    newUser.save();
    res.redirect('/')    
})








app.post("/register", function(req, res){

    const body = req.body;

    const {fname, lname, pass, dob, email, phone} = body

    bcrypt.hash(pass, saltRounds, function(err, hash) {
        if(err){

        } else{
            pass = hash;
        }
    });

    const newUser = new userTable({
        fname: fname,
        lname: lname,
        password: pass,
        dob: dob,
        email: email,
        phone: phone
    })

    newUser.save();
    res.redirect('/')    
})



app.listen(8000, ()=>{console.log("----------AppStarted-----------");})