const express = require('express');
const nodemailer = require('nodemailer');
const mongoose= require('mongoose');
const path = require('path');
const app = express();

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}));

// Serving the html file with GET request
app.get('/',function(req,res) 
{
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Connecting MongoDB database
const url ="mongodb+srv://dbUser:dbUser@cluster0.zqxtt.mongodb.net/landingPage?retryWrites=true&w=majority"
mongoose.connect(url,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Database Schema
const landingPageSchema = new mongoose.Schema(
    {
        data: Object,
    },{
        collection: "custData"
    }
);

const Form =mongoose.model("Form",landingPageSchema);

// Saving data in database
const formData= (bodyData)=>{           
    Form ({data:bodyData}).save((err)=>{
        if(err){
            throw err;
        }
    })
}

// Receving form data with POST request
app.post("/submit",express.urlencoded({extended:false}),(req,res)=>{
    res.redirect('/');
    console.log(req.body);
    formData(req.body);

    // Sending Email 
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fake.buddy0990@gmail.com',
          pass: 'Password@2020'
        }
      });
      
      var mail = {
        from: 'fake.buddy0990@gmail.com',
        to: req.body.email,
        subject: 'Early access Registration',
        text: `Hi ${req.body.name},\n\nWelcome to Acer Family\n
            We are excited to have you with us.\nYou have successfully registered to purchase the product Acer Predator Helios 300 before it's official launch.\n\n
            More updates will follow and related mails will be sent to your registered email id\n\nThanks and regards,\nAcer Family`
      };
      
      transport.sendMail(mail, function(error, info){
        if (error) {
          console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
      });
});

app.listen(8080,'0.0.0.0',()=>{
    console.log('Server is running');
});




