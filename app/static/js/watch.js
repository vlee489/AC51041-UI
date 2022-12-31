let player = videojs('my-video', {aspectRatio: "16:9"});
let continue_alert = new bootstrap.Alert(document.getElementById('continue_film'))

async function loadInfo(){
    const response = await fetch(`https://devops.vlee.me.uk/film/id/${getURLPrams()['fim_id']}`, {
        headers: {
            "Content-type": "application/json",
            "Authorization": getCookies().session
        },
        method: 'get',
    }).then(response => response.json())
    {
        player.poster(response.thumbnail_url);
        document.getElementById("title").innerHTML = response.name;
        document.getElementById("description").innerHTML = response.description;
        document.getElementById("tags").innerHTML = `Tags: ${response.tags}`;
        document.getElementById("categories").innerHTML = `Category: ${response.categories}`;
        
    }
}

async function loadFilm(){
    const response = await fetch(`https://devops.vlee.me.uk/sign/film/id/${getURLPrams()['fim_id']}`, {
        headers: {
            "Content-type": "application/json",
            "Authorization": getCookies().session
        },
        method: 'get',
    }).then(response => response.json())
    {
        player.src({src: response.url,type: "video/mp4"})
    }
}


(async () => {
    await loadInfo();
    await loadFilm();
})()


player.on('play', function() {
    continue_alert.close()
});

player.on('pause', function() {
    console.log('paused')
});

function resume(){
    player.currentTime(10)
    player.play()
    continue_alert.close()
}
