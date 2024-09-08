import React, { useEffect, useState } from 'react'
import { Each } from '../Each';
import useAxios from '../../hooks/useAxios';

const UserFriends = () => {
    
    const axios = useAxios();

    const [friends, setFriends] = useState([]);

    useEffect(() => {
        axios.get('/users/myfriends').then((resp) => {
            setFriends(resp.data.friends);
        });
    }, []);

    const removeFriend = (friendId) => {
        const formData = new FormData();
        formData.append('friend_user_id', friendId);

        axios.delete('/users/remove-friend', formData);
    }

    return (
        <>
            { friends &&
                <Each of={friends} render={(friend, index) =>
                <div className='h-12 w-full flex space-x-4 p-1 place-items-center justify-items-center rounded-lg border-2 border-gray-800'>
                    <div className='w-fit'>
                        <img
                            className='h-8 rounded-full ms-1'
                            src={friend.profile.image}
                        />
                    </div>
                    <div>
                        <h5>{friend.username}</h5>
                        <p>{friend.email}</p>
                    </div>
                    <div>
                        <button className='' onClick={() => removeFriend(friend.id)}>Remove</button>
                    </div>
                </div>
            }></Each>
            }
        </>
    )
}

export default UserFriends;