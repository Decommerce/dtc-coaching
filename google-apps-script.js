/**
 * Google Apps Script for Lead Capture & Newsletter Signup
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Open your Google Sheet
 *    - A-test: https://docs.google.com/spreadsheets/d/1IkdCWzMDqTQ8N6yWjy8pwjvst7B-TOl5FSIhMkAYHKk/edit
 *    - B-test: https://docs.google.com/spreadsheets/d/10WElZR0Q2dpfYpFBUk3AcdW9VyQuhH5nhPoLnYsySZU/edit
 *
 * 2. Go to Extensions → Apps Script
 *
 * 3. Delete any existing code and paste this entire script
 *
 * 4. Save the project (give it a name like "Lead Capture Handler")
 *
 * 5. Click "Deploy" → "New deployment"
 *
 * 6. Click the gear icon next to "Select type" and choose "Web app"
 *
 * 7. Configure the deployment:
 *    - Description: "Lead Capture"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *
 * 8. Click "Deploy"
 *
 * 9. Copy the Web App URL (it looks like: https://script.google.com/macros/s/ABC123.../exec)
 *
 * 10. Replace the GOOGLE_SCRIPT_URL in the landing page HTML with this URL
 *
 * 11. Make sure your Google Sheet has these column headers in row 1:
 *     A1: Timestamp
 *     B1: First Name
 *     C1: Last Name
 *     D1: Email
 *     E1: Phone
 *     F1: Website
 *     G1: Source
 *
 * NOTE: This script handles both CTA popup submissions (with phone + website)
 *       and exit-intent newsletter signups (without phone + website).
 *       Phone and Website columns will be empty for newsletter signups.
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
      sheet.getRange('A1:G1').setValues([['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Website', 'Source']]);
    }

    // Append the new row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.firstName || '',
      data.lastName || '',
      data.email || '',
      data.phone || '',
      data.website || '',
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
    .createTextOutput(JSON.stringify({ 'status': 'Lead capture endpoint is active' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run this to verify the script works
function testAppend() {
  var testData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+1234567890',
    website: 'https://example.com',
    timestamp: new Date().toISOString(),
    source: 'test'
  };

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();

  if (sheet.getRange('A1').getValue() === '') {
    sheet.getRange('A1:G1').setValues([['Timestamp', 'First Name', 'Last Name', 'Email', 'Phone', 'Website', 'Source']]);
  }

  sheet.appendRow([
    testData.timestamp,
    testData.firstName,
    testData.lastName,
    testData.email,
    testData.phone,
    testData.website,
    testData.source
  ]);

  Logger.log('Test row added successfully!');
}
