import io from 'socket.io-client';
const sockets = io('http://localhost:3001', { autoConnect: true });
export default sockets;