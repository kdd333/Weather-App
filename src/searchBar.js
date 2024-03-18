import { useState, useEffect } from 'react';

function SearchBar({onLocationChange, onLatChange, onLonChange}) {
    const maxLocations = 5;
    const [searchLocation, setSearchLocation] = useState("");
    const [locations, setLocations] = useState(Array(maxLocations));
    const [recent, setRecent] = useState([Array(maxLocations).fill({name: ""})]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSubmit = event => {
        event.preventDefault();
        let button = event.nativeEvent.submitter;
        let buttonID = button.id;
        let buttonType = "Recent";
        if (buttonID >= 5) {
            buttonID -= maxLocations;
            buttonType = "New"
        }
        let locationText = "";
        let lat = 0;
        let lon = 0;
        if (buttonType === "New") {
            let city = locations[buttonID]['name'];
            let state = locations[buttonID]['state'] !== "" ? ", " + locations[buttonID]['state'] : "";
            locationText = city + state;
            lat = locations[buttonID]['lat'];
            lon = locations[buttonID]['lon'];
        }
        else if (buttonType === "Recent") {
            locationText = recent[buttonID]['name'];
            lat = recent[buttonID]['lat'];
            lon = recent[buttonID]['lon'];
        }
        onLocationChange(locationText);
        onLatChange(lat);
        onLonChange(lon);
        setSearchLocation("");
        setLocations([]);
        if (buttonType === "New") {
            let newLat = locations[buttonID]['lat'];
            let newLon = locations[buttonID]['lon'];
            let mostRecent = recent[0];
            let newRecent = [{id: 0, name: locationText, lat: newLat, lon: newLon}];
            for (let i = 1; i < maxLocations; i++) {
                if (i === 1) {
                    newRecent.push({id: 1, ...mostRecent})
                }
                else {
                    newRecent.push({id: i + 1, ...recent[i - 1]});
                }
            }
            setRecent(newRecent)
        }
    }
  
    useEffect(() => {
        const APIKey = "137d15d7a9080968e84a1462718ab6e2";
        if (searchLocation !== "") {
            setIsSearching(true);
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${searchLocation},GB&limit=10&appid=${APIKey}`)
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
            <div class="btn">
                <button class="btn1" onClick={opensearchbar}>☰</button>
            </div>
            <div class="searches" style={{display:"none"}}id="mySidebar">
                <div class="sidebar">
                    <form onSubmit = {(e) => handleSubmit(e)}>
                        <input class="searchbar" onChange = {(e) => setSearchLocation(e.target.value)} value = {searchLocation}></input>
                        <div id = "s">
                            {locations.length !== 0 && <h2> Results </h2>}
                            {
                            locations.map(location => {
                                let locationText = location.name + (location.state !== "" ? ", " + location.state : "");
                                return <button id = {location.id} class = "search-boxes" type = "Submit"> {locationText} </button>
                            })
                            }
                            {isSearching && <h2> Recent </h2>}
                            {
                                recent.map(location => {
                                    if (isSearching && location.name !== "") {
                                        return <button id = {location.id} class = "search-boxes" type = "Submit"> {location.name} </button>
                                    }
                                })
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function opensearchbar(){
    document.getElementById("mySidebar").style.display = "block";
}

export default SearchBar;