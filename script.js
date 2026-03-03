const submit=document.getElementById("weather-input");
const locationapikey = "01212a7cb6a8db7638a95a05edfb6a86";

let city = submit.value;

submit.addEventListener("keyup", async ()=> {

    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit={limit}\&appid=${locationapikey}`);
    
    const data = await response.json();

    const lat = data[0].lat;
    const lon = data[0].lon;

    

}

);
