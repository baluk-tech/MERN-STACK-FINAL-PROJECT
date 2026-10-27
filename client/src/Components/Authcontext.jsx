import React, { useLayoutEffect } from 'react'
import { useState, useEffect } from 'react';
import { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
let  userval = null;
if (localStorage.getItem("token") && localStorage.getItem("role")) {
    userval = {
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role")
    }
}
const AuthContext = createContext({
    user: userval,
    setUser: () => {},
    Login: () => {},
    Logout: () => {}
});

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const Login = (userData) => {        
        localStorage.setItem("token", userData.token);
        localStorage.setItem("role", userData.role);
        setUser(userData);
    };

    const Logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);        
    };

    useLayoutEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (token && role)
        setUser({token, role});
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, Login, Logout }}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    return useContext(AuthContext);
};

export {AuthContext, AuthProvider, useAuth};