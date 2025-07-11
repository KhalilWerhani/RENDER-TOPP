import { io } from 'socket.io-client';

const socket = io('http://localhost:4005', {
  withCredentials: true,
  transports: ['websocket']
});

export default socket;
