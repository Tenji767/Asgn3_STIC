const submit = document.getElementById('searchWeather');
const inputcity = document.getElementById('locationinput');
const locationapikey = '01212a7cb6a8db7638a95a05edfb6a86';

submit.addEventListener('click', async () => {
  let city = inputcity.value;

  let responseLocation = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${locationapikey}`);

  let data = await responseLocation.json();

  if (data.length === 0) {
    alert('City not found. Please try again.');
    return;
  }

  let lat = data[0].lat;
  let lon = data[0].lon;

  let responseWeather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,visibility,weather_code`
  );

  let data2 = await responseWeather.json();

  data2.hourly.time.forEach((time, index) => {
    const temp = data2.hourly.temperature_2m[index];
    const humidity = data2.hourly.relative_humidity_2m[index];
    const precipProb = data2.hourly.precipitation_probability[index];
    const precipAmt = data2.hourly.precipitation[index]; //in mm
    const weatherCode = data2.hourly.weather_code[index]; //check to see what each code corresponds to, make it the background

    const weatherCard = document.createElement('div');

    weatherCard.innerHTML = ` <h3>${time}</h3>
          <h2>${temp}</h2>
          <h4>${precipProb}%</h4>
        `;

    document.getElementById('weathercard').appendChild(weatherCard);
  });
});
