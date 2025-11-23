import {
    WiDaySunny,
    WiNightClear,
    WiCloudy,
    WiNightCloudy,
    WiRain,
    WiNightRain,
    WiThunderstorm,
    WiNightThunderstorm,
    WiSnow,
    WiNightSnow,
    WiFog,
    WiSunrise,
    WiSunset,
} from "react-icons/wi";

// Function to calculate approximate sunrise and sunset times
export const getSunTimes = (_location, date = new Date()) => {
    // Using approximate times - you can enhance this with actual API data later
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    
    return {
        sunrise: new Date(year, month, day, 6, 0, 0), // 6:00 AM
        sunset: new Date(year, month, day, 18, 0, 0)  // 6:00 PM
    };
};

// Function to determine time of day
export const getTimeOfDay = (location, currentTime = new Date()) => {
    const { sunrise, sunset } = getSunTimes(location, currentTime);
    
    if (currentTime >= sunrise && currentTime < new Date(sunrise.getTime() + 2 * 60 * 60 * 1000)) {
        return 'sunrise'; // 2 hours after sunrise
    } else if (currentTime >= new Date(sunset.getTime() - 2 * 60 * 60 * 1000) && currentTime < sunset) {
        return 'sunset'; // 2 hours before sunset
    } else if (currentTime >= sunrise && currentTime < sunset) {
        return 'day';
    } else {
        return 'night';
    }
};

// Enhanced weather icon function with time of day support
export const getWeatherIcon = (conditionText, timeOfDay = 'day', showSunMoon = false, size = 90) => {
    const text = conditionText?.toLowerCase();
    
    // If we're in sunrise/sunset period and showSunMoon is true, show sun/moon icons
    if (showSunMoon) {
        if (timeOfDay === 'sunrise') {
            return <WiSunrise size={size} color="#ff8c00" />;
        } else if (timeOfDay === 'sunset') {
            return <WiSunset size={size} color="#ff4500" />;
        }
    }

    // Choose between day and night variants based on time of day
    const isNight = timeOfDay === 'night' || timeOfDay === 'sunset';
    
    if (!text) return isNight ? <WiNightCloudy size={size} color="#7d93b0" /> : <WiCloudy size={size} color="#9db4c0" />;

    if (text.includes("sunny") || text.includes("clear")) {
        return isNight ? <WiNightClear size={size} color="#f0e68c" /> : <WiDaySunny size={size} color="#f7d32a" />;
    }
    if (text.includes("cloud")) {
        return isNight ? <WiNightCloudy size={size} color="#7d93b0" /> : <WiCloudy size={size} color="#9db4c0" />;
    }
    if (text.includes("rain") || text.includes("drizzle")) {
        return isNight ? <WiNightRain size={size} color="#2d5f9c" /> : <WiRain size={size} color="#3a86ff" />;
    }
    if (text.includes("thunder")) {
        return isNight ? <WiNightThunderstorm size={size} color="#6a0dad" /> : <WiThunderstorm size={size} color="#8338ec" />;
    }
    if (text.includes("snow")) {
        return isNight ? <WiNightSnow size={size} color="#a8d0e6" /> : <WiSnow size={size} color="#bde0fe" />;
    }
    if (text.includes("fog") || text.includes("mist") || text.includes("haze")) {
        return <WiFog size={size} color="#6c757d" />;
    }

    return isNight ? <WiNightCloudy size={size} color="#7d93b0" /> : <WiCloudy size={size} color="#9db4c0" />;
};