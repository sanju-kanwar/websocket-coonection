import { useEffect, useRef, useState } from 'react';
import './App.css';
import { connectWebSocket, clearReconnect } from './websocket';

function App() {
  const savedOffline = localStorage.getItem('offline') === 'true';
  const [netStatus, setNetStatus] = useState(savedOffline ? 'Offline' : (navigator.onLine ? 'Online' : 'Offline'));
  const [wsStatus, setWsStatus] = useState('Connecting...');
  const wsRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setNetStatus('Online');
    const handleOffline = () => setNetStatus('Offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('offline', netStatus === 'Offline');

    if (netStatus === 'Offline') {
      setWsStatus('Disconnected');
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      clearReconnect();
      return;
    }

    if (netStatus === 'Online') {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      const socket = connectWebSocket(setWsStatus);
      wsRef.current = socket;

      return () => {
        if (wsRef.current) {
          wsRef.current.close();
          wsRef.current = null;
        }
        clearReconnect();
      };
    }
  }, [netStatus]);

  return (
    <div className="app-container">
      <h1>🔌 WebSocket Connectivity</h1>
      <div className={`status ${wsStatus === 'Connected' ? 'connected' : 'disconnected'}`}>
        WebSocket: {wsStatus}
      </div>
      <div className={`status ${netStatus === 'Online' ? 'connected' : 'disconnected'}`}>
        Internet: {netStatus}
      </div>
      {netStatus === 'Offline' && (
        <div className="offline-banner">
          You are offline. Please check your internet connection.
        </div>
      )}
    </div>
  );
}

export default App;
