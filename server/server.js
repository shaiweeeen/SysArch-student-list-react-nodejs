const express = require('express')//require 
const bodyparser = require('body-parser') // to get req.body
const mysql = require('mysql') // for database
const cors = require ('cors') // for communication betwwen frontend and backend
const multer = require('multer')
const path = require('path')
const fs = require('fs')

//instantiate express
const app =  express()

const port = process.env.PORT || 3500

//config for DB connection
const config = {
    hostname : "locahost",
    user: "root",
    password: "",
    database: "sysarch_db",
    charset: "utf8mb4",
    multipleStatement: true

}


//create db connection
const db = mysql.createPool(config)

const storage = multer.diskStorage({
    destination: path.join(__dirname, './images'),
    filename: function (req, file, cb) {   
        // null as first argument means no error
        cb(null, Date.now() + '-' + file.originalname )  
    }
})

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())
app.use('/images', express.static('./images'))


app.get('/',(req,res)=>{
    res.send("SysArch")
})

app.get('/login',(req,res) => {
    
})

app.post('/login', (req, res) => {
    const user = req.body
    const sql = " SELECT * FROM users  where username = '"+user.username+"' AND password = '"+user.password+"' "
    db.query(sql, (err, results, field) => {
        if(err) res.status(500).json(err)
        
        if(results && results.length > 0) {
           res.json({success: true} )
        } else {res.json({success: false} )}
        //res.json({"results" : results})
    })
})

app.get('/users',(req,res)=>{
    const sql = "SELECT * FROM users"
    db.query(sql,(err,results,field) => {
        if(err) res.status(500).json(err)
        res.json({"usersList": results})
    })
})

app.post('/users',(req,res)=>{
    const user = req.body
    const sql = "INSERT INTO users (username, password) values ('"+user.username+"', '"+user.password+"')"
    db.query(sql,(err,results,field) => {
        if(err) res.status(500).json(err)
        res.json({"message": "success"})
    })
})

app.put('/users',(req,res)=>{
    const user = req.body
    const sql = "UPDATE users SET  username = '"+user.username+"', password = '"+user.password+"' where id = "+user.id+" "
    db.query(sql,(err,results,field) => {
        if(err) res.status(500).json(err)
        res.json({"message": "success"})
    })
})

app.delete('/users/:idno',(req,res)=>{
    const deleteId = req.params.idno
    const sql = "Delete from users where id = "+deleteId+" "
    db.query(sql,(err,results,field) => {
        if(err) res.status(500).json(err)
        res.json({"message": "success"})
    })
})

app.get('/students',(req,res)=>{
    const sql = "SELECT * FROM students"
    db.query(sql,(err,results,field) => {
        if(err) res.status(500).json(err)
        res.json({"studentsList": results})
    })
})

app.post('/students',(req,res)=>{
    
    let upload = multer({ storage: storage}).single('file');
        upload(req, res, function(err) {
            
            const student = req.body
            const path = './images/'+student.lastname+'.png'
            const imgdata = student.file
            console.log(req.body)
            const reference = student.lastname+'.png' // my reference to compare data from DB to File system
            
            // to convert base64 format into random filename
            const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
            
            fs.writeFileSync(path, base64Data,  {encoding: 'base64'});

        
        const sql = "INSERT INTO students (lastname, firstname, course, level,img) values ('"+student.lastname+"','"+student.firstname+"','"+student.course+"','"+student.level+"','"+reference+"')"
        db.query(sql,(err,results,field) => {
            if(err) res.status(500).json(err)
            res.json({"message": "Student added successfully"})
        })
    })
})

app.put('/students',(req,res)=>{
    
    const student = req.body
    const idno = parseInt(req.body.idno)
    const sql = "UPDATE students SET lastname = '"+student.lastname+"',firstname = '"+student.firstname+"', course = '"+student.course+"', level = '"+student.level+"' where idno = "+idno+" "
    db.query(sql,(err,results,field) => {
        if(err) {res.status(500).json(err)}else{
        console.log("updated")
        res.json({"message": "Student is updated successfully"})
        }
       
    })
})

app.delete('/students/:idno',(req,res)=>{
    const deleteId = req.params.idno
    const sql = "Delete from students where idno = "+deleteId+" "
    db.query(sql,(err,results,field) => {
        if(err) {res.status(500).json(err)}
        else{
            res.json({"message": "student is deleted successfully"})
        }
        
    })
})


app.listen(port, ()=>{
    console.log("Listening at port: " + port)
})

