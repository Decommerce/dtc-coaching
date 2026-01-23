/**
 * Google Apps Script for Newsletter Signup
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1IkdCWzMDqTQ8N6yWjy8pwjvst7B-TOl5FSIhMkAYHKk/edit
 *
 * 2. Go to Extensions → Apps Script
 *
 * 3. Delete any existing code and paste this entire script
 *
 * 4. Save the project (give it a name like "Newsletter Signup Handler")
 *
 * 5. Click "Deploy" → "New deployment"
 *
 * 6. Click the gear icon next to "Select type" and choose "Web app"
 *
 * 7. Configure the deployment:
 *    - Description: "Newsletter Signup"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *
 * 8. Click "Deploy"
 *
 * 9. Copy the Web App URL (it looks like: https://script.google.com/macros/s/ABC123.../exec)
 *
 * 10. Replace 'YOUR_SCRIPT_ID' in the landing page HTML with this URL
 *     Find this line in the HTML:
 *     const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
 *
 *     Replace it with your actual URL:
 *     const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/ABC123.../exec';
 *
 * 11. Make sure your Google Sheet has these column headers in row 1:
 *     A1: Timestamp
 *     B1: First Name
 *     C1: Last Name
 *     D1: Email
 *     E1: Source
 */

// Handle POST requests from the form
function doPost(e) {
  try {
    // Parse the incoming data
    var data = JSON.parse(e.postData.contents);

    // Open the spreadsheet
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getActiveSheet();

    // Check if headers exist, if not add them
    if (sheet.getRange('A1').getValue() === '') {
      sheet.getRange('A1:E1').setValues([['Timestamp', 'First Name', 'Last Name', 'Email', 'Source']]);
    }

    // Append the new row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.source || 'website'
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle GET requests (for testing)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 'status': 'Newsletter signup endpoint is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this to verify the script works
function testAppend() {
  var testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    timestamp: new Date().toISOString(),
    source: 'test'
  };

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();

  if (sheet.getRange('A1').getValue() === '') {
    sheet.getRange('A1:E1').setValues([['Timestamp', 'First Name', 'Last Name', 'Email', 'Source']]);
  }

  sheet.appendRow([
    testData.timestamp,
    testData.firstName,
    testData.lastName,
    testData.email,
    testData.source
  ]);

  Logger.log('Test row added successfully!');
}
