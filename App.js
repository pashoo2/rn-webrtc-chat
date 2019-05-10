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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  txtInput: {
    borderWidth: 1,
  },
});
