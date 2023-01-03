let no_load = false;
async function getResume() {
    const response = await fetch(`https://devops.vlee.me.uk/watch/history`, {
        headers: { "content-type": "application/json", "Authorization": getCookies().session },
        method: 'get',
    }).then(async (response) => {
        json = await response.json()
        if (json.length > 0) {
            const resume = document.getElementById("resume-films")
            resume.innerHTML += `<h1>Resume Watching</h1> <p>Resume watching films you've started.</p>`
            for (let i = 0; i < json.length; i++) {
                const filmID = json[i].film_id
                const film = await fetch(`https://devops.vlee.me.uk/film/id/${filmID}`, {
                    headers: { "content-type": "application/json", "Authorization": getCookies().session },
                    method: 'get',
                }).then(async (response) => {
                    filmJson = await response.json()
                    let link = getNewUrl('watch.html', 'fim_id', filmID)
                    resume.innerHTML += `
            <div class="col-sm-5 col-lg-3 mb-4">
                <div class="card">
                    <div class="card-header">${filmJson.name}</div>
                    <img src="${filmJson.thumbnail_url}" class="card-img-top">
                    <div class="card-body">
                        <p class="card-text">${filmJson.tag_line}</p>
                        <a href="${link}" class="btn btn-primary">Watch</a>
                    </div>
                </div>
            </div>
            
            `;
                })
            }
        }
    })
}

async function fillRecommendations() {
    const response = await fetch(`https://devops.vlee.me.uk/rec`, {
        headers: { "content-type": "application/json", "Authorization": getCookies().session },
        method: 'get',
    }).then(async (response) => {
        json = await response.json()
        if ((Object.keys(json.tags).length != 0) && (Object.keys(json.categories).length != 0)) {
            const tags = sortDict(json.tags)
            const categories = sortDict(json.categories)
            let tags_to_show = 3
            let categories_to_show = 3
            if (Object.keys(tags).length < 3) { tags_to_show = Object.keys(tags).length }
            if (Object.keys(categories).length < 3) { categories_to_show = Object.keys(categories).length }
            if(tags_to_show == 0 && categories_to_show == 0){
                no_load = true;
                return;
            }
            // for tags
            if (tags_to_show > 0) {
                for (let i = 0; i < tags_to_show; i++) {
                    const tag_name = tags[i][0]
                    const film = await fetch(`https://devops.vlee.me.uk/film/tag/${tag_name}`, {
                        headers: { "content-type": "application/json", "Authorization": getCookies().session },
                        method: 'get',
                    }).then(async (response) => {
                        let section = `<div class="row gx-5 m-5 d-flex">
                        <h2>Recommended Films for "${tag_name}"</h2>
                        <h5>Based on your viewing history for this tag</h5>
                        `
                        const tagsJson = await response.json()
                        const shuffled = tagsJson.sort(() => 0.5 - Math.random());
                        let selected = shuffled.slice(0, 4);
                        for(let i = 0; i < selected.length; i++) {
                            let film = selected[i]
                            let link = getNewUrl('watch.html', 'fim_id', film.id)
                            section += `
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
                            
                            `
                        }
                        section += `</div>`
                        document.getElementById("recommended-films").innerHTML += section
                    })
                }
            }
            // for categories
            if (categories_to_show > 0) {
                for (let i = 0; i < categories_to_show; i++) {
                    const category_name = categories[i][0]
                    const film = await fetch(`https://devops.vlee.me.uk/film/category/${category_name}`, {
                        headers: { "content-type": "application/json", "Authorization": getCookies().session },
                        method: 'get',
                    }).then(async (response) => {
                        let section = `<div class="row gx-5 m-5 d-flex">
                        <h2>Recommended Films for "${category_name.replace("_",  " ")}"</h2>
                        <h5>Based on your viewing history for this category</h5>
                        `
                        const categoryJson = await response.json()
                        const shuffled = categoryJson.sort(() => 0.5 - Math.random());
                        let selected = shuffled.slice(0, 4);
                        for(let i = 0; i < selected.length; i++) {
                            let film = selected[i]
                            let link = getNewUrl('watch.html', 'fim_id', film.id)
                            section += `
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
                            
                            `
                        }
                        section += `</div>`
                        document.getElementById("recommended-films").innerHTML += section
                    })
                }
            }
        }
    })
}

async function if_no_load(){
    window.location.replace("/allFilms.html");
}


(async () => {
    await getPermissions();
    await getResume();
    await fillRecommendations();
    if(no_load){
        await if_no_load();
    }
})()
