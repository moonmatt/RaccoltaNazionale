const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Parser = require('rss-parser')
const parser = new Parser({
    customFields: {
    item: ['description'],
  }
})
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))


let postArr = [];

(async () => {
 
  let feed = await parser.parseURL('https://www.liberoquotidiano.it/rss.xml');
 
  feed.items.forEach(item => {
    post = {title: item.title, url: item.link, date: item.pubDate, content: item.description}
    postArr.push(post)
  });
 
})();


app.get('/', function (req, res) {
  res.render('index', {postArr: postArr})
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
