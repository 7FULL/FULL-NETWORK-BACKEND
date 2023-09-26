const net = require("net");
const dgram = require("dgram");
const {
  Packague,
  PackagueType,
  PackagueOptions,
  Data,
} = require("./models/Packague");
const { Client } = require("./models/Client");

// Lista de clientes conectados
const clients = [];

const tcpServer = net.createServer((tcpSocket) => {
  // TODO: Correctly assing the clientID here and in the client of unity
  // TODO: Correctly parse the data from the packague received maybe adding "" to the data
  const token = generateUniqueToken();

  const newClient = new Client(token);

  newClient.setTCPSocket(tcpSocket);
  clients.push(newClient);

  tcpSocket.write(token);

  // We send a connection packague to all the clients except the new one
  clients.forEach((client) => {
    if (client.id !== newClient.id) {
      const packague = new Packague(
        PackagueType.CONNECTION,
        0,
        PackagueOptions.NONE,
        newClient.id
      );

      client.tcpSocket.write(packague.toJson());
    }
  });

  console.log("New client connected with id: " + token);
  console.log("");

  /*
  
    Start of the TCP socket events  
  
  */

  tcpSocket.on("data", (data) => {
    // We generate a json object from the data received

    let dataReceived = null;

    let packagueReceived = null;

    try {
      const message = JSON.parse(data.toString());

      packagueReceived = new Packague(
        message.packagueType,
        message.clientID,
        message.options,
        message.data
      );

      dataReceived = packagueReceived.data;
    } catch (error) {
      console.log("Error parsing the data received");
      console.log(error);
    }

    console.log(packagueReceived);

    if (packagueReceived.packagueType === PackagueType.HANDSHAKE) {
      const packague = new Packague(
        PackagueType.HANDSHAKE,
        0,
        PackagueOptions.NONE,
        "PONG"
      );

      tcpSocket.write(packague.toJson());
    } else if (packagueReceived.packagueType === PackagueType.TARGET_RPC) {
      const targetClient = getPlayerSocketById(dataReceived.targetID);
      if (targetClient) {
        targetClient.write(packagueReceived.toJson());
      }
    } else if (packagueReceived.packagueType === PackagueType.RPC) {
      const options = packagueReceived.options;

      let sendBack = true;

      for (let i = 0; i < options.length; i++) {
        if (options[i] == PackagueOptions.RPC_DONT_SEND_BACK) {
          sendBack = false;
        }
      }

      clients.forEach((client) => {
        // If sendBack is true, we send the packague to all the clients
        // If sendBack is false, we send the packague to all the clients except the sender

        if (sendBack || client.id !== packagueReceived.id) {
          client.tcpSocket.write(packagueReceived.toJson());
        }
      });
    }
  });

  tcpSocket.on("end", () => {
    // Eliminar el cliente de la lista de clientes
    const clientIndex = clients.findIndex((client) => {
      return client.tcpSocket === tcpSocket;
    });

    const packague = new Packague(
      PackagueType.DISCONNECTION,
      0,
      PackagueOptions.NONE,
      clients[clientIndex].id
    );

    if (clientIndex !== -1) {
      clients.splice(clientIndex, 1);
    }
  });

  tcpSocket.on("error", (err) => {
    console.error(err);
  });
});

function generateUniqueToken() {
  let token = "";

  for (let i = 0; i < 8; i++) {
    const random = Math.floor(Math.random() * 10);

    if (random != 0) {
      token += random;
    } else {
      i--;
    }
  }

  return token;
}

function getPlayers() {
  const players = [];

  clients.forEach((client) => {
    players.push(client.id);
  });

  return players;
}

function getPlayerSocketById(playerId) {
  let playerSocket = null;

  clients.forEach((client) => {
    if (client.id.toString() == playerId.toString()) {
      playerSocket = client.tcpSocket;
    }
  });

  return playerSocket;
}

/*
 *
 *  Start of the UDP socket events
 *
 */

const udpServer = dgram.createSocket("udp4");
const udpPort = 4000;

udpServer.on("message", (msg, rinfo) => {
  // Verificar el tipo de mensaje UDP (primer byte)
  const messageType = msg.readUInt8(0);

  // Si el tipo de mensaje es 0x01 (por ejemplo, para actualizaciones de posición)
  if (messageType === 0x01) {
    const playerId = msg.readUInt16LE(1); // Supongamos que el ID del jugador es un entero de 2 bytes
    const posX = msg.readFloatLE(3);
    const posY = msg.readFloatLE(7);
    const posZ = msg.readFloatLE(11);

    // Actualizar la posición del jugador en el estado
    if (players.has(playerId)) {
      const player = players.get(playerId);
      player.posX = posX;
      player.posY = posY;
      player.posZ = posZ;
    } else {
      players.set(playerId, { posX, posY, posZ });
    }

    // Puedes agregar aquí cualquier lógica adicional que necesites para tu juego
    // Por ejemplo, propagar las actualizaciones de posición a otros jugadores.
  } else {
    // Tipo de mensaje desconocido, puedes ignorarlo o manejarlo según tus necesidades
    console.log(
      `Mensaje UDP desconocido recibido de ${rinfo.address}:${rinfo.port}`
    );
  }
});

tcpServer.listen(3000, () => {
  console.log("Servidor TCP escuchando en el puerto 3000");
});

udpServer.bind(udpPort, () => {
  console.log(`Servidor UDP escuchando en el puerto ${udpPort}`);
  console.log("");
});
