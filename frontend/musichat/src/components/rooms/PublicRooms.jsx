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
                await axios.get('/rooms/public').then((resp) => {
                    setPublicRooms(resp.data);
                });
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
    }, []);

    return (
        <div className='p-2 space-y-2'>
            <Each of={publicRooms} render={(item, index) =>
                <RoomCard room={item} />
            } />
        </div>
    )
}
