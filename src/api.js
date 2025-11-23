// api.js
export const getWeather = async (cityName) => {
    const baseUrl = process.env.REACT_APP_WEATHER_API_BASE_URL || 'https://localhost:5000/api';
    const response = await fetch(`${baseUrl}/weather?city=${cityName}`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
};