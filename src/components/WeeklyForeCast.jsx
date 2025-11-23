import './WeeklyForeCast.css';
import { getWeatherIcon } from '../utils/timeutils';

const WeeklyForeCast = ({ data }) => {
    if (!data || !Array.isArray(data)) {
        return (
            <div className="card weekly-forecast">
                <h3>7-Day Forecast</h3>
                <p>No weekly data available</p>
            </div>
        );
    }

    const formatDay = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        }
        
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <div className="card weekly-forecast">
            <h3>7-Day Forecast</h3>
            <div className="weekly-list">
                {data.map((dayData, index) => (
                    <div key={index} className="day-item">
                        
                        {/* Day + Date */}
                        <div className="day-header">
                            <span className="day-name">{formatDay(dayData.date)}</span>
                            <span className="day-date">
                                {new Date(dayData.date).getDate()}
                            </span>
                        </div>

                        {/* Condition + Icon */}
                        <div className="day-condition">
                            <div className="day-icon">
                                {getWeatherIcon(dayData.day.condition.text, 'day', false, 45)}
                            </div>
                            <span className="condition-text">
                                {dayData.day.condition.text}
                            </span>
                        </div>

                        {/* Temperature bar */}
                        <div className="day-temps">
                            <span className="max-temp">
                                {Math.round(dayData.day.maxtemp_c)}°
                            </span>

                            <div className="temp-bar">
                                <div
                                    className="temp-fill"
                                    style={{
                                        width: `${((dayData.day.maxtemp_c - dayData.day.mintemp_c) / 30) * 100}%`
                                    }}
                                ></div>
                            </div>

                            <span className="min-temp">
                                {Math.round(dayData.day.mintemp_c)}°
                            </span>
                        </div>

                        {/* Rain + Wind */}
                        <div className="day-details">
                            <div className="detail">
                                <span>💧</span>
                                {dayData.day.daily_chance_of_rain}%
                            </div>
                            <div className="detail">
                                <span>💨</span>
                                {Math.round(dayData.day.maxwind_kph)}km/h
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeeklyForeCast;