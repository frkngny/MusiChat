import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import RoomChat from '../../components/rooms/RoomChat';
import LeaveRoomButton from '../../components/rooms/LeaveRoomButton';


const RoomPage = (props) => {
    const axios = useAxios();

    const params = useParams();
    const roomKey = params.roomKey;

    const [room, setRoom] = useState(null);

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

    return (
        <div className='max-h-screen grid grid-cols-3 gap-2'>
            <div className='col-span-3 max-h-[4%]'>
                <LeaveRoomButton room_key={roomKey} />
            </div>
            <div className='bg-black col-span-2 max-h-[70%]'>
                {room && <RoomChat chat_id={room.chat} roomKey={roomKey} />}
            </div>
            <div className='max-h-[70%]'>
                <p>Hello</p>
            </div>
        </div>
    )
}

export default RoomPage