export const createGoogleCalendarEvent = async (
  accessToken: string,
  summary: string,
  start: Date,
  end: Date
) => {
  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary,
        start: { dateTime: start.toISOString(), timeZone: "Asia/Tokyo" },
        end: { dateTime: end.toISOString(), timeZone: "Asia/Tokyo" },
      }),
    }
  );

  if(!res.ok) {
    const error = await res.json();
    console.error("登録エラーの詳細:\n", JSON.stringify(error, null, 2));
    throw new Error("予定の登録に失敗しました")
  }
  return await res.json();
};
