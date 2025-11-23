import './CurrentWeather.css';
import { getWeatherIcon } from '../utils/timeutils';

const CurrentWeather = ({ data, location, timeOfDay = 'day' }) => {
    const { temp_c, condition, feelslike_c, wind_kph, humidity /*, uv, precip_mm */ } = data;

    // Enhanced condition detection for snow
    const isSnowing = condition?.text?.toLowerCase().includes('snow') || 
                     condition?.text?.toLowerCase().includes('blizzard') ||
                     condition?.text?.toLowerCase().includes('sleet') ||
                     condition?.text?.toLowerCase().includes('flurries');

    return (
        <div className="current-weather">
            <div className="card left-card">
                {/* Location and Main Weather */}
                <div className="location-section">
                    <h2 className="city-name">{location?.name}</h2>
                    <p className="region-country">{location?.region}, {location?.country}</p>
                    <p className="current-date">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    {isSnowing && (
                        <div className="snow-indicator">
                            ❄️ Currently Snowing
                        </div>
                    )}
                </div>

                {/* Temperature and Condition */}
                <div className="weather-main">
                    <div className="temperature-display">
                        <span className="temp-value">{Math.round(temp_c)}</span>
                        <span className="temp-unit">°C</span>
                    </div>

                    <div className="condition-display">
                        {/* Enhanced Icon with time of day - snow will be automatically detected by getWeatherIcon */}
                        <div className="icon-wrapper">
                            {getWeatherIcon(condition?.text, timeOfDay, true, 90)}
                        </div>

                        <span className="condition-text">{condition?.text}</span>
                        {isSnowing && (
                            <div className="snow-badge">
                                ❄️ Snow
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card right-card">
                <h3 className="details-title">Weather Details</h3>

                <div className="weather-details">
                    <div className="detail-item">
                        <span className="detail-label">Feels like</span>
                        <span className="detail-value">{Math.round(feelslike_c)}°C</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Wind</span>
                        <span className="detail-value">{Math.round(wind_kph)} km/h</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Humidity</span>
                        <span className="detail-value">{Math.round(humidity)}%</span>
                    </div>
                    {/* <div className="detail-item">
                        <span className="detail-label">UV Index</span>
                        <span className="detail-value">{Math.round(uv)}</span>
                    </div> */}
                    {/* <div className="detail-item">
                        <span className="detail-label">Precipitation</span>
                        <span className="detail-value">{Math.round(precip_mm)} mm</span>
                    </div> */}
                    <div className="detail-item">
                        <span className="detail-label">Pressure</span>
                        <span className="detail-value">{Math.round(data.pressure_mb)} mb</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrentWeather;