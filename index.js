const express = require('express')
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const dotenv = require('dotenv')
dotenv.config()

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://mesaaransh:' + process.env.pass + '@cluster0.x2j4nhi.mongodb.net/HackTu?retryWrites=true&w=majority')


const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set('view engine', 'ejs')

const testschema = new mongoose.Schema({
    head: String,
    body: String
})

const testtable = mongoose.model("study", testschema)

app.get("/", function(req, res){
    res.render("index")
})

app.post("/add", function(req, res){
    const nhead = req.body.head;
    const nbody = req.body.body;

    console.log(nhead, nbody);

    const newobj = new testtable({
        head: nhead,
        body: nbody
    })

    newobj.save();
    res.redirect('/')    
})

app.listen(8000, ()=>{console.log("----------AppStarted-----------");})