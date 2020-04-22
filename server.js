const express = require('express')
const app = express()
const articleRouter = require('./routes/articles')
const dbRouter = require('./routes/db')
const tools = require('./tools')
const session = require('express-session')
const cookiep   = require("cookie-parser");
const {performance} = require('perf_hooks');
const fs = require('fs');
var cron = require('node-cron')
const Parser = require('rss-parser')
const moment = require('moment')
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

// Qui parso i file e li mando

let journals = ['https://www.ilgiornale.it/feed.xml', 'https://www.liberoquotidiano.it/rss.xml', 'https://www.ilprimatonazionale.it/feed/', 'https://www.iltempo.it/rss.jsp?sezione=200', 'https://www.ilfoglio.it/rss.jsp?sezione=121']

async function getRss(){
    let postArr = [];
      for(let url of journals){
        p0 = performance.now();
        let feed = await parser.parseURL(url);
        p1 = performance.now();
        console.log("Pars:  " + (p1 - p0) + " milliseconds.")
        // let i = 0;
        for(let item of feed.items){
        //   if(i >= 50){
        //     break;
        //   }
        //   i++
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
        }
  };
  postArr.sort(tools.sortFunction).reverse()
  // postArr = postArr.slice(0, 50);
//   console.log(JSON.stringify(postArr))

fs.writeFile('public/data.json', JSON.stringify(postArr), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
};


cron.schedule('*/2 * * * *', () => {
  getRss();
  console.log("Get new posts")
});

async function rssReader() {
  let rawdata = await fs.readFileSync('public/data.json');
  let posts = await JSON.parse(rawdata);
  return posts

}

app.use('/articles', articleRouter)
app.use('/db', dbRouter)
app.use('/public', express.static(__dirname + '/public')); 

// INDEX LOAD POSTS

app.get('/', async function (req, res) {
  if(req.session.username){
    let finalArr = await rssReader()
    res.render('index', {postArr: finalArr})
  } else {
    res.redirect('/login')
  }
}) 

app.get('/random', function (req, res) {
  if(req.session.username){
    let randNum = tools.between(0,postArr.length)
    let post = postArr[randNum]
    if(post.content != ""){
      res.render('post', {title: post.title, content: post.content, date: post.date, image: post.image, journal: post.journal, url: post.url})
    } else {
      res.redirect('/random')
    }
  } else {
    res.redirect('/login')
  }
}) 

app.get('/login', function(req, res) {
  if(req.session.username){
    res.redirect('/')
  } else {
    res.render('login')
  }
})
app.get('/logout', function(req, res) {
  if(req.session.username){
    req.session.destroy();
    res.redirect('/login')
  } else {
    res.redirect('/login')
  }
})

app.get('/info', function(req, res) {
  if(req.session.username){
    res.render('info')
  } else {
    res.redirect('/login')
  }
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})