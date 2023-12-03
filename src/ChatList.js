import React from 'react';

const ChatList = ({ chats, onSelectChat }) => {
    return (
        <div className="chat-list">
            {chats.map(chat => (
                <div key={chat.id} className="chat-list-item" onClick={() => handleSelectChat(chat)}>
                    
                    {chat.username}
                </div>
            ))}
        </div>

    );
};

export default ChatList;
