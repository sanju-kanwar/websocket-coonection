let reconnectTimeout;

export function connectWebSocket(setStatus) {
  const socket = new WebSocket('ws://localhost:8080');

  socket.onopen = () => {
    setStatus('Connected');
  };

  socket.onmessage = (e) => {
    console.log('Received:', e.data);
  };

  socket.onclose = () => {
    setStatus('Disconnected. Reconnecting...');
    reconnectTimeout = setTimeout(() => {
      if (navigator.onLine) {
        connectWebSocket(setStatus);
      }
    }, 5000);
  };

  socket.onerror = () => {
    setStatus('WebSocket Error');
  };

  return socket;
}

export function clearReconnect() {
  clearTimeout(reconnectTimeout);
}
