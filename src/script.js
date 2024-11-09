import api_key from './apikey.js';

const search = document.querySelector("#search");
const currentLocation = document.querySelector("#location");
const place = document.querySelector("#place");
const currentweather = document.querySelector("#currentweather");
const cardArea = document.querySelector("#weathercards");
const weatherdata = document.querySelector("#weatherdata");
const history = document.querySelector("#history");
const frostedBg = document.querySelector("#frostedbg");
let isFirstLoad = true;

//to update the search History and store it in localstorage

const updateSearchHistory = (pname) => {
    let historyList = JSON.parse(localStorage.getItem("searchHistory")) || [];
    
    if (!historyList.includes(pname)) {
        historyList.unshift(pname);  
        historyList = historyList.slice(0, 6);
    }

    localStorage.setItem("searchHistory", JSON.stringify(historyList));
    renderSearchHistory();
};

//to render the search History on the screen

const renderSearchHistory = () => {
    const historyList = JSON.parse(localStorage.getItem("searchHistory")) || [];
    
    if (historyList.length === 0) return;

    history.innerHTML = "";

    historyList.forEach(pname => {
        const historyItem = document.createElement("button");
        historyItem.textContent = pname;
        historyItem.classList.add("historyItem", "bg-slate-200", "hover:bg-slate-300", "text-black", "py-1", "px-3", "rounded", "m-1");
        

        historyItem.addEventListener("click", () => {
            place.value = pname;
            getGeolocation();
        });

        history.appendChild(historyItem);
    });

        const deleteHistory = document.createElement("button");
        deleteHistory.innerHTML = `<span class="material-symbols-outlined">delete</span>&nbsp;Clear History`;
        deleteHistory.classList.add("deleteHistory", "bg-slate-200", "text-black", "py-1", "px-3", "rounded", "flex" ,"m-1", "border", "border-black");
        deleteHistory.addEventListener("click", ()=> {
            localStorage.clear();
            history.innerHTML = "";
        })
        history.appendChild(deleteHistory);

    
};

// to create the banner current weather card

const currentWeatherCard = (element,pname)=>{
    const details = document.createElement("div");
    details.id = "details";
    details.innerHTML = `<h2 class="font-bold text-2xl pr-5 min-w-40">${pname} (${element.dt_txt.split(" ")[0]})</h2>
                        <h4 class="font-medium mt-3">Temperature: ${element.main.temp} °C</h4>
                        <h4 class="font-medium mt-3">Wind: ${element.wind.speed} M/S</h4>
                        <h4 class="font-medium mt-3">Humidity: ${element.main.humidity}%</h4>`
    
    const icon = document.createElement("div");
    icon.id = "icon"
    icon.classList.add("max-w-28", "max-[496px]:ml-10", "flex", "flex-col", "justify-center","items-center");
    icon.innerHTML = `<img src="./icons/${element.weather[0].icon}.svg" class="w-14 justify-self-center drop-shadow-[0_0_10px_rgba(255,255,255,1)]" alt="weather-icon">
                    <h4 class="font-medium mt-3 text-center capitalize">${element.weather[0].description}</h4>`;
    
    frostedBg.style.backgroundImage = `url('./icons/${element.weather[0].icon}.jpg')`;
    currentweather.appendChild(details);
    currentweather.appendChild(icon);

};

//to create the forecast cards

const weatherCard = (element)=>{
    const card = document.createElement("li");
    card.id = "card";
    card.classList.add("hover:bg-slate-700","bg-slate-600", "list-none", "text-white","py-5", "px-4", "text-center", "rounded","min-w-44", "min-[1680px]:min-w-[12rem]", "min-[1600px]:min-w-[11.5rem]", "max-[1034px]:min-w-[10.5rem]", "max-[768px]:min-w-[10rem]", "max-[480px]:min-w-[9rem]", "max-[768px]:p-3", "max-[480px]:p-2.5", "max-[400px]:p-2", "flex-wrap");
    card.innerHTML =  `<h3 class="font-bold text-2xl">${element.dt_txt.split(" ")[0]}</h3>
                <img src="./icons/${element.weather[0].icon}.svg" class="w-14 max-w-16 mt-1.5 inline drop-shadow-[0_0_10px_rgba(30,30,30)]" alt="weather-icon">
                <h4 class="font-medium mt-3">Temp: ${element.main.temp} °C</h4>
                <h4 class="font-medium mt-3">Wind: ${element.wind.speed} M/S</h4>
                <h4 class="font-medium mt-3">Humidity: ${element.main.humidity}%</h4>`;
    cardArea.appendChild(card);
};

//to fetch the weather details based on latitude and longitude

const weatherDetails = (lat,lon, pname) => {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;

    fetch(URL)
    .then(results=>results.json())
    .then(result => {

        if(!pname) {
            pname = result.city.name; 
        }

        const collectDays= [];
        const batchForecast = result.list.filter(terms => {
            const date = new Date(terms.dt_txt);
            const day = date.getDate();
            const hour = date.getHours();
            if(!collectDays.includes(day) && (hour ===3 || hour === 6 || hour === 9 || hour === 12 || hour === 15 || hour === 18 || hour === 21)){
                collectDays.push(day) ;
                return true;
            }
            return false;
        })
        
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
        if(!isFirstLoad)
        updateSearchHistory(pname);
        isFirstLoad = false;
    }).catch(error => alert(`Error:(${error})`))

};

//to get latitude and longitude and name of a place using users input

const getGeolocation = () => {
    const pname = place.value.trim();
    place.value="";
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

const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
        current => {
                const { latitude, longitude } = current.coords;
                weatherDetails(latitude, longitude);   

            },
        error => {
            alert(`Failed to Fetch Location: [ ${error.message} ]`);
        }
    )
};

//enter detect

search.addEventListener("click", getGeolocation);
currentLocation.addEventListener("click", getCurrentLocation);
place.addEventListener("keyup", (e) => {
    if(e.key === "Enter") {
    getGeolocation();
}})

//default dom loading and default searched place

document.addEventListener("DOMContentLoaded", () => {
    let historyList = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if(historyList.length>0){
        const res = historyList[0];
        place.value = res;
        getGeolocation();
    } else {
        const defaultCity = "Tokyo";
        const lat = 35.6895;
        const lon = 139.6917; 
        weatherDetails(lat, lon, defaultCity);
    }


    renderSearchHistory();
});