import React from 'react'

const UserCard = (props) => {
    const { user } = props

    return (

        <div className='h-12 w-full flex space-x-4 p-1 place-items-center justify-items-center rounded-lg border-2 border-emerald-500'>
            <div className='rounded-md ms-1'>
                <img
                    className='h-8 w-8'
                    src={roomUser.profile.image}
                />
            </div>
            <div>
                <h5>{roomUser.username}</h5>
                <p>{roomUser.email}</p>
            </div>
        </div>

    )
}

export default UserCard