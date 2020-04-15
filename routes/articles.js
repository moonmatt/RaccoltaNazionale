const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    // var urlArr = req.query.p.split("###!###");
    // res.render('post.ejs', {urlArr: urlArr});
    let urlArr = req.body.urlArr.split()
    res.render('post', {urlArr: urlArr})
})

module.exports = router