const submit = document.getElementById("searchWeather");
const inputcity = document.getElementById("locationinput");
const locationapikey = "01212a7cb6a8db7638a95a05edfb6a86";

let map;
let radarLayers = [];
let animationIndex = 0;
let animationTimer;

// Radar animation function
async function loadRadarAnimation(lat, lon) {
  const frames = [
    Date.now() - 30 * 60 * 1000,
    Date.now() - 20 * 60 * 1000,
    Date.now() - 10 * 60 * 1000,
    Date.now(),
  ];

  radarLayers.forEach((layer) => map.removeLayer(layer));
  radarLayers = [];

  frames.forEach((time) => {
    const layer = L.tileLayer(
      `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${locationapikey}&ts=${time}`,
      { opacity: 0 },
    );

    radarLayers.push(layer);
    layer.addTo(map);
  });

  animateRadar();
}

// animation loop
function animateRadar() {
  if (animationTimer) clearInterval(animationTimer);

  animationTimer = setInterval(() => {
    radarLayers.forEach((layer) => layer.setOpacity(0));

    radarLayers[animationIndex].setOpacity(0.6);

    animationIndex = (animationIndex + 1) % radarLayers.length;
  }, 800);
}

submit.addEventListener("click", async () => {
  const container = document.getElementById("weathercard");
  container.innerHTML = "";

  let city = inputcity.value;

  let responseLocation = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${locationapikey}`,
  );

  let data = await responseLocation.json();

  if (data.length === 0) {
    alert("City not found. Please try again.");
    return;
  }

  let lat = data[0].lat;
  let lon = data[0].lon;

  // initialize map
  if (!map) {
    map = L.map("map").setView([lat, lon], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
  } else {
    map.setView([lat, lon], 7);
  }

  // start radar animation
  loadRadarAnimation(lat, lon);

  let responseWeather = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,visibility,weather_code&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto`,
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

    const weatherCard = document.createElement("div");

    weatherCard.innerHTML = `
        <h3>${formattedDate} ${formattedTime}</h3>
          <h2>${temp}${tempunit}</h2>
          <h4>${precipProb}%</h4>
        `;

    document.getElementById("weathercard").appendChild(weatherCard);
  });
});
