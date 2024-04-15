import { useState, useEffect } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';

//Search bar component
function SearchBar({onLocationChange, onLatChange, onLonChange}) {
    //maxLocations is the number of possible locations that can be fetched or stored in recent
    const maxLocations = 5;
    const [searchLocation, setSearchLocation] = useState("");
    const [locations, setLocations] = useState(Array(maxLocations));
    const [recent, setRecent] = useState(Array(maxLocations).fill({name: ""}));
    const [isSearching, setIsSearching] = useState(false);

    //Changes the location to the location clicked on by the user
    const handleClick = (locationText, lat, lon) => {
        //Adds a new location to the recent list, if it's not already in the list
        if (recent.findIndex((location) => {return location.name === locationText;}) === -1) {
            let newRecent = [{name: locationText, lat: lat, lon: lon}];
            for (let i = 0; i < maxLocations - 1; i++) {
                newRecent.push(recent[i]);
            }
            setRecent(newRecent)
        }
        onLocationChange(locationText);
        onLatChange(lat);
        onLonChange(lon);
        setSearchLocation("");
        setLocations([]);
    }
  
    //Get locations and store it
    useEffect(() => {
        const APIKey = "137d15d7a9080968e84a1462718ab6e2";
        if (searchLocation !== "") {
            setIsSearching(true);
            //Searching is limited to GB
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchLocation},GB&limit=${maxLocations}&appid=${APIKey}`)
                .then (response => {
                    if (response.ok) {
                        return response.json();
                    }
                })
                .then (data => {
                    let locationsLength = maxLocations > data.length ? data.length : maxLocations;
                    let allLocations = [];
                    for (let i = 0; i < locationsLength; i++) {
                        let location = data[i]['name'];
                        let state = data[i]['state'];
                        let lat = data[i]['lat'];
                        let lon = data[i]['lon'];
                        allLocations.push({id: i + maxLocations, name: location, state: state, lat: lat, lon: lon});
                    }
                    setLocations(allLocations);
                })
        }
        else {
            setIsSearching(false);
            setLocations([]);
        }
    }, [searchLocation])

    return (
        <div>
            <div class = "btn">
                <button id="theme-btn" onClick={opensearchbar}>Location</button>
            </div>
            <div class="searches" style={{display:"none"}}id="mySidebar">
                <button class="btn2" onClick={closebutton}>
                    <svg onClick={closebutton} width="24" height="24" fill="solid" viewBox="0 0 24 24">
                        <path stroke="lightgrey" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75L6.75 17.25"/>
                        <path stroke="lightgrey" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 6.75L17.25 17.25"/>
                    </svg>
                </button>
            
                <div class="sidebar">
                    <input class="searchbar" placeholder="Search the location" onChange = {(e) => setSearchLocation(e.target.value)} value = {searchLocation}></input>
                    <div id = "s">
                        {isSearching && <h2> Results </h2>}
                        {isSearching && locations.length === 0 && <p> No results </p>}
                        {
                            //Loops through each location fetched from the API and displays a button for it
                            locations.map(location => {
                                //location.state might be empty
                                let locationText = location.name + (location.state !== undefined ? ", " + location.state : "");
                                return <button class = "search-boxes" type = "Submit" onClick = {() => handleClick(locationText, location.lat, location.lon)}> {locationText} </button>
                            })
                        }
                        {isSearching && <h2> Recent </h2>}
                        {isSearching && recent[0].name === "" && <p> No recent searches </p>}
                        {
                            //Loops through all the recent searches and displays a button for it
                            recent.map(location => {
                                if (isSearching && location.name !== "") {
                                    return <button class = "search-boxes" type = "Submit" onClick = {() => handleClick(location.name, location.lat, location.lon)}> {location.name} </button>
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

function opensearchbar(){
    document.getElementById("mySidebar").style.display = "block";
}

function closebutton(){
    document.getElementById("mySidebar").style.display = "none";
}

export default SearchBar;