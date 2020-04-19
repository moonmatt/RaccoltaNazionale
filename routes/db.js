const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bodyParser = require('body-parser')
// router.set('trust proxy', 1);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'raccoltanazionale'
})
 
// Connection
db.connect((err) => {
  if(err){
    throw err
  }
  console.log("connessoooo")
})

// router.get('/createdb', (req, res) => {
//     let sql = "CREATE DATABASE raccoltaNazionale"
//     db.query(sql, (err, result) => {
//         if(err) throw err
//         res.send("database created")
//         console.log("DATABASE CREATOOOO")
//     })
// })

// router.get('/createtable', (req, res) => {
//     let sql = "CREATE TABLE users(id INT AUTO_INCREMENT PRIMARY KEY, username varchar(255), password varchar(255))"
//     db.query(sql, (err, result) => {
//         if(err) throw err
//         res.send("TABLE CREATO")
//         console.log("TABLE CREATO")
//     })
// })

// router.get('/adduser', (req, res) => {
//     let user = {username: "Filippo", password: "ciaociao"}
//     let sql = "INSERT INTO users SET ? "
//     let query = db.query(sql, user, (err, result) => {
//         if(err) throw err
//         res.send("USER AGGIUNTO")
//         console.log("USER AGGIUNTO")
//     })
// })

// router.get('/getuser', (req, res) => {
//     let sql = "SELECT * FROM users"
//     db.query = db.query(sql, (err, results) => {
//         if(err) throw err
//         res.send(results)
//         console.log(results)
//     })
// })
 
// router.get('/getuser/:name', (req, res) => {
//     let sql = `SELECT * FROM users WHERE username = ${db.escape(req.params.name)}`;
//     let query = db.query(sql, (err, results) => {
//         if(err) throw err
//         console.log(sql)
//         res.send(results)
//         console.log(results)
//     })
// })

router.post('/login', function(req, res) {
    let sql = `SELECT * FROM users WHERE username = ${db.escape(req.body.username)} AND password = ${db.escape(req.body.password)}`;
    db.query(sql, (err, results) => {
        if(err) throw err
        if(results.length == 1){
            let username = results[0].username
            res.send(username)
            req.session.username = "PROVAAA"

            console.log(req.session.username)
        } else {
            console.log("Credenziali errate")
            res.send("Credenziali errate")
        }
    })
})

module.exports = router