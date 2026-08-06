/**
 * feedback_apps_script.gs
 *
 * Paste this into a Google Sheet's Apps Script editor (Extensions > Apps
 * Script), deploy it as a Web App, and point FEEDBACK_ENDPOINT in
 * india_atlas.html at the deployment URL. Every feedback submission on
 * the site will then also be appended as a new row here, in real time,
 * from every visitor — not just stored in one person's browser.
 *
 * SETUP
 * 1. Create a new Google Sheet (sheets.new).
 * 2. In row 1, add headers:  Date | Name | Message
 * 3. Extensions > Apps Script. Delete the placeholder code and paste
 *    in everything below.
 * 4. Click Deploy > New deployment.
 *      - Click the gear icon next to "Select type" and choose "Web app".
 *      - Description: anything, e.g. "Feedback receiver"
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Click Deploy. The first time, Google will ask you to authorize
 *    the script — approve it (it's your own script, acting on your
 *    own sheet).
 * 6. Copy the "Web app URL" shown after deploying (it ends in /exec).
 * 7. In india_atlas.html, find:
 *        const FEEDBACK_ENDPOINT = null;
 *    and change it to:
 *        const FEEDBACK_ENDPOINT = 'PASTE_YOUR_URL_HERE';
 *
 * That's it — no API keys, no billing, this runs on Google's free tier
 * for personal Apps Script usage.
 *
 * NOTE: If you ever change the form's fields, update the `e.parameter`
 * lookups below to match.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var date = (e.parameter && e.parameter.date) || new Date().toISOString();
    var name = (e.parameter && e.parameter.name) || '';
    var message = (e.parameter && e.parameter.message) || '';

    sheet.appendRow([date, name, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you sanity-check the deployment by visiting the URL directly
// in a browser — you should see this text instead of an error page.
function doGet(e) {
  return ContentService.createTextOutput('Feedback endpoint is live. POST submissions will be appended below the header row.');
}
