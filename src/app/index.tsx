import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  //hello this med app

  //"hello my shella sigma toilet"

  const [message, setmessage] = useState("เริ่มต้นการใช้งาน");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>TIME MED</Text>

      <View style={styles.welcome}>
        <Text style={styles.textwelcome}>ยินดีต้อนรับ!</Text>
      </View>

      <Image
        style={styles.ppkimg}
        source={require("../../assets/expo.icon/Assets/ppk.png")}
      />

      <View style={styles.card}>
        <Text style={styles.subtitle}>แอปพลิเคชั่นแจ้งเตือนการกินยา</Text>

        <Image
          style={styles.iconimg}
          source={require("../../assets/expo.icon/Assets/time_med.png")}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.4}
          onPress={() => router.push("/account")}
        >
          <Text style={styles.buttonText}>{message}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  //STYLE IMPORTANT*************
  container: {
    flex: 1,
    backgroundColor: "#e3efff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    width: "88%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    // Shadow สำหรับ iOS/Android
    elevation: 12,
    shadowColor: "#ff0bb6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: "black",
    textAlign: "center",
    zIndex: 1,
    position: "absolute",
    bottom: 130,
  },
  title: {
    fontSize: 71,
    fontWeight: "bold",
    color: "#f6c8ff",
    marginBottom: 0,
    textAlign: "center",
    position: "absolute",
    top: 80,
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#313133",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
    position: "absolute",
    top: 50,
  },
  button: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#ffff95",
    paddingVertical: 12,
    width: "75%",
    borderRadius: 50,
    borderWidth: 0.8,
    borderStyle: "solid",
    borderColor: "black",
    textAlign: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  welcome: {
    position: "absolute",
    backgroundColor: "#f6daff",
    borderRadius: 10,
    borderWidth: 0.8,
    borderStyle: "solid",
    borderColor: "black",
    textAlign: "center",
    width: "45%",
    paddingVertical: 8,
    top: 225,

    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  textwelcome: {
    fontSize: 20,
    fontWeight: "800",
  },

  iconimg: {
    width: 280,
    height: 280,
    position: "absolute",
    top: 70,
  },

  ppkimg: {
    width: 100,
    height: 100,
    position: "absolute",
    top: 190,
    right: 5,
    zIndex: 15,
    elevation: 50,
    shadowColor: "#ff0bb6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    transform: [{ rotate: "8deg" }],
  },
});
