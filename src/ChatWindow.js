import React, { useState } from 'react';
import Message from './Message';

const ChatWindow = ({ currentChat }) => {
    const [newMessage, setNewMessage] = useState('');

    const sendMessage = () => {
        // Implement send message functionality
        setNewMessage('');
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {currentChat.messages.map(msg => 
                    <Message key={msg.id} message={msg} isMine={msg.senderId === currentChat.userId} />
                )}
            </div>
            <div className="message-input">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
