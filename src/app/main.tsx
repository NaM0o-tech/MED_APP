//import { router } from 'expo-router';
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
//import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function account() {
  const [name, Setname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [page, setpage] = useState("home");

  const [time, settime] = useState(new Date());
  const [period, setperiod] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const timeinterval = setInterval(() => {
      settime(new Date());

      if (time.getHours() >= 6 && time.getHours() < 12) {
        setperiod("สวัสดีตอนเช้า 🌄");
      } else if (time.getHours() >= 12 && time.getHours() < 18) {
        setperiod("สวัสดีตอนบ่าย ☀️");
      } else if (time.getHours() >= 18 && time.getHours() < 24) {
        setperiod("สวัสดีตอนเย็น 🌙");
      }
    }, 1000);

    return () => clearInterval(timeinterval);
  }, []);

  const loadProfile = async () => {
    const saved = await AsyncStorage.getItem("userProfile");
    if (saved) {
      const profile = JSON.parse(saved);
      Setname(profile.name);
      setAge(profile.age);
      setGender(profile.gender);
      setpage(page);
      setperiod(profile.period);
    }
  };

  const profileImages = {
    male: require("../../assets/images/userblue.png"),
    female: require("../../assets/images/userpink.png"),
  };

  const modifyProfile = () => {
    router.push("/account?mode=edit");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.card}>
        <Text style={styles.title}>TIME MED</Text>
        <Image
          style={styles.ppkimg}
          source={require("../../assets/expo.icon/Assets/ppk.png")}
        />

        <View style={styles.page}>
          {page === "home" && (
            <>
              <Text style={styles.pageText}>{period}</Text>
              <View></View>
            </>
          )}
          {page === "profile" && (
            <>
              <Text style={styles.pageText}>หน้าโปรไฟล์ 👥</Text>
              <View style={styles.profilecard}>
                <Image
                  style={styles.profilepic}
                  source={profileImages[gender as "male" | "female"]}
                />
                <Text style={styles.textpro}>ข้อมูลของคุณ</Text>
                <Text style={styles.textname}>{name}</Text>

                <TouchableOpacity
                  style={styles.modifyproButton}
                  onPress={modifyProfile}
                  activeOpacity={0.4}
                >
                  <Text style={styles.modifyproButtonText}>แก้ไขข้อมูล</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={styles.pagechange}>
          <TouchableOpacity
            style={page === "home" ? styles.pagebutselected : styles.pagebut}
            onPress={() => setpage("home")}
          >
            <Image
              style={styles.pageimg}
              source={require("../../assets/images/home.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={page === "profile" ? styles.pagebutselected : styles.pagebut}
            onPress={() => setpage("profile")}
          >
            <Image
              style={styles.pageimg}
              source={require("../../assets/images/account.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4c7ff",
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#eba0fa",
    marginBottom: 0,
    textAlign: "center",
    position: "absolute",
    top: 20,
    left: 20,
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    height: "90%",
    bottom: "5%",
    alignItems: "center",
    justifyContent: "flex-start",
    // Shadow สำหรับ iOS/Android
    elevation: 12,
    shadowColor: "#ff0bb6",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: "black",
    textAlign: "center",
    zIndex: 1,
    position: "absolute",
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

  ppkimg: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 18,
    left: 145,
    zIndex: 15,
    elevation: 50,
    shadowColor: "#ff0bb6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    transform: [{ rotate: "0deg" }],
  },
  profilecard: {
    backgroundColor: "#f8fcff",
    padding: 30,
    borderRadius: 20,
    width: "95%",
    height: "10%",
    borderWidth: 0.5,
    borderColor: "black",

    position: "absolute",
    top: 35,
    left: 10,
    zIndex: 10,

    paddingBlock: 20,

    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  profilepic: {
    width: 55,
    height: 55,
    zIndex: 15,
    elevation: 50,
    shadowColor: "#292528",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,

    alignSelf: "center",
    position: "absolute",
    left: 10,
  },
  textpro: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0c0c0c7a",

    position: "absolute",
    left: 70,
    top: 5,
  },
  textname: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0c0c0c",
    position: "absolute",
    left: 70,
    top: 25,
  },
  modifyproButton: {
    backgroundColor: "#c5c4c4",
    borderWidth: 1,
    borderColor: "#a3a3a3",
    paddingVertical: 0,
    width: 80,
    paddingBlock: 5,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 5,
  },
  modifyproButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0c0c0c",
  },

  pagechange: {
    backgroundColor: "#fff9ff",
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 8,
    width: 220,
    height: 60,
    borderRadius: 50,

    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  pageimg: {
    width: 25,
    height: 25,
  },
  pagebut: {
    width: 60,
    height: 40,
    borderWidth: 0.5,
    borderColor: "#48254c",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  pagebutselected: {
    width: 65,
    height: 45,
    borderWidth: 0.5,
    borderColor: "#76267d",
    backgroundColor: "#edc6ff",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    width: "112%",
    height: "85%",
    borderWidth: 0,
    borderColor: "#00000055",
    borderRadius: 15,
    zIndex: 5,
    position: "absolute",
    top: 65,
  },
  pageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0c0c0c",
    marginLeft: 25,
  },
});
