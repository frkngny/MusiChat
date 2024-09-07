import { useState } from "react";
import { PublicRooms } from "../components/homepage/PublicRooms";
import RoomCreate from "../components/rooms/RoomCreate";

const HomePage = (props) => {
    const { userObject } = props
    
    const [openCreateRoomModal, setOpenCreateRoomModal] = useState(false);

    return (
        <div>
            <button onClick={() => setOpenCreateRoomModal(true)}>Create Room</button>
            {
                openCreateRoomModal &&
                <RoomCreate open={openCreateRoomModal} closeCallback={() => setOpenCreateRoomModal(false)} />
            }

            <div className='w-fit flex-1 m-2 outline-dashed outline-1 upto-bottom overflow-y-auto '>
                <div className='sticky top-0 bg-gray-800 text-white text-center'>Public rooms</div>
                <PublicRooms />
            </div>
        </div>
    )
}
export default HomePage;