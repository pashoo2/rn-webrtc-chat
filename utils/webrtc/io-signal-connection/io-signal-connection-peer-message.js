class PeerMessage {
  type;
  from;
  to;
  payload;

  constructor(msg) {
    let msgObj;

    if (typeof msg === 'string') {
      try {
        msgObj = JSON.parse(msg);
      } catch (err) {
        console.error(err);
        return null;
      }
    } else {
      msgObj = msg;
    }

    this.setProps(msgObj);
  }

  setProps(msgObj) {
    this.type = msgObj.type;
    this.from = msgObj.from;
    this.to = msgObj.to;
    this.payload = msgObj.payload;
  }

  toString() {
    return JSON.stringify({
      type: this.type,
      from: this.from,
      to: this.to,
      payload: this.payload,
    });
  }
}
