import api_key from './apikey.js';

const search = document.querySelector("#search");
const place = document.querySelector("#place");


const weatherDetails = (lat,lon, pname) => {
    const URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;

    fetch(URL)
    .then(results=>results.json())
    .then(result => {

    }).catch(error => alert(`Error:(${error})`))

};

const getGeolocation = () => {
    const pname = place.value.trim();
    if(!pname) return;
    const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${pname}&limit=1&appid=${api_key}`;

    fetch(URL)
    .then(results => results.json())
    .then(result => {
        if(!result.length) return alert(`"${pname}" not found, Invalid Input`);
        const { lat, lon, name } = result[0];
        weatherDetails(lat,lon,name);
    })
    .catch(error => alert(`Error:(${error})`))
}

search.addEventListener("click", getGeolocation);