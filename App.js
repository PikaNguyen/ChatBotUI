import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ChatBot from './Chatbot';

export default function App() {
  return (
    <View style={styles.container}>
      <ChatBot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});