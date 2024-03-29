import React, {useEffect, useState} from 'react';
import ReactMapGl, {FlyToInterpolator, Layer, Source} from 'react-map-gl';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import {MapEvent} from "react-map-gl/src/components/interactive-map";
import MapMarker from "./MapMarker/MapMarker";
import floor1 from './img/floor1.png';
import floor2 from './img/floor2.png';
import laforge0 from './img/laforge0.png';
import laforge1 from './img/laforge1.png';
import epfl0 from './img/EPFL0.png';
import epfl1 from './img/EPFL1.png';
import epfl2 from './img/EPFL2.png';
import jura from './img/jura.png';

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

const flyToOperator = new FlyToInterpolator({speed: 6});

function App() {
    const [floor, setFloor] = useState(0);
    const [markers, setMarkers] = useState([] as LngLat[]);
    const [filterMarkers, setFilterMarkers] = useState([] as any[]);
    const [viewport, setViewport] = useState({
        latitude: 46.52945096084946,
        longitude: 6.622548414151265,
        zoom: 19,
        maxZoom: 22,
        minZoom: 12,
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

    function locationHandler(zoom: number, latitude: number, longitude: number) {
        let newViewport = {...viewport};
        newViewport.zoom = zoom;
        newViewport.latitude = latitude;
        newViewport.longitude = longitude;
        newViewport.transitionDuration = 'auto';
        newViewport.transitionInterpolator = flyToOperator;
        setViewport(newViewport);
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
                <Source
                    id="map-forge"
                    type="image"
                    url={floor < 1 ? laforge0 : laforge1}
                    coordinates={[
                        [6.562626893173264, 46.517607277539106],
                        [6.562863671772686, 46.517609132035275],
                        [6.562870180322819, 46.51710903432505],
                        [6.562632991299888, 46.51710791825781]
                    ]}
                />
                <Source
                    id="map-epfl"
                    type="image"
                    url={floor <= 0 ? epfl0 : (floor === 1 ? epfl1 : epfl2)}
                    coordinates={[
                        [6.568616030085856, 46.52101710040429],
                        [6.571625357306832, 46.521041126066834],
                        [6.571643373393564, 46.51999620572547],
                        [6.568631644262474, 46.51997530035722]
                    ]}
                />
                <Source
                    id="map-jura"
                    type="image"
                    url={jura}
                    coordinates={[
                        [7.338341717516884, 47.36915896661172],
                        [7.3388349106114275, 47.36921815171731],
                        [7.338952851681915, 47.36876905735807],
                        [7.338453313289029, 47.36870640756432],
                    ]}
                />
                <Layer
                    id="overlay1"
                    source="map-source"
                    type="raster"
                    paint={{"raster-opacity": 1}}
                />
                <Layer
                    id="overlay2"
                    source="map-forge"
                    type="raster"
                    paint={{"raster-opacity": 1}}
                />
                <Layer
                    id="overlay3"
                    source="map-epfl"
                    type="raster"
                    paint={{"raster-opacity": 1}}
                />
                <Layer
                    id="overlay4"
                    source="map-jura"
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
            <div className="location-container">
                <button className='location-button'
                        onClick={() => locationHandler(18, 46.520509440496326, 6.5701475342863125)}>
                    {'EPFL CE'}
                </button>
                <button className='location-button'
                        onClick={() => locationHandler(20,46.51749320903048, 6.562742904370853)}>
                    {'La Forge'}
                </button>
                <button className='location-button'
                        onClick={() => locationHandler(19, 46.52945096084946, 6.622548414151265)}>
                    {'La Source'}
                </button>
                <button className='location-button'
                        onClick={() => locationHandler(19, 47.36895354249011, 7.338636884727114)}>
                    {'Hôpital du Jura'}
                </button>
            </div>
        </div>
    );
}

export default App;
