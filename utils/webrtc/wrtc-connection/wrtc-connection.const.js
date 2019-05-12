export const PEER_CONNECTION_CONF = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

export const WRTC_DATA_CHANNEL_STATUS = {
  EMPTY: 'empty',
  NEW: 'new',
  OPEN: 'open',
  TRANSMITTING: 'transmitting', // a message was received
  ERROR: 'error',
  CLOSE: 'close',
};

export const WRTC_DATA_CHANNEL_OPTIONS = {
  maxRetransmits: 5,
  maxPacketLifeTime: 1000,
  ordered: true,
};
