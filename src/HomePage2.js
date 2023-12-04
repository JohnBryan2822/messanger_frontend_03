import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaEllipsisV, FaPaperPlane, FaRegSmile } from 'react-icons/fa';
import './HomePage.css';
import SockJS from 'sockjs-client';
import * as Webstomp from 'webstomp-client';

const HomePage2 = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [client, setClient] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = new SockJS('http://localhost:5000/ws');
        const client = Webstomp.over(socket);

        // Cleanup function on component unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);

    // Load chats when the component mounts
    useEffect(() => {
        fetchChats();
    }, []);

    // Function to fetch chats from the backend
    const fetchChats = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!user || !token) {
                console.error('User or token not found in localStorage');
                return;
            }

            // Parse the user string to get the user object
            const userId = user.id; // Adjust if the property name for the ID in your user object is different

            const response = await fetch(`http://localhost:5000/messenger/chats/${userId}`, {
                headers: {
                    'Authorization': token
                }
            });

            if (response.ok) {
                const fetchedChats = await response.json();
                setChats(fetchedChats);
                //initializeNotifications(fetchedChats);
            } else {
                // Handle HTTP errors
                console.error('Failed to fetch chats:', response.status);
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };
    // Function to handle selecting a chat
    const handleSelectChat = (chat) => {
        // Set the selected chat
        setSelectedChat(chat);
        // Fetch and display messages for the selected chat
        fetchAndDisplayUserChat(chat.id);
    };

    const fetchAndDisplayUserChat = async (recipientId) => {
        // Fetch messages for the selected chat from the backend
        try {
            const token = localStorage.getItem('jwtToken');

            if (!user || !token) {
                console.error('User or token not found in localStorage');
                return;
            }

            const senderId = user.id;
            const response = await fetch(`http://localhost:5000/messenger/messages/${senderId}/${recipientId}`, {
                headers: {
                    'Authorization': token
                }
            });

            if (response.ok) {
                const userChat = await response.json();
                setMessages(userChat);
            } else {
                console.error('Failed to fetch chat messages:', response.status);
            }
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    // Function to send a new message
    const handleSendMessage = async () => {
        // Send a new message to the server
        if (newMessage.trim()) {
            const chatMessage = {
                senderId: user.id,  // Replace with the actual user ID
                recipientId: selectedChat.id,
                content: newMessage.trim(),
                timestamp: new Date()
            };

            // socket.emit('chat', chatMessage);  // Emit the message to the server
            client.send("/app/chat", {}, JSON.stringify(chatMessage));

            // Update the messages state with the new message
            setMessages((prevMessages) => [...prevMessages, chatMessage]);

            // Clear the input field
            setNewMessage('');
        }
    };

    return (
        <div className="container-fluid homepage">
            <div className="row h-100">
                {/* Chat List Section */}
                <div className="col-md-4 col-lg-3 chat-list-section">
                    <div className="chat-list-header">
                        <button className="btn btn-light me-2"><FaBars /></button>
                        <input type="text" className="form-control" placeholder="Search" />
                    </div>
                    <div className="chat-list">
                        {chats.map(chat => (
                            <div className={`chat-list-item ${selectedChat && chat.id === selectedChat.id ? 'selected' : ''}`} 
                                        key={chat.id} onClick={() => handleSelectChat(chat)}>
                                <div className="initial-letter">
                                    {chat.username.charAt(0).toUpperCase()}
                                </div>
                                {chat.username}
                                {/* {notifications.map(notification => {
                                    if (notification.senderId === chat.userId && notification.unreadMessageCount > 0) {
                                        // Show a small rounded notification with unreadMessageCount
                                        return (
                                            <div key={`notification-${chat.userId}`} className="notification-badge">
                                                {notification.unreadMessageCount}
                                            </div>
                                        );
                                    }
                                    return null;
                                })} */}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window Section */}
                <div className="col-md-8 col-lg-9 chat-window-section">
                    <div className="chat-window-header">
                        <span className="username-title">{selectedChat?.name}</span>
                        <button className="btn btn-light me-2"><FaSearch /></button>
                        <button className="btn btn-light"><FaEllipsisV /></button>
                    </div>
                    <div className="chat-conversation">
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.senderId === user.id ? 'mine' : ''}`}>
                                {message.messageText}
                            </div>
                        ))}
                    </div>
                    <div className="message-input-area">
                        <input 
                            type="text" 
                            className="form-control me-2" 
                            placeholder="Write a message..." 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button className="btn btn-primary" onClick={handleSendMessage}><FaPaperPlane /></button>
                        <button className="btn btn-light"><FaRegSmile /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage2;
