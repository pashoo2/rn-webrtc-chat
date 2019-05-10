import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import IOSignalConnection from './utils/webrtc/io-signal-connection';

@observer
export default class App extends Component {
  @observable.box signalConnection = null;

  get ssConnectionStatus() {
    return String(
      this.signalConnection ? this.signalConnection.connectionStatus : ''
    );
  }

  componentDidMount() {
    this.signalConnection = new IOSignalConnection();
  }

  render() {
    return (
      <ScrollView>
        <Text>{this.ssConnectionStatus()}</Text>
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
