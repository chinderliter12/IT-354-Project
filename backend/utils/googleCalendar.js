const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({
  version: 'v3',
  auth: oAuth2Client
});


function formatTime(time) {
  let [hour, minute] = time.split(":");

  hour = hour.padStart(2, "0"); // 9 -> 09

  return `${hour}:${minute}:00`;
}

async function createCalendarEvent({
  course,
  date,
  startTime,
  endTime,
  studentEmail,
  tutorEmail
}) {
  try {

    const startDateTime = new Date(`${date}T${formatTime(startTime)}`);
    const endDateTime = new Date(`${date}T${formatTime(endTime)}`);

    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      throw new Error("Invalid date/time format");
    }

    const event = {
      summary: `Tutoring: ${course}`,
      description: "Tutoring session",
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'America/Chicago'
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'America/Chicago'
      },
      attendees: [
        { email: studentEmail },
        { email: tutorEmail }
      ]
    };

    const result = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    console.log(" Calendar event created");

    return result;

  } catch (err) {
    console.error(" Google Calendar Error:", err.message);
  }
}

module.exports = createCalendarEvent;