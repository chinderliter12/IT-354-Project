const { google } = require('googleapis');

// oauth client setup
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT
);

// refresh token auth
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// convert date + time → valid ISO string
function toDateTime(date, time) {
  const [hour, minute] = time.split(':');

  const d = new Date(date);
  d.setHours(Number(hour), Number(minute), 0, 0);

  return d.toISOString();
}

// create calendar event
async function createCalendarEvent({ course, date, startTime, endTime, studentEmail, tutorEmail }) {
  const event = {
    summary: `Tutoring: ${course}`,
    description: 'tutoring session',
    start: {
      dateTime: toDateTime(date, startTime),
      timeZone: 'America/Chicago'
    },
    end: {
      dateTime: toDateTime(date, endTime),
      timeZone: 'America/Chicago'
    },
    attendees: [
      { email: studentEmail },
      { email: tutorEmail }
    ]
  };

  return await calendar.events.insert({
    calendarId: 'primary',
    resource: event
  });
}

module.exports = {
  createCalendarEvent
};