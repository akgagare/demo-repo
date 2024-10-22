const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
const User=require('./model/user');
const  mongoose = require('mongoose');
const app=express();
const methodOverride=require('method-override');
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride("_method"));
app.use(express.json());
mongoose.connect("mongodb+srv://arungagare2915:mongodb123@cluster0.ez7sv3z.mongodb.net/banking").then(()=>{
    console.log("connection successful");
}).catch((e)=>{
    console.log("error MSG----->>>>>"+e);
})

console.log("changes");

app.get('/',(req,res)=>{
    res.render("home.ejs");
})
//to see all customer 
app.get('/customers',async(req,res)=>{
    const allUser=await User.find({});
    return res.status(401).json({
        allUser
    })
    res.render("allUser.ejs",{allUser});
})
//to see profile of individual
app.get('/customer/:id',async(req,res)=>{
    const id=req.params.id;
    const user=await User.findById({_id:id});
    res.render('show.ejs',{user});
})

//to feef detail  
app.get('/addForm',(req,res)=>{
    res.render('new.ejs');
})



app.get('/transferForm/:id',async(req,res)=>{
    const id=req.params.id;
    const user=await User.findById({_id:id});
    if(user){
        console.log(user.name);
        res.render('transfer.ejs',{user});
    }
    else{
        res.send("user not found");
    }
   
})
//to save to feeded details 
app.post('/addUser',async(req,res)=>{
    try{
        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            balance_amount:req.body.balance_amount,
            contact_number:req.body.contact_number,
        })
        await newUser.save();
        res.redirect('/customers');
    }
    catch(e){
        res.send("The Error is not adding user" + e)
    }
})
app.put('/transfer/:id',async(req,res)=>{
    try{
        const id=req.params.id;
        const sender=await User.findById(id);
        const amt=parseFloat(req.body.balance_amount);
        if(sender.balance_amount<amt){
            res.send("Sorry You dont have sufficient balance to send money");
        }
        const transferTo=req.body.name;
        const user=await User.findOne({name:transferTo});
        if(user){
            const newSum=user.balance_amount+amt;
            user.balance_amount=newSum;
            sender.balance_amount=sender.balance_amount-amt;
            console.log("Update successfull");
            user.save();
            sender.save();
            res.render('show.ejs',{user});
        }
        else{
            console.log("update mai problem");
            res.send("User Not found");
        }
    }
    catch(e){
        console.log(e);
        res.status(201).send("Internal Server Error could Not update");
    }
    
    
})
app.listen(3000,()=>{
    console.log("http://localhost:3000/");
})

