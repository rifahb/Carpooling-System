const axios = require('axios');

exports.validateLocation = async (location) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
    try {
        const response = await axios.get(url);

        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { isValid: true, lat, lon };
        }

        return { isValid: false };
    } catch (error) {
        console.error('Location validation failed:', error.message);
        return { isValid: false };
    }
};
