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
const moment = require('moment')
app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let journals = ['https://www.ilgiornale.it/feed.xml', 'https://www.liberoquotidiano.it/rss.xml', 'https://www.ilprimatonazionale.it/feed/', 'https://www.laverita.info/feeds/feed.rss', 'https://www.iltempo.it/rss.jsp?sezione=200', 'https://www.ilfoglio.it/rss.jsp?sezione=121', 'https://www.panorama.it/feeds/feed.rss']
let postArr = [];

journals.forEach(url => rssReader(url));
async function rssReader(url){
 
  let feed = await parser.parseURL(url);
 
  feed.items.forEach(item => {
    try{
      image = item.enclosure.url
    } catch(err){
      image = null
    }
    post = {
      title: item.title,
      url: item.link, 
      date: moment(item.pubDate).locale("it").format('LLLL'),
      content: item.description, 
      description: tools.escapeHtml(item.description).substring(0,200) + "...",
      journal: feed.title,
      image: image
    }
    // var date = moment(post.date).format('LLLL');
    // console.log(post.title)
    // console.log(date)
    postArr.push(post)
  });
 
};
app.use('/articles', articleRouter)

app.get('/', function (req, res) {
  postArr.sort(tools.sortFunction).reverse()
  res.render('index', {postArr: postArr})
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})