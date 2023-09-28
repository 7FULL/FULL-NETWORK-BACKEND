class SyncVar {
  constructor(type, value, id, localID) {
    this.type = type;
    this.value = value;
    this.id = id;
    this.localID = localID;
  }
  get() {
    return this.value;
  }
  set(value) {
    this.value = value;
  }

  toJson() {
    return JSON.stringify(this);
  }

  static fromJson(json) {
    const data = JSON.parse(json);

    return new SyncVar(data.value, data.id);
  }
}

module.exports = { SyncVar };
