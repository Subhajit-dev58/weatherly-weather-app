const apiKey = "MY_API_KEY";

const btn = document.getElementById("getWeatherBtn");
const locationBtn = document.getElementById("locationBtn");
const input = document.getElementById("cityInput");

const weatherBox = document.getElementById("weatherResult");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");

const historyDiv = document.getElementById("history");

let history = JSON.parse(localStorage.getItem("history")) || [];

btn.onclick = getWeatherByCity;
locationBtn.onclick = getWeatherByLocation;

function saveHistory(city){
  if(!history.includes(city)){
    history.unshift(city);
    history = history.slice(0,5);
    localStorage.setItem("history",JSON.stringify(history));
    renderHistory();
  }
}

function renderHistory(){
  historyDiv.innerHTML="";
  history.forEach(city=>{
    const b=document.createElement("button");
    b.innerText=city;
    b.onclick=()=> fetchWeather(`q=${city}`);
    historyDiv.appendChild(b);
  })
}
renderHistory();

function showLoading(){
  loading.classList.remove("hidden");
  weatherBox.classList.add("hidden");
  errorBox.classList.add("hidden");
}

function showError(msg){
  loading.classList.add("hidden");
  errorBox.innerText = msg;
  errorBox.classList.remove("hidden");
}

function getEmoji(condition){
  if(condition.includes("Cloud")) return "☁️";
  if(condition.includes("Rain")) return "🌧";
  if(condition.includes("Clear")) return "☀️";
  if(condition.includes("Snow")) return "❄️";
  return "🌤";
}

function showWeather(data){
  loading.classList.add("hidden");
  weatherBox.classList.remove("hidden");

  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temp").innerText = Math.round(data.main.temp)+"°C";
  document.getElementById("desc").innerText = data.weather[0].description;
  document.getElementById("humidity").innerText = data.main.humidity+"%";
  document.getElementById("wind").innerText = data.wind.speed+" m/s";
  document.getElementById("feels").innerText = Math.round(data.main.feels_like)+"°C";
  document.getElementById("emoji").innerText = getEmoji(data.weather[0].main);

  document.getElementById("dateTime").innerText =
    new Date().toLocaleString();

  const icon=data.weather[0].icon;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  changeBackground(data.weather[0].main);
  saveHistory(data.name);
}

function fetchWeather(query){
  showLoading();
  fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`)
    .then(res=>res.json())
    .then(data=>{
      if(data.cod!==200) return showError(data.message);
      showWeather(data);
    })
    .catch(()=>showError("Network error"));
}

function getWeatherByCity(){
  const city=input.value.trim();
  if(city) fetchWeather(`q=${city}`);
}

function getWeatherByLocation(){
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude,longitude}=pos.coords;
    fetchWeather(`lat=${latitude}&lon=${longitude}`);
  });
}

function changeBackground(condition){
  if(condition.includes("Cloud")) document.body.style.background="linear-gradient(135deg,#757f9a,#d7dde8)";
  else if(condition.includes("Rain")) document.body.style.background="linear-gradient(135deg,#314755,#26a0da)";
  else if(condition.includes("Clear")) document.body.style.background="linear-gradient(135deg,#f7971e,#ffd200)";
}