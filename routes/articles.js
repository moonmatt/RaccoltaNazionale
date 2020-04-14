const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    var passedVariable = req.query.p;
    res.send(passedVariable);
    console.log(passedVariable)
})

module.exports = router