import React, { Component } from "react";
import EventTile from "./EventTile";
 
class EventsMenu extends Component {
constructor(props){
    super(props);
    this.state = {
        elems: []
    }
    //this.fetchEventData(props.lat, props.lon);
}

  render() {
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

  fetchEventData(curLat, curLon){
    this.setState({elems: []});
    fetch(`https://www.skiddle.com/api/v1/events/search/?api_key=c7d125f6586c9ce36123e6d38559f081&latitude=${curLat}&longitude=${curLon}&radius=30&&limit=10&offset=0`)
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
            this.setState({elems: [<li>No Events Found</li>]});
            return;
        }
        let eventLIs = [];
        let elemts = data["results"];

        elemts = Array.from(elemts);
        
        for (let x=0; x < 10; x++)
        {
          eventLIs.push(<EventTile src={elemts[x]["imageurl"]} title={elemts[x]["eventname"]} desc={elemts[x]["description"]} link={elemts[x]["link"]}/>);
          
        }
        this.setState({elems: eventLIs});
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