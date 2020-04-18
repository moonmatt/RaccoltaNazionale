const express = require('express')
const router = express.Router()
const cookieParser = require('cookie-parser')
router.use(cookieParser())

router.get('/', (req, res) => {
    var title = req.cookies['title']
    var content = req.cookies['content']
    var date = req.cookies['date']
    var image = req.cookies['image']
    var journal = req.cookies['journal']
    if(title != ""){
        res.render('post', {title: title, content: content, date: date, image: image, journal: journal})
    }
})
module.exports = router