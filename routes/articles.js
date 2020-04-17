const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/', (req, res) => {
    console.log("ok ci siamo")
    var cookie = req.cookies['title']
    console.log(cookie)
    // cookie = decodeURIComponent(cookie)
    // let cookieArr = cookie.split("###!###")
    // console.log(cookieArr)
    // res.render('post', {title: cookieArr[0], content: cookieArr[1], date: cookieArr[2], image: cookieArr[3], journal: cookieArr[4]})

        // var cookie = getcookie(req).toString();
    // cookie = decodeURIComponent(cookie)
    // if(cookie != ""){
    //     let cookieArr = cookie.split("###!###")
    //     console.log(cookieArr)
    //     res.render('post', {title: cookieArr[0], content: cookieArr[1], date: cookieArr[2], image: cookieArr[3], journal: cookieArr[4]})
    // } else {
    //     console.log("Ci scusiamo ma si è verificato un problema")
    //     res.redirect('/?errore');
    // }
})
module.exports = router