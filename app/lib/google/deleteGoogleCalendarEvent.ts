export const deleteGoogleCalendarEvent = async (
  accessToken: string,
  eventId: string
) => {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    console.error("削除エラー", errorText);
    throw new Error("予定の削除に失敗しました");
  }
};
