import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const loginUser = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
};

export const searchRides = async (pickup, dropoff) => {
    const response = await api.post('/rides/search', { pickup, dropoff });
    return response.data;
};

export const bookRide = async (rideId, token) => {
    const response = await api.post(
        '/rides/book',
        { rideId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
