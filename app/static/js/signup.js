const button = document.getElementById('post-btn');
const email = document.getElementById('email');
const password = document.getElementById('password');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const loginPopup = document.getElementById('signupComplete');

button.addEventListener('click', async _ => {
    let signupBody = {
        "email": email.value,
        "password": password.value,
        "first_name": firstName.value,
        "last_name": lastName.value,
    }
    const response = await fetch('https://devops.vlee.me.uk/session/signup', {
        headers: { "Content-type": "application/json" },
        method: 'post',
        body: JSON.stringify(signupBody)
    });
    //check if response is ~200
    if (response.ok) {
        await response.json().then(data => {
            const loginModal = new bootstrap.Modal(document.getElementById("signupComplete"), {});
            loginModal.show();
        });
    } else {
        if (response.status === 422) {
            await response.json().then(data => {
                alert(JSON.stringify(data.detail))
            });
            return;
        }
        // else, alert user to try again
        alert("Internal Error Signing up.");
        return;
    }
});

loginPopup.addEventListener('hide.bs.modal', function () {
    window.location.replace("/login.html");
})