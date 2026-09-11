export type TCreateNotificationPayload = {
  userId: string;
  title: string;
  message: string;
};

export type TNotificationListQuery = {
  page?: string;
  limit?: string;
  isRead?: string;
};
