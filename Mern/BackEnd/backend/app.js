const express = require('express')
const bodyParser = require('body-parser')
const path =require('path')
const mongoose = require('mongoose')
const placesRotues = require('./routes/places-routes')
const usersRotues = require('./routes/users-routes')
const HttpError = require('./models/http-error')
const app =express()
const fs = require('fs')
const cors = require('cors');

app.use(bodyParser.json())
app.use(cors());

app.use('/uploads/images',express.static(path.join('uploads','images')))

app.use((req,res,next)=>{
    
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization')
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE')
    next()
})
app.use(cors({
    origin: 'https://mern-frontend-b118c.web.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  

app.use('/api/places',placesRotues)
app.use('/api/users',usersRotues)
app.use((req,res,next)=>{
    const error = new HttpError('Couşd not find this .route',404)
        throw error
    
})

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            if (err) console.error(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'unknown error' });
});

mongoose.connect("mongodb+srv://manu:manu123@cluster0.vnc8z.mongodb.net/").then(()=>{
    console.log('db başarılı')
    app.listen(process.env.PORT||5000)
   

}).catch(err =>{
    console.log(err)
})
