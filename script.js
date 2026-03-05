const submit = document.getElementById('searchWeather');
const inputcity = document.getElementById('locationinput');
const locationapikey = '01212a7cb6a8db7638a95a05edfb6a86';

submit.addEventListener('click', async () => {
//   let city = inputcity.value;
let city= "lynchburg";

  let responseLocation = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${locationapikey}`);

  let data = await responseLocation.json();

  if (data.length === 0) {
    alert('City not found. Please try again.');
    return;
  }

  let lat = data[0].lat;
  let lon = data[0].lon;

  let responseWeather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_min,temperature_2m_max&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,visibility,weather_code&current=temperature_2m&timezone=auto&temperature_unit=fahrenheit`
  );

  let data2 = await responseWeather.json();

  data2.hourly.time.forEach((time, index) => {

    const datetime = time;
const date = new Date(datetime);

const optionsDate = { month: "long", day: "numeric" };
const optionsTime = { hour: "numeric", minute: "2-digit" };

const formattedDate = date.toLocaleDateString("en-US", optionsDate);
const formattedTime = date.toLocaleTimeString("en-US", optionsTime);




    let temp = data2.hourly.temperature_2m[index];
    let humidity = data2.hourly.relative_humidity_2m[index];
    let precipProb = data2.hourly.precipitation_probability[index];
    let precipAmt = data2.hourly.precipitation[index]; //in mm
    let weatherCode = data2.hourly.weather_code[index]; //check to see what each code corresponds to, make it the background
    let tempunit = data2.hourly_units.temperature_2m;
    let currentTemperature = data2.current.temperature_2m;

    document.getElementById('currentTemp').innerText = `${currentTemperature} ${tempunit}`;

const weatherIcons = {
  0: "☀️",

  1: "⛅",
  2: "⛅",
  3: "☁️",

  45: "🌫️",
  48: "🌫️",

  51: "🌦️",
  53: "🌦️",
  55: "🌧️",

  56: "🥶🌧️",
  57: "🥶🌧️",

  61: "🌧️",
  63: "🌧️",
  65: "🌧️",

  66: "🌧️❄️",
  67: "🌧️❄️",

  71: "❄️",
  73: "❄️",
  75: "❄️",

  77: "🌨️",

  80: "🌦️",
  81: "🌧️",
  82: "⛈️",

  85: "🌨️",
  86: "❄️🌨️",

  95: "⛈️",

  96: "⛈️🧊",
  99: "⛈️🧊"
};

function getWeatherIcon(code) {
  return weatherIcons[code] || "❓";
}



    //create weathercard for each hour
    const weatherCard = document.createElement('div');

    weatherCard.innerHTML = `
        <h6>${formattedDate}</h6>
        <h3>${formattedTime}</h3>
        <p>${getWeatherIcon(weatherCode)}</p>
          <h3>${temp}${tempunit}</h3>
          <h4>${precipProb}%</h4>
        `;

    document.getElementById('weathercard').appendChild(weatherCard);
  });
});
