document.addEventListener("DOMContentLoaded", function() {
    // Elemente abrufen
    var loginBtn = document.getElementById("loginBtn");
    var modal = document.getElementById("loginModal");
    var closeModal = document.getElementsByClassName("close")[0];
    var loginForm = document.getElementById("loginForm");

    // Klicken des Login-Buttons öffnet das Modal
    loginBtn.addEventListener("click", function() {
        modal.style.display = "block";
    });

    // Klicken des Schließen-Symbols schließt das Modal
    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Klicken außerhalb des Modals schließt es
    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Formular-Einreichung verhindern und Anfrage an den Server senden
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Erfolgreich eingeloggt, Weiterleitung zur internen Seite');
                window.location.href = '/internal'; // Änderung der Weiterleitung
            } else {
                alert('Login fehlgeschlagen: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Fehler:', error);
        });
    });
});
