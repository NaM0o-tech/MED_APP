import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
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
  amount: string,
  dateTime: Date,
) {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "ถึงเวลาทานยาแล้ว 💊",
      body: `ทาน ${name} จำนวน ${amount} เม็ด`,
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dateTime,
    },
  });

  return id;
}

export async function cancelMedicineNotification(notificationId?: string) {
  if (!notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
