import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import JoinRoomButton from './JoinRoomButton';
import LeaveRoomButton from './LeaveRoomButton';
import AuthContext from '../../context/AuthContext';

const RoomCard = (props) => {
    const { room, ...others } = props
    const { user } = useContext(AuthContext);

    return (
        <Card sx={{ maxWidth: 320, maxHeight: 200 }} className='shadow-md border-green-800 rounded-md justify-center mt-2'>
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
                <JoinRoomButton room_key={room.key} />
                {room.joined_users.includes(user.user_id) &&
                    <LeaveRoomButton room_key={room.key} />}
                <span className='font-light justify-self-end'>{room.joined_users.length} / {room.max_users}</span>
            </CardActions>
        </Card>
    )
}
export default RoomCard;
