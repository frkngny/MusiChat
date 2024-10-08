import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React, { useContext } from 'react'
import JoinRoomButton from '../rooms/JoinRoomButton';
import LeaveRoomButton from '../rooms/LeaveRoomButton';
import AuthContext from '../../context/AuthContext';

const RoomCard = (props) => {
    const { room, ...others } = props
    const { user } = useContext(AuthContext);

    const leaveRoomCallback = () => {
        const index = room.joined_users.indexOf(user.user_id);
        room.joined_users.splice(index, 1);
    }

    return (
        <Card sx={{ maxWidth: 320, maxHeight: 200 }} className='shadow-md border-green-800 rounded-md justify-center'>
            <CardContent sx={{ maxHeight: '80%' }}>
                <Typography gutterBottom variant="h5" component="div">
                    Room: {room.key}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions sx={{ maxWidth: 'full', maxHeight: '20%' }}>
                <JoinRoomButton roomKey={room.key} />
                {
                    room.joined_users.find(u => u.id === user.user_id) &&
                    <LeaveRoomButton room_key={room.key} onCardClick={leaveRoomCallback} />
                }
                <span className='font-light justify-self-end'>{room.joined_users.length} / {room.max_users}</span>
            </CardActions>
        </Card>
    )
}
export default RoomCard;
