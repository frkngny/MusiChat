import axios from "axios";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import VerifyToken from '../utils/VerifyToken';


const useAxios = () => {
    const { authTokens, setUser, setAuthTokens, baseURL } = useContext(AuthContext);
    const axiosInstance = axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${authTokens?.access}`
        }
    });

    axiosInstance.interceptors.request.use(async req => {
        const user = VerifyToken(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        if (!isExpired) return req;

        const response = await axios.post(`/users/auth/token-refresh`, {
            refresh: authTokens.refresh,
            headers: {Authorization: `Bearer ${authTokens.access}`}
        });
        localStorage.setItem("authTokens", JSON.stringify(response.data));
        setAuthTokens(response.data);
        setUser(VerifyToken(response.data.access));

        req.headers.Authorization = `Bearer ${response.data.access}`;
        return req;
    });

    return axiosInstance;
}

export default useAxios;