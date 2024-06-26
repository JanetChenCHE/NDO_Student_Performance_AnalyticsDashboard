function topNavigation() {
    const x = document.getElementById('topNav');
    if(x.className === 'topnav') {
        x.className += ' responsive'; //must [space] => '[space]responsive'
    } else {
        x.className = 'topnav';
    }
}

// Show Page
let currentPage = null;

function showPage(pageId) {
    // Hide the previous page if it exists
    if (currentPage !== null) {
        currentPage.style.display = 'none';
        // Remove the 'active' class from the previous anchor element
        const prevAnchor = document.querySelector(`.topnav a[href="#${currentPage.id}"]`);
        if (prevAnchor) {
            prevAnchor.classList.remove('active');
        }
    }

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
        currentPage = selectedPage;
        // Add the 'active' class to the anchor element of the current page
        const currentAnchor = document.querySelector(`.topnav a[href="#${pageId}"]`);
        if (currentAnchor) {
            currentAnchor.classList.add('active');
        }
    }
}

// Show home page by default
showPage('homePage');
