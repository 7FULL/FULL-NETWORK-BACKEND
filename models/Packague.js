class Packague {
  constructor(packagueType, clientID, options, data) {
    this.packagueType = packagueType;
    this.clientID = clientID;
    this.options = options;
    this.data = data;

    if (data instanceof Object) {
      this.data = data.toJson();
    }
  }

  toJson() {
    //this.data = JSON.stringify(this.data);
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
  static CHECK_PLAYERS = 9;
  static REGISTER_NETWORK_OBJECT = 10;
  static SYNCVAR = 11;
  static REGISTER_SYNCVARS = 12;
  static CHECK_SYNCVARS = 13;
}

class PackagueOptions {
  // No options
  static NONE = 0;
  // Option if you want to send back the packague to the sender in case of a rpc
  static DONT_SEND_BACK = 1;
}

class RPCData {
  constructor(method, parameters, targetID) {
    this.method = method;
    this.parameters = parameters;
    this.targetID = targetID;
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(json) {
    const data = JSON.parse(json);

    return new RPCData(data.method, data.parameters, data.targetID);
  }
}

class PlainData {
  constructor(message) {
    this.message = message;
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(json) {
    const data = JSON.parse(json);

    return new PlainData(data.data);
  }
}

module.exports = {
  Packague,
  PackagueType,
  PackagueOptions,
  RPCData,
  PlainData,
};
