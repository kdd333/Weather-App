import React from 'react';
import {useState, useEffect, useContext} from 'react';
import ThemeContext from './Theme';

function TransportContainer() {
    //Max number of bus services
    const numOfBuses = 50;
    const [transportType, setTransportType] = useState("Train");
    const [trainData, setTrainData] = useState([]);
    const [busData, setBusData] = useState([]);
    const {theme} = useContext(ThemeContext);

    const handleTransportChange = newTransportType => {
        if (newTransportType !== transportType) {
            setTransportType(newTransportType);
        }
    }

    useEffect(() => {
        //Gets the data for TFL train lines
        fetch("https://api.tfl.gov.uk/Line/Mode/dlr,elizabeth-line,overground,tram,tube/Status")
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                let newTrainData = [];
                data.map(line => {
                    let reason = line.lineStatuses[0].reason !== undefined ? line.lineStatuses[0].reason : "";
                    newTrainData.push({name: line.name, status: line.lineStatuses[0].statusSeverityDescription, reason: reason});
                })
                setTrainData(newTrainData);
            })
        //Gets the data for TFL buses
        fetch("https://api.tfl.gov.uk/Line/Mode/bus/Status")
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                let newBusData = [];
                data.map(bus => {
                    if (Number(bus.id) < numOfBuses) {
                        let reason = bus.lineStatuses[0].reason !== undefined ? bus.lineStatuses[0].reason : "";
                        newBusData.push({name: bus.name, status: bus.lineStatuses[0].statusSeverityDescription, reason: reason});
                    }
                })
                setBusData(newBusData);
            })
    }, [transportType])

    return (
        <div class = {"transport-box-" + theme}>
            <div class = "transport-types">
                <TransportType type = "Train" onTransportChange = {handleTransportChange}></TransportType>
                <TransportType type = "Bus" onTransportChange = {handleTransportChange}></TransportType>
            </div>
            <div class = "transport-results">
                {transportType === "Train" &&
                    trainData.map(line => {
                        return (<TransportInfoBox transportInfo = {line} transportType = {transportType}></TransportInfoBox>);
                    })
                }
                {transportType === "Bus" &&
                    busData.map(line => {
                        return (<TransportInfoBox transportInfo = {line} transportType = {transportType}></TransportInfoBox>);
                    })
                }
            </div>
        </div>
    );
}

//Two types, Train or Bus
function TransportType({type, onTransportChange}) {
    return (
        <button onClick = {() => onTransportChange(type)}>
            <h2> {type} </h2>
        </button>
    );
}

//Displays information about the service on the line
function TransportInfoBox({transportInfo, transportType}) {
    const {theme} = useContext(ThemeContext);
    let lineName = "";
    if (transportType === "Train") {
        lineName = transportInfo.name.includes("line") ? transportInfo.name : transportInfo.name + " line";
    }
    else if (transportType === "Bus") {
        lineName = "Bus " + transportInfo.name;
    }
    return (
        <div class = {"transport-boxes-" + theme}>
            <h2> {lineName} </h2>
            {transportInfo.reason !== "" && <p> {transportInfo.reason} </p>}
            <p> {transportInfo.status} </p>
        </div>
    );
}

export default TransportContainer;
