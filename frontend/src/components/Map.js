import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet.markercluster';

const Map = () => {
    useEffect(() => {
        // Initialize the map
        const map = L.map('map').setView([12.9716, 77.5946], 13);

        // Add OpenStreetMap tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Initialize routing
        const routeControl = L.Routing.control({
            waypoints: [
                L.latLng(12.9716, 77.5946), // Start
                L.latLng(13.0358, 77.5970), // End
            ],
            routeWhileDragging: true,
        }).addTo(map);

        // Marker clustering
        const locations = [
            { lat: 12.9716, lng: 77.5946, popup: 'Location 1' },
            { lat: 13.0358, lng: 77.5970, popup: 'Location 2' },
            { lat: 12.9234, lng: 77.6094, popup: 'Location 3' },
        ];

        const markers = L.markerClusterGroup(); // Create a cluster group

        locations.forEach(location => {
            const marker = L.marker([location.lat, location.lng])
                .bindPopup(location.popup);
            markers.addLayer(marker);
        });

        map.addLayer(markers); // Add the markers to the map

        // Cleanup on component unmount
        return () => {
            if (routeControl) {
                routeControl.remove(); // Properly remove routing control
            }
            if (map) {
                map.remove(); // Remove map when component unmounts
            }
        };
    }, []); // Empty dependency array ensures this effect runs only once

    return <div id="map" style={{ height: '400px', width: '100%' }}></div>;
};

export default Map;
