function connection() {
  const socket = new WebSocket('ws://localhost:4000');
  return socket;
}

export {
  connection
};
