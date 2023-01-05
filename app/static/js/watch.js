let player = videojs('my-video', { aspectRatio: "16:9" });
let continue_alert = new bootstrap.Alert(document.getElementById('continue_film'))
let continue_time = 0;
let tags = [];
let categories = [];
let sent = false;

async function loadInfo() {
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
        tags = response.tags;
        categories = response.categories;

    }
}


async function loadContinue() {
    const response = await fetch(`https://devops.vlee.me.uk/watch/film/${getURLPrams()['fim_id']}`, {
        headers: { "content-type": "application/json", "Authorization": getCookies().session },
        method: 'get',
    }).then(async (response) => {
        if (!response.ok) {
            continue_alert.close()
        } else {
            response = await response.json()
            continue_time = response.pos;
        }
    })
}

async function loadFilm() {
    const response = await fetch(`https://devops.vlee.me.uk/sign/film/id/${getURLPrams()['fim_id']}`, {
        headers: {
            "Content-type": "application/json",
            "Authorization": getCookies().session
        },
        method: 'get',
    }).then(response => response.json())
    {
        player.src({ src: response.url, type: "video/mp4" })
    }
}


(async () => {
    await getPermissions();
    await loadInfo();
    await loadFilm();
    await loadContinue();
})()


player.on('play', function () {
    if (continue_time > 0) {
        continue_alert.close()
    }
    if (!sent) {
        fetch(`https://devops.vlee.me.uk/rec`, {
            headers: { "content-type": "application/json", "Authorization": getCookies().session },
            method: 'POST',
            body: JSON.stringify({ "tags": tags, "categories": categories })
        })
        sent = true;
    }
});

player.on('pause', function () {
    fetch(`https://devops.vlee.me.uk/watch/film/${getURLPrams()['fim_id']}`, {
        headers: { "content-type": "application/json", "Authorization": getCookies().session },
        method: 'POST',
        body: JSON.stringify({ pos: player.currentTime() })
    })
});

player.on('ended', function () {
    fetch(`https://devops.vlee.me.uk/watch/film/${getURLPrams()['fim_id']}`, {
        headers: { "content-type": "application/json", "Authorization": getCookies().session },
        method: 'DELETE',
        body: JSON.stringify({ pos: player.currentTime() })
    })
});

function resume() {
    player.currentTime(continue_time)
    player.play()
    continue_alert.close()
}
