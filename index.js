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
    userId: String,
    categ: String,
    expense: Number,
    Date: Date
})


const incomeSchema = new mongoose.Schema({
    userId: String,
    categ: String,
    income: Number,
    Date: Date
})

const categ = [
    {
        name: "Food",
        color: "#E6E6FA"
    },
    {
        name: "Medical & Healthcare",
        color: "#B0E0E6"
    },
    {
        name: "Entertainment",
        color: "#FFC0CB"
    },
    {
        name: "Rent",
        color: "#98FF98"
    },
    {
        name: "Clothing",
        color: "#FFE5B4"
    },
    {
        name: "Insurance",
        color: "#87CEEB"
    },
    {
        name: "Utilities",
        color: "#C8A2C8"
    },
    {
        name: "Debt Payments",
        color: "#F08080"
    },
    {
        name: "Miscellaneous",
        color: "#FF69B4"
    }
]

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

    userTable.find({_id: req.query.ids}, (err, user) => {
        ExpTable.find({userId: req.query.ids}, (err, result) => {
            if(err){
    
            } else {
                res.render("expense", {categ: categ, ids: req.query.ids, trans: result, ident: user[0].fname})
            }
    
        })
    })  
})

app.get("/income", function(req, res){


    userTable.find({_id: req.query.ids}, (err, user) => {
        IncTable.find({userId: req.query.ids}, (err, result) => {
            if(err){
    
            } else {
                console.log(result);
                res.render("income", {categ: categ, ids: req.query.ids, trans: result, ident: user[0].fname})
            }
    
        })
    })
})



app.get("/test", function(req, res){
    console.log(req.query.ids);

    var totalinc = 0;

    var totalexp = 0;

    function addinc (a){
        totalinc += a;
    }

    function addexp (a){
        totalexp += a;
    }

    userTable.find({_id: req.query.ids}, (err, user) => {
        IncTable.find({userId: req.query.ids}, (err, result) => {
            if(err){
    
            } else {
                for(var i=0;i<=result.length-1;i++){
                    addinc(result[i].income)
                }
                ExpTable.find({userId: req.query.ids}, (err, result) => {
                    if(err){
            
                    } else {
                        for(var i=0;i<=result.length-1;i++){
                            addexp(result[i].expense)
                        }
                        res.render("test", {ids: req.query.ids, inc: totalinc, exp: totalexp, ident: user[0].fname})
                    }
            
                })
            }
    
        })
    })
    
    
})






app.post("/newexp", function(req, res){

    const body = req.body;

    const query = req.query

    const {categ, amm} = body

    console.log(query.ids)

    const expense = new ExpTable({
        userId: query.ids,
        expense: amm,
        categ: categ,
        Date: new Date()
    })

    expense.save();
    res.redirect('/test?ids=' + query.ids)

})




app.post("/newinc", function(req, res){

    const body = req.body;
    const query = req.query

    const {amm} = body

    const inc = new IncTable({
        userId: query.ids,
        income: amm,
        Date: new Date()
    })

    inc.save();
    res.redirect('/test?ids=' + query.ids)
})






app.post("/login", function(req, res){

    const body = req.body;

    const {pass, email} = body

    userTable.find({email: email}, (err, list) => {


        if(err){
            res.send('err');
        }

        bcrypt.compare(pass, list[0].password, function(err, result) {
            if(result){
                res.redirect("/expense?ids=" + list[0]._id)
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