import React, { useContext, useEffect, useRef, useState } from 'react'
import useAxios from '../../hooks/useAxios';
import { Each } from '../Each';
import AuthContext from '../../context/AuthContext';
import { MessageLeft, MessageRight } from '../chat/Message';
import useSocket from '../../hooks/useSocket';

const RoomChat = (props) => {
    const { chat_id, roomKey } = props

    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const axios = useAxios();
    const { user } = useContext(AuthContext);

    const [messageReceived, setMessageReceived] = useState(false);

    useEffect(() => {
        try {
            axios.get('/chats/chat', { params: chat_id }).then((resp) => {
                setChat(resp.data);
                setMessages(resp.data.messages);
            });
        } catch (error) {
            console.log(error);
        }
    }, [messageReceived])

    // websocket
    const socket = useSocket(`/chat/${roomKey}`);
    socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.type === 'chat_message') {
            setMessageReceived(!messageReceived);
        }
    }

    // Scroll to the last message automatically
    const messageViewRef = useRef(null);
    useEffect(() => {
        messageViewRef.current?.lastElementChild?.scrollIntoView()
    }, [chat]);

    // send message
    const sendMessage = async (e) => {
        e.preventDefault();
        const messageForm = new FormData();
        let text = e.target.messageText.value;
        if (text !== "") {
            messageForm.append('chat', chat.id)
            messageForm.append('text', text);
            messageForm.append('sender', user.user_id);
            axios.post('/chats/chat/send-message', messageForm);
        }
        e.target.messageText.value = "";
    }

    return (
        <div className='m-1 max-h-full min-h-full overflow-y-hidden'>
            <div className='bg-green-900 rounded-xl overflow-y-auto mb-1 pb-2' ref={messageViewRef}>
                {
                    messages &&
                    <Each of={messages} render={(message, index) =>
                        message.sender.username !== user.username ?
                            <MessageLeft message={message} />
                            :
                            <MessageRight message={message} />
                    } />
                }
            </div>
            <div >
                <form onSubmit={sendMessage} className='max-h-10 h-10 min-h-10 bottom-0 flex p-1 mb-2'>
                    <input type='text' className='rounded-md w-full p-2' id='message-text' name='messageText' />
                    <button type='submit' className='text-white shadow-inner shadow-white hover:bg-green-700 w-24 ms-2' >Send</button>
                </form>
            </div>
        </div>
    )
}

export default RoomChat