import { useState } from "react";
import { PublicRooms } from "../components/homepage/PublicRooms";
import RoomCreate from "../components/rooms/RoomCreate";
import UserFriends from "../components/users/UserFriends";

const HomePage = (props) => {
    const { userObject } = props
    
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

    return (
        <div className='flex h-full'>
            <button onClick={() => setOpenCreateRoomModal(true)} className="h-8 p-2 m-2">Create Room</button>
            {
                openCreateRoomModal &&
                <RoomCreate open={openCreateRoomModal} closeCallback={() => setOpenCreateRoomModal(false)} />
            }

            <div className='w-fit max-w-fit flex-1 m-2 p-1 outline-dashed outline-1 upto-bottom overflow-y-auto '>
                <div className='sticky top-0 bg-gray-800 text-white text-center'>Public rooms</div>
                <PublicRooms />
            </div>
            <div className='max-w-fit flex-1 m-2 p-1 outline-dashed outline-1 upto-bottom overflow-y-auto'>
                <div className='sticky top-0 bg-gray-800 text-white text-center'>Friends</div>
                <UserFriends />
            </div>
        </div>
    )
}
export default HomePage;