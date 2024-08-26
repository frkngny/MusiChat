import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import RoomChat from '../../components/rooms/RoomChat';

const RoomPage = (props) => {
    const axios = useAxios();

    const params = useParams();
    const roomKey = params.roomKey;

    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get('/rooms/room', { params: { key: roomKey } });
                console.log(resp.data)
                setRoom(resp.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, [])

    return (
        <div className='h-screen grid grid-cols-3 gap-2 overflow-hidden'>
            <div className='bg-black col-span-2 h-4/5 rounded-r-xl'>
                {room && <RoomChat chat_id={room.chat} roomKey={roomKey} />}
            </div>
            <div className=''>
                <p>Hello</p>
            </div>
        </div>
    )
}

export default RoomPage