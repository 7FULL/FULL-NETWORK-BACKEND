class Client {
  constructor(id) {
    this.id = id;
  }

  // Set TCP socket
  setTCPSocket(socket) {
    this.tcpSocket = socket;
  }

  // Set UDP socket
  setUDPSocket(socket) {
    this.udpSocket = socket;
  }
}

module.exports = { Client };
