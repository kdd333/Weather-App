import React, { useCallback } from 'react';
import {useState, useEffect, useContext} from 'react';
import ThemeContext from './Theme';

//Display the main information about the current weather forecast
function WeatherMainInformation({lat, lon}) {
    const [description, setDescription] = useState("");
    const [allWarnings, setAllWarnings] = useState([]);
    const {theme} = useContext(ThemeContext);
  
    useEffect(() => {
      const APIKey = '137d15d7a9080968e84a1462718ab6e2';
  
      fetch(`https://pro.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIKey}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(data => {
          //Beaufort scale: https://en.wikipedia.org/wiki/Beaufort_scale
          //Heat index: https://en.wikipedia.org/wiki/Heat_index
          //Wind chill index: https://en.wikipedia.org/wiki/Wind_chill
          //Generates a weather description based on the current weather data
          const temp = Math.round(data['main']['temp']);
          const tempFL = Math.round(data['main']['feels_like']);
          const weatherType = data['weather'][0]['id'];
          const visibility = data['visibility'];
          const windSpeed = data['wind']['speed'];
          const B = Math.round(Math.cbrt((windSpeed/0.836)**2));
          const windWarnings = ["Strong winds", "Storm"];
          let windDescs = ["calm air", "light air", "light breeze", "gentle breeze",
                          "moderate breeze", "fresh breeze", "strong breeze",
                          "high wind", "gale", "strong gale", "storm",
                          "violent storm", "hurricane-force"];
          const weatherWarnings = ["Thunderstorm", "Heavy Thunderstorm", "Hail", "Heavy Rain", "Snow", "Heavy Snow"];
          const visibilityWarning = ["Low Visibility"];
          let visibilityDesc = visibility < 5000 ? "poor visibility" : "good visibility";
          const tempWarnings = ["Caution - Cold", "Extreme Caution - Very Cold", "Danger - Extreme Cold, Frostbite", "Extreme Danger - Extreme Cold, Frostbite",
                              "Caution - High Temperature", "Extreme Caution - High Temperature, Heat Stroke", 
                              "Danger - Extreme Temperature, Heat Stroke", "Extreme Danger - Extreme Temperature, Heat Stroke"];
          let tempDesc = `feels like ${tempFL}°C.`;
  
          let desc = "It currently " + tempDesc + " With an expected maximum temperature of " + Math.round(data['main']['temp_max']) + 
                    "°C and an expected minimum temperature of " + Math.round(data['main']['temp_min']) + 
                    "°C. With windspeeds producing a " + windDescs[B] + ". There is currently " + visibilityDesc + ".";
  
          let warnings = [];
          //Between 6 - 9 on the Beaufort scale is moderate
          if (B >= 6 && B <= 9) {
            warnings.push({warning: windWarnings[0], type: "Amber"});
          }
          //Above 9 is dangerous
          else if (B > 9) {
            warnings.push({warning: windWarnings[1], type: "Red"});
          }
  
          //Codes taken from https://openweathermap.org/weather-conditions
          //Heavy/Ragged thunderstorm
          if (weatherType === 212 || weatherType === 221) {
            warnings.push({warning: weatherWarnings[1], type: "Amber"})
          }
          //Thunderstorms
          else if (weatherType >= 200 && weatherType < 300) {
            warnings.push({warning: weatherWarnings[0], type: "Red"});
          }
          //Freezing rain
          else if (weatherType === 511) {
            warnings.push({warning: weatherWarnings[2], type: "Amber"})
          }
          //Very heavy/Extreme/Heavy intensity shower/Ragged shower rain
          else if (weatherType === 503 || weatherType === 504 || weatherType === 522 || weatherType === 531) {
            warnings.push({warning: weatherWarnings[3], type: "Amber"});
          }
          //Heavy/Heavy shower snow
          else if (weatherType === 602 || weatherType === 622) {
            warnings.push({warning: weatherWarnings[5], type: "Red"})
          }
          //Snow
          else if (weatherType >= 600 && weatherType < 700) {
            warnings.push({warning: weatherWarnings[4], type: "Amber"});
          }
          //Atmosphere - visiblity
          else if (weatherType >= 700 && weatherType < 800 && visibility < 5000) {
            warnings.push({warning: visibilityWarning[0], type: "Amber"});
          }
  
          //Cold warnings
          if (temp  <= 0 && temp > -12) {
            warnings.push({warning: tempWarnings[0], type: "Amber"});
          }
          else if (temp <= -12 && temp > -20) {
            warnings.push({warning: tempWarnings[1], type: "Red"});
          }
          else if (temp <= -20 && temp > -37) {
            warnings.push({warning: tempWarnings[2], type: "Red"});
          }
          else if (temp <= -37) {
            warnings.push({warning: tempWarnings[3], type: "Red"});
          }
          //Heat warnings
          if (temp >= 27 && temp < 32) {
            warnings.push({warning: tempWarnings[4], type: "Amber"});
          }
          else if (temp >= 32 && temp < 41) {
            warnings.push({warning: tempWarnings[5], type: "Red"});
          }
          else if (temp >= 41 && temp < 54) {
            warnings.push({warning: tempWarnings[6], type: "Red"});
          }
          else if (temp >= 54) {
            warnings.push({warning: tempWarnings[7], type: "Red"});
          }
          
          setDescription(desc);
          setAllWarnings(warnings);
        })
    }, [lat, lon]);
    
    return (
      <div class = {"main-info-" + theme}>
        {allWarnings.map(warning => {
          let warningType = "";
          if (warning.type === "Amber") {
            warningType = "amber";
          }
          else if (warning.type === "Red") {
            warningType = "severe";
          }
          return (
            <div class = "warning">
              <img src = {warningType + "-warning.png"} alt = ""></img>
              <p> - {warning.warning} </p>
            </div>
          );
        })}
        <p> {description} </p>
      </div>
    );
  }

  export default WeatherMainInformation;