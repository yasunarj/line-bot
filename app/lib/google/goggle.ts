import { google } from "googleapis";

export const getGoogleCalendarEvents = async (
  accessToken: string,
  refreshToken: string,
  timeMin: Date,
  timeMax: Date,
) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: (timeMin || new Date()).toISOString(),
    timeMax: timeMax?.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return res.data.items;
};
