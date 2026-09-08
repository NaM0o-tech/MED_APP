//import { router } from 'expo-router';
//import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';

export default function account() {

  return (
    <View style={styles.card}>
          <Text style={styles.title}>TIME MED</Text>
          <Image style={styles.ppkimg} source={require('../../assets/expo.icon/Assets/ppk.png')} />
          <Text style={styles.des}>แอปพลิเคชั่นแจ้งเตือนการกินยา</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#e3efff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    },
    title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#f6c8ff',
    marginBottom: 0,
    textAlign: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    width: '100%',
    height: '90%', 
    bottom:'5%',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow สำหรับ iOS/Android
    elevation: 12,
    shadowColor: '#ff0bb6',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'black',
    textAlign: 'center',
    zIndex: 1,
    position: 'absolute',
  },
  welcome: {
    position: 'absolute',
    backgroundColor: '#f6daff',
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: 'solid',
    borderColor: 'black',
    textAlign: 'center',
    width: '45%',
    paddingVertical: 8,
    top: 225,

    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  textwelcome: {
    fontSize: 20,
    fontWeight: '800',
  },
  ppkimg: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 18,
    left: 145,
    zIndex: 15,
    elevation: 50,
    shadowColor: '#ff0bb6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    transform: [{ rotate: '0deg' }]
  },
  des: {
    position: 'absolute',
    top: 60,
    left:25,
    fontSize: 13,
    color: '#8d8d8d'
  },

})