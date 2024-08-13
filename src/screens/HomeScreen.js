import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, Platform, TouchableOpacity } from 'react-native';
import { check, request, PERMISSIONS } from 'react-native-permissions';
import SmsListener from 'react-native-android-sms-listener';
import Tts from 'react-native-tts';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/HomeStyle.js';

const HomeScreen = () => {
  const [smsMessages, setSmsMessages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const requestSmsPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const receiveResult = await request(PERMISSIONS.ANDROID.RECEIVE_SMS);
        const readResult = await request(PERMISSIONS.ANDROID.READ_SMS);

        if (receiveResult === 'granted' && readResult === 'granted') {
          console.log('You can receive and read SMS');
          listenForSms();
        } else {
          Alert.alert('Permission Denied', 'SMS permissions are required to read messages.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const checkSmsPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const receiveResult = await check(PERMISSIONS.ANDROID.RECEIVE_SMS);
        const readResult = await check(PERMISSIONS.ANDROID.READ_SMS);

        if (receiveResult === 'granted' && readResult === 'granted') {
          console.log('SMS permissions are already granted');
          listenForSms();
        } else {
          await requestSmsPermissions();
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const listenForSms = () => {
    SmsListener.addListener((message) => {
      console.log('Received message:', message);
      if (/.*(A\/c|withdrawal|credited|transfer|Cyber).*/.test(message.body)) {
        setSmsMessages((prevMessages) => [
          ...prevMessages,
          {
            address: message.originatingAddress,
            body: message.body,
            date: new Date(),
          },
        ]);

        Tts.speak(message.body, {
          androidParams: {
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });

        setIsPlaying(true);
      }
    });
  };

  const stopTts = () => {
    Tts.stop();
    setIsPlaying(false);
  };

  const resumeTts = () => {
    if (smsMessages.length > 0) {
      Tts.speak(smsMessages[smsMessages.length - 1].body, {
        androidParams: {
          KEY_PARAM_STREAM: 'STREAM_MUSIC',
        },
      });
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    Tts.setDefaultRate(0.5);
    Tts.setDefaultPitch(1.0);
    Tts.setDucking(true);

    checkSmsPermissions();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Transaction</Text>
      {smsMessages.length > 0 ? (
        smsMessages.map((sms, index) => (
          <View key={index} style={styles.smsContainer}>
            <Text style={styles.smsText}>From: {sms.address}</Text>
            <Text style={styles.smsText}>Message: {sms.body}</Text>
            <Text style={styles.smsText}>Date: {sms.date.toLocaleString()}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noSmsText}>No bank transaction SMS messages found.</Text>
      )}
      <TouchableOpacity
        style={styles.stopButton}
        onPress={isPlaying ? stopTts : resumeTts}
      >
        <Icon name={isPlaying ? "stop" : "play"} size={20} color="#fff" />
        <Text style={styles.stopButtonText}>
          {isPlaying ? " Stop" : " Play"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default HomeScreen;
