import React from 'react'

const RoomCard = (props) => {
    const {room} = props
    console.log(room);

    return (
    <>
        <div className='w-fit shadow-md border-violet-600 rounded-md justify-center items-center'>
            <div className='w-36 h-24'>
                Hello
            </div>
            <h1>{room.key}</h1>
        </div>
    </>
    )
}
export default RoomCard;
