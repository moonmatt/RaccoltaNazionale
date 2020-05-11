const express = require('express')
const app = express()
const articleRouter = require('./routes/articles')
const tools = require('./tools')
const session = require('express-session')
const cookiep = require("cookie-parser");
const {
    performance
} = require('perf_hooks');
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
    cookie: {
        secure: false
    }
}));

// List of all Journals
let journals = [
    'https://www.ilgiornale.it/feed.xml',
    'https://www.liberoquotidiano.it/rss.xml',
    'https://www.ilprimatonazionale.it/feed/',
    'https://www.iltempo.it/rss.jsp?sezione=200',
    'https://www.ilfoglio.it/rss.jsp?sezione=121'
]

// Function to get all posts from Journals' RSS feeds
async function getRss() {
    let postArr = []; // Array with an object for every post (atm it's empty)
    for (let url of journals) {
        let feed = await parser.parseURL(url);
        let i = 0;
        for (let item of feed.items) {
        if (i >= 15) {
            break;
        }
        i++
            try {
                image = item.enclosure.url
            } catch (err) {
                image = tools.getImg(item.description)
            }
            let content = await tools.escapeContent(item.content);
            post = {
                title: item.title,
                url: item.link,
                date: moment(item.pubDate).locale('it').format('LLLL'),
                orderDate: moment(item.pubDate).format('LLLL'),
                content: content,
                description: tools.escapeHtml(item.description).substring(0, 200),
                journal: feed.title,
                image: image,
                thumbnail: image,
                id: tools.uniqueId()
            }
            if (post.content.includes(image)) { // I don't really remember how this works | It should get the image from the content and put it in the thumbnail
                post.thumbnail = null
            }
            postArr.push(post); // Push the object to the array
        }
    };
    postArr.sort(tools.sortFunction).reverse() // Sort the array by date (from the newest to the oldest)

    fs.writeFile('public/data.json', JSON.stringify(postArr), (err) => {
        if (err) throw err;
        console.log('Added posts'); // Puts all the posts to the data.json file
    });

    fs.writeFile('public/update.json', JSON.stringify(moment().format('H:mm')), (err) => {
        if (err) throw err;
        console.log('Time updated'); // Update the time to the update.json
    });

};


cron.schedule('*/2 * * * *', () => { // Gets new posts every 2 minutes | Maybe to avoid server "overflow" (idk) I should change it to 5 minutes
    getRss(); // gets posts
    console.log("Get new posts")
});

async function rssReader() { // Reads the posts from the data.json
    let rawdata = await fs.readFileSync('public/data.json'); // gets data
    let posts = await JSON.parse(rawdata); // parses the data into an array with objects
    return posts

}

async function timeReader() { // Reads the time from update.json
    let rawdata = await fs.readFileSync('public/update.json'); // gets data
    let time = await JSON.parse(rawdata); // parses the data into the variable time
    return time
}


// Routes
app.use('/articles', articleRouter)
app.use('/public', express.static(__dirname + '/public'));

// Index route
app.get('/', async function (req, res) {
    // Time to load (only for debugging purposes), you know, I don't want it to take ages to load
    t0 = performance.now();
    let finalArr = await rssReader()
    let timeUpdate = await timeReader()
    t1 = performance.now();
    console.log("Time to load: " + (t1 - t0) + " milliseconds.")
    
    // Render index file, sending posts and time
    res.render('index', {
        postArr: finalArr,
        timeUpdate: timeUpdate
    })
})

// Random route
app.get('/random', async function (req, res) {
    let finalArr = await rssReader(); // get all posts
    let randNum = tools.between(0, finalArr.length) // generate random number to get random post
    let post = finalArr[randNum]; // random post
    if (post.content != "") { // if it is not an empty post, like video posts that only contain videos or media
        res.render('post', {
            title: post.title,
            content: post.content,
            date: post.date,
            image: post.image,
            journal: post.journal,
            url: post.url,
            thumbnail: post.thumbnail,
            id: post.id
        })
    } else { // if it is empty, restart
        res.redirect('/random')
    }
})

// Info route
app.get('/info', function (req, res) {
    res.render('info')
})

// The main server
app.listen(6969, function () {
    console.log('Website started! Port: 6969')
})