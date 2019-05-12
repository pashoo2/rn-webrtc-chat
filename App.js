import React, { Component } from 'react';
import {
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import IOSignalConnection from './utils/webrtc/io-signal-connection';
import WRTCConnection from './utils/webrtc/wrtc-connection';
import { RTCView } from 'react-native-webrtc';

@observer
export default class App extends Component {
  @observable receiverId = '';

  signalConnection = observable.box(null, { deep: true });
  peerConnection = observable.box(null, { deep: true });

  setReceiverId = text => {
    this.receiverId = text;
  };
  connectionStatus(connectionInstance) {
    return String(
      connectionInstance ? connectionInstance.connectionStatus : ''
    );
  }
  get ssConnectionStatus() {
    const signalConnection = this.signalConnection.get();

    return this.connectionStatus(signalConnection);
  }
  get peerConnectionStatus() {
    const peerConnection = this.peerConnection.get();

    return this.connectionStatus(peerConnection);
  }
  get userId() {
    const signalConnection = this.signalConnection.get();

    return String(signalConnection ? signalConnection.userId : '');
  }
  get streamUrl() {
    const peerConnection = this.peerConnection.get();

    return peerConnection ? String(peerConnection.streamUrl) : null;
  }
  get dataChannelStatus() {
    const peerConnection = this.peerConnection.get();

    if (peerConnection) {
      const dc = peerConnection.dataChannel.get();

      if (dc) {
        return String(dc.status);
      }
    }

    return '';
  }
  startCall = () => this.createPeerConnection(true);
  startWaiting = () => this.createPeerConnection(false);
  createPeerConnection(isCaller = false) {
    const signalServerConnection = this.signalConnection.get();
    const receiverId = String(this.receiverId);

    if (signalServerConnection) {
      if (!receiverId) {
        console.error('There is no receiverId was defined');
      } else {
        this.peerConnection.set(
          new WRTCConnection({
            signalServerConnection,
            receiverId,
            isCaller,
          })
        );
      }
    }
  }
  componentDidMount() {
    this.signalConnection.set(new IOSignalConnection());
  }
  render() {
    return (
      <ScrollView>
        <Text>Signal server connection status: {this.ssConnectionStatus}</Text>
        <Text>Peer connection status: {this.peerConnectionStatus}</Text>
        <Text>Data channel status: {this.dataChannelStatus}</Text>
        <Text>UserId:</Text>
        <TextInput
          style={styles.txtInput}
          value={this.userId}
          multiline={false}
        />
        <Text>ReceiverId:</Text>
        <TextInput
          style={styles.txtInput}
          value={this.receiverId}
          multiline={false}
          onChangeText={this.setReceiverId}
        />
        <TouchableOpacity onPress={this.startCall}>
          <Text>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.startWaiting}>
          <Text>Waiting for call</Text>
        </TouchableOpacity>
        <Text>streamUrl: {this.streamUrl}</Text>
        {this.streamUrl ? (
          <RTCView streamURL={this.streamUrl} style={styles.selfView} />
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  txtInput: {
    borderWidth: 1,
  },
  selfView: {
    width: 200,
    height: 150,
  },
});
