import React from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, onSearch, placeholder }) {
    return (
        <div className="flex gap-2 w-full">
            <Input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || 'Search...'}
                className="flex-1"
            />
            <Button
                onClick={onSearch}
                size="md"
                variant="default"
                aria-label="Search"
            >
                <Search className="w-4 h-4" />
            </Button>
        </div>
    );
}
