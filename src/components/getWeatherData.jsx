
export default async function getWeatherData(city) {
    console.log('🔍 Fetching weather for:', city);
    
    try {
        const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // ← Only this line changed
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        
        console.log('📡 API URL:', url);
        
        const response = await fetch(url);
        console.log('📊 Response status:', response.status);
        
        const data = await response.json();
        console.log('📦 API response data:', data);

        // OpenWeatherMap returns 404 for invalid cities
        if (response.status === 404) {
            console.log('❌ City not found');
            throw new Error('INVALID_CITY');
        }

        // OpenWeatherMap returns error in cod property if not 200
        if (data.cod !== 200) {
            console.log('❌ API error:', data.message);
            throw new Error('INVALID_CITY');
        }

        console.log('✅ Valid weather data received');
        
        // Transform OpenWeatherMap data to match your component structure
        return transformOpenWeatherData(data);
        
    } catch (error) {
        console.log('❌ API error:', error.message);
        if (error.message === 'INVALID_CITY') {
            throw error;
        }
        throw new Error('Failed to fetch weather data');
    }
}

// ... rest of your code remains exactly the same ...

// Transform OpenWeatherMap data to match WeatherAPI structure
function transformOpenWeatherData(data) {
    const currentTime = new Date();
    
    return {
        location: {
            name: data.name,
            country: data.sys.country,
            region: data.name, // OpenWeatherMap doesn't provide region
            localtime: currentTime.toISOString()
        },
        current: {
            temp_c: data.main.temp,
            feelslike_c: data.main.feels_like,
            humidity: data.main.humidity,
            wind_kph: data.wind.speed * 3.6, // Convert m/s to km/h
            pressure_mb: data.main.pressure,
            uv: 1, // OpenWeatherMap doesn't provide UV in basic API
            precip_mm: 0, // OpenWeatherMap doesn't provide precipitation in basic API
            condition: {
                text: data.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            }
        },
        forecast: {
            forecastday: [
                {
                    date: currentTime.toISOString().split('T')[0],
                    day: {
                        mintemp_c: data.main.temp_min,
                        maxtemp_c: data.main.temp_max,
                        condition: {
                            text: data.weather[0].description,
                            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                        },
                        daily_chance_of_rain: 0,
                        maxwind_kph: data.wind.speed * 3.6
                    },
                    hour: generateMockHourlyData(data)
                },
                ...generateMockWeeklyData(data)
            ]
        }
    };
}

// Generate mock hourly data since OpenWeatherMap basic API doesn't provide hourly forecast
function generateMockHourlyData(currentData) {
    return Array.from({ length: 24 }, (_, i) => {
        const hourTime = new Date();
        hourTime.setHours(i, 0, 0, 0);
        return {
            time: hourTime.toISOString(),
            temp_c: currentData.main.temp + (Math.random() * 4 - 2), // Small variation
            condition: {
                text: currentData.weather[0].description,
                icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`
            },
            chance_of_rain: Math.round(Math.random() * 30),
            wind_kph: currentData.wind.speed * 3.6 + (Math.random() * 5)
        };
    });
}

// Generate mock weekly data since OpenWeatherMap basic API doesn't provide weekly forecast
function generateMockWeeklyData(currentData) {
    return Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i + 1);
        return {
            date: date.toISOString().split('T')[0],
            day: {
                mintemp_c: currentData.main.temp_min + (Math.random() * 3 - 1.5),
                maxtemp_c: currentData.main.temp_max + (Math.random() * 3 - 1.5),
                condition: {
                    text: ["Sunny", "Cloudy", "Partly cloudy", "Light rain"][Math.floor(Math.random() * 4)],
                    icon: `https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png`
                },
                daily_chance_of_rain: Math.round(Math.random() * 60),
                maxwind_kph: currentData.wind.speed * 3.6 + (Math.random() * 10)
            }
        };
    });
}