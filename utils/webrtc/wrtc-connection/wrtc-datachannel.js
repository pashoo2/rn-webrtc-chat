import { observable } from 'mobx';
import { WRTC_DATA_CHANNEL_STATUS } from './wrtc-connection.const';
import { poll } from '../../common';

class WRTCDataChannel {
  @observable status = WRTC_DATA_CHANNEL_STATUS.EMPTY;
  @observable messagesIncoming = [];

  userId = null;
  peerId = null;
  dataChannel = null;
  peerConnection = null;

  constructor({ userId, peerId, peerConnection, dataChannel }) {
    debugger;
    this.userId = userId;
    this.peerConnection = peerConnection;
    this.peerId = peerId;
    this.dataChannel = dataChannel || this.createChannel();
    this.setListeners();
    this.checkDCState();
  }

  createChannel() {
    const dc = this.peerConnection.createDataChannel(
      '123',
      { ordered: true }
      // TODO WRTC_DATA_CHANNEL_OPTIONS // if id is defined it cause app's crash
    );

    this.status = WRTC_DATA_CHANNEL_STATUS.NEW;
    return dc;
  }

  onopenHandler = () => {
    this.status = WRTC_DATA_CHANNEL_STATUS.OPEN;
  };

  oncloseHandler = () => {
    this.status = WRTC_DATA_CHANNEL_STATUS.CLOSE;
  };

  onmessageHandler = e => {
    const { data } = e;
    debugger;
    console.error('datachannel::onmessageHandler', data); // TODO - delete this
    this.messagesIncoming.push(data);
    this.status = WRTC_DATA_CHANNEL_STATUS.TRANSMITTING;
  };

  onerrorHandler = err => {
    debugger;
    console.error(err);
    this.status = WRTC_DATA_CHANNEL_STATUS.ERROR;
  };

  setListeners() {
    const { dataChannel } = this;

    dataChannel.addEventListener('open', this.onopenHandler);
    dataChannel.addEventListener('close', this.oncloseHandler);
    dataChannel.addEventListener('error', this.onerrorHandler);
    dataChannel.addEventListener('message', this.onmessageHandler);
  }

  checkDCState = async () => {
    const dataChannel = this.dataChannel;
    debugger;
    await poll(() => dataChannel && dataChannel.readyState === 'open', 10000);
    console.error('data channel open');
  };
}

export default WRTCDataChannel;
