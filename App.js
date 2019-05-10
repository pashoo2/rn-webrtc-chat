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

  setReceiverId = text => (this.receiverId = text);
  connectionStatus(connectionInstance) {
    return String(
      connectionInstance ? connectionInstance.connectionStatus : ''
    );
  }
  get ssConnectionStatus() {
    const signalConnection = this.signalConnection.get();

    return connectionStatus(signalConnection);
  }
  get peerConnectionStatus() {
    const peerConnection = this.peerConnection.get();

    return connectionStatus(peerConnection);
  }
  get userId() {
    const signalConnection = this.signalConnection.get();

    return String(signalConnection ? signalConnection.userId : '');
  }
  startCall = () => this.createPeerConnection(true);
  startWaiting = () => this.createPeerConnection(false);
  createPeerConnection(isCaller = false) {
    if (this.IOSignalConnection.get() && this.receiverId) {
      this.peerConnection.set(
        new WRTCConnection({
          signalServerConnection: this.IOSignalConnection.get(),
          receicerId: this.receiverId,
          isCaller,
        })
      );
    }
  }
  componentDidMount() {
    this.signalConnection.set(new IOSignalConnection());
  }
  render() {
    return (
      <ScrollView>
        <Text>Signal server connection status: {this.ssConnectionStatus}</Text>
        <Text>UserId:</Text>
        <TextInput
          style={styles.txtInput}
          value={this.userId}
          multiline={false}
        />
        <Text>ReceiverId:</Text>
        <TextInput
          style={styles.txtInput}
          value={this.userId}
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
