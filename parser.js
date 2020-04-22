const Parser = require('rss-parser')
const moment = require('moment')
const tools = require('./tools')
const fs = require('fs');

const {performance} = require('perf_hooks');
const parser = new Parser({
    customFields: {
    item: ['description'],
    test: ['enclosure']
  }
})

// Qui parso i file e li mando

let journals = ['https://www.ilgiornale.it/feed.xml', 'https://www.liberoquotidiano.it/rss.xml', 'https://www.ilprimatonazionale.it/feed/', 'https://www.iltempo.it/rss.jsp?sezione=200', 'https://www.ilfoglio.it/rss.jsp?sezione=121']

async function rssReader(){
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


rssReader();
