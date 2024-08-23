import React, { useEffect, useState } from 'react'
import useAxios from '../../hooks/useAxios';
import { Each } from '../Each';
import RoomCard from './RoomCard';

export const PublicRooms = () => {

    const [publicRooms, setPublicRooms] = useState([]);

    const axios = useAxios();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await axios.get('/rooms/public');
                setPublicRooms(resp.data);
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);

    return (
        <div className='w-fit flex-grow max-h-screen p-2 m-2 outline-dashed outline-1'>
            <Each of={publicRooms} render={(item, index) =>
                <RoomCard room={item} />
            } />
        </div>
    )
}
