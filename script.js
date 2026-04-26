const apiKey = "3770046748ae7d34c95906dfc29276ee";

const btn = document.getElementById("getWeatherBtn");
const locationBtn = document.getElementById("locationBtn");
const input = document.getElementById("cityInput");

const weatherBox = document.getElementById("weatherResult");
const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");

btn.addEventListener("click", () => getWeatherByCity());
input.addEventListener("keypress", e => {
    if(e.key === "Enter") getWeatherByCity();
});

locationBtn.addEventListener("click", getWeatherByLocation);

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

function showWeather(data){
    loading.classList.add("hidden");
    weatherBox.classList.remove("hidden");

    document.getElementById("cityName").innerText = data.name;
    document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
    document.getElementById("desc").innerText = data.weather[0].description;
    document.getElementById("humidity").innerText = data.main.humidity + "%";
    document.getElementById("wind").innerText = data.wind.speed + " m/s";

    const icon = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
      `https://openweathermap.org/img/wn/${icon}@2x.png`;

    changeBackground(data.weather[0].main);
}

function getWeatherByCity(){
    const city = input.value.trim();
    if(!city) return;

    showLoading();

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
    if(data.cod !== 200){
        showError(data.message);
        return;
    }
    showWeather(data);
})
.catch(() => showError("Network error 😢"));
}

function getWeatherByLocation(){
    navigator.geolocation.getCurrentPosition(pos => {
        const {latitude, longitude} = pos.coords;
        showLoading();

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(showWeather)
        .catch(()=> showError("Location error"));
    });
}

function changeBackground(condition){
    const body = document.body;
    if(condition.includes("Cloud")) body.style.background="linear-gradient(135deg,#757f9a,#d7dde8)";
    else if(condition.includes("Rain")) body.style.background="linear-gradient(135deg,#314755,#26a0da)";
    else if(condition.includes("Clear")) body.style.background="linear-gradient(135deg,#f7971e,#ffd200)";
    else body.style.background="linear-gradient(135deg,#4facfe,#00f2fe)";
}