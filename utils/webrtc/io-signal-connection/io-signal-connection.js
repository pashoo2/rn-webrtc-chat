import io from 'socket.io-client';
import { observable } from 'mobx';
import {
  SIGNAL_SERVER_CONNECTION_STATUS,
  SERVER_MESSAGE_TYPES,
  SIGNAL_SERVER_CONNECTION_CONFIG,
} from './io-signal-connection.const';
import PeerMessage from './io-signal-connection-peer-message';

/**
 * connection to the signal server
 * @class IOSignalConnection
 * @namespace IOSignalConnection
 */
class IOSignalConnection {
  @observable connectionStatus = SIGNAL_SERVER_CONNECTION_STATUS.EMPTY;
  @observable userId = null;
  /**
   * observable list of a messages from another peers
   * @property {<PeerMessage[]>} peerMessages
   * @memberof IOSignalConnection
   */
  @observable peerMessages = [];

  socket = null;

  constructor() {
    this.connectionStatus = SIGNAL_SERVER_CONNECTION_STATUS.NEW;
    this.socket = io.connect(
      `http://${SIGNAL_SERVER_CONNECTION_CONFIG.host}:${
        SIGNAL_SERVER_CONNECTION_CONFIG.port
      }`,
      { transports: ['websocket'] }
    );
  }

  setHandlers() {
    const { socket } = this;

    socket.on('connect', this.handleConnectionOpen);
  }

  clearPeerMessagesList = () => this.peerMessages.clear();

  handleConnectionOpen = () => {
    debugger;
    this.connectionStatus = SIGNAL_SERVER_CONNECTION_STATUS.OPEN;
    this.setMessageHandlers();
  };

  onPeerMessage = message => {
    const msgO = new PeerMessage(message);

    this.peerMessages.push(msgO);
  };

  setPeerMessageHandler = () => {
    const { socket } = this;

    socket.on(SIGNAL_SERVER_CONNECTION_STATUS.PEER_MESSAGE, this.onPeerMessage);
  };

  serverMessageHandlers = {
    [SERVER_MESSAGE_TYPES.SET_USER_ID]: userId => {
      this.connectionStatus = SIGNAL_SERVER_CONNECTION_STATUS.GOT_USER_ID;
      this.userId = userId;
      this.setPeerMessageHandler();
    },
  };

  setMessageHandlers = (handlersList = this.serverMessageHandlers) => {
    const messageTypes = Object.keys(SERVER_MESSAGE_TYPES);

    messageTypes.forEach(msgType => {
      const handler = handlersList[msgType];

      if (handler) {
        socket.on(msgType, handler);
      } else {
        console.warn(
          new Error(
            `There is no handler for the signal server message type ${msgType}`
          )
        );
      }
    });
  };
}

export default IOSignalConnection;
