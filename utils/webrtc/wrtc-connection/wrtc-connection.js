import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from 'react-native-webrtc';
import { observable, reaction } from 'mobx';
import { PEER_CONNECTION_CONF } from './wrtc-connection.const';
import { PEER_MESSAGE_TYPES } from '../io-signal-connection/io-signal-connection.const';
import { getLocalStreamDevice } from '../stream';

/**
 * create and handle WebRTC connection to another peer
 * @class WRTCConnection
 * @namespace WRTCConnection
 */
class WRTCConnection {
  @observable streamUrl = '';
  @observable connectionStatus = '';

  ssConnection = null;
  userId = null;
  /**
   * id of the user whow is called by this one
   * @property {string} receiverUserId
   * @memberof WRTCConnection
   */
  receiverUserId = null;
  peerConnection = null;
  isCaller = false;
  stopSignalMessageListener = null;
  stream = null;

  constructor({ signalServerConnection, receicerId, isCaller }) {
    this.ssConnection = signalServerConnection;
    this.userId = signalServerConnection.userID;
    this.receiverUserId = receicerId;
    this.isCaller = isCaller;
    this.createStream();
  }

  async createStream() {
    this.stream = await getLocalStreamDevice();
    this.startConnection();
    this.setSignalMessageHandlers();
  }

  startConnection() {
    const peerConnection = new RTCPeerConnection(PEER_CONNECTION_CONF);

    this.peerConnection = peerConnection;
    this.setPCHandlers();
    peerConnection.addStream(this.stream);
  }

  createOffer = async () => {
    const peerConnection = this.peerConnection;
    const offerSDP = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offerSDP);
    this.ssConnection.sendOffer({
      to: this.receiverUserId,
      payload: offerSDP,
    });
  };

  onicecandidateHandler = e => {
    if (e.candidate) {
      this.ssConnection.sendCandidate({
        to: this.receiverUserId,
        payload: e.candidate,
      });
    }
  };

  onnegotiationneededHandler = () => {
    if (this.isCaller) {
      this.createOffer();
    }
  };

  onsignalingstatechangeHandler = e => console.log(e.target.signallingState);

  onaddstreamHandler = e => {
    this.streamUrl = e.stream.toURL();
  };

  onremovestreamHandler = () => {
    this.streamUrl = '';
  };

  oniceconnectionstatechangeHandler = e => {
    const { target: peerConnection } = e;

    this.connectionStatus = peerConnection.iceConnectionState;
  };

  setPCHandlers() {
    const peerConnection = this.peerConnection;

    peerConnection.onicecandidate = this.onicecandidateHandler;
    peerConnection.onnegotiationneeded = this.onnegotiationneededHandler;
    peerConnection.onsignalingstatechange = this.onsignalingstatechangeHandler;
    peerConnection.onaddstream = this.onaddstreamHandler;
    peerConnection.onremovestream = this.onremovestreamHandler;
    peerConnection.oniceconnectionstatechange = this.oniceconnectionstatechangeHandler;
  }

  setRemoteDescription = remoteSDP =>
    this.peerConnection.setRemoteDescription(
      new RTCSessionDescription(remoteSDP)
    );

  handlePeerMessage = async msg => {
    const { type, from, payload } = msg;
    const peerConnection = this.peerConnection;
    const receiverUserId = this.receiverUserId;

    if (from === receiverUserId) {
      switch (type) {
        case PEER_MESSAGE_TYPES.OFFER:
          {
            await this.setRemoteDescription(payload);

            const answerSDP = await peerConnection.createAnswer();

            await peerConnection.setLocalDescription(answerSDP);
            this.ssConnection.sendAnswer({
              to: receiverUserId,
              payload: answerSDP,
            });
          }
          break;
        case PEER_MESSAGE_TYPES.ANSWER:
          await this.setRemoteDescription(payload);
          break;
        case PEER_MESSAGE_TYPES.CANDIDAE:
          await peerConnection.addIceCandidate(new RTCIceCandidate(payload));
          break;
      }
    }
  };

  setSignalMessageHandlers = () => {
    this.stopSignalMessageListener = reaction(
      () => this.ssConnection.peerMessages.length,
      async messagesLenght => {
        const ssConnection = this.ssConnection;
        const { peerMessages } = ssConnection;
        const peerMessagesCpy = peerMessages.slice();

        ssConnection.clearPeerMessagesList();
        for (let i = 0; i < messagesLenght; i++) {
          await this.handlePeerMessage(peerMessagesCpy[i]);
        }
      }
    );
  };
}

export default WRTCConnection;
