import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import JoinRoomButton from './JoinRoomButton';

const RoomCard = (props) => {
    const { room } = props

    const navigate = useNavigate();

    const joinRoomHandler = () => {
        navigate(`/room/${room.key}`);
    }

    return (
        <Card sx={{ maxWidth: 320, maxHeight: 200 }} className='shadow-md border-green-800 rounded-md justify-center items-center mt-2 p-2'>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    Room: {room.key}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                </Typography>
            </CardContent>
            <CardActions>
                <JoinRoomButton room_key={room.key}/>
            </CardActions>
        </Card>
    )
}
export default RoomCard;
