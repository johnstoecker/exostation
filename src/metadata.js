function getCurrentSong() {
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

  (async () => {
    // get last 10 mins of songs
    const time = Math.floor((new Date().getTime() - 2000000)/1000);
    const songs = await fetch(CORS_PROXY+'http://aska.ru-hoster.com:2199/external/rpc.php?m=recenttracks.get&username=forex&charset=&since='+time+'&mountpoint=&rid=forex')
    const text = await songs.text();
    const parsedSongs = JSON.parse(text)
    console.log(parsedSongs)
    if (parsedSongs.data && parsedSongs.data.length > 0 && parsedSongs.data[0].length > 0) {
      document.getElementById("now-playing").style.visibility = "visible";
      document.getElementById("current-artist").innerHTML = parsedSongs.data[0][0].artist;
      document.getElementById("current-track").innerHTML = parsedSongs.data[0][0].title;
    }

  })();

}

export default {
  getCurrentSong: getCurrentSong
}
