"use strict"

let ipApiResponse = {};
let OWMApiResponse = {};

fetch("http://ip-api.com/json")
    .then((response) => {
        response.json().then((json) => {
            ipApiResponse = json;
            OWMApiCall(ipApiResponse.city);
        })
    });





function initMap() {
    const position = {lat: ipApiResponse.lat, lng: ipApiResponse.lon};

    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: position
    });
    const marker = new google.maps.Marker({position: position, map: map});
}




    
function OWMApiCall(city){
/*  
    OWM means OpenWeatherMap.
    This OWM API call only works for people in the US. Can be changed later to include other countries?
*/
const OWMBaseUrl = "http://api.openweathermap.org/data/2.5/weather?";
//  OWMAPIKey will never be pushed onto github.
const OWMAPIKey = "736d3d373c597ed144ecdfc6e96c2af4";
const apiRequestURL = `${OWMBaseUrl}q=${city}&APPID=${OWMAPIKey}`;

fetch(apiRequestURL)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        OWMApiResponse = responseJson;
        console.log(OWMApiResponse);
        weatherRetrieved(OWMApiResponse);
    });
}





function weatherRetrieved(weather){
    const temperatureFarenheit = (weather.main.temp - 273.15) * (9/5) + 32;
    const cardinalWind = cardinalWindDirection(weather.wind.deg);
    const windSpeed = weather.wind.speed * 2.237; // Miles per hour
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