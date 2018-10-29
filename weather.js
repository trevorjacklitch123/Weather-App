let ipApiResponse = {};
let zipCode = "";
let OWMApiResponse = {};
fetch("http://ip-api.com/json")
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        ipApiResponse = responseJson;
        zipCode = responseJson.zip;
    })
    .then(OWMApiCall(zipCode));


function OWMApiCall(){
/*  
    OWM means OpenWeatherMap
    This OWM API call only works for people in the US. Can be changed later.
*/
const OWMBaseUrl = "http://api.openweathermap.org/data/2.5/weather?";
//  OWMAPIKey will never be pushed onto github.
const OWMAPIKey = "";
const apiRequestURL = `${OWMBaseUrl}zip=${zipCode},US&APPID=${OWMAPIKey}`;

fetch(apiRequestURL)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        OWMApiResponse = responseJson;
        console.log(OWMApiResponse);
    });
}