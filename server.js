const express = require('express')
const app = express()
const articleRouter = require('./routes/articles')
const bodyParser = require('body-parser')
const Parser = require('rss-parser')
var tools = require('./tools');
const parser = new Parser({
    customFields: {
    item: ['description'],
    test: ['enclosure']
  }
})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

let postArr = [];
(async () => {
 
  let feed = await parser.parseURL('https://www.liberoquotidiano.it/rss.xml');
 
  feed.items.forEach(item => {
    try{
      image = item.enclosure.url
    } catch(err){
      image = null
    }
    post = {
      title: item.title,
      url: item.link, 
      date: item.pubDate,
      content: tools.escapeHtml(item.description), 
      description: tools.escapeHtml(item.description).substring(0,200),
      journal: feed.title,
      image: image
    }
    postArr.push(post)
  });
 
})();

app.use('/articles', articleRouter)

app.get('/', function (req, res) {
  res.render('index', {postArr: postArr})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
