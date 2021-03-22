import React, {useEffect, useState} from 'react';
import ReactMapGl, {Layer, Source} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {MapEvent} from "react-map-gl/src/components/interactive-map";
import MapMarker from "./MapMarker/MapMarker";
import floor1 from './floor1.png';
import floor2 from './floor2.png';

import mapboxgl from 'mapbox-gl';
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require('worker-loader!../node_modules/mapbox-gl/dist/mapbox-gl-csp-worker').default;

export class LngLat {
    id: number;
    longitude: number;
    latitude: number;
    floor: number;

    constructor(longitude: number, latitude: number, floor: number) {
        this.id = 0;
        this.longitude = longitude;
        this.latitude = latitude;
        this.floor = floor;
    }
}

function App() {
    const [floor, setFloor] = useState(1);
    const [markers, setMarkers] = useState([] as LngLat[]);
    const [filterMarkers, setFilterMarkers] = useState([] as any[]);
    const [viewport, setViewport] = useState({
        latitude: 46.529405896941945,
        longitude: 6.622925131236617,
        zoom: 19,
        maxZoom: 22,
        minZoom: 17,
    } as any);
    const lonShift = -0.00000804584146 * 0.3;
    const latShift = -0.00002940280387 * 0.8;

    useEffect(() => {
        setFilterMarkers(markers
            .map((marker, idx) => {
                marker.id = idx;
                return marker;
            })
            .filter(marker => marker.floor === floor)
            .map(marker =>
                <MapMarker id={marker.id} marker={marker} onDelete={() => deleteMarker(marker.id)}/>));
    }, [floor, markers]);

    function deleteMarker(id: number) {
        setMarkers(markers.filter(marker => marker.id !== id));
    }

    function handleDblClick(evt: MapEvent) {
        const markersCopy = [...markers];
        markersCopy.push(new LngLat(evt.lngLat[0], evt.lngLat[1], floor));
        setMarkers(markersCopy);
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
                doubleClickZoom={false}
            >
                <Source
                    id="map-source"
                    type="image"
                    url={floor < 2 ? floor1 : floor2}
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
                    paint={{"raster-opacity": 1}}
                />
                {filterMarkers}
            </ReactMapGl>
            <div className="export-container">
                {markers.map((gps, idx) =>
                    <div>{'RELAIS ' + (idx + 1)} <br/> {' lon: ' + gps.longitude} <br/> {'lat: ' + gps.latitude} <br/>
                        {'floor: ' + gps.floor} <br/> <br/></div>)}
            </div>
            <div className="floor-container">
                <button className='floor-button'
                        onClick={() => setFloor(floor + 1)}>
                    {'+'}
                </button>
                <div className="floor-text">{floor}</div>
                <button className='floor-button'
                        onClick={() => setFloor(floor - 1)}>
                    {'-'}
                </button>
            </div>
        </div>
    );
}

export default App;
