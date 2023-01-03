function getCookies(){
    var cookies = {};
    document.cookie.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        cookies[parts[0].trim()] = (parts[1] || '').trim();
    });
    return cookies;
}

function getURLPrams() {
    /**
     * Get URL params as object
     */
    const urlParams = new URLSearchParams(window.location.search);
    let params = {};
    urlParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}

async function logOut()
{
  const response = await fetch(`https://devops.vlee.me.uk/session/logout`, {
    headers: {
        "Content-type": "application/json",
        "Authorization": getCookies().session
    },
    method: 'get',
  }).then(response => response.json())
  {
    window.location.replace("login.html");
  }
}

function getNewUrl(page, updateKey = null, newValue = null) {
    /**
     * Get link to new page with new key value for URL param
     */
    let origin = window.location.origin
    const currentParams = new URLSearchParams(window.location.search);
    let newParams = new URLSearchParams(window.location.search);

    if (!(updateKey == null) && !(newValue == null)) {
        newParams = new URLSearchParams();
        currentParams.forEach((value, key) => {
            if (key != updateKey) {
                newParams.append(key, value);
            } else {
                newParams.append(updateKey, newValue);
            }
        });
        if (!newParams.has(updateKey)) {
            newParams.append(updateKey, newValue);
        }
    } else if (!(updateKey == null) && (newValue == null)){
        newParams.delete(updateKey)
    }
    newLink = `${origin}/${page}?${newParams.toString()}`
    return newLink
}

function search(){
    try{
      let search = document.getElementById('search-bar').value;
      let accountLink = getNewUrl("search.html", "query", search);
      window.location = accountLink;
    } catch (err) {
      console.error(`Error: ${err}`)
    }
}
 
function sortDict(obj) {
    /**
     * Sorts a dictionary by value
     */
    var items = Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    return items;
}

async function getPermissions() {
    /**
     * Get the permissions of the user
     */
    try {
      const response = await fetch('https://devops.vlee.me.uk/user/', {
        method: 'get',
        headers: { "content-type": "application/json", "Authorization": getCookies().session },
      })
      if ([401, 404].includes(response.status)) {
        window.location.replace("/login.html");
      }
    } catch (err) {
      console.error(`Error: ${err}`)
    }
  }