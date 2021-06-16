//Standalone parser/fetcher to get daily NASA RSS feed, save to file

const fs = require('fs')
const Parser = require('rss-parser');
const fetch = require("node-fetch");

let parser = new Parser();
const CORS_PROXY = "feed.txt";

(async () => {

  let feed = await parser.parseURL('https://blogs.nasa.gov/stationreport/feed/');
  // let feed = await fetch('https://blogs.nasa.gov/stationreport/2021/06/15/iss-daily-summary-report-6-15-2021/');
  // let text = await feed.text();
  console.log(feed.items[0]);
  // console.log(feed.title);
  //
  // feed.items.forEach(item => {
  //   console.log(item.title + ':' + item.link)
  // });
  //
  let feed2 = await fetch(feed.items[0].link)
  let text = await feed2.text();

  fs.writeFile('feed.txt', text, err => {
    if (err) {
      console.error(err)
      return
    }
    //file written successfully
  })
})();
