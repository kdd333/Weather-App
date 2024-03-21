import React, {Component} from "react";

class EventTile extends Component{ // Make new component class for individual events
    constructor(props){
        super();
        this.state ={imageURL: props["src"], // Set
                     title: props["title"],
                     description: props["desc"],
                     link: props["link"]}
    }
    
    render(){ // Render tile as responsive li with opening link if clicked
        return(
            <li onClick={this.open.bind(this)}>
                <div class="image">
                    <img alt={"Image of Event: " + this.state.title} src={this.state.imageURL} />
                </div>
                <div class="text">
                    <h3 class="title">{this.state.title}</h3>
                    <p class="desc">{this.state.description}</p>
                </div>
            </li>
        );
    }
    open(){ // Method to open assigned link in new tab if clicked
        window.open(this.state.link, '_blank');
    }

}

export default EventTile;