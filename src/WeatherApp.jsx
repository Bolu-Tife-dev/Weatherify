import './App.css';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import HourlyForeCast from './components/HourlyForeCast';
import WeeklyForeCast from './components/WeeklyForeCast';
import getWeatherData from './components/getWeatherData';
import { getTimeOfDay } from './utils/timeutils';
import { useState, useEffect } from 'react';

const getGradientClass = (hour) => {
    if (hour >= 6 && hour < 9) return 'bg-sunrise';
    if (hour >= 9 && hour < 17) return 'bg-day';
    if (hour >= 17 && hour < 19) return 'bg-sunset';
    return 'bg-night';
}

function WeatherApp() {
    const [city, setCity] = useState('Lagos');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Get current hour for background and time of day
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const gradientClass = getGradientClass(hour);
    
    // Calculate time of day based on current location data
    const timeOfDay = weatherData?.location ? 
        getTimeOfDay(weatherData.location, currentTime) : 
        getGradientClass(hour).replace('bg-', '');

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError('');
            try {
                console.log('🔄 Starting weather fetch for:', city);
                const data = await getWeatherData(city);
                console.log('📦 Weather data received:', data);

                // Ensure we have the required data structure
                if (data && data.current && data.forecast) {
                    setWeatherData({
                        current: {
                            ...data.current,
                            mintemp_c: data.forecast.forecastday[0]?.day.mintemp_c || data.current.temp_c - 5,
                            maxtemp_c: data.forecast.forecastday[0]?.day.maxtemp_c || data.current.temp_c + 5
                        },
                        hourly: data.forecast.forecastday[0]?.hour || [],
                        weekly: data.forecast.forecastday.slice(1) || [],
                        location: data.location
                    });
                } else {
                    throw new Error('Invalid data structure from API');
                }
            } catch (e) {
                console.error('❌ Error in fetchWeather:', e);
                if (e.message === 'INVALID_CITY') {
                    setError('City not found! Please check the spelling and try again.');
                } else {
                    setError('Failed to load weather data. Please try again.');
                }
                setWeatherData(null); // Clear any previous data
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [city]);

    return (
        <div className={`app ${gradientClass}`}>
            <div className='container'>
                <SearchBar onSearch={setCity} />
                {loading && <div className="loading">Loading weather data...</div>}
                {error && <div className="error">{error}</div>}
                {weatherData && !error && (
                    <>
                        <CurrentWeather 
                            data={weatherData.current}
                            location={weatherData.location}
                            timeOfDay={timeOfDay}
                        />
                        <HourlyForeCast 
                            data={weatherData.hourly} 
                            timeOfDay={timeOfDay}
                        />
                        <WeeklyForeCast 
                            data={weatherData.weekly} 
                            timeOfDay={timeOfDay}
                        />
                    </>
                )}
            </div>
        </div>
    )
}

export default WeatherApp;