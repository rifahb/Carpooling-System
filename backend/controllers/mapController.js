const axios = require('axios');

exports.getCoordinates = async (req, res) => {
    const { address } = req.body;
    
    // URL for Nominatim Geocoding API (OpenStreetMap)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1`;

    try {
        // Make the GET request to Nominatim API
        const response = await axios.get(url);

        // Log the full response to understand the structure
        console.log('Nominatim API Response:', response.data);

        // Check if we received any results
        if (response.data.length === 0) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Extract the lat and lon from the first result
        const { lat, lon } = response.data[0];

        // Return lat and lon as JSON
        return res.json({ lat, lon });

    } catch (err) {
        console.error('Geocoding Error:', err.message);
        return res.status(500).json({ error: err.message });
    }
};
