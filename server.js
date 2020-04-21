const express = require('express')
const app = express()
const articleRouter = require('./routes/articles')
const dbRouter = require('./routes/db')
const Parser = require('rss-parser')
const tools = require('./tools')
const moment = require('moment')
const session = require('express-session')
const uuid      = require("uuid");
const helmet    = require("helmet");
const cookiep   = require("cookie-parser");
const parser = new Parser({
    customFields: {
    item: ['description'],
    test: ['enclosure']
  }
})
app.set('view engine', 'ejs')
app.use(cookiep());
app.set('trust proxy', 1);

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'sdlfjljrowuroweu',
  cookie: { secure: false }
}));

let journals = ['https://www.ilgiornale.it/feed.xml', 'https://www.liberoquotidiano.it/rss.xml', 'https://www.ilprimatonazionale.it/feed/', 'https://www.laverita.info/feeds/feed.rss', 'https://www.iltempo.it/rss.jsp?sezione=200', 'https://www.ilfoglio.it/rss.jsp?sezione=121']
// let journals = ['https://www.ilgiornale.it/feed.xml']
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
      description: tools.escapeHtml(item.description).substring(0,200),
      journal: feed.title,
      image: image
    }
    postArr.push(post)
  });
 
};
app.use('/articles', articleRouter)
app.use('/db', dbRouter)
app.use('/public', express.static(__dirname + '/public')); 

app.get('/', function (req, res) {
  if(req.session.username){
    postArr.sort(tools.sortFunction).reverse()
    res.render('index', {postArr: postArr})
  } else {
    res.redirect('/login')
  }
}) 

app.get('/random', function (req, res) {
  if(req.session.username){
    let randNum = tools.between(0,postArr.length)
    let post = postArr[randNum]
    res.render('post', {title: post.title, content: post.content, date: post.date, image: post.image, journal: post.journal, url: post.url})
  } else {
    res.redirect('/login')
  }
}) 

app.get('/login', function(req, res) {
  res.render('login')
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})