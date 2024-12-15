import React, { useState } from 'react';
import axios from 'axios';

const Geocode = () => {
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/maps/geocode', { address });
            setCoordinates(response.data);
            setError(null);
        } catch (err) {
            setError('Error fetching coordinates');
            setCoordinates(null);
        }
    };

    return (
        <div>
            <h3>Geocode Address</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address"
                />
                <button type="submit">Get Coordinates</button>
            </form>

            {coordinates && (
                <div>
                    <p>Latitude: {coordinates.lat}</p>
                    <p>Longitude: {coordinates.lon}</p>
                </div>
            )}

            {error && <p>{error}</p>}
        </div>
    );
};

export default Geocode;
