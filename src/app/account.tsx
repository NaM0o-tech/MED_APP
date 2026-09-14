import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function account() {
  const [name, Setname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  let welcome = "เข้าใช้งาน";
  let time_med = "TIME MED";

  const { mode } = useLocalSearchParams();
  if (mode === "edit") {
    welcome = "แก้ไขข้อมูล";
    time_med = "";
  }

  const isFormComplete =
    name.trim() !== "" && age.trim() !== "" && gender !== "";

  const clearProfile = async () => {
    await AsyncStorage.removeItem("userProfile");
    Setname("");
    setAge("");
    setGender("");
  };

  useEffect(() => {
    loadprofile();
    router.prefetch("/main");
  }, []);

  const loadprofile = async () => {
    const saved = await AsyncStorage.getItem("userProfile");
    if (saved) {
      const profile = JSON.parse(saved);
      Setname(profile.name);
      setAge(profile.age);
      setGender(profile.gender);

      if (mode !== "edit") {
        router.push("/main");
      }
    }
  };

  const saved_profile = async () => {
    // เช็คว่ากรอกชื่อหรือยัง
    if (name.trim() === "") {
      alert("กรุณากรอกชื่อ");
      return;
    }

    if (name.length >= 15) {
      alert("กรุณากรอกชื่อไม่เกิน 15 ตัวอักษร");
      return;
    }

    // เช็คว่ากรอกอายุหรือยัง และต้องเป็นตัวเลข
    if (age.trim() === "" || isNaN(Number(age))) {
      alert("กรุณากรอกอายุเป็นตัวเลข");
      return;
    }

    // เช็คว่าเลือกเพศหรือยัง
    if (gender === "") {
      alert("กรุณาเลือกเพศ");
      return;
    }

    // เช็คช่วงอายุที่สมเหตุสมผล (ถ้าอยากเข้มงวดขึ้น)
    if (Number(age) <= 0 || Number(age) > 120) {
      alert("กรุณากรอกอายุที่ถูกต้อง");
      return;
    }

    const existing = await AsyncStorage.getItem("userProfile"); //หาโปรไฟล์ทียังมีอยู่
    const existingProfile = existing ? JSON.parse(existing) : {}; //ไปใส่ object ทับมา

    const profile = { ...existingProfile, name, age, gender }; //ตั้งทับโปรไฟล์ใหม่ไม่ยุ่งกับ ค่าที่มีอยู่
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile)); //แปลงเป็น string ได้ข้อมุลมาเป็น {}

    router.push("/main");

    alert("บันทึกข้อมูลเรียบร้อยแล้ว");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.title}>{time_med}</Text>

      <View style={styles.welcome}>
        <Text style={styles.textwelcome}>{welcome}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.des}>กรุณากรอกข้อมูลส่วนตัว</Text>

        <Image
          style={styles.ppkimg}
          source={require("../../assets/images/ppk.png")}
        />

        <Text style={styles.label}>ชื่อ</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={Setname}
          placeholder="กรอกชื่อเล่น"
        />

        <Text style={styles.label}>อายุ</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
          placeholder="กรอกอายุ"
          keyboardType="numeric"
        />

        <Text style={styles.label}>เพศ</Text>
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "male" && styles.genderSelected,
            ]}
            onPress={() => setGender("male")}
          >
            <Text>ชาย</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.genderButton,
              gender === "female" && styles.genderSelected,
            ]}
            onPress={() => setGender("female")}
          >
            <Text>หญิง</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.savedbutton,
            isFormComplete && styles.savedbuttonActive,
          ]}
          activeOpacity={0.4}
          onPress={saved_profile}
        >
          <Text
            style={[styles.savedtext, isFormComplete && styles.savetextActive]}
          >
            บันทึกข้อมูล
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3efff",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center", // การ์ดยังอยู่กึ่งกลางแนวนอนของจอ
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#f6c8ff",
    textAlign: "center",
    marginBottom: 25,
    textShadowColor: "#000000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  textwelcome: {
    fontSize: 20,
    fontWeight: "800",
  },
  ppkimg: {
    width: 70,
    height: 70,
    position: "absolute",
    top: 14,
    right: 12,
    zIndex: 15,
    elevation: 50,
    shadowColor: "#ff0bb6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    transform: [{ rotate: "8deg" }],
  },
  welcome: {
    backgroundColor: "#f6daff",
    borderRadius: 10,
    borderWidth: 0.8,
    borderColor: "black",
    width: "45%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",

    position: "absolute",
    top: 195,
    left: 40,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    width: "88%",
    elevation: 12,
    shadowColor: "#ff0bb6",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderColor: "black",

    position: "absolute",
    top: "30%",
    left: "6%",
  },
  des: {
    color: "#8d8d8d",
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    marginLeft: 45,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 12,
    alignSelf: "flex-start", // label ชิดซ้าย
  },
  input: {
    width: "100%", // input เต็มความกว้างการ์ด
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  genderRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%", // แถวปุ่มเพศเต็มความกว้าง
  },
  genderButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  genderSelected: {
    backgroundColor: "#e3efff",
    borderColor: "#378ADD",
  },
  savedbutton: {
    backgroundColor: "#c5c4c4",
    borderWidth: 1,
    borderColor: "#a3a3a3",
    paddingVertical: 8,
    width: 150,
    borderRadius: 50,
    marginTop: 20,
    alignSelf: "center", // ปุ่มบันทึกอยู่กึ่งกลางการ์ด (ปรับเป็น flex-start ได้ถ้าอยากชิดซ้ายด้วย)
  },
  savedtext: {
    color: "#555555",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },

  savedbuttonActive: {
    backgroundColor: "#ffff95",
    borderWidth: 1,
    borderColor: "#000000",
    paddingVertical: 8,
    width: 150,
    borderRadius: 50,
    marginTop: 20,
    alignSelf: "center", // ปุ่มบันทึกอยู่กึ่งกลางการ์ด (ปรับเป็น flex-start ได้ถ้าอยากชิดซ้ายด้วย)
  },
  savetextActive: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "600",
  },
});
