import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAxios from '../../hooks/useAxios';

const LeaveRoomButton = (props) => {
    const { room_key, onCardClick, socket, ...others } = props;

    const formData = new FormData();
    formData.append('room_key', room_key)

    const navigate = useNavigate();
    const axios = useAxios();

    const handleLeave = () => {
        axios.put('/rooms/leave', formData).then((resp) => {
            if (Object.keys(resp.data).includes('success')) {
                if (onCardClick) { onCardClick(); }
                if (socket) { socket.close(); }
                navigate(`/home`);
            }
        });
    }

    return (
        <>
            <button onClick={handleLeave}
                className='text-red-800 bg-green-800 font-bold p-1 '>
                <span >X</span> Leave
            </button>
        </>
    )
}

export default LeaveRoomButton