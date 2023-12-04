import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_SERVER_URL, {
  auth: { token: import.meta.env.VITE_SOCKET_JWT}
});

const messageInput = document.getElementById('messageInput') as HTMLInputElement;
const sendButton = document.getElementById('sendButton') as HTMLButtonElement;
const messageList = document.getElementById('messageList') as HTMLUListElement;

// Handle Socket.io connection event
socket.on('connect', () => {
  console.log('Connected to the WebSocket server');
});

const roomId = import.meta.env.VITE_ROOM_ID
const secretKey = import.meta.env.VITE_SECRET_KEY

// Emit an event to create a private room
socket.emit('createPrivateRoom', roomId, secretKey);

// Listen for unauthorized access
socket.on('unauthorizedAccess', (errorMessage: string) => {
  console.error('Unauthorized access:', errorMessage);
});

// Listen for private messages
socket.on('privateMessage', (message: string) => {
  const listItem = document.createElement('li');
  listItem.textContent = message;
  messageList.appendChild(listItem);
});

// Handle Socket.io disconnection event
socket.on('disconnect', () => {
  console.log('Disconnected from the WebSocket server');
});

// Send a message to the WebSocket server when the button is clicked
sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  socket.emit('privateMessage', roomId, message);
  messageInput.value = '';
});
