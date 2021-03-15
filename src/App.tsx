import React, {useState} from 'react';
import ReactMapGl from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {MapEvent} from "react-map-gl/src/components/interactive-map";
import MapMarker from "./MapMarker/MapMarker";

import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!../../../node_modules/mapbox-gl/dist/mapbox-gl-csp-worker').default;

export class LngLat {
    longitude: number;
    latitude: number;

    constructor(longitude: number, latitude: number) {
        this.longitude = longitude;
        this.latitude = latitude;
    }

}

const markers: LngLat[] = [];

function App() {
    const [viewport, setViewport] = useState({
        latitude: 46.440896,
        longitude: 6.891924,
        zoom: 19,
        maxZoom: 22,
        minZoom: 17,
        // doubleClickZoom: false
        // mapStyle: 'mapbox://styles/ludohoffstetter/cklfuba923yaa17miwvtmd26g',
    } as any);

    function handleDblClick(evt: MapEvent) {
        markers.push(new LngLat(evt.lngLat[0], evt.lngLat[1]))
    }

    return (
        <div className="container">
            <ReactMapGl
                {...viewport}
                className={'map'}
                width="100%"
                height="100%"
                onViewportChange={setViewport}
                mapStyle={'mapbox://styles/ludohoffstetter/ckm9rqausfir817rz0t5l28p5'}
                onDblClick={handleDblClick}
                getCursor={() => "crosshair"}
            >
                {markers.map((gps, idx) =>
                    <MapMarker id={idx} gps={gps} onDelete={() => markers.splice(idx, 1)}/>)}
            </ReactMapGl>
        </div>
    );
}

export default App;
