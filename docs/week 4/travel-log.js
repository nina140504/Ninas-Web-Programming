// It was challenging to get started because I am not so familiar with JavaScript, 
// but I was able to get help from Google and AI to get started. The structure of 
// the code was the hardest part, the rest used a lot of copy/paste, with just 
// the variable names changed and some elements were very similar to python and quite 
// easy to understand and implement. I also had to add new css elements for the 
// form, and create the form in html, but that was fairly easy as there was also 
// a lot of repetition.


// Grab the form and the main diary container
const travelForm = document.getElementById('travel-log-form');
const diaryContainer = document.getElementById('travel-log-container');

travelForm.addEventListener('submit', function(event) {
    // Prevent the default page reload, because then all the inputs would be gone
    event.preventDefault();

    // Read values from input fields
    const continentInput = document.getElementById('input-continent').value.trim();
    const countryInput = document.getElementById('input-country').value.trim();
    const cityInput = document.getElementById('input-city').value.trim();
    const spotInput = document.getElementById('input-spot').value.trim();
    const reviewText = document.getElementById('input-review').value.trim();
    const mediaUrl = document.getElementById('input-media-url').value.trim();

    // Read all selected tags
    const selectedTags = [];
    document.querySelectorAll('input[name="tag"]:checked').forEach(checkbox => {
        selectedTags.push(checkbox.value);
    });

    // Require at least one tag, warning if not
    if (selectedTags.length === 0) {
        alert("Please select at least one tag!");
        return;
    }

    // Helper variables to find our hierarchy targets (ai said i need this)
    let currentContainer = diaryContainer;

    // Continent level
    // Find all existing continent details tags
    const continents = diaryContainer.querySelectorAll('details.continent');
    let targetContinent = null;

    // Search if the continent text already exists in a <summary> (help from ai)
    continents.forEach(c => {
        if (c.querySelector('summary h2').textContent.trim().toLowerCase() === continentInput.toLowerCase()) {
            targetContinent = c;
        }
    });

    // If it doesn't exist, create it completely matching your design (help from ai)
    if (!targetContinent) {
        targetContinent = document.createElement('details');
        targetContinent.className = 'continent';
        targetContinent.setAttribute('open', '');
        targetContinent.innerHTML = `<summary><h2>${continentInput}</h2></summary>`;
        diaryContainer.appendChild(targetContinent);
    }

    // Country level
    // Look for existing countries INSIDE the chosen continent
    const countries = targetContinent.querySelectorAll('details.country');
    let targetCountry = null;

    countries.forEach(co => {
        if (co.querySelector('summary h3').textContent.trim().toLowerCase() === countryInput.toLowerCase()) {
            targetCountry = co;
        }
    });

    if (!targetCountry) {
        targetCountry = document.createElement('details');
        targetCountry.className = 'country';
        targetCountry.setAttribute('open', '');
        targetCountry.innerHTML = `<summary><h3>${countryInput}</h3></summary>`;
        targetContinent.appendChild(targetCountry);
    }

    // Set the current container to country level
    currentContainer = targetCountry;

    // City level (optional)
    if (cityInput !== "") { //Check if there is a city input, skip if empty
        const cities = targetCountry.querySelectorAll('details.city');
        let targetCity = null;

        cities.forEach(ci => {
            if (ci.querySelector('summary h4').textContent.trim().toLowerCase() === cityInput.toLowerCase()) {
                targetCity = ci;
            }
        });

        if (!targetCity) {
            targetCity = document.createElement('details');
            targetCity.className = 'city';
            targetCity.setAttribute('open', '');
            targetCity.innerHTML = `<summary><h4>${cityInput}</h4></summary>`;
            targetCountry.appendChild(targetCity);
        }
        
        // Set the current container to city level
        currentContainer = targetCity;
    }

    // Spot level (optional) (used Ai so that if spot input is empty, it will just create a block in the last  input category)
    // Build Tags List HTML
    let tagsHTML = '<ul class="spot-tags">';
    selectedTags.forEach(tag => {
        tagsHTML += `<li>${tag}</li>`;
    });
    tagsHTML += '</ul>';

    // show/use media link if provided 
    let mediaHTML = '';
    if (mediaUrl !== "") {
        if (mediaUrl.toLowerCase().endsWith('.mp4')) {
            mediaHTML = `
                <video autoplay muted loop playsinline class="spot-video">
                    <source src="${mediaUrl}" type="video/mp4">
                </video>`;
        } else {
            mediaHTML = `<img src="${mediaUrl}" alt="Travel Media">`;
        }
    }

    // Build Review List as HTML
    let reviewHTML = '';
    if (reviewText !== "") {
        reviewHTML += '<h5>My Review:</h5><ul class="review-points">';
        const lines = reviewText.split('\n');
        lines.forEach(line => {
            if (line.trim() !== "") {
                reviewHTML += `<li>${line.trim()}</li>`;
            }
        });
        reviewHTML += '</ul>';
    }

    // Format: <details> for specific spots, or simple <div> for country/city entries
    if (spotInput !== "") {
        // Create a collapsible spot card like original structure
        const spotCard = document.createElement('details');
        spotCard.className = 'spot-card';
        spotCard.innerHTML = `
            <summary><h5>${spotInput}</h5></summary>
            ${tagsHTML}
            ${mediaHTML}
            ${reviewHTML}
        `;
        currentContainer.appendChild(spotCard);
    } else {
        // create info block if no spot is provided, just to show the tags, media, and review at the current level (country/city)
        const infoBlock = document.createElement('div');
        infoBlock.className = 'general-info-block';
        infoBlock.style.margin = "15px 0"; 
        infoBlock.innerHTML = `
            ${tagsHTML}
            ${mediaHTML}
            ${reviewHTML}
            <hr style="border: 0; border-top: 1px dashed #e9e5dc; margin-top: 15px;">
        `;
        currentContainer.appendChild(infoBlock);
    }

    // Reset the form for the next entry
    travelForm.reset();
});