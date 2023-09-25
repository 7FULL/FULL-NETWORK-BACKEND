class Packague {
  constructor(packagueType, clientID, options, data) {
    this.packagueType = packagueType;
    this.clientID = clientID;
    this.options = options;
    this.data = data;
  }

  toJson() {
    return JSON.stringify(this);
  }
}

class PackagueType {
  static HANDSHAKE = 1;
  static RPC = 2;
  static TARGET_RPC = 3;
  static POSITION = 4;
  static ROTATION = 5;
  static PLAIN = 6;
  static DISCONNECTION = 7;
  static CONNECTION = 8;
}

class PackagueOptions {
  // No options
  static NONE = 0;
  // Option if you want to send back the packague to the sender in case of a target rpc
  static TARGET_SEND_BACK = 1;
  // Option if you want to send back the packague to the sender in case of a rpc
  static RPC_DONT_SEND_BACK = 2;
}

class Data {
  constructor(method, parameters, targetID) {
    this.method = method;
    this.parameters = parameters;
    this.targetID = targetID;
  }
}

module.exports = { Packague, PackagueType, PackagueOptions, Data };
