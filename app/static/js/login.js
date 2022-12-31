// based off of: https://medium.com/swlh/how-to-create-your-first-login-page-with-html-css-and-javascript-602dd71144f1
const button = document.getElementById('post-btn');
const email = document.getElementById('email');
const password = document.getElementById('password');
const DateTime = luxon.DateTime;
button.addEventListener('click', async _ => {
    let loginBody = {
        "email": email.value,
        "password": password.value,
    }
    try {
        const response = await fetch('https://devops.vlee.me.uk/session/login', {
            headers: { "Content-type": "application/json" },
            method: 'post',
            body: JSON.stringify(loginBody)
        });
        //check if response is ~200
        if (response.ok) {
            await response.json().then(data => {
                // If good, set cookie
                const exp = DateTime.fromISO(data.expiry)
                const now = DateTime.now();
                const expSec = Math.round((exp.diff(now, 'seconds').toObject()).seconds);
                document.cookie = `session=${data.session_id}; path=/; SameSite=Lax; max-age=${expSec};`
                // window.location.replace("allFilms.html");
            });
        } else {
            // else, alert user to try again
            alert("Please make sure your username and password is entered correctly.");
            return;
        }
    } catch (err) {  // General error
        console.error(`Error: ${err}`);
    }
});


