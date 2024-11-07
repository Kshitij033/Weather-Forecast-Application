import api_key from './apikey.js';

const search = document.querySelector("#search");
const place = document.querySelector("#place");
const cardArea = document.querySelector("#weathercards");


const weatherCard = (element)=>{
    const card = document.createElement("li");
    card.id = "card";
    card.classList.add("bg-slate-500", "list-none", "text-white","py-5", "px-4","rounded","min-w-49", "max-[900px]:min-w-[11.5rem]", "max-[478px]:min-w-[12rem]", "max-[460px]:min-w-[11rem]", "max-[428px]:min-w-[10rem]", "max-[400px]:min-w-[9rem]", "max-[384px]:min-w-[8rem]", "max-[900px]:p-3.5", "max-[400px]:p-3", "max-[384px]:p-2","flex-wrap");
    card.innerHTML =  `<h3 class="font-bold text-2xl">${element.dt_txt.split(" ")[0]}</h3>
                <img src="icons/${element.weather[0].icon}.png" class="w-14 max-w-16 mt-1.5" alt="weather-icon">
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
            if(!collectDays.includes(day) && (hour === 9)){
                collectDays.push(day) ;
                return true;
            }
            return false;
        })
        console.log(collectDays)
        console.log(batchForecast)
        
        place.value="";
        cardArea.innerHTML= "";

        batchForecast.forEach(element => {
            weatherCard(element);
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