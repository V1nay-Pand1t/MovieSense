import { createContext, useContext, useState, useEffect } from 'react';
// persist data on page refresh
// use localStorage to persist user data across page refreshes
// this will allow us to keep the user logged in even after a page refresh
// we will use useEffect to load the user data from localStorage on initial render
// and useState to manage the user data in the context

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        // Load from localStorage (once, at init)
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { id: '', name: '', email: '' };
    });

    // Save to localStorage whenever user changes
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
