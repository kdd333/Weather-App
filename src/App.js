/*
To do:
Night weather shift
Change image based on weather type for the hour
Change description
Format the time to look neater
*/

import { useEffect, useState } from "react";

function App() {
  const [location, setLocation] = useState("London");
  //Lat is latitude as a float
  //Lon is longitude as a float
  const [lat, setLat] = useState("51.0");
  const [lon, setLon] = useState("1.0");

  //Used to change the location by passing it to the child component
  const handleLocationChange = newLocation => {
    setLocation(newLocation);
  }
  //Used to change the latitude
  const handleLatChange = newLat => {
    setLat(newLat);
  }
  //Used to change the longitude
  const handleLonChange = newLon => {
    setLon(newLon);
  }

  return (
    <>
      <div>
        <div id = "header">
          <SearchBar></SearchBar>
          <Logo></Logo>
        </div>
        <div id = "main">
          <Weather location = {location} lat = {lat} lon = {lon}></Weather>
          <MainInformation></MainInformation>
        </div>
        <div id = "forecasts">
          <div>
            <Forecast type = "Hourly"></Forecast>
            <Forecast type = "Weekly"></Forecast>
          </div>
          <div>
            <WeatherContainer lat = {lat} lon = {lon}></WeatherContainer>
          </div>
        </div>
      </div>
    </>
  );
}

// search bar should have 2 modes - light and dark - only dark implemented
function SearchBar() {
  return (
    <div class = "search-bar">
      <img class = "location-icon" alt = "" src = "location-icon-dark.png"></img>
      <div class = "search-bar-input">
        <input class = "location-input" placeholder = "Search for location"></input>
        <img class = "search-icon" alt = "" src = "search-icon-dark.png"></img>
      </div>
    </div>
  )
}


// logo component should have 2 modes - light and dark - only dark implemented 
function Logo() {
  return (
    <div class = "logo">
      <img class = "logo-img" alt = "" src = "logo-dark.png"></img>
    </div>
  )
}

//Displays the current weather information
function Weather({location, lat, lon}) {
  const [temp, setTemp] = useState(0);
  const [weatherType, setWeatherType] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  useEffect(() => {
    const APIKey = '137d15d7a9080968e84a1462718ab6e2';

    //Fetch the data with metric units
    //No way to get precipitation - not in JSON response
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      //Data isn't hourly but every three hours
      .then(data => {
        console.log(data);
        setTemp(Math.round(data['main']['temp']));
        //Rain has light rain and moderate rain, to get the appropriate type the description is needed
        setWeatherType(data['weather'][0]['main'] === "Rain" ? data['weather'][0]['description'] : data['weather'][0]['main']);
        setHumidity(data['main']['humidity']);
        //Windspeed recieved in m/s, to convert to km/h multiply by 3.6
        setWind(Math.round(data['wind']['speed'], 2) * 3.6);
      })
  }, [location, lat, lon])

  let imageSrc = getWeatherImage(weatherType);

  return (
    <div class = "main-container">
      <div class = "main-location">
        <h1> {location} </h1>
        <p> {weatherType} </p>   
      </div>
      <div class = "main-weather-icon">
        <img class = "main-weather-img" alt = "" src = {imageSrc}></img>
      </div>
      <div class = "main-temperature">
        <h1> {temp}° </h1>
      </div>
      <div class = "main-information">
        <div class = "humidity"> Humidity: {humidity}% </div>
        <div class = "wind"> Wind speed: {wind} km/h </div>
      </div>
    </div>
  )
}

//Add information from API
function MainInformation() {
  return (
    <div class = "main-info">
      <p>current weather description and information goes here..</p>
    </div>
  )
}

//Button for each forecast view
//Hourly and Weekly
//Weekly forecast can't be done - no API data for days
function Forecast({type}) {
  return (
    <button class = "forecast-btn">
      <h2> {type} Forecast </h2>
    </button>
  )
}

//Gets the weather data for every three hours 
function WeatherContainer({lat, lon}) {
  //Make numOfBoxes dynamic based on window size
  const numOfBoxes = 8;
  const [times, setTimes] = useState(Array(numOfBoxes).fill(0))
  const [temps, setTemps] = useState(Array(numOfBoxes).fill(0))
  const [weatherTypes, setWeatherTypes] = useState(Array(numOfBoxes).fill(0));

  useEffect(() => {
    const APIKey = '137d15d7a9080968e84a1462718ab6e2';

    //Fetch the data with metric units
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
      .then(response => {
        console.log(lat, lon);
        if (response.ok) {
          return response.json();
        }
      })
      //Data isn't hourly but every three hours
      .then(data => {
        console.log(data);
        let hourData = data['list'];
        //Intialise the arrays
        let newTimes = Array(numOfBoxes).fill(0);
        let newTemps = Array(numOfBoxes).fill(0);
        let newWeatherTypes = Array(numOfBoxes).fill(0);
        for (let i = 0; i < numOfBoxes; i++) {
          //Get the data from the JSON
          newTimes[i] = hourData[i]['dt_txt'].split(' ')[1];
          newTemps[i] = Math.round(hourData[i]['main']['temp']);
          newWeatherTypes[i] = hourData[i]['weather'][0]['main'];
          if (newWeatherTypes[i] === "Rain") {
            newWeatherTypes[i] = hourData[i]['weather'][0]['description'];
          }
        }
        setTimes(newTimes);
        setTemps(newTemps);
        setWeatherTypes(newWeatherTypes);
      })
  }, [lat, lon])

  return (
    <div class = "weather-container">
      <WeatherInfoBox time = {times[0]} temp = {temps[0]} weatherType = {weatherTypes[0]}></WeatherInfoBox>
      <WeatherInfoBox time = {times[1]} temp = {temps[1]} weatherType = {weatherTypes[1]}></WeatherInfoBox>
      <WeatherInfoBox time = {times[2]} temp = {temps[2]} weatherType = {weatherTypes[1]}></WeatherInfoBox>
      <WeatherInfoBox time = {times[3]} temp = {temps[3]} weatherType = {weatherTypes[1]}></WeatherInfoBox>
      <WeatherInfoBox time = {times[4]} temp = {temps[4]} weatherType = {weatherTypes[1]}></WeatherInfoBox>
      <WeatherInfoBox time = {times[5]} temp = {temps[5]} weatherType = {weatherTypes[1]}></WeatherInfoBox>
      <WeatherInfoBox time = {times[6]} temp = {temps[6]} weatherType = {weatherTypes[1]}></WeatherInfoBox>
      <WeatherInfoBox time = {times[7]} temp = {temps[7]} weatherType = {weatherTypes[1]}></WeatherInfoBox>
    </div>
  )
}

function WeatherInfoBox({time, temp, weatherType}) {
  let imageSrc = getWeatherImage(weatherType);
  return (
    <div class = "box">
      <h1> {time} </h1>
      <p> {temp}° </p>
      <img class = "weather-icon-small" alt = "" src = {imageSrc}></img>
    </div>
  )
}

//To add
function getWeatherImage(weatherType) {
  let imageSrc = "";
  if (weatherType === "Clouds") {
    imageSrc = "white-cloud.png";
  }
  else if (weatherType === "Clear") {
    imageSrc = "cloud-sunny.png";
  }
  else if (weatherType === "light rain") {
    imageSrc = "light-rain.png";
  }
  else if (weatherType === "moderate rain") {
    imageSrc = "heavy-rain.png";
  }
  else if (weatherType === "Snow") {
    imageSrc = "snowy.png";
  }
  return imageSrc;
}

/* For getting data from the Weather API */

//Gets the weather data for today, in an area
//Lat is latitude as a float
//Lon is longitude as a float
//The limit for API calls is 2000 per day
function getWeatherData(lat, lon) {
  const APIKey = '137d15d7a9080968e84a1462718ab6e2';

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then(response => {
      if (response.ok) {
        console.log(response.json());
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error('API request failed');
      }
    })
    .then(data => {
      //Display data
      console.log(data);
    })
    .catch(error => {
      //Display errors
      console.error(error);
    });
}

function getWeatherDataThreeHour(lat, lon) {
  const APIKey = '137d15d7a9080968e84a1462718ab6e2';

  return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then(response => {
      if (response.ok) {
        console.log(response.clone().json());
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error('API request failed');
      }
    })
}

//For testing that weather works
function WeatherButton() {
  return (
    <button onClick = {() => getWeatherDataThreeHour(51.0, 1.0)}></button>
  )
}

export default App;

