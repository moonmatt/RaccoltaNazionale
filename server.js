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
  secret: uuid.v4(), // va bene un qualsiasi valore randomico, puoi anche usare crypto.randomBytes(8).toString()
  resave: false,
  saveUninitialized: true,
  cookie: {
      secure: true,
      httpOnly: true,
      domain: 'localhost:3000',
      expires: new Date(Date.now() + 7200000),
      sameSite: true
  },
  name: 'COMPUTER'
}))

let journals = ['https://www.ilgiornale.it/feed.xml', 'https://www.liberoquotidiano.it/rss.xml', 'https://www.ilprimatonazionale.it/feed/', 'https://www.laverita.info/feeds/feed.rss', 'https://www.iltempo.it/rss.jsp?sezione=200', 'https://www.ilfoglio.it/rss.jsp?sezione=121']
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


app.get('/', function (req, res) {
  console.log(req.session)
  postArr.sort(tools.sortFunction).reverse()
  res.render('index', {postArr: postArr})
  if(req.session.username){
    console.log("SESSIONE SETTATA")
  } else {
    console.log("NON SETTATA")
  }
})

app.get('/login', function(req, res) {
  res.render('login')
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})