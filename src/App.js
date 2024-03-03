/*
To do:
Weather, WeatherContainer
Weather data from API in Weather
*/

function App() {
  return (
    <>
      <div>
        <div id = "header">
          <SearchBar></SearchBar>
          <Logo></Logo>
        </div>
        <div id = "main">
          <Weather location = "London"></Weather>
          <MainInformation></MainInformation>
        </div>
        <div id = "forecasts">
          <div>
            <Forecast type = "Hourly"></Forecast>
            <Forecast type = "Weekly"></Forecast>
          </div>
          <div>
            <WeatherContainer></WeatherContainer>
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
      <img class = "location-icon" src = "location-icon-dark.png"></img>
      <div class = "search-bar-input">
        <input class = "location-input" placeholder = "Search for location"></input>
        <img class = "search-icon" src = "search-icon-dark.png"></img>
      </div>
    </div>
  )
}


// logo component should have 2 modes - light and dark - only dark implemented 
function Logo() {
  return (
    <div class = "logo">
      <img class = "logo-img" src = "logo-dark.png"></img>
    </div>
  )
}

// started rough layout - all placeholders
function Weather({location}) {
  return (
    <div class = "main-container">
      <div class = "main-location">
        <h1> {location} </h1>
        <p> (weather) </p>   
      </div>
      <div class = "main-weather-icon">
        <img class = "main-weather-img" src = "white-cloud.png"></img>
      </div>
      <div class = "main-temperature">
        <h1> 0° </h1>
      </div>
      <div class = "main-information">
        <div class = "precipitation"> Precipitation: </div>
        <div class = "humidity"> Humidity: </div>
        <div class = "wind"> Wind: </div>
      </div>
    </div>
  )
}

function MainInformation() {
  return (
    <div class = "main-info">
      <p>current weather description and information goes here..</p>
    </div>
  )
}

//Button for each forecast view
//Hourly and Weekly
function Forecast({type}) {
  return (
    <button class = "forecast-btn">
      <h2> {type} Forecast </h2>
    </button>
  )
}

// all placeholder data - needs to be replaced with actual data from API 
function WeatherContainer() {
  return (
    <div class = "weather-container">
      <div class = "box hour-1">
        <h1> 11:00 </h1>
        <p> 6° </p>
        <img class = "weather-icon-small" src = "cloud-sunny.png"></img>
      </div>
      <div class = "box hour-2">

      </div>
      <div class = "box hour-2">

      </div>
      <div class = "box hour-3">

      </div>
      <div class = "box hour-4">

      </div>
      <div class = "box hour-5">

      </div>
      <div class = "box hour-6">

      </div>
      <img class = "arrow" src = "arrow-dark.png"></img>
    </div>
  )
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

//For testing that weather works
function WeatherButton() {
  return (
    <button onClick = {() => getWeatherData(51.0, 1.0)}></button>
  )
}

export default App;

