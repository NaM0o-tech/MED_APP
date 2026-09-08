import { router } from 'expo-router';
//import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function account() {

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        style="dark"
        
      />

      <Text style={styles.title}>TIME MED</Text>

      <Image style={styles.ppkimg} source={require('../../assets/expo.icon/Assets/ppk.png')} />

      <View style={styles.welcome}>
            <Text style={styles.textwelcome}>เข้าใช้งาน</Text>
      </View>

        <View style={styles.card}>
            <Text style={styles.des}>กรุณาเข้าสู่ระบบ หรือสมัครบัญชี</Text>

            <TouchableOpacity style={styles.google} activeOpacity={0.6}>
                <Text style={styles.googletext}>เข้าสู่ระบบ google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.facebook} activeOpacity={0.6}>
                <Text style={styles.facebooktext}>เข้าสู่ระบบ Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.line} activeOpacity={0.6}>
                <Text style={styles.linetext}>เข้าสู่ระบบ Line</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skip} activeOpacity={0.4} onPress={() => router.push('./main') }>
                <Text style={styles.skiptext}>เข้าแอปในฐานะ guest</Text>
            </TouchableOpacity>
        </View>

    </SafeAreaView>
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
    fontSize: 71,
    fontWeight: 'bold',
    color: '#f6c8ff',
    marginBottom: 0,
    textAlign: 'center',
    position: 'absolute',
    top: 80,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    width: '88%',
    height: '60%', 
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow สำหรับ iOS/Android
    elevation: 12,
    shadowColor: '#ff0bb6',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderColor: 'black',
    textAlign: 'center',
    zIndex: 1,
    position: 'absolute',
    bottom: 130,
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
    width: 100,
    height: 100,
    position: 'absolute',
    top: 190,
    right: 5,
    zIndex: 15,
    elevation: 50,
    shadowColor: '#ff0bb6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    transform: [{ rotate: '8deg' }]
  },
  des: {
    position: 'absolute',
    top: 50,
    color: '#8d8d8d'
  },
  skip: {
    position: 'absolute',
    backgroundColor: '#c5c4c4',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#a3a3a3',
    paddingVertical: 8,
    width: 150,
    borderRadius: 50,
    bottom: 20,
  },
  skiptext: {
    color: '#555555',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 10,
  },
  google: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#c2c1c1',
    paddingVertical: 8,
    width: '80%',
    borderRadius: 50,
    top: 100,
  },
  googletext: {
    color: '#000000',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  facebook: {
    position: 'absolute',
    backgroundColor: '#608aff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#0632f3',
    paddingVertical: 8,
    width: '80%',
    borderRadius: 50,
    top: 150,
  },
  facebooktext: {
    color: '#fdfbfb',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  },
  line: {
    position: 'absolute',
    backgroundColor: '#7edd61',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#0d8103',
    paddingVertical: 8,
    width: '80%',
    borderRadius: 50,
    top: 200,
  },
  linetext: {
    color: '#fdfbfb',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 13,
  }

})