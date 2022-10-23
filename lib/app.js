const loadJSON = (path, callback) => {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", path, true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

/**
  <div class="col-xl-2 col-lg-3 col-md-4 col-6" id="ca">
    <div class="bollard-container">
      <div class="country-info no-wrap" title="Canada">
        <span class="bollard-code">ca</span><span> </span>
        <span>Canada</span>
      </div>
      <div class="bollards" id="bollards-ca">
        <div><img class="bollard-img" src="bollards/ca-1f.svg"></div>
        <div><img class="bollard-img" src="bollards/ca-2f.svg"></div>
        <div><img class="bollard-img" src="bollards/ca-2b.svg"></div>
        <div><img class="bollard-img" src="bollards/ca-3f.svg"></div>
      </div>
      <div role="tablist" class="dots" id="dots-ca"></div>
    </div>
  </div>
 */
const addCountryBollards = (country, rowDiv) => {
    // Create column div
    const colDiv = document.createElement("div");
    colDiv.classList.add("col-xl-2");
    colDiv.classList.add("col-lg-3");
    colDiv.classList.add("col-md-4");
    colDiv.classList.add("col-6");
    colDiv.classList.add("country");
    colDiv.id = country.code;
    colDiv.setAttribute("data-continent", country.continent);

    // Create child bollard div + add to column
    const bollardContainer = document.createElement("div");
    bollardContainer.classList.add("bollard-container");
    colDiv.appendChild(bollardContainer);

    // Create country code, name & divider divs
    const codeSpan = document.createElement("span");
    codeSpan.classList.add("bollard-code");
    const code = document.createTextNode(country.code);
    codeSpan.appendChild(code);
    const dividerSpan = document.createElement("span");
    const divider = document.createTextNode(" ");
    dividerSpan.appendChild(divider);
    const countrySpan = document.createElement("span");
    const countryName = document.createTextNode(country.name);
    countrySpan.appendChild(countryName);

    // Create country info div + add to bollardContainer
    const countryInfo = document.createElement("div");
    countryInfo.classList.add("country-info");
    countryInfo.classList.add("no-wrap");
    countryInfo.title = country.name;
    countryInfo.appendChild(codeSpan);
    countryInfo.appendChild(dividerSpan);
    countryInfo.appendChild(countrySpan);
    bollardContainer.appendChild(countryInfo);

    // Create a bollards div (for the images)
    const bollards = document.createElement("div");
    bollards.classList.add("bollards");
    bollards.id = `bollards-${country.code}`;
    let fileInfo = null;

    // Add all bollard images
    country.bollards.forEach((filename, bollardIdx) => {
        // Parse filename
        fileInfo = parseBollardName(filename);
        if (fileInfo && fileInfo.face === "back") {
            return; // Skip
        }
        let bollardPair = null;
        if (
            fileInfo &&
            country.bollards.length > 1 &&
            bollardIdx < country.bollards.length - 1
        ) {
            const next = parseBollardName(country.bollards[bollardIdx + 1]);
            if (next.number === fileInfo.number && next.face === "back") {
                bollardPair = next;
            }
        }
        // Create DOM elements
        const bollardDiv = document.createElement("div");
        const bollardImg = document.createElement("img");
        bollardImg.src = filename;
        if (fileInfo) {
            bollardImg.alt = `Bollard #${fileInfo.number} of ${country.name}`;
        }
        if (bollardPair) {
            bollardImg.classList.add("bollard-half");
            const bollardTwoImg = document.createElement("img");
            bollardTwoImg.src = bollardPair.filename;
            bollardTwoImg.classList.add("bollard-half");
            bollardTwoImg.alt = `Bollard #${bollardPair.number} (rear) of ${country.name}`;
            bollardDiv.appendChild(bollardImg);
            bollardDiv.appendChild(bollardTwoImg);
        } else {
            bollardImg.classList.add("bollard-img");
            bollardDiv.appendChild(bollardImg);
        }
        bollards.appendChild(bollardDiv);
    });

    // Create carousel controls
    /*
        <div role="tablist" class="dots" id="dots-ca"></div>
        <button aria-label="Previous" class="glider-prev">«</button>
        <button aria-label="Next" class="glider-next">»</button>
    */
    const dotsDiv = document.createElement("div");
    dotsDiv.setAttribute("role", "tablist");
    dotsDiv.classList.add("dots");
    dotsDiv.id = `dots-${country.code}`;
    const buttonLeft = document.createElement("button");
    buttonLeft.setAttribute("aria-label", "Previous");
    buttonLeft.classList.add("glider-prev");
    buttonLeft.textContent = "«";
    buttonLeft.id = `left-${country.code}`;
    const buttonRight = document.createElement("button");
    buttonRight.setAttribute("aria-label", "Next");
    buttonRight.classList.add("glider-next");
    buttonRight.textContent = "»";
    buttonRight.id = `right-${country.code}`;

    // Add the bollards to the container, and the column to the row
    bollardContainer.appendChild(bollards);
    bollardContainer.appendChild(dotsDiv);
    if (country.bollards.length > 1) {
        bollardContainer.appendChild(buttonLeft);
        bollardContainer.appendChild(buttonRight);
    }
    rowDiv.appendChild(colDiv);

    // Activate glider (carousel)
    const gliderSettings = {
        slidesToShow: 1,
        dots: `#${dotsDiv.id}`,
        draggable: true,
    };
    if (country.bollards.length > 1) {
        gliderSettings.arrows = {
            prev: `#left-${country.code}`,
            next: `#right-${country.code}`,
        };
    }
    new Glider(document.querySelector(`#${bollards.id}`), gliderSettings);
};

const parseBollardName = (bollard) => {
    const splitName = bollard.replace(/(\.[^/.]+$|[^\/]+\/)/, "").split("-");
    if (splitName.length < 2) {
        return null;
    }

    const namePartsRegex = /(\d+)([fb])/g;
    const nameParts = namePartsRegex.exec(splitName[1]);
    if (nameParts.length < 3) {
        return null;
    }
    const bollardNumber = nameParts[1];
    const bollardFace = nameParts[2].toLowerCase() === "f" ? "front" : "back";

    return {
        filename: bollard,
        country: splitName[0],
        number: bollardNumber,
        face: bollardFace,
    };
};

const filter = (button, buttons) => {
    for (let i = 0; i < buttons.length; ++i) {
        buttons[i].classList.remove("disabled");
    }
    button.classList.add("disabled");
    let selectedFilter = null;
    switch (button.id) {
        case "filter-na":
            selectedFilter = "North America";
            break;
        case "filter-sa":
            selectedFilter = "South America";
            break;
        case "filter-europe":
            selectedFilter = "Europe";
            break;
        case "filter-asia":
            selectedFilter = "Asia";
            break;
        case "filter-africa":
            selectedFilter = "Africa";
            break;
        case "filter-oceania":
            selectedFilter = "Oceania";
            break;
        default:
            selectedFilter = "All";
            break;
    }

    let countries = document.getElementsByClassName("country");
    for (country of countries) {
        if (
            country.dataset.continent === selectedFilter ||
            selectedFilter === "All"
        ) {
            country.classList.remove("hide");
        } else {
            country.classList.add("hide");
        }
    }
};

window.onload = function () {
    // Activate filters
    const buttons = document.querySelectorAll(".filter");
    for (let i = 0; i < buttons.length; ++i) {
        buttons[i].addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();
            filter(buttons[i], buttons);
        });
    }

    // Load bollards and display them
    const bollardsRow = document.getElementById("bollard-row");
    loadJSON("geo-countries.json", (geoCountriesJson) => {
        const geoCountries = JSON.parse(geoCountriesJson);
        loadJSON("countries.json", (countriesJson) => {
            const countries = JSON.parse(countriesJson);
            for (country of countries) {
                if (geoCountries.indexOf(country.code) > -1) {
                    addCountryBollards(country, bollardsRow);
                }
            }
        });
    });
};
