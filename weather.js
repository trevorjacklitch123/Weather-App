"use strict"

const input = document.getElementById("searchText");
const button = document.getElementById("searchButton");
button.addEventListener("click", (event) => {
    event.preventDefault();
    const inputText = input.value;
});

let ipApiResponse = {};
let OWMApiResponse = {};
let date = new Date();

fetch("http://ip-api.com/json")
    .then((response) => {
        response.json().then((json) => {
            ipApiResponse = json;
            OWMApiCallLatLon(ipApiResponse.lat, ipApiResponse.lon);
            initMap(ipApiResponse.lat, ipApiResponse.lon);
            setupLocationHTML(json);
        })
    });


const searchText = document.getElementById("searchText");
document.getElementById("searchButton").addEventListener("click", () => {
    const input = searchText.value;
    const zipCodeRegex = /\d\d\d\d\d/;
    if(!zipCodeRegex.test(input)){
        console.log("Invalid zipcode");
    }
    else{
        OWMApiCallZipCode(input);
    }
});


function initMap(lat, lon) {
    const position = {lat: lat, lng: lon};

    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: position
    });
    const marker = new google.maps.Marker({position: position, map: map});
}





function setupLocationHTML(jsonData){
    const {city, regionName, country, zip, timezone} = jsonData;

    document.getElementById("locationInformation").innerText = `${city}, ${regionName}`;
}

function setupLocationHTMLOWM(name){
    document.getElementById("locationInformation").innerText = name;
}


    
function OWMApiCallLatLon(lat, lon){
/*  
    OWM means OpenWeatherMap.
    This OWM API call only works for people in the US. Can be changed later to include other countries
*/
const OWMBaseUrl = "http://api.openweathermap.org/data/2.5/weather?";
//  OWMAPIKey should never be pushed onto github.
const OWMAPIKey = "736d3d373c597ed144ecdfc6e96c2af4";
let units = "";
if(localStorage.getItem("Units") === "Metric")
    units = "&units=metric";
else if(localStorage.getItem("Units") === "Imperial")
    units = "&units=imperial";
else if(localStorage.getItem("Units") !== "Standard"){
    localStorage.setItem("Units", "Imperial");
    units = "&units=imperial";
}
const apiRequestURL = `${OWMBaseUrl}lat=${Math.round(lat)}&lon=${Math.round(lon)}&APPID=${OWMAPIKey}${units}`;

fetch(apiRequestURL)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        OWMApiResponse = responseJson;
        weatherRetrieved(OWMApiResponse);
    });
}

function OWMApiCallZipCode(zip){
    /*  
        OWM means OpenWeatherMap.
        This OWM API call only works for people in the US. Can be changed later to include other countries
    */
    const OWMBaseUrl = "http://api.openweathermap.org/data/2.5/weather?";
    //  OWMAPIKey should never be pushed onto github.
    const OWMAPIKey = "736d3d373c597ed144ecdfc6e96c2af4";
    let units = "";
    if(localStorage.getItem("Units") === "Metric")
        units = "&units=metric";
    else if(localStorage.getItem("Units") === "Imperial")
        units = "&units=imperial";
    else if(localStorage.getItem("Units") !== "Standard"){
        localStorage.setItem("Units", "Imperial");
        units = "&units=imperial";
    }
    const apiRequestURL = `${OWMBaseUrl}zip=${zip},us&APPID=${OWMAPIKey}${units}`;
    
    fetch(apiRequestURL)
        .then(response => {
            return response.json();
        })
        .then(responseJson => {
            weatherRetrieved(responseJson);
            initMap(responseJson.coord.lat, responseJson.coord.lon);
            setupLocationHTMLOWM(responseJson.name);
        });
    }




function weatherRetrieved(weather){
    let temperature = Math.round(weather.main.temp);
    let cardinalWind = cardinalWindDirection(weather.wind.deg);
    let windSpeed = Math.round(weather.wind.speed);

    const units = localStorage.getItem("Units");
    if(units === "Standard"){
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



function temperatureColor(temp){
    if(temp < 0)
        return "rgb(0,0,255)";
    else if(temp > 100)
        return "rgb(255,0,0)";
}
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