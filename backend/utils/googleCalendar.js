const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

async function createEvent({ course, date, startTime, endTime, studentEmail, tutorEmail }) {

  const event = {
    summary: `Tutoring: ${course}`,
    description: "Tutoring session",
    start: {
      dateTime: new Date(`${date}T${startTime}:00`).toISOString(),
    },
    end: {
      dateTime: new Date(`${date}T${endTime}:00`).toISOString(),
    },
    attendees: [
      { email: studentEmail },
      { email: tutorEmail }
    ]
  };

  return await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });
}

module.exports = createEvent;