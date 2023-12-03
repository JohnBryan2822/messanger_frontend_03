import React, { useState, useEffect } from 'react';
import { FaSearch, FaBars, FaEllipsisV, FaPaperPlane, FaRegSmile } from 'react-icons/fa';
import io from 'socket.io-client';
import './HomePage.css';

const HomePage2 = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Connect to the WebSocket server
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        // Cleanup function on component unmount
        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    }, []);  // Run only on component mount and unmount

    useEffect(() => {
        if (socket) {
            // Listen for messages from the server
            socket.on('chat-message', (message) => {
                // Update the messages state with the new message
                setMessages((prevMessages) => [...prevMessages, message]);

                // Update notifications based on the incoming message
                updateNotifications(message.senderId);
            });
        }

        // Cleanup function on component unmount
        return () => {
            if (socket) {
                socket.off('chat-message');
            }
        };
    }, [socket]);
    // }, [socket, updateNotifications]);  // Run only when the socket changes

    // Load chats when the component mounts
    useEffect(() => {
        fetchChats();
    }, []);

    // Subscribe to the user's message queue when WebSocket is connected
    // useEffect(() => {
    //     const onConnected = () => {
    //         const user = JSON.parse(localStorage.getItem('user'));
    //         if (user) {
    //             const nickname = user.id;  // Replace with the actual property name for the ID
    //             stompClient.subscribe(`/user/${nickname}/queue/messages`, onMessageReceived);
    //         }
    //     };

    //     if (socket) {
    //         const stompClient = Stomp.over(socket);
    //         stompClient.connect({}, onConnected);

    //         // Cleanup function on component unmount
    //         return () => {
    //             if (stompClient.connected) {
    //                 stompClient.disconnect();
    //             }
    //         };
    //     }
    // }, [socket, onMessageReceived]);

    // Function to fetch chats from the backend
    const fetchChats = async () => {
        try {
            const userString = localStorage.getItem('user');
            const token = localStorage.getItem('jwtToken');

            if (!userString || !token) {
                console.error('User or token not found in localStorage');
                return;
            }

            // Parse the user string to get the user object
            const user = JSON.parse(userString);
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

    // Initialize notifications based on the number of unread messages for each chat
    const initializeNotifications = (chats) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user.id;

        const initialNotifications = chats.map(chat => {
            const unreadMessageCount = getUnreadMessageCount(userId, chat.userId);
            return {
                senderId: chat.userId,
                unreadMessageCount
            };
        });

        setNotifications(initialNotifications);
    };

    // Update notifications based on the number of unread messages for the sender
    const updateNotifications = async (senderId) => {
        try {
            const unreadMessageCount = await getUnreadMessageCount(user.id, senderId);
    
            setNotifications(prevNotifications => {
                const updatedNotifications = prevNotifications.map(notification => {
                    if (notification.senderId === senderId) {
                        return {
                            ...notification,
                            unreadMessageCount
                        };
                    }
                    return notification;
                });
                return updatedNotifications;
            });
        } catch (error) {
            console.error('Error updating notifications:', error);
        }
    };    

    // Get the number of unread messages for a specific chat
    const getUnreadMessageCount = async (userId, senderId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await fetch(`http://localhost:5000/messenger/messages/${senderId}/${userId}/unreadCount`, {
                headers: {
                    'Authorization': token
                }
            });
            
            if (response.ok) {
                const unreadMessageCount = await response.json();
                return unreadMessageCount.unreadCount;
            } else {
                // Handle HTTP errors
                console.error('Failed to fetch unread message count:', response.status);
                return 0; // Default to 0 if there's an error
            }
        } catch (error) {
            console.error('Error fetching unread message count:', error);
            return 0; // Default to 0 if there's an error
        }
    };
    

    // Function to handle selecting a chat
    const handleSelectChat = (chat) => {
        // Set the selected chat
        setSelectedChat(chat);

        // Fetch and display messages for the selected chat
        fetchAndDisplayUserChat(chat.userId);

        // Update notifications based on the selected chat
        updateNotifications(chat.userId);
    };

    const fetchAndDisplayUserChat = async (recipientId) => {
        // Fetch messages for the selected chat from the backend
        try {
            const userString = localStorage.getItem('user');
            const token = localStorage.getItem('jwtToken');

            if (!userString || !token) {
                console.error('User or token not found in localStorage');
                return;
            }

            const user = JSON.parse(userString);
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
        if (newMessage.trim() && socket) {
            const token = localStorage.getItem('jwtToken');
            const user = JSON.parse(localStorage.getItem('user'));
            const chatMessage = {
                senderId: user.id,  // Replace with the actual user ID
                recipientId: selectedChat.userId,
                content: newMessage.trim(),
                timestamp: new Date()
            };

            socket.emit('chat', chatMessage, { Authorization: `Bearer ${token}` }); // Emit the message to the server

            // Update the messages state with the new message
            setMessages((prevMessages) => [...prevMessages, chatMessage]);

            // Clear the input field
            setNewMessage('');
        }
    };

    // Function to show a notification
    const showNotification = (unreadMessageCount) => {
        // Implement your logic to show a notification
        // This might involve displaying a small rounded notification
        // with the unreadMessageCount at the right side of the chat list item
        // You can use a library or custom styling to achieve this
        // For example, you might update the chat list item component to handle notifications
        // and conditionally render the notification based on unreadMessageCount
        console.log(`Show notification: ${unreadMessageCount} unread messages`);
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
                            <div className='chat-list-item' key={chat.id} onClick={() => handleSelectChat(chat)}>
                                <div className="initial-letter">
                                    {chat.username.charAt(0).toUpperCase()}
                                </div>
                                {chat.username}
                                {notifications.map(notification => {
                                    if (notification.senderId === chat.userId && notification.unreadMessageCount > 0) {
                                        // Show a small rounded notification with unreadMessageCount
                                        return (
                                            <div key={`notification-${chat.userId}`} className="notification-badge">
                                                {notification.unreadMessageCount}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
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
                                {message.content}
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
