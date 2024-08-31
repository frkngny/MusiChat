import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import RoomChat from '../../components/rooms/RoomChat';
import LeaveRoomButton from '../../components/rooms/LeaveRoomButton';
import JoinedUsers from '../../components/rooms/JoinedUsers';
import AuthContext from '../../context/AuthContext';
import useSocket from '../../hooks/useSocket';
import Swal from 'sweetalert2';
import Layout from '../../components/Layout';


const RoomPage = (props) => {
    const axios = useAxios();
    const navigate = useNavigate();

    const params = useParams();
    const roomKey = params.roomKey;

    const { user } = useContext(AuthContext);
    const [room, setRoom] = useState(null);

    const [roomUsers, setRoomUsers] = useState([]);
    const [socket, setSocket] = useState(null);


    useEffect(() => {
        try {
            axios.get('/rooms/room', { params: { key: roomKey } })
                .then((resp) => {
                    setRoom(resp.data);
                });
        } catch (error) {
            console.log(error)
        }
    }, [])

    onpagehide = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('room_key', roomKey);
        axios.put('/rooms/leave', formData);
    };


    // websocket
    if (socket === null) {
        setSocket(useSocket(`/room/${roomKey}`));
    } else {
        socket.onload = function (e) {
            const data = JSON.parse(e.data);
            if (data.type === 'room_users') {
                setRoomUsers(data.data);
            }
        }
        socket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            if (data.type === 'room_users') {
                setRoomUsers(data.data);
            }
        }
        onbeforeunload = (event) => {
            socket.close();
        }
    }

    useEffect(() => {
        if (roomUsers.length > 0) {
            if (roomUsers && !roomUsers.find(u => u.id === user.user_id)) {
                navigate('/home');
                Swal.fire({
                    title: `You are kicked from ${roomKey}.`,
                    icon: "error",
                    toast: true,
                    timer: 3000,
                    position: 'bottom-right',
                    timerProgressBar: true,
                    showConfirmButton: false,
                });
            }
        }
    }, [roomUsers]);

    return (
        <>
            <div className='h-full w-full'>
                <div className='flex h-fit max-h-fit m-2'>
                    <LeaveRoomButton room_key={roomKey} socket={socket} />
                </div>
                <div className='flex w-full max-h-full h-full space-x-4'>
                    <div className='bg-black max-w-[70%] w-[70%] h-full'>
                        {room && <RoomChat room={room} />}
                    </div>
                    <div className='w-[30%] space-y-2 pe-4'>
                        <div className='w-full space-y-1 max-h-[20%] overflow-y-auto'>
                            {roomUsers && <JoinedUsers roomUsers={roomUsers} room={room} />}
                        </div>
                        <div className='w-full'>
                            <p>Hi</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RoomPage