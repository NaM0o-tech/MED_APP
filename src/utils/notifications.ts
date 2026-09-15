import * as Notifications from "expo-notifications";

const NOTIFICATION_ENABLE = false; // ต้องตรงกับค่าใน main.tsx

if (NOTIFICATION_ENABLE) {
  Notifications.setNotificationHandler({
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
  if (!NOTIFICATION_ENABLE) return false;
  // ...โค้ดเดิมข้างล่างเหมือนเดิม
}

export async function scheduleMedicineNotification(
  name: string,
  amount: string,
  dateTime: Date,
) {
  if (!NOTIFICATION_ENABLE) return undefined;
  // ...โค้ดเดิมข้างล่างเหมือนเดิม
}

export async function cancelMedicineNotification(notificationId?: string) {
  if (!NOTIFICATION_ENABLE || !notificationId) return;
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
