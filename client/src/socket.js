import io from 'socket.io-client';
// const sockets = io('http://localhost:3001', { autoConnect: true });
const sockets = io('/', { autoConnect: true });
export default sockets;
