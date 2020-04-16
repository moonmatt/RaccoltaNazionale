const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    let newArr = req.body.newArr.split("###!###");
    res.render('post', {newArr: newArr})
})
module.exports = router