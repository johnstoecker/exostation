import Typewriter from 'typewriter-effect/dist/core';
import Parser from 'rss-parser';

function updateScroll(){
    var element = document.getElementById("typewriter");
    element.scrollTop = element.scrollHeight;
    setInterval(updateScroll,1000);
};

function startISSFeed() {

  const typewriter = new Typewriter('#typewriter', {
    delay: 5,
    loop: false
  });

  // new Typewriter('#typewriter', {
  //   strings: ['NanoRacks Module-9: The crew performed the 3rd operations of sample tube mixtures. NanoRacks Module-09 is a combination of 35 experiments provided by school students from 5 different countries. The experiments are housed within a NanoRacks Module container and is a combination of biological static experiments and some experiments that require crew interaction to mix materials to activate. The experiments within the module are returned to the ground for analysis.'],
  //   autoStart: true,
  //   delay: 5
  // });


  let parser = new Parser();
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

  (async () => {

    let feed = await parser.parseURL(CORS_PROXY + 'https://blogs.nasa.gov/stationreport/feed/');
    // console.log(feed.title);
    //
    // feed.items.forEach(item => {
    //   console.log(item.title + ':' + item.link)
    // });
    //
    let feed2 = await fetch(CORS_PROXY+feed.items[0].link)
    let text = await feed2.text();
    // console.log(text);
    // console.log(text.match(/(?<=\<h1>).*(?=\<\/h1>)/));
    let matches = text.match(/<div class="entry-content">(.*?[\s\S]*?)<footer/);

    var element = document.getElementById("typewriter");
    if (matches.length > 0) {
      let issFeedLines = matches[1].split("\n");
      for(var i=0; i<issFeedLines.length; i++) {
        const line = issFeedLines[i];
        if (i == issFeedLines.length - 1) {
          typewriter.typeString(line).pauseFor(1500).typeString('<br/>').start().callFunction(() => {clearInterval(updateScroll);});
        } else {
          typewriter.typeString(line).pauseFor(1500).typeString('<br/>').start();
        }

      }
      updateScroll();
    }
    console.log(matches)

  })();

}

export default {
  startISSFeed: startISSFeed
}
