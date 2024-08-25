import AuthContext from "../context/AuthContext";
import useAxios from "./useAxios";

import React from 'react'

const useSocket = (endpoint) => {
    const baseUrl = '127.0.0.1:8000';

    const webSocket = new WebSocket(`ws://${baseUrl}/ws${endpoint}`)
    webSocket.onopen = function (e) {
        console.log(`Web socket is connected (${endpoint})`)
    }
    return webSocket;
}

export default useSocket