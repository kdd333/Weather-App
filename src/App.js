import {useEffect, useState, useContext} from "react";
import SearchBar from "./searchBar";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import EventsMenu from "./EventsMenu";
import WeatherMainInformation from "./WeatherMainInformation";
import ThemeContext from "./Theme";
import TransportContainer from "./TransportContainer";

function App() {
  //Default location
  const [location, setLocation] = useState("London, England");
  const [lat, setLat] = useState("51.0");
  const [lon, setLon] = useState("1.0");
  //weatherView represents the view of the forecast, either hourly or weekly
  const [weatherView, setWeatherView] = useState("Hourly");
  const [theme, setTheme] = useState("light");

  //Attempt to get the users location
  //Only runs on first render to avoid changing back to the users location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
    const APIKey = '137d15d7a9080968e84a1462718ab6e2';
    const coords = pos.coords;
    
    setLat(coords.latitude);
    setLon(coords.longitude);

    fetch(`http://pro.openweathermap.org/geo/1.0/reverse?lat=${coords.latitude}&lon=${coords.longitude}&limit=5&appid=${APIKey}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        let city = data[0]['name'];
        let state = data[0]['state'] !== undefined ? ", " + data[0]['state'] : "";
        setLocation(city + state);
      })
    })
  }, [])
  
  //Used to change the location
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

  //Used to change the weatherView
  const handleWeatherViewChange  = newWeatherView => {
    if (weatherView === "Hourly" && newWeatherView !== "Hourly") {
      setWeatherView(newWeatherView);
    }
    else if (weatherView === "Weekly" && newWeatherView !== "Weekly") {
      setWeatherView(newWeatherView);
    }
  }

  const openEventsMenu = () => {
    document.getElementById("container").style.transform = "translate3d(0, 0, 0)";
    window.EVMenu.fetchEventData(lat, lon);
  }

  return (
    <>
      <ThemeContext.Provider value = {{theme}}>
        <div id = {"app-" + theme}>
          <div id = "header">
            <SearchBar  onLocationChange= {handleLocationChange} onLatChange = {handleLatChange} onLonChange = {handleLonChange}></SearchBar>
            <Logo></Logo>
            <div id="nav-btns">
              <button id="theme-btn" onClick={openEventsMenu}>Events</button>
              <button id="theme-btn" onClick = {() => {setTheme(theme => {return theme === "light" ? "dark" : "light"})}}> {theme === "light" ? "Dark" : "Light"} Mode </button>
            </div>
          </div>
          <div id = "main">
            <Weather location = {location} lat = {lat} lon = {lon}></Weather>
            <WeatherMainInformation lat = {lat} lon = {lon}></WeatherMainInformation>
          </div>
          <div id = "forecasts">
            <div>
              <Forecast type = "Hourly" onWeatherViewChange = {() => handleWeatherViewChange("Hourly")}></Forecast>
              <Forecast type = "Weekly" onWeatherViewChange = {() => handleWeatherViewChange("Weekly")}></Forecast>
            </div>
            <div class = "weather-container">
              <WeatherContainer lat = {lat} lon = {lon} currentWeatherView = {weatherView}></WeatherContainer>
            </div>
          </div>
          <div id = "extra">
            <div id = {"transport-" + theme}> 
              <TransportContainer></TransportContainer>
            </div>
          </div>
        </div>
        <EventsMenu ref = {EVMenu => {window.EVMenu = EVMenu}}></EventsMenu>
      </ThemeContext.Provider>
    </>
  );
}

// logo component should have 2 modes - light and dark - only dark implemented 
function Logo() {
  const {theme} = useContext(ThemeContext);
  return (
    <div class = "logo">
      <img class = "logo-img" src = {"logo-" + theme + ".png"} alt = ""></img>
    </div>
  )
}

//Displays the current weather information
function Weather({location, lat, lon}) {
  const [temp, setTemp] = useState(0);
  const [weatherType, setWeatherType] = useState(0);
  const [weatherCondition, setWeatherCondition] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const {theme} = useContext(ThemeContext);

  useEffect(() => {
    const APIKey = '137d15d7a9080968e84a1462718ab6e2';

    //Fetch the data with metric units
    fetch(`https://pro.openweathermap.org/data/2.5/weather?&location=${location}&lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        setTemp(Math.round(data['main']['temp']));
        setWeatherType(data['weather'][0]['main']);
        setWeatherCondition(data['weather'][0]['id'])
        setHumidity(data['main']['humidity']);
        //Windspeed recieved in m/s, to convert to km/h multiply by 3.6
        setWind(Math.round(data['wind']['speed'], 2) * 3.6);
      })
  }, [location, lat, lon])

  let imageSrc = getWeatherImage(weatherCondition);

  return (
    <div class = {"main-container-" + theme + " main-container"}>
      <div class = "main-location">
        <h1> {location} </h1>
        <p> {weatherType} </p>   
      </div>
      <div class = "main-weather-icon">
        <img class = "main-weather-img" src = {imageSrc} alt = ""></img>
      </div>
      <div class = "main-temperature">
        <h1> {temp}°C </h1>
      </div>
      <div class = "main-information">
        <div class = "humidity"> Humidity: {humidity}% </div>
        <div class = "wind"> Wind: {wind}km/h </div>
      </div>
    </div>
  );
}

//Button for each forecast view
//Hourly and Weekly
function Forecast({type, onWeatherViewChange}) {
  const {theme} = useContext(ThemeContext);
  return (
    <button class = {"forecast-btn-" + theme} onClick = {onWeatherViewChange}>
      <h2> {type} Forecast </h2>
    </button>
  );
}

//Gets the weather data for each hour
function WeatherContainer({lat, lon, currentWeatherView}) {
  const hourlyNumOfBoxes = 24;
  const weeklyNumOfBoxes = 8;
  const [weatherData, setWeatherData] = useState([]);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 8
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7
    },
    tablet: {
      breakpoint: { max: 1024, min: 700 },
      items: 5
    },
    smallTablet: { 
      breakpoint: { max: 700, min: 570 },
      items: 4
    },
    mobile: {
      breakpoint: { max: 570, min: 0 },
      items: 3
    }
  };

  useEffect(() => {
    const APIKey = '137d15d7a9080968e84a1462718ab6e2';
    //Fetch the data with metric units
    if (currentWeatherView === "Hourly") {
      fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=${APIKey}&cnt=${hourlyNumOfBoxes}&units=metric`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => {
          let hourData = data['list'];
          let newWeatherData = [];
          for (let i = 0; i < hourlyNumOfBoxes; i++) {
            let id = i;
            let time = Number(hourData[id]['dt_txt'].split(' ')[1].split(":")[0]);
            time = formatTime(time);
            let temp = Math.round(hourData[id]['main']['temp']);
            let weatherCondition = hourData[id]['weather'][0]['id'];
            newWeatherData.push({id: id, time: time, temp: temp, weatherCondition: weatherCondition});
          }
          setWeatherData(newWeatherData);
        })
    }
    else if (currentWeatherView === "Weekly") {
      fetch(`https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${APIKey}&cnt=${weeklyNumOfBoxes}&units=metric`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => {
          let dailyData = data['list'];
          let newWeatherData = [];
          for (let i = 0; i < weeklyNumOfBoxes; i++) {
            let id = i;
            //Multiply by 1000 because Date uses milliseconds
            let time = new Date(Number(dailyData[id]['dt'] * 1000));
            let timeString = findDay(time.getDay()) + " " + time.getDate();
            let temp = Math.round(dailyData[id]['temp']['day']);
            let weatherCondition = dailyData[id]['weather'][0]['id'];
            newWeatherData.push({id: id, time: timeString, temp: temp, weatherCondition: weatherCondition});
          }
          setWeatherData(newWeatherData);
        })
    }
  }, [lat, lon, currentWeatherView])

  return (
    <Carousel responsive = {responsive} slidesToSlide = {3}>
      {weatherData.map(weather => {
        return (<WeatherInfoBox key = {weather.id} time = {weather.time} temp = {weather.temp} weatherCondition = {weather.weatherCondition}></WeatherInfoBox>)
      })}
    </Carousel>
  );
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

function WeatherInfoBox({time, temp, weatherCondition}) {
  const {theme} = useContext(ThemeContext);
  let imageSrc = getWeatherImage(weatherCondition);
  return (
    <div class = {"box-" + theme}>
      <h1> {time} </h1>
      <p> {temp}° </p>
      <img class = "weather-icon-small" src = {imageSrc} alt = ""></img>
    </div>
  );
}

//Gets the weather image based on weatherCondition
//weatherCondition is the id of the weather
//All codes can be found at https://openweathermap.org/weather-conditions
function getWeatherImage(weatherCondition) {
  const heavyRainCodes = [503, 504, 522, 531];
  let imageSrc = "";
  if (weatherCondition >= 200 && weatherCondition < 300) {
    imageSrc = "stormy-icon.png";
  }
  else if (weatherCondition >= 300 && weatherCondition < 400) {
    imageSrc = "light-rain.png";
  }
  else if (heavyRainCodes.findIndex((code) => {return code === weatherCondition;}) >= 0) {
    imageSrc = "heavy-rain.png";
  }
  else if (weatherCondition >= 500 && weatherCondition < 600) {
    imageSrc = "light-rain.png";
  }
  else if (weatherCondition >= 600 && weatherCondition < 700) {
    imageSrc = "snowy.png"
  }
  else if (weatherCondition === 800 || weatherCondition === 801) {
    imageSrc = "cloud-sunny.png";
  }
  else if (weatherCondition === 802 || weatherCondition === 803 || weatherCondition === 804) {
    imageSrc = "white-cloud.png";
  }
  return imageSrc;
}

export default App;