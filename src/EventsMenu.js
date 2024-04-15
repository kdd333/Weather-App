import React, { Component } from "react";
import EventTile from "./EventTile";
import ThemeContext from "./Theme";
 
class EventsMenu extends Component { // Make class to handle API request of and serve to students

static contextType = ThemeContext; //Set the context of the component

constructor(props){
    super();
    this.state = { // Set up states for rendering and holding EventTile elems
        elems: []
    }
}
  render() { // Method to handle rendering Events Menu skeleton
    const {theme} = this.context; //Get the current context
    return (
      <div id="container" class = {"container-" + theme}>
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
    this.setState({elems: []}); // Reset state and rerender to empty
    fetch(`https://www.skiddle.com/api/v1/events/search/?api_key=c7d125f6586c9ce36123e6d38559f081&latitude=${curLat}&longitude=${curLon}&radius=30&&limit=10&offset=0`)
    .then(response => {
      if (response.ok) {
        return response.json(); // Parse the response data as JSON and return to then clause
      } else {
        throw new Error('API request failed');
      }
    })
    .then(data => {
        if (data.results.length === 0) // If results come empty display No Events message
        {
          this.setState({elems: [<li>No Events Found In Your Area</li>]});
          return;
        }
        let eventLIs = [];
        let elems = data["results"]; // Extract results from JSON response

        elems = Array.from(elems);
        
        for (let x=0; x < 10; x++) // Iter thru first 10 events
        {
          // Render EventTile tags with props of image, name, description, and link to event
          eventLIs.push(<EventTile src={elems[x]["imageurl"]} title={elems[x]["eventname"]} desc={elems[x]["description"]} link={elems[x]["link"]}/>);
        }
        this.setState({elems: eventLIs}) // Reset state => Rerender element with relevant events
    })
    
    .catch(error => {
      // Handle any errors here
      console.error(error); // Example: Logging the error to the console
    });
  }
}

function closeEventsMenu() // Function to change menu postition and bring out of view
{
  let cont = document.getElementById("container");
  cont.style.transform = "translate3d(-110vw, 0, 0)";
}

export default EventsMenu;