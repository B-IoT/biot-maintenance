import React, {useState} from 'react';
import ReactMapGl, {Layer, Source} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {MapEvent} from "react-map-gl/src/components/interactive-map";
import MapMarker from "./MapMarker/MapMarker";
import blueprint from './blueprint.png';

import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!../node_modules/mapbox-gl/dist/mapbox-gl-csp-worker').default;

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
        latitude: 46.529405896941945,
        longitude: 6.622925131236617,
        zoom: 19,
        maxZoom: 22,
        minZoom: 17,
        // doubleClickZoom: false
        // mapStyle: 'mapbox://styles/ludohoffstetter/cklfuba923yaa17miwvtmd26g',
    } as any);

    function handleDblClick(evt: MapEvent) {
        markers.push(new LngLat(evt.lngLat[0], evt.lngLat[1]))
    }

    const lonShift = -0.00000804584146*0.3;
    const latShift = -0.00002940280387*0.8;

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
                <Source
                    id="map-source"
                    type="image"
                    url={blueprint}
                    coordinates={[
                        [6.6221646113321135 + lonShift, 46.52992292443224 + latShift],
                        [6.623385456772448 + lonShift, 46.52943385229428 + latShift],
                        [6.622987925323761 + lonShift, 46.528960050318986 + latShift],
                        [6.621764919250702 + lonShift, 46.52944756749944 + latShift]
                    ]}
                />
                <Layer
                    id="overlay"
                    source="map-source"
                    type="raster"
                    paint={{ "raster-opacity": 0.05 }}
                />
                {markers.map((gps, idx) =>
                    <MapMarker id={idx} gps={gps} onDelete={() => markers.splice(idx, 1)}/>)}
            </ReactMapGl>
            <div className="export-container">
                {markers.map((gps, idx) =>
                    <div>{'RELAIS ' + (idx + 1)} <br/>  {' lon: ' + gps.longitude} <br/> {'lat: ' + gps.latitude} <br/> <br/> </div>)}
            </div>
        </div>
    );
}

export default App;
