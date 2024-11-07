import api_key from './apikey.js';

const search = document.querySelector("#search");
const place = document.querySelector("#place");
const currentweather = document.querySelector("#currentweather");
const cardArea = document.querySelector("#weathercards");
const weatherdata = document.querySelector("#weatherdata");


const currentWeatherCard = (element,pname)=>{
    const details = document.createElement("div");
    details.id = "details";
    details.innerHTML = `<h2 class="font-bold text-2xl pr-5 min-w-40">${pname} (${element.dt_txt.split(" ")[0]})</h2>
                        <h4 class="font-medium mt-3">Temperature: ${element.main.temp} °C</h4>
                        <h4 class="font-medium mt-3">Wind: ${element.wind.speed} M/S</h4>
                        <h4 class="font-medium mt-3">Humidity: ${element.main.humidity}%</h4>`
    
    const icon = document.createElement("div");
    icon.id = "icon"
    icon.classList.add("max-w-28");
    icon.innerHTML = `<img src="icons/${element.weather[0].icon}.png" class="w-14 justify-self-center drop-shadow-[0_0_10px_rgba(255,255,255,1)]" alt="weather-icon">
                    <h4 class="font-medium mt-3 capitalize">${element.weather[0].description}</h4>`;
    currentweather.appendChild(details);
    currentweather.appendChild(icon);

};


const weatherCard = (element)=>{
    const card = document.createElement("li");
    card.id = "card";
    card.classList.add("bg-slate-500", "list-none", "text-white","py-5", "px-4", "text-center", "rounded","min-w-49", "max-[900px]:min-w-[11.5rem]", "max-[478px]:min-w-[12rem]", "max-[460px]:min-w-[11rem]", "max-[428px]:min-w-[10rem]", "max-[400px]:min-w-[9rem]", "max-[384px]:min-w-[8rem]", "max-[900px]:p-3.5", "max-[400px]:p-3", "max-[384px]:p-2","flex-wrap");
    card.innerHTML =  `<h3 class="font-bold text-2xl">${element.dt_txt.split(" ")[0]}</h3>
                <img src="icons/${element.weather[0].icon}.png" class="w-14 max-w-16 mt-1.5 inline drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]" alt="weather-icon">
                <h4 class="font-medium mt-3">Temp: ${element.main.temp} °C</h4>
                <h4 class="font-medium mt-3">Wind: ${element.wind.speed} M/S</h4>
                <h4 class="font-medium mt-3">Humidity: ${element.main.humidity}%</h4>`;
    cardArea.appendChild(card);
};



const weatherDetails = (lat,lon, pname) => {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;

    fetch(URL)
    .then(results=>results.json())
    .then(result => {
        console.log(result);


        const collectDays= [];
        const batchForecast = result.list.filter(terms => {
            const date = new Date(terms.dt_txt);
            const day = date.getDate();
            const hour = date.getHours();
            if(!collectDays.includes(day) && (hour === 6 || hour === 9 || hour === 12 || hour === 15)){
                collectDays.push(day) ;
                return true;
            }
            return false;
        })
        console.log(collectDays)
        console.log(batchForecast)
        
        place.value="";
        cardArea.innerHTML= "";
        currentweather.innerHTML= "";
        weatherdata.classList.remove("hidden");

        batchForecast.forEach((element, index) => {
            if(index === 0) {
                currentWeatherCard(element,pname);
            } else {
                weatherCard(element);
            }
        });

    }).catch(error => alert(`Error:(${error})`))

};

const getGeolocation = () => {
    const pname = place.value.trim();
    if(!pname) return;
    const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${pname}&limit=1&appid=${api_key}`;

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

document.addEventListener("DOMContentLoaded", () => {
    const defaultCity = "Jakarta";
    const lat = -6.2088;
    const lon = 106.8456; 
    weatherDetails(lat, lon, defaultCity);   
});
