import { io } from 'socket.io-client';

const URL: string = import.meta.env.VITE_SAGER_DRONE_SERVER_URL || 'http://localhost:9013';

export const socket = io(URL);