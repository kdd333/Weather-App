/*
To do:
Weather, WeatherContainer
Weather data from API in Weather
*/

function App() {
  return (
    <>
      <div>
        <div id = "nav">
          <li>
            <ul><SearchBar></SearchBar></ul>
            <ul><h1> Weather </h1></ul>
          </li>
        </div>
        <div id = "main">
          <div id = "main-weather">
            <Weather></Weather>
          </div>
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

//The a.png image is a placeholder
function SearchBar() {
  return (
    <div class = "search-bar">
      {/* Location image */}
      <img style = {{height: 100}} src = "a.png"></img>
      <input placeholder = "Search for location"></input>
      {/* Search image */}
      <img style = {{height: 100}} src = "a.png"></img>
    </div>
  )
}

//Do later
function Weather() {

}

//Button for each forecast view
//Hourly and Weekly
function Forecast({type}) {
  return (
    <button class = "forecast">
      <h2> {type} Forecast </h2>
    </button>
  )
}

//Contains the weather for each hour/day
//To do
function WeatherContainer() {
  return (
    <div>
      {/* Stuff */}
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
