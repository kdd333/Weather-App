import React, {Component} from "react";

class EventTile extends Component{
    constructor(props){
        super();
        this.state ={imageURL: props["src"],
                     title: props["title"],
                     description: props["desc"],
                     link: props["link"]}
    }
    
    render(){
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
    open(){
        window.open(this.state.link, '_blank');
    }

}

export default EventTile;