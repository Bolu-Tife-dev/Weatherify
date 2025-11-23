import './HourlyForeCast.css';
import {
    WiDaySunny,
    WiCloudy,
    WiRain,
    WiThunderstorm,
    WiSnow,
    WiFog,
} from "react-icons/wi";


// Map weather condition to a colorful icon
const getWeatherIcon = (conditionText) => {
    const text = conditionText?.toLowerCase();

    if (!text) return <WiCloudy size={40} color="#9db4c0" />;

    if (text.includes("sunny") || text.includes("clear")) {
        return <WiDaySunny size={40} color="#f7d32a" />;
    }
    if (text.includes("cloud")) {
        return <WiCloudy size={40} color="#9db4c0" />;
    }
    if (text.includes("rain") || text.includes("drizzle")) {
        return <WiRain size={40} color="#3a86ff" />;
    }
    if (text.includes("thunder")) {
        return <WiThunderstorm size={40} color="#8338ec" />;
    }
    if (text.includes("snow")) {
        return <WiSnow size={40} color="#bde0fe" />;
    }
    if (text.includes("fog") || text.includes("mist") || text.includes("haze")) {
        return <WiFog size={40} color="#6c757d" />;
    }

    return <WiCloudy size={40} color="#9db4c0" />;
};

const HourlyForeCast = ({ data }) => {
    if (!data || !Array.isArray(data)) {
        return (
            <div className="card hourly-forecast">
                <h3>Hourly Forecast</h3>
                <p>No hourly data available</p>
            </div>
        );
    }

    // Current time → next 12 hours
    const currentTime = new Date();
    const nextHours = data
        .filter(hourData => new Date(hourData.time) > currentTime)
        .slice(0, 12);

    const formatTime = (timeString) => {
        const date = new Date(timeString);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            hour12: true 
        });
    };

    return (
        <div className="card hourly-forecast">
            <h3>24-Hour Forecast</h3>
            <div className="hourly-container">
                <div className="hourly-list">
                    {nextHours.map((hourData, index) => (
                        <div key={index} className="hourly-item">
                            <div className="hour-time">
                                {formatTime(hourData.time)}
                            </div>

                            {/* Colorful Icon */}
                            <div className="hour-icon">
                                {getWeatherIcon(hourData.condition.text)}
                            </div>

                            <div className="hour-temp">
                                {Math.round(hourData.temp_c)}°
                            </div>

                            <div className="hour-details">
                                <div className="hour-precip">
                                    💧 {hourData.chance_of_rain}%
                                </div>
                                <div className="hour-wind">
                                    💨 {Math.round(hourData.wind_kph)} km/h
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HourlyForeCast;
