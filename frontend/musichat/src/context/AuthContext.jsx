import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VerifyToken from "../utils/VerifyToken.jsx";
import Swal from "sweetalert2";

//require('dotenv').config()
const baseURL = "http://127.0.0.1:8000";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    // get token from user storage if any
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
    );

    // decode jwt token and get-set user if any
    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens") ? VerifyToken(localStorage.getItem("authTokens")) : null
    );

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // login user method
    const loginUser = async (username, password) => {
        // get user token from api
        const response = await fetch(`${baseURL}/users/auth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, password
            })
        })
        const data = await response.json();

        if (response.status === 200) {
            // if response is valid (if user can login)
            setAuthTokens(data);
            setUser(VerifyToken(data.access));  // set user
            localStorage.setItem("authTokens", JSON.stringify(data)); // set tokens to local storage
            navigate("/home"); // navigate to home
            // display succsee message
            Swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 3000,
                position: 'bottom-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            // if user cannot login, display error message
            Swal.fire({
                title: "Incorrect username or password.",
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'bottom-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    }

    // register new user
    const registerUser = async (email, username, password, password2) => {
        // post user info to api
        const response = await fetch(`${baseURL}/users/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })

        // if user is registered, login automatically
        // else display error message
        if (response.status === 201) {
            loginUser(username, password);
        } else{
            const error = await response.json();
            
            Swal.fire({
                title: "error occured",
                icon: "error",
                toast: true,
                timer: 3000,
                position: 'bottom-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
            return error;
        }
    }

    // logout the user, navigate to login page and remove tokens from local storage
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens"); // remove tokens from local storage
        navigate("/"); // navigate to login
        // display message
        Swal.fire({
            title: "You have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'bottom-right',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        registerUser,
        loginUser,
        logoutUser,
        baseURL
    };

    useEffect(() => {
        if (authTokens) {
            setUser(VerifyToken(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )

}