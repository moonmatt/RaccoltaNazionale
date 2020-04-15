const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    var urlArr = req.query.p.split("###!###");
    res.render('post.ejs', {urlArr: urlArr});
})

module.exports = router