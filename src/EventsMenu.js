import React, { Component } from "react";
import ReactDOM from "react";
import EventTile from "./EventTile";

 
class EventsMenu extends Component {
constructor(){
    super();
    this.state = {
        elems: [],
        json: {}
    }
    this.fetchEventData("");
}
  render(elems) {
    return (
      <div id="container">
          <div id="eventControlGroup">
            <h1>Events</h1>
            <div onClick={closeEventsMenu}>
              <svg onClick={closeEventsMenu} width="44" height="44" fill="solid" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.25 6.75L6.75 17.25"/>
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 6.75L17.25 17.25"/>
              </svg>
            </div>
          </div>
          <ul id="elemList">
            {this.state.elems}
          </ul>
      </div>
    );
  }

  fetchEventData(location){
    fetch('https://www.skiddle.com/api/v1/events/search/?api_key=c7d125f6586c9ce36123e6d38559f081&latitude=51.5072&longitude=0.1276&radius=30&&limit=100&offset=0')
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON
      } else {
        throw new Error('API request failed');
      }
    })
    .then(data => {
        if (data.results.length === 0)
        {
            return;
        }
        let eventLIs = [];
        let elems = data["results"];

        elems = Array.from(elems);
        
        for (let x=0; x < 10; x++)
        {
          console.log(elems);
          eventLIs.push(<EventTile src={elems[x]["imageurl"]} title={elems[x]["eventname"]} desc={elems[x]["description"]} link={elems[x]["link"]}/>);
        }
        console.log(eventLIs.length);
        this.setState({elems: eventLIs, json: data.results})
    })
    
    .catch(error => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
  }
}

function closeEventsMenu()
{
  let cont = document.getElementById("container");
  cont.style.transform = "translate3d(-110vw, 0, 0)";
}

export default EventsMenu;