import { useEffect } from 'react';
import { socket } from '@/socket';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store';
import type { DroneData } from '@/types/droneData';
import { receiveDroneData } from '@/features/drone/droneSlice';
import log from 'loglevel';

function useDroneSocket() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on('connect', () => {
      log.info('Connected to sager drone server');
    });

    socket.on('message', (data: DroneData) => {
      dispatch(receiveDroneData(data));
    });

    socket.on('disconnect', () => {
      log.warn('Disconnected from sager drone server');
    });

    socket.on('error', () => {
      log.error('Socket connection error');
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.off('disconnect');
      socket.off('error');
    };
  }, [dispatch]);
}

export default useDroneSocket;