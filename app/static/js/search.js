async function getSearchFilms() {
    document.getElementById('search_term').innerHTML = getURLPrams()['query'];

    const response = await fetch(`https://devops.vlee.me.uk/film/search/${getURLPrams()['query']}`, {
        headers: {
            "Content-type": "application/json",
            "Authorization": getCookies().session
        },
        method: 'get',
    }).then(response => response.json())
    {
        let filmList = document.getElementById("films");
        for (let i = 0; i < response.length; i++) {
            let film = response[i]; 
            let link = getNewUrl('watch.html', 'fim_id', film.id)
            filmList.innerHTML += `
            <div class="col-sm-5 col-lg-3 mb-4">
                <div class="card">
                    <div class="card-header">${film.name}</div>
                    <img src="${film.thumbnail_url}" class="card-img-top">
                    <div class="card-body">
                        <p class="card-text">${film.tag_line}</p>
                        <a href="${link}" class="btn btn-primary">Watch</a>
                    </div>
                </div>
            </div>
            
            `;
        }
    }
}

(async () => {
    await getSearchFilms();
})()
