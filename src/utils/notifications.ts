import { Platform } from "react-native";

const NOTIFICATION_ENABLE = true; // ต้องตรงกับค่าใน main.tsx

const CHANNEL_ID = "med";
const SOUND = "med_alert.wav";

// โหลด expo-notifications เฉพาะตอนเปิดใช้งานเท่านั้น
// (กัน error บน Expo Go ที่ SDK 53+ ไม่รองรับ push notification)
let Notifications: typeof import("expo-notifications") | null = null;

if (NOTIFICATION_ENABLE) {
  Notifications = require("expo-notifications");

  Notifications!.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function registerForNotificationsAsync() {
  if (!NOTIFICATION_ENABLE || !Notifications) return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Medicine",
      importance: Notifications.AndroidImportance.MAX,
      sound: SOUND,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("กรุณาอนุญาตการแจ้งเตือน เพื่อให้แอปเตือนเวลาทานยาได้");
    return false;
  }

  return true;
}

export async function scheduleMedicineNotification(
  name: string,
  type: string,
  amount: string,
  dateTime: Date,
) {
  if (!NOTIFICATION_ENABLE || !Notifications) return undefined;

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "ถึงเวลาทานยาแล้ว 💊",
      body: `${type} - ${name}  จำนวน ${amount} เม็ด`,
      sound: SOUND,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dateTime,
      channelId: CHANNEL_ID,
    },
  });

  return id;
}

export async function cancelMedicineNotification(notificationId?: string) {
  if (!NOTIFICATION_ENABLE || !Notifications || !notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
