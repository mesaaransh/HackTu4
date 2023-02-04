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


const expenseSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    categ: String,
    expense: Number,
    Date: Date
})


const incomeSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    categ: String,
    income: Number,
    Date: Date
})

const userTable = mongoose.model("User", userSchema)
const ExpTable = mongoose.model("Expense", expenseSchema)
const IncTable = mongoose.model("Income", incomeSchema)

app.get("/", function(req, res){
    res.render("index")
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})

app.get("/test", function(req, res){
    res.render("test")
})
app.get("/about", function(req, res){
    res.render("about")
})

app.get("/services", function(req, res){
    res.render("services")
})

app.get("/team", function(req, res){
    res.render("team")
})

app.get("/expense", function(req, res){
    res.render("expense")
})
app.get("/income", function(req, res){
    res.render("income")
})






app.post("/newexp", function(req, res){

    const body = req.body;

    const {categ, amm} = body

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    console.log(today)

    const expense = new ExpTable({
        expense: amm,
        categ: categ,
        Date: today
    })

    expense.save();

})




app.post("/newinc", function(req, res){

    const body = req.body;

    const {categ, amm} = body

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    console.log(today)

    const inc = new IncTable({
        income: amm,
        categ: categ,
        Date: today
    })

    inc.save();

})






app.post("/login", function(req, res){

    const body = req.body;

    const {pass, email} = body

    var encpass

    userTable.find({email: email}, (err, list) => {


        if(err){
            res.send('err');
        }

        console.log(list[0].password)

        bcrypt.compare(pass, list[0].password, function(err, result) {
            if(result){
                console.log('ver')
                res.redirect('/login?' + list[0]._id)
            } else{
                res.send('User Not Authenticated')
            }
        });


    })
})








app.post("/register", function(req, res){

    const body = req.body;

    var {fname, lname, pass, dob, email, phone} = body

    userTable.find({email: email}, (err, result) => {
        if(result.length >= 1){
            res.send('User Aleready Registered')
        } else{
            bcrypt.hash(pass, saltRounds, function(err, hash) {
                if(err){
        
                } else{
                    const newUser = new userTable({
                        fname: fname,
                        lname: lname,
                        password: hash,
                        dob: dob,
                        email: email,
                        phone: phone
                    })
                    newUser.save();
                    res.redirect('/')
                }
            }); 
        }
    })

    
})



app.listen(8000, ()=>{console.log("----------AppStarted-----------");})