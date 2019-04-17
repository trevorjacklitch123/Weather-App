"use strict"

let OWMApiResponse = {};
let date = new Date();

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(geolocationFunction);
    }
    else{
        console.log("Geolocation is not supported by this browser");
    }
}

function geolocationFunction(position){
    let data = {};
    data.longitude = position.coords.longitude;
    data.latitude = position.coords.latitude;
    OWMAPICall(data);
}

const searchText = document.getElementById("searchText");
document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("ErrorText").innerText = "";
    const input = searchText.value;
    const zipCodeRegex = /\d\d\d\d\d/;
    if(!zipCodeRegex.test(input)){
        handleError("Invalid zipcode");
    }
    else{
        let data = {};
        data.zipCode = input;
        OWMAPICall(data);
    }
});

document.getElementById("geolocationIcon").addEventListener("click", () => {
    getLocation();
});

function googleMapsCallback(){
    const x = 0;
}

function initMap(latitude, longitude) {
    const position = {lat: latitude, lng: longitude};
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: position
    });
    const marker = new google.maps.Marker({position: position, map: map});
}

function unsplashAPICall(query){
    const baseURL = "https://api.unsplash.com/search/photos?";
    const accessKey = "4f5e889809b6a4742629683ed7700e859b969d8b125df63e50e906e5122bf2c2";
    //Should never be uploaded in production code
    
    const url = `${baseURL}client_id=${accessKey}&query=${query}&orientation=landscape`;
    fetch(url)
    .then((response) => {return response.json()})
    .then((json) => {
        console.log(json);
        unsplashResponseSetup(json);
    });
}

function unsplashResponseSetup(data){
    document.getElementById("imageBackground").style.backgroundImage = `url("${data.results[0].urls.regular}")`;
}


function setupLocationHTML(jsonData){
    const {city, regionName, country, zip, timezone} = jsonData;

    document.getElementById("locationInformation").innerText = `${city}, ${regionName}`;
}

function setupLocationHTMLOWM(name){
    document.getElementById("locationInformation").innerText = name;
}





function OWMAPICall(data){
    const OWMBaseUrl = "https://api.openweathermap.org/data/2.5/weather?";
    const OWMAPIKey = "736d3d373c597ed144ecdfc6e96c2af4";

    let apiRequestURL, units;
    if(!localStorage.getItem("Units")){
        units = "&units=imperial";
        localStorage.setItem("Units", "Imperial");
    }
    else{
        units = `&units=${localStorage.getItem("Units")}`;
    }
    const localUnits = localStorage.getItem("Units");

    if(data.latitude & data.longitude){
        
        apiRequestURL = `${OWMBaseUrl}lat=${data.latitude}&lon=${data.longitude}&APPID=${OWMAPIKey}${units}`;
    }
    else if(data.zipCode){

        apiRequestURL = `${OWMBaseUrl}zip=${data.zipCode},us&APPID=${OWMAPIKey}${units}`;
    }

    fetch(apiRequestURL)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        if(responseJson.cod === 200){
            OWMApiResponse = responseJson;
            weatherRetrieved(responseJson);
            initMap(responseJson.coord.lat, responseJson.coord.lon);
            setupLocationHTMLOWM(responseJson.name);
        }
        else{
            handleError("Couldn't find that city");
        }
    });
}





function handleError(text){
    document.getElementById("ErrorText").innerText = text;
}


function weatherRetrieved(weather){
    let temperature = Math.round(weather.main.temp);
    let cardinalWind = cardinalWindDirection(weather.wind.deg);
    let windSpeed = Math.round(weather.wind.speed);

    const units = localStorage.getItem("Units");
    if(units === null){
        localStorage.setItem("Units", "Imperial");
        temperature += " °F";
        windSpeed += " miles/hour";
    }
    else if(units === "Standard"){
        temperature += " K";
        windSpeed += " m/s";
    }
    else if(units === "Metric"){
        temperature += " °C";
        windSpeed += " m/s";
    }
    else if(units === "Imperial"){
        temperature += " °F";
        windSpeed += " miles/hour";
    }



    document.getElementById("temp").innerText = temperature;
    document.getElementById("windSpeed").innerText = windSpeed;
    document.getElementById("windDirection").innerText = cardinalWind;
}





document.getElementById("imperialUnitsButton").addEventListener("click", () => {
    const newTemperature = Math.round(changeTemperatureType(parseInt(document.getElementById("temp").innerText.split(" ")[0]), localStorage.getItem("Units"), "Imperial"));
    if(newTemperature){
        document.getElementById("temp").innerText = newTemperature + " °F";
        localStorage.setItem("Units", "Imperial");
    }
});
document.getElementById("metricUnitsButton").addEventListener("click", () => {
    const newTemperature = Math.round(changeTemperatureType(parseInt(document.getElementById("temp").innerText.split(" ")[0]), localStorage.getItem("Units"), "Metric"));
    if(newTemperature){
        document.getElementById("temp").innerText = newTemperature + " °C";
        localStorage.setItem("Units", "Metric");
    }
});
document.getElementById("standardUnitsButton").addEventListener("click", () => {
    const newTemperature = Math.round(changeTemperatureType(parseInt(document.getElementById("temp").innerText.split(" ")[0]), localStorage.getItem("Units"), "Standard"));
    if(newTemperature){
        document.getElementById("temp").innerText = newTemperature + " K";
        localStorage.setItem("Units", "Standard");
    }
});


// Function to change the temp into "Imperial"(Farenheit), "Metric"(Celsius), or "Standard"(Kelvin).
function changeTemperatureType(temp, startType, endType){
    switch(startType){
        case "Imperial":{
            switch(endType){
                case "Metric":{
                    return (temp - 32) * (5 / 9);
                }
                case "Standard":{
                    return (temp - 32) * (5 / 9) + 273.15;
                }
                default:{
                    return temp;
                }
            }
            break;
        }
        case "Metric":{
            switch(endType){
                case "Imperial":{
                    return (temp * (9 / 5)) + 32;
                }
                case "Standard":{
                    return temp + 273.15;
                }
                default:{
                    return temp;
                }
            }
            break;
        }
        case "Standard":{
            switch(endType){
                case "Imperial":{
                    return (temp - 273.15) * (9 / 5) + 32;
                }
                case "Metric":{
                    return temp - 273.15;
                }
                default:{
                    return temp;
                }
            }
            break;
        }
    }
}
function cardinalWindDirection(windDegree){
    if(windDegree >= 348.75 || windDegree <= 11.25)
        return "N";
    else if(windDegree > 11.25 && windDegree < 33.75)
        return "NNE";
    else if(windDegree >= 33.75 && windDegree <= 56.25)
        return "NE";
    else if(windDegree > 56.25 && windDegree < 78.75)
        return "ENE";
    else if(windDegree >= 78.75 && windDegree <= 101.25)
        return "E";
    else if(windDegree > 101.25 && windDegree < 123.75)
        return "ESE";
    else if(windDegree >= 123.75 && windDegree <= 146.25)
        return "SE";
    else if(windDegree > 146.25 && windDegree < 168.75)
        return "SSE";
    else if(windDegree >= 168.75 && windDegree <= 191.25)
        return "S";
    else if(windDegree > 191.25 && windDegree < 213.75)
        return "SSW";
    else if(windDegree >= 213.75 && windDegree <= 236.25)
        return "SW";
    else if(windDegree > 236.25 && windDegree < 258.75)
        return "WSW";
    else if(windDegree >= 258.75 && windDegree <= 281.25)
        return "W";
    else if(windDegree > 281.25 && windDegree < 303.75)
        return "WNW";
    else if(windDegree >= 303.75 && windDegree <= 326.25)
        return "NW";
    else if(windDegree > 326.25 && windDegree < 348.75)
        return "NNE";
}
