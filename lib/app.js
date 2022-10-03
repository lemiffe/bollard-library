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

const addBollard = (country, rowDiv) => {
  const colDiv = document.createElement("div");
  colDiv.classList.add("col-xl-2");
  colDiv.classList.add("col-lg-3");
  colDiv.classList.add("col-md-4");
  colDiv.classList.add("col-6");
  colDiv.id = country.code;
  const bollardDiv = document.createElement("div");
  bollardDiv.classList.add("bollard");

  // Code
  const codeSpan = document.createElement("span");
  codeSpan.classList.add("bollard-code");
  const code = document.createTextNode(country.code);
  codeSpan.appendChild(code);
  // Divider
  const dividerSpan = document.createElement("span");
  const divider = document.createTextNode(" ");
  dividerSpan.appendChild(divider);
  //Country
  const countryDiv = document.createElement("div");
  countryDiv.classList.add("bollard-country");
  countryDiv.classList.add("no-wrap");
  countryDiv.title = country.name;
  const countrySpan = document.createElement("span");
  const countryName = document.createTextNode(country.name);
  countrySpan.appendChild(countryName);
  countryDiv.appendChild(codeSpan);
  countryDiv.appendChild(dividerSpan);
  countryDiv.appendChild(countrySpan);

  const bollardImg = document.createElement("img");
  bollardImg.classList.add("bollard-img");
  bollardImg.src = country.bollard;
  bollardImg.alt = `Bollard of ${country.name}`;

  colDiv.appendChild(bollardDiv);
  bollardDiv.appendChild(countryDiv);
  bollardDiv.appendChild(bollardImg);
  rowDiv.appendChild(colDiv);
};

const show1x1 = () => {
  //const click4x3 = document.getElementById("click-4x3");
  const click1x1 = document.getElementById("click-1x1");
  //click4x3.classList.remove("hide");
  click1x1.classList.add("hide");
  const bollards = document.getElementsByClassName("bollard-img");
  for (bollard of bollards) {
    console.log(bollard);
    bollard.classList.remove("hide");
  }

  gtag("event", "switch", {
    event_category: "bollards",
    event_label: "1x1",
  });
};

window.onload = function () {
  const bollardsRow = document.getElementById("bollards");

  const click1x1 = document.getElementById("click-1x1");
  click1x1.addEventListener("click", (event) => {
    event.stopPropagation();
    event.preventDefault();
    show1x1();
  });

  loadJSON("geo-countries.json", (geoCountriesJson) => {
    const geoCountries = JSON.parse(geoCountriesJson);
    loadJSON("countries.json", (countriesJson) => {
      const countries = JSON.parse(countriesJson);
      for (country of countries) {
        if (geoCountries.indexOf(country.code) > -1) {
          addBollard(country, bollardsRow);
        }
      }
    });
  });
};
