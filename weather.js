let ipApiResponse = {};
let OWMApiResponse = {};

fetch("http://ip-api.com/json")
    .then((response) => {
        response.json().then((json) => {
            ipApiResponse = json;
            OWMApiCall(ipApiResponse.zip);
        })
    });


function OWMApiCall(zip){
/*  
    OWM means OpenWeatherMap.
    This OWM API call only works for people in the US. Can be changed later to include other countries?
*/
console.log(ipApiResponse.zip);
console.log(zip);
const OWMBaseUrl = "http://api.openweathermap.org/data/2.5/weather?";
//  OWMAPIKey will never be pushed onto github.
const OWMAPIKey = "736d3d373c597ed144ecdfc6e96c2af4";
const apiRequestURL = `${OWMBaseUrl}zip=${zip},US&APPID=${OWMAPIKey}`;

fetch(apiRequestURL)
    .then(response => {
        return response.json();
    })
    .then(responseJson => {
        OWMApiResponse = responseJson;
        console.log(OWMApiResponse);
    });
}