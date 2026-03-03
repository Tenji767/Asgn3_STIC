const submit = document.getElementById('locationinput');
const locationapikey = '01212a7cb6a8db7638a95a05edfb6a86';

let city = submit.value;

submit.addEventListener('keyup', async () => {
  const response = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit={limit}\&appid=${locationapikey}`
  );

<<<<<<< HEAD
  const data = await response.json();

  const lat = data[0].lat;
  const lon = data[0].lon;
});
=======
    const responseLocation = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${locationapikey}`);
    
    const data = await responseLocation.json();

    const lat = data[0].lat;
    const lon = data[0].lon;

    const responseWeather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,visibility,weather_code`);


}

);
>>>>>>> 2fefbc0b3ba082a91f0895320f5ba36e100d5a71
