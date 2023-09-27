class SyncVar {
  constructor(value, id) {
    this.value = value;
    this.id = id;
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
