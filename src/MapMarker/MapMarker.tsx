import React, {useState} from 'react';
import {Marker, Popup} from 'react-map-gl';
import OutsideAlerter from '../OutsideAlerter';
import tracker from '../img/marker.svg';
import {LngLat} from "../App";
import './MapMarker.css';

export default function MapMarker(props: { id: number, marker: LngLat, onDelete: () => void }) {
    const [showPopup, togglePopup] = useState(false);

    return (
        <div>
            <Popup
                className={showPopup ? 'popup' : 'hidden'}
                latitude={props.marker.latitude}
                longitude={props.marker.longitude}
                closeButton={false}
                anchor="top"
            >
                <OutsideAlerter
                    value={false}
                    setValue={togglePopup}
                    detectDrag={true}>
                    <div
                        className={showPopup ? 'popup-animation' : 'hidden'}>
                        <div
                            className={showPopup ? 'popup' : 'hidden'}>
                            {" RELAIS " + (props.id + 1)}
                            <br/>
                            <br/>
                            {" Longitude: " + props.marker.longitude}
                            <br/>
                            {" Latitude: " + props.marker.latitude}
                            <br/>
                            {" Floor: " + props.marker.floor}
                        </div>

                        <button
                            className={showPopup ? 'delete-button' : 'hidden'}
                            onClick={props.onDelete}
                        > Supprimer
                        </button>
                    </div>
                </OutsideAlerter>
            </Popup>
            <Marker
                key={props.id}
                latitude={props.marker.latitude}
                longitude={props.marker.longitude}
                offsetLeft={-15}
                offsetTop={-30}
            >

                <button
                    className={showPopup ? 'tracker tracker-animation' : 'tracker'}
                    onClick={() => {
                        togglePopup(!showPopup);
                    }}
                >
                    <img
                        src={tracker}
                        alt="Tracker"
                        width={30}/>
                </button>

            </Marker>
        </div>
    );
}
