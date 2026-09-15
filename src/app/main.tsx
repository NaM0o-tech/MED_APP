//import { router } from 'expo-router';
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
//import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import {
  cancelMedicineNotification,
  registerForNotificationsAsync,
  scheduleMedicineNotification,
} from "../utils/notifications";

type Medicine = {
  id: string;
  name: string;
  amount: string;
  time: string;
  day: string;
  checked: boolean;
  notificationId?: string;
};

export default function main() {
  const [name, Setname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [page, setpage] = useState("home");

  const [expage, setexpage] = useState("");
  const [editingMedId, setEditingMedId] = useState<string | null>(null);

  const [time, settime] = useState(new Date());
  const [period, setperiod] = useState("");

  /*MED VAR*/
  const [medname, setmedname] = useState("");
  const [medamount, setmedamount] = useState("");
  const [meddate, setmeddate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [medtime, setmedtime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [defaultPickerDate] = useState(() => new Date());

  const combineDateTime = (date: Date, time: Date): Date => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  let gender_thai = gender === "male" ? "ชาย" : "หญิง";

  const saveProfile = async (data: any) => {
    await AsyncStorage.setItem("userProfile", JSON.stringify(data));
  };

  const saveMedicines = async (data: Medicine[]) => {
    await AsyncStorage.setItem("medicines", JSON.stringify(data));
  };

  const change_page = (newpage: string) => {
    setpage(newpage);
    saveProfile({ name, age, gender, page: newpage, period });
  };

  useEffect(() => {
    loadProfile();
    loadMedicines();
    registerForNotificationsAsync();
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
      setpage(profile.page || "home");
      setperiod(profile.period);
    }
  };

  const loadMedicines = async () => {
    const saved = await AsyncStorage.getItem("medicines");
    if (saved) {
      setMedicines(JSON.parse(saved));
    }
  };

  const profileImages = {
    male: require("../../assets/images/userblue.png"),
    female: require("../../assets/images/userpink.png"),
  };

  const modifyProfile = () => {
    router.push("/account?mode=edit");
  };

  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const addMedicine = (newmed: Omit<Medicine, "id" | "checked">) => {
    const medicine: Medicine = {
      ...newmed,
      id: Date.now().toString(),
      checked: false,
    };
    setMedicines((prev) => {
      const updated = [...prev, medicine];
      saveMedicines(updated); // save ทันทีหลังเพิ่ม
      return updated;
    });
  };

  const toggleCheck = (id: string) => {
    setMedicines((prev) => {
      const updated = prev.map((med) =>
        med.id === id ? { ...med, checked: !med.checked } : med,
      );
      saveMedicines(updated); // save ทันทีหลัง toggle
      return updated;
    });
  };

  const saveMedicine = async () => {
    if (medname.trim() === "") {
      alert("กรุณากรอกชื่อยา");
      return;
    }

    if (medname.length >= 20) {
      alert("กรุณากรอกชื่อยาไม่เกิน 20 ตัวอักษร");
      return;
    }

    // เช็คว่ากรอกจำนวนหรือยัง และต้องเป็นตัวเลข
    if (medamount.trim() === "" || isNaN(Number(medamount))) {
      alert("กรุณากรอกจำนวนยาเป็นตัวเลข");
      return;
    }

    if (Number(medamount) <= 0 || Number(medamount) > 100) {
      alert("กรุณากรอกจำนวนยาที่ถูกต้อง");
      return;
    }

    if (meddate === null) {
      alert("กรุณากรอกวันที่");
      return;
    }

    if (medtime === null) {
      alert("กรุณาเลือกเวลา");
      return;
    }

    const selectedDateTime = combineDateTime(meddate, medtime);
    const now = new Date();

    if (selectedDateTime < now) {
      alert("กรุณาเลือกวันที่และเวลาที่ยังไม่ผ่านไป");
      return;
    }

    const notificationId = await scheduleMedicineNotification(
      medname,
      medamount,
      selectedDateTime,
    );

    addMedicine({
      name: medname,
      amount: medamount,
      time: medtime.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      day: meddate.toLocaleDateString("th-TH", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      notificationId,
    });

    setmedname("");
    setmedamount("");
    setexpage("");
    setmeddate(null);
    setmedtime(null);
  };

  const clearAllMedicines = async () => {
    await Promise.all(
      medicines.map((med) => cancelMedicineNotification(med.notificationId)),
    );

    setMedicines([]);
    await AsyncStorage.removeItem("medicines");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {expage === "addmed" /*addmed*/ && (
        <>
          <View style={styles.blackcon}>
            <View style={styles.concard}>
              <TouchableOpacity
                style={styles.closecon}
                onPress={() => {
                  setexpage("");
                }}
              >
                <Image
                  style={styles.medboxiconimg}
                  source={require("../../assets/images/close.png")}
                ></Image>
              </TouchableOpacity>

              <Text style={styles.conaddmedtext}>เพิ่มยา 💊✨</Text>

              <Text style={styles.conlabel}>ชื่อยา</Text>
              <TextInput
                style={styles.coninput}
                value={medname}
                onChangeText={setmedname}
                placeholder="กรอกชื่อยา"
              />

              <Text style={styles.conlabel}>จำนวนยาที่ทาน</Text>
              <TextInput
                style={styles.coninput}
                value={medamount}
                onChangeText={(text) =>
                  setmedamount(text.replace(/[^0-9]/g, ""))
                }
                placeholder="กรอกจำนวนยา"
                keyboardType="numeric"
              />
              <Text style={styles.conlabel}>วันที่ทานยา</Text>
              <TouchableOpacity
                style={styles.coninput}
                onPress={() => {
                  setShowDatePicker(true);
                }}
              >
                <Text>
                  {meddate
                    ? meddate.toLocaleDateString("th-TH", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "แตะเพื่อเลือกวันที่"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={meddate ?? defaultPickerDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setmeddate(selectedDate);
                  }}
                />
              )}

              <Text style={styles.conlabel}>เวลาทานยา</Text>
              <TouchableOpacity
                style={styles.coninput}
                onPress={() => setShowTimePicker(true)}
              >
                <Text>
                  {medtime
                    ? medtime.toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "แตะเพื่อเลือกเวลา"}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={medtime ?? defaultPickerDate}
                  mode="time"
                  display="default"
                  is24Hour={true}
                  onChange={(event, selectedTime) => {
                    setShowTimePicker(false);
                    if (selectedTime) setmedtime(selectedTime);
                  }}
                />
              )}

              <TouchableOpacity
                style={styles.medsavebut}
                onPress={saveMedicine}
              >
                <Text style={styles.medsavebuttext}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {expage === "delmed" && (
        <>
          <View style={styles.blackcon}>
            <View style={styles.concard}>
              <TouchableOpacity
                style={styles.closecon}
                onPress={() => {
                  setexpage("");
                }}
              >
                <Image
                  style={styles.medboxiconimg}
                  source={require("../../assets/images/close.png")}
                ></Image>
              </TouchableOpacity>

              <Text style={styles.areyousure}>คุณแน่ใจหรือไม่?</Text>

              <TouchableOpacity
                style={styles.conbut}
                onPress={() => {
                  setexpage("");
                }}
              >
                <Text style={styles.conbuttext}>ไม่</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.conbut}
                onPress={() => {
                  clearAllMedicines();
                  setexpage("");
                }}
              >
                <Text style={styles.conbuttext}>ใช่</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>TIME MED</Text>
        <Image
          style={styles.ppkimg}
          source={require("../../assets/expo.icon/Assets/ppk.png")}
        />

        <TouchableOpacity
          style={styles.goback}
          onPress={() => {
            router.push("/");
          }}
        >
          <Image
            style={styles.medboxiconimg}
            source={require("../../assets/images/back.png")}
          ></Image>
        </TouchableOpacity>

        <View style={styles.page}>
          {page === "home" && (
            <>
              <Text style={styles.pageText}>{period}</Text>

              <View style={styles.medsign}>
                <Text style={styles.medsigntext}>ตารางยา 💊</Text>
              </View>

              <ScrollView
                style={styles.medmanage}
                contentContainerStyle={styles.medmanagecontent}
              >
                {medicines.length === 0 ? (
                  <Text style={styles.noyet}>ยังไม่มีรายการยา</Text>
                ) : (
                  medicines.map((med) => (
                    <View key={med.id} style={styles.medbox}>
                      <Text style={styles.medboxname}>{med.name}</Text>
                      <Text style={styles.medboxamount}>
                        ทาน {med.amount} เม็ด
                      </Text>
                      <Text style={styles.medboxtime}>เวลา {med.time} น.</Text>
                      <Text style={styles.medboxday}>วันที่ {med.day}</Text>

                      <TouchableOpacity style={styles.medconfigbut}>
                        <Image
                          style={styles.medboxiconimg}
                          source={require("../../assets/images/setting.png")}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={
                          med.checked
                            ? styles.medcheckbut
                            : styles.medcheckundone
                        }
                        onPress={() => toggleCheck(med.id)}
                      >
                        <Image
                          style={styles.medboxiconimg}
                          source={require("../../assets/images/check-mark.png")}
                        />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.addmed}
                onPress={() => {
                  setEditingMedId(null);
                  setexpage("addmed");
                }}
              >
                <Text style={styles.addmedtext}>+ เพิ่มยา</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.delmed}
                onPress={() => {
                  setEditingMedId(null);
                  setexpage("delmed");
                }}
              >
                <Text style={styles.delmedtext}>ลบยาทั้งหมด</Text>
              </TouchableOpacity>
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

                <Text style={styles.forage}>-อายุ {age} ปี</Text>
                <Text style={styles.forgender}>-เพศ{gender_thai}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.pagechange}>
          <TouchableOpacity
            style={page === "home" ? styles.pagebutselected : styles.pagebut}
            onPress={() => change_page("home")}
          >
            <Image
              style={styles.pageimg}
              source={require("../../assets/images/home.png")}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={page === "profile" ? styles.pagebutselected : styles.pagebut}
            onPress={() => change_page("profile")}
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
    left: 128,
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
    right: 85,
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

  forage: {
    color: "#000",
    fontWeight: 600,
    fontSize: 20,

    position: "absolute",
    left: 10,
    top: 70,
  },
  forgender: {
    color: "#000",
    fontWeight: 600,
    fontSize: 20,

    position: "absolute",
    left: 10,
    top: 100,
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
    marginLeft: 130,
  },

  medsign: {
    borderWidth: 1,
    color: "#000000",
    backgroundColor: "#ffeec1",
    width: 180,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    zIndex: 20,

    position: "absolute",
    top: 40,
    left: 20,
  },
  medsigntext: {
    color: "#6e512b",
    fontSize: 20,
    fontWeight: 600,
  },

  medmanage: {
    width: "112%",
    height: "60%",
    fontWeight: "bold",
    borderWidth: 1,
    color: "#000000",
    backgroundColor: "#fffedf",
    zIndex: 15,

    position: "absolute",
    top: 70,

    padding: 15,
    paddingTop: 30,
  },

  medmanagecontent: {
    paddingBottom: 20,
  },

  medbox: {
    width: "90%",
    height: 90,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,

    marginBottom: 10,
  },

  medboxname: {
    color: "#000",
    fontSize: 18,
    fontWeight: 600,

    position: "absolute",
    left: 25,
    top: 5,
  },
  medboxamount: {
    color: "#000",
    fontSize: 18,
    fontWeight: 600,

    position: "absolute",
    right: 10,
    top: 5,
  },
  medboxtime: {
    color: "#00000086",
    fontSize: 13,
    fontWeight: 600,

    position: "absolute",
    left: 25,
    top: 25,
  },
  medboxday: {
    color: "#0000009f",
    fontSize: 10,
    fontWeight: 600,

    position: "absolute",
    left: 25,
    bottom: 5,
  },

  medconfigbut: {
    width: 40,
    height: 40,
    backgroundColor: "#c5c5c5",
    borderWidth: 1.5,
    borderColor: "#8a8989",
    borderRadius: 8,

    position: "absolute",
    right: 60,
    bottom: 10,

    justifyContent: "center",
    alignItems: "center",
  },

  medcheckbut: {
    width: 40,
    height: 40,
    backgroundColor: "#baffb4",
    borderWidth: 1.5,
    borderColor: "#3f8636",
    borderRadius: 8,

    position: "absolute",
    right: 10,
    bottom: 10,

    justifyContent: "center",
    alignItems: "center",
  },

  medcheckundone: {
    width: 40,
    height: 40,
    backgroundColor: "#bfc0bf",
    borderWidth: 1.5,
    borderColor: "#9c9c9c",
    borderRadius: 8,

    position: "absolute",
    right: 10,
    bottom: 10,

    justifyContent: "center",
    alignItems: "center",
  },

  medboxiconimg: {
    width: 30,
    height: 30,
  },

  noyet: {
    color: "#beae82",
    fontSize: 15,
    fontWeight: 600,
    position: "absolute",
    left: 120,
    top: 120,
  },

  addmed: {
    width: 180,
    height: 60,
    backgroundColor: "#d5ffb2",

    borderWidth: 2,
    borderColor: "#80aa73",

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    left: 20,
    bottom: 100,
  },
  addmedtext: {
    color: "#5a7747",
    fontSize: 20,
    fontWeight: 500,
  },

  blackcon: {
    width: "111%",
    height: "100%",
    backgroundColor: "#00000070",
    zIndex: 30,

    justifyContent: "center",
    alignItems: "center",
  },

  concard: {
    zIndex: 35,
    width: 350,
    height: 400,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#000",

    borderRadius: 15,

    marginRight: "11%",

    padding: 20,
    paddingTop: 35,
  },

  closecon: {
    width: 40,
    height: 40,
    backgroundColor: "#ffe8e8",
    borderWidth: 1.5,
    borderColor: "#833939",
    borderRadius: 8,

    position: "absolute",
    right: 10,
    top: 10,

    justifyContent: "center",
    alignItems: "center",
  },

  conaddmedtext: {
    color: "#000",
    fontSize: 25,
    fontWeight: 600,

    position: "absolute",
    top: 10,
    left: 100,
  },

  conlabel: {
    fontSize: 18,
    marginBottom: 4,
    marginTop: 12,
    alignSelf: "flex-start",
  },

  coninput: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 4,
    fontSize: 16,
  },

  medsavebut: {
    width: 80,
    height: 40,
    backgroundColor: "#d5ffb2",

    borderWidth: 2,
    borderColor: "#80aa73",

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    right: 10,
    bottom: 10,
  },

  medsavebuttext: {
    color: "#5a7747",
    fontSize: 14,
    fontWeight: 600,
  },

  delmed: {
    width: 120,
    height: 50,
    backgroundColor: "#ffb2b2",

    borderWidth: 2,
    borderColor: "#aa7373",

    borderRadius: 10,

    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    left: 20,
    bottom: 40,
  },
  delmedtext: {
    color: "#6b3737",
    fontSize: 15,
    fontWeight: 500,
  },

  areyousure: {
    color: "#000",
    fontSize: 20,
    fontWeight: 600,
    position: "absolute",
    top: 20,
    left: 20,
  },

  conbut: {
    width: 100,
    height: 80,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,

    padding: 15,
    marginBottom: 10,
    marginTop: 20,

    justifyContent: "center",
    alignItems: "center",
  },

  conbuttext: {
    color: "#000",
    fontSize: 15,
  },

  goback: {
    backgroundColor: "#a3a3a365",
    borderWidth: 1,
    borderColor: "#5e5c5c65",
    paddingVertical: 0,
    width: 60,
    paddingBlock: 5,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: "center",
    alignItems: "center",
    position: "absolute",
    left: 5,
    top: 1,
  },
});
