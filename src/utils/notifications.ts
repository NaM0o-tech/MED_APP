import { Platform } from "react-native";

const NOTIFICATION_ENABLE = true; // ต้องตรงกับค่าใน main.tsx

const CHANNEL_ID = "med";
const SOUND = "med_alert.wav";

// โหลด expo-notifications เฉพาะตอนเปิดใช้งานเท่านั้น
// (กัน error บน Expo Go ที่ SDK 53+ ไม่รองรับ push notification)
let Notifications: typeof import("expo-notifications") | null = null;

const REPEAT_MINUTES = [0, 5, 10, 15, 20, 25];

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
  date: Date,
): Promise<string[]> {
  if (!NOTIFICATION_ENABLE || !Notifications) return [];

  const ids: string[] = [];

  for (let i = 0; i < REPEAT_MINUTES.length; i++) {
    const when = new Date(date.getTime() + REPEAT_MINUTES[i] * 60 * 1000);

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title:
          i === 0
            ? "ถึงเวลาทานยา 💊"
            : `อย่าลืมทานยา 💊 (เตือนซ้ำครั้งที่ ${i}) ⏰`,
        body: `${name} (${type}) จำนวน ${amount} เม็ด`,
        sound: SOUND,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: when,
        channelId: CHANNEL_ID,
      },
    });
    ids.push(id);
  }

  return ids;
}

export async function cancelMedicineNotification(
  notificationIds?: string | string[],
) {
  if (!NOTIFICATION_ENABLE || !Notifications || !notificationIds) return;

  const list = Array.isArray(notificationIds)
    ? notificationIds
    : [notificationIds];

  await Promise.all(
    list.map((id) => Notifications!.cancelScheduledNotificationAsync(id)),
  );
}
