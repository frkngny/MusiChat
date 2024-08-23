import React from 'react'

const RoomCard = (props) => {
    const {room} = props

    return (
    <>
        <div className='w-fit shadow-md border-violet-600 rounded-md justify-center items-center mt-2 p-2'>
            <div className='w-48 h-28'>
                Hello
            </div>
            <h1>{room.key}</h1>
        </div>
    </>
    )
}
export default RoomCard;
