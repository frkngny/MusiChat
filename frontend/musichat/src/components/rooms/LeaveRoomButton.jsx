import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAxios from '../../hooks/useAxios';
import Swal from 'sweetalert2';

const LeaveRoomButton = (props) => {
    const { room_key, ...others } = props;

    const formData = new FormData();
    formData.append('room_key', room_key)

    const navigate = useNavigate();
    const axios = useAxios();

    const handleLeave = () => {
        axios.put('/rooms/leave', formData).then((resp) => {
            if (Object.keys(resp.data).includes('success')) {
                navigate(`/home`);
            }
        });
    }
    
    return (
        <>
            <button onClick={handleLeave}
                className='text-red-800 bg-green-800 hover:first:rotate-180'>
                <span className='font-bold'>X</span> Leave
            </button>
        </>
    )
}

export default LeaveRoomButton