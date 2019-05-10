export const SIGNAL_SERVER_CONNECTION_CONFIG = {
  host: '10.0.2.2',
  port: 3000,
};

export const SIGNAL_SERVER_CONNECTION_STATUS = {
  EMPTY: 'empty',
  NEW: 'new',
  OPEN: 'open',
  GOT_USER_ID: 'user id',
  CLOSE: 'close',
  ERROR: 'error',
};

export const SERVER_MESSAGE_TYPES = {
  SET_USER_ID: 'user::set::id',
  PEER_MESSAGE: 'user::to:peer',
};

export const PEER_MESSAGE_TYPES = {
  OFFER: 'peer::offer',
  ANSWER: 'peer::answer',
  CANDIDATE: 'peer::candidate',
};
