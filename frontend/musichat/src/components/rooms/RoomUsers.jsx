import React from 'react'
import { Each } from '../Each';
import useAxios from '../../hooks/useAxios';

import banIcon from '../../assets/icons/banIcon.png'
import kickIcon from '../../assets/icons/kickIcon.png'

const JoinedUsers = (props) => {
    const { roomUsers, room, title, user, ...others } = props;

    const axios = useAxios();

    const kickUser = (roomUserId) => {
        const formData = new FormData();
        formData.append('key', room.key);
        formData.append('id', roomUserId);
        axios.put('/rooms/room/kick', formData);
    }

    const banUnbanUser = (roomUserId, operation) => {
        const formData = new FormData();
        formData.append('key', room.key);
        formData.append('id', roomUserId);
        formData.append('operation', operation);
        axios.put('/rooms/room/ban-unban', formData);
    }

    return (
        <>
            <Each of={roomUsers} render={(roomUser, index) =>
                <div className='h-12 w-full flex space-x-4 p-1 place-items-center justify-items-center rounded-lg border-2 border-emerald-500'>
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
                        (
                            title === 'Users' ?
                                <>
                                    <button className='text-white p-1' onClick={() => kickUser(roomUser.id)}>
                                        <img src={kickIcon} alt='kick' title='Kick' />
                                    </button>
                                    <button className='text-white p-1' onClick={() => banUnbanUser(roomUser.id, 'ban')}>
                                        <img src={banIcon} alt='ban' title='Ban' />
                                    </button>
                                </>
                                :
                                <>
                                    <button className='text-white p-1' onClick={() => banUnbanUser(roomUser.id, 'unban')}>
                                        <img src={banIcon} alt='remove ban' title='Remove ban' />
                                    </button>
                                </>
                        )
                    }
                </div>
            } />
        </>
    )
}

export default JoinedUsers