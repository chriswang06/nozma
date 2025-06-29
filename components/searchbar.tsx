'use client';
import { Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
    onSearch: (searchTerm: string) => void;
    placeholder: string;
}

const styles = {
    container: "w-full max-w-md",
    input: "w-full p-3 border border-gray-300 rounded-lg",
};

function SearchBar({ onSearch, placeholder}: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            onSearch(searchTerm);
            console.log(searchTerm);
        }
    };

    return (
        <div className={styles.container}>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown ={handleKeyDown}
                placeholder= {placeholder}
                className={styles.input}
            />
        </div>
    );
}

export default SearchBar;