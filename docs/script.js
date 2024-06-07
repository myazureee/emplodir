document.addEventListener("DOMContentLoaded", function() {
    function showSecondaryNav(selectedTab) {
        // Verstecke alle Tabs
        document.querySelectorAll('#secondary-navbar ul li').forEach(function(tab) {
            tab.style.display = 'none';
        });

        // Zeige nur die Tabs für den ausgewählten Haupt-Tab
        document.querySelectorAll('.secondary-nav .' + selectedTab).forEach(function(tab) {
            tab.style.display = 'block';
        });
    }

    document.querySelectorAll('#secondary-navbar ul li').forEach(function(tab) {
        tab.addEventListener('click', function() {
            // Entferne die Klasse 'active' von allen Tabs
            document.querySelectorAll('#secondary-navbar ul li').forEach(function(tab) {
                tab.classList.remove('active');
            });

            // Füge die Klasse 'active' zum angeklickten Tab hinzu
            this.classList.add('active');

            // Zeige die entsprechenden sekundären Navigationselemente
            showSecondaryNav(this.classList[0]);
        });
    });

    // Initialisiere die Anzeige des ersten Tabs
    var firstTab = document.querySelector('#secondary-navbar ul li');
    if (firstTab) {
        firstTab.click();
    }
});
