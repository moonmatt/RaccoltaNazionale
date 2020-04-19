const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
    var title = req.body.title
    var content = req.body.content
    var date = req.body.date
    var image = req.body.image
    var journal = req.body.journal
    if(title != ""){
        res.render('post', {title: title, content: content, date: date, image: image, journal: journal})
    } else {
        res.status(404)
        .send('Not found');
    }
})
module.exports = router