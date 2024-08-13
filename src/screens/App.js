import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackgroundService from 'react-native-background-actions'; 
import HomeScreen from './HomeScreen';
import SettingScreen from './SettingScreen';
import SmsListener from 'react-native-android-sms-listener';
import Tts from 'react-native-tts';

const Tab = createMaterialBottomTabNavigator();

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments) => {
    const { delay } = taskDataArguments;

    await new Promise(async (resolve) => {
        Tts.setDefaultRate(0.5);
        Tts.setDefaultPitch(1.0);
        Tts.setDucking(true);

        const smsSubscription = SmsListener.addListener((message) => {
            console.log('Received message:', message);
            if (/.*(A\/c|withdrawal|credited|transfer|Cyber).*/.test(message.body)) {
                Tts.speak(message.body, {
                    androidParams: {
                        KEY_PARAM_STREAM: 'STREAM_MUSIC',
                    },
                });
            }
        });
        
        while (BackgroundService.isRunning()) {
            console.log('Background task running...');
            await sleep(delay);
        }
        
        smsSubscription.remove();
        resolve();
    });
};

const options = {
    taskName: 'SMS Monitoring',
    taskTitle: 'Monitoring SMS',
    taskDesc: 'Listening for SMS messages in the background',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#3D8320',
    parameters: {
        delay: 1000,
    },
    allowedInForeground: true,
    stopWithTerminate: false,
    startOnBoot: true,
};

function MyTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="black"
            inactiveColor="white"
            barStyle={{ backgroundColor: '#3D8320' }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarIcon: ({ color }) => (
                        <Icon name="cog" color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    useEffect(() => {
        BackgroundService.start(veryIntensiveTask, options)
            .then(() => console.log('Background service started'))
            .catch(err => console.log('Error starting background service:', err));

        return () => {
            BackgroundService.stop()
                .then(() => console.log('Background service stopped'))
                .catch(err => console.log('Error stopping background service:', err));
        };
    }, []);

    return (
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    );
}

