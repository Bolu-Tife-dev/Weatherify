import { useState } from "react";
import './SearchBar.css';

// Input sanitization function
const sanitizeCityName = (input) => {
    if (!input) return '';
    
    // Remove potentially dangerous characters but allow:
    // - Letters (including international/accents)
    // - Spaces, hyphens, apostrophes, commas (common in city names)
    // - Periods (for St. Petersburg, etc.)
    const sanitized = input
        .replace(/[^a-zA-ZÀ-ÿ\u00C0-\u017F\s\-',.]/g, '') // Allow letters, spaces, hyphens, apostrophes, commas, periods
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim()
        .substring(0, 50); // Limit length to prevent abuse
    
    return sanitized;
};

// Validation function
const validateCityName = (city) => {
    if (!city || city.trim().length === 0) {
        return { isValid: false, message: 'City name cannot be empty' };
    }
    
    if (city.length < 2) {
        return { isValid: false, message: 'City name too short' };
    }
    
    if (city.length > 50) {
        return { isValid: false, message: 'City name too long' };
    }
    
    // Check if it contains at least some letters
    if (!/[a-zA-ZÀ-ÿ]/.test(city)) {
        return { isValid: false, message: 'City name must contain letters' };
    }
    
    return { isValid: true, message: '' };
};

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const rawInput = e.target.value;
        const sanitizedInput = sanitizeCityName(rawInput);
        setCity(sanitizedInput);
        setError(''); // Clear error when user types
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        
        const validation = validateCityName(city);
        
        if (!validation.isValid) {
            setError(validation.message);
            return;
        }

        if (city) {
            onSearch(city);
            setCity('');
        }
    }

    return(
        <div className="search-container">
            <form onSubmit={handleSubmit}>
                <span className="search-icon">🔍</span>
                <input 
                    type="text" 
                    className="search-input" 
                    value={city} 
                    onChange={handleInputChange} 
                    placeholder="Lagos" 
                    required 
                />
            </form>
            {error && <div className="search-error">{error}</div>}
        </div>
    )
}

export default SearchBar;