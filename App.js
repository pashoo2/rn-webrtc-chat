import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import IOSignalConnection from './utils/webrtc/io-signal-connection';

@observer
export default class App extends Component {
  signalConnection = observable.box(null, { deep: true });

  get ssConnectionStatus() {
    const signalConnection = this.signalConnection.get();

    return String(signalConnection ? signalConnection.connectionStatus : '');
  }

  get userId() {
    const signalConnection = this.signalConnection.get();

    return String(signalConnection ? signalConnection.userId : '');
  }

  componentDidMount() {
    this.signalConnection.set(new IOSignalConnection());
  }

  render() {
    return (
      <ScrollView>
        <Text>Signal server connection status: {this.ssConnectionStatus}</Text>
        <Text>UserId:</Text>
        <TextInput value={this.userId} multiline={false} />
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
