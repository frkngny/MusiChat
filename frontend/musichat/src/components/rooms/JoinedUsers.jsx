import React, { useContext, useState } from 'react'
import { Each } from '../Each';
import useSocket from '../../hooks/useSocket';
import AuthContext from '../../context/AuthContext';
import useAxios from '../../hooks/useAxios';

const JoinedUsers = (props) => {
    const { roomUsers, room,  ...others } = props;

    const { user } = useContext(AuthContext);
    const axios = useAxios();

    const kickUser = (roomUserId) => {
        const formData = new FormData();
        formData.append('key', room.key);
        formData.append('id', roomUserId);
        axios.put('/rooms/room/kick', formData);
    }

    return (
        <>
            <Each of={roomUsers} render={(roomUser, index) =>
                <div className='h-12 w-full flex space-x-4 place-items-center justify-items-center rounded-lg border-2 border-emerald-500'>
                    <div className='rounded-md'>
                        <p>{roomUser.image}</p>
                    </div>
                    <div>
                        <h5>{roomUser.username}</h5>
                        <p>{roomUser.id}</p>
                    </div>
                    {
                        user.user_id === room.host.id &&
                        room.host.id !== roomUser.id &&
                        <button className='bg-red-600 text-white p-1' onClick={() => kickUser(roomUser.id)}>X</button>
                    }
                </div>
            } />
        </>
    )
}

export default JoinedUsers