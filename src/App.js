/*
To do:
Night weather shift
Change description
Change the number of boxes so arrows work properly - something about dynamic
*/

import { useEffect, useState } from "react";
import SearchBar from "./searchBar";


function App() {
  const [location, setLocation] = useState("London");
  //Lat is latitude as a float
  //Lon is longitude as a float
  const [lat, setLat] = useState("51.0");
  const [lon, setLon] = useState("1.0");
  //Changing the weather view from hourly to weekly or vise-versa
  const [weatherView, setWeatherView] = useState("Hourly");
  const [offset, setOffset] = useState(0);

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

  const handleWeatherViewChange  = newWeatherView => {
    if (weatherView === "Hourly" && newWeatherView !== "Hourly") {
      setWeatherView(newWeatherView);
      setOffset(0);
    }
    else if (weatherView === "Weekly" && newWeatherView !== "Weekly") {
      setWeatherView(newWeatherView);
      setOffset(0);
    }
  }

  

  return (
    <>
      <div>
        <div id = "header">
          <SearchBar  onLocationChange= {handleLocationChange} onLatChange = {handleLatChange} onLonChange = {handleLonChange}></SearchBar>
          <Logo></Logo>
        </div>
        <div id = "main">
          <Weather location = {location} lat = {lat} lon = {lon}></Weather>
          <MainInformation></MainInformation>
        </div>
        <div id = "forecasts">
          <div>
            <Forecast type = "Hourly" onWeatherViewChange = {() => handleWeatherViewChange("Hourly")}></Forecast>
            <Forecast type = "Weekly" onWeatherViewChange = {() => handleWeatherViewChange("Weekly")}></Forecast>
          </div>
          <div>
            <WeatherContainer lat = {lat} lon = {lon} currentWeatherView = {weatherView} offset = {offset} onOffsetChange = {(offset) => setOffset(offset)}></WeatherContainer>
          </div>
        </div>
      </div>
    </>
  );
}

// logo component should have 2 modes - light and dark - only dark implemented 
function Logo() {
  return (
    <div class = "logo">
      <img class = "logo-img" src = "logo-dark.png" alt = ""></img>
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
    fetch(`https://pro.openweathermap.org/data/2.5/weather?&location=${location}&lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      //Data isn't hourly but every three hours
      .then(data => {
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
        <img class = "main-weather-img" src = {imageSrc} alt = ""></img>
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
function Forecast({type, onWeatherViewChange}) {
  return (
    <button class = "forecast-btn" onClick = {onWeatherViewChange}>
      <h2> {type} Forecast </h2>
    </button>
  )
}

//Gets the weather data for each hour
function WeatherContainer({lat, lon, currentWeatherView, offset, onOffsetChange}) {
  const numOfBoxes = 8;
  const [maxBoxes, setMaxBoxes] = useState(24);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const APIKey = '137d15d7a9080968e84a1462718ab6e2';
    //Fetch the data with metric units
    if (currentWeatherView === "Hourly") {
      setMaxBoxes(24);
      fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${APIKey}&cnt=24&units=metric`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => {
          let hourData = data['list'];
          //Intialise the array
          let newWeatherData = [];
          for (let i = 0; i < numOfBoxes; i++) {
            //Get the data from the JSON
            let id = offset + i;
            let time = Number(hourData[id]['dt_txt'].split(' ')[1].split(":")[0]);
            time = formatTime(time);
            let temp = Math.round(hourData[id]['main']['temp']);
            let weatherType = hourData[id]['weather'][0]['main'];
            if (weatherType === "Rain") {
              weatherType = hourData[id]['weather'][0]['description']
            }
            newWeatherData.push({id: id, time: time, temp: temp, weatherType: weatherType});
          }
          setWeatherData(newWeatherData);
        })
    }
    else if (currentWeatherView === "Weekly") {
      setMaxBoxes(8);
      fetch(`https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${APIKey}&cnt=${numOfBoxes}&units=metric`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => {
          let dailyData = data['list'];
          let newWeatherData = [];
          for (let i = 0; i < numOfBoxes; i++) {
            let id = offset + i;
            //Multiply by 1000 because Date uses milliseconds
            let time = new Date(Number(dailyData[id]['dt'] * 1000));
            let timeString = findDay(time.getDay()) + " " + time.getDate();
            let temp = Math.round(dailyData[id]['temp']['day']);
            let weatherType = dailyData[id]['weather'][0]['main'];
            if (weatherType === "Rain") {
              weatherType = dailyData[id]['weather'][0]['description'];
            }
            newWeatherData.push({id: id, time: timeString, temp: temp, weatherType: weatherType});
          }
          setWeatherData(newWeatherData);
        })
    }
  }, [lat, lon, offset, currentWeatherView])

  return (
    <div class = "weather-container">
      {offset >= numOfBoxes && <img class = "arrow" src = "arrow-dark-back.png" alt = "" onClick = {() => onOffsetChange(offset => offset - numOfBoxes)}></img>}
      {weatherData.map(weather => {
        return (<WeatherInfoBox key = {weather.id} time = {weather.time} temp = {weather.temp} weatherType = {weather.weatherType}></WeatherInfoBox>)
      })}
      {offset + numOfBoxes < maxBoxes && <img class = "arrow" src = "arrow-dark-forward.png" alt = "" onClick = {() => onOffsetChange(offset => offset + numOfBoxes)}></img>}
    </div>
  )
}

//Formats the time
function formatTime(time) {
  if (time < 12) {
    if (time === 0) {
      time = "12 AM";
    }
    else {
      time = time + " AM";
    }
  }
  else {
    if (time === 12) {
      time = "12 PM"
    }
    else {
      time = time % 12 + " PM";
    }
  }
  return time;
}

//Converts the day from a number into the string for the day
//Starts at 0 - Sunday
function findDay(day) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function WeatherInfoBox({time, temp, weatherType}) {
  let imageSrc = getWeatherImage(weatherType);
  return (
    <div class = "box">
      <h1> {time} </h1>
      <p> {temp}° </p>
      <img class = "weather-icon-small" src = {imageSrc} alt = ""></img>
    </div>
  )
}

//Gets the weather image based on weatherType
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
        console.log(response.clone().json());
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

function getWeatherDataThreeHourlocation(location) {
  const APIKey = '137d15d7a9080968e84a1462718ab6e2';

  return fetch(`https://api.openweathermap.org/data/2.5/forecast?location=${location}&appid=${APIKey}`)
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

