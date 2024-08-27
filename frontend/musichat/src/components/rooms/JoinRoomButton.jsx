import React from 'react'
import { useNavigate } from 'react-router-dom'
import useAxios from '../../hooks/useAxios';
import Swal from 'sweetalert2';

const JoinRoomButton = (props) => {
    const { room_key, ...others } = props;

    const formData = new FormData();
    formData.append('room_key', room_key)

    const navigate = useNavigate();
    const axios = useAxios();

    const handleJoin = () => {
        axios.put('/rooms/join', formData).then((resp) => {
            if (Object.keys(resp.data).includes('success')) {
                navigate(`/room/${room_key}`);
            } else {
                Swal.fire({
                    title: resp.data.error,
                    icon: "error",
                    toast: true,
                    timer: 3000,
                    position: 'bottom-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        });
    }

    return (
        <>
            <button onClick={handleJoin}
                className='bg-green-900 text-white font-bold p-1 animated-box'>
                Join
            </button>
        </>
    )
}

export default JoinRoomButton