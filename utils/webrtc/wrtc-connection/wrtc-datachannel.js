import { observable } from 'mobx';
import { WRTC_DATA_CHANNEL_STATUS } from './wrtc-connection.const';

class WRTCDataChannel {
  receiverId = null;
  dataChannel = null;
  peerConnection = null;
  @observable status = WRTC_DATA_CHANNEL_STATUS.EMPTY;
  @observable messagesIncoming = [];

  constructor({ peerConnection, receiverId, dataChannel }) {
    this.peerConnection = peerConnection;
    this.receiverId = receiverId;
    this.dataChannel = dataChannel || this.createChannel();
    this.status = WRTC_DATA_CHANNEL_STATUS.NEW;
    this.setListeners();
  }

  createChannel() {
    return this.peerConnection.createChannel(
      `Connection with the peer ${this.receiverId}`
    );
  }

  onopenHandler = () => {
    this.status = WRTC_DATA_CHANNEL_STATUS.OPEN;
  };

  oncloseHandler = () => {
    this.status = WRTC_DATA_CHANNEL_STATUS.CLOSE;
  };

  onmessageHandler = e => {
    const { data } = e;

    console.error('datachannel::onmessageHandler', data); // TODO - delete this
    this.messagesIncoming.push(data);
    this.status = WRTC_DATA_CHANNEL_STATUS.TRANSMITTING;
  };

  onerrorHandler = err => {
    console.error(err);
    this.status = WRTC_DATA_CHANNEL_STATUS.ERROR;
  };

  setListeners() {
    const { dataChannel } = this;

    dataChannel.onopen = this.onopenHandler;
    dataChannel.onclose = this.oncloseHandler;
    dataChannel.onerror = this.onerrorHandler;
    dataChannel.onmessage = this.onmessageHandler;
  }
}

export default WRTCDataChannel;
