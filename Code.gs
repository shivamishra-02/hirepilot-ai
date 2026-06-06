const GEMINI_API_KEY = "enter_your_gemini_key_here";
const RESUME_FOLDER_ID = "1gJdaYpYQf16D2gAR7Ifp8duvMTuEaWhh"; // this is my folder id in which i have kept the reusme in my drive

function testGemini() {

  const prompt = "Say Hello HirePilot AI";

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    GEMINI_API_KEY;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);

  Logger.log(response.getContentText());
}

function selectResumeFromJD(jd) {

  const prompt = `
You are an expert technical recruiter.

You must choose ONLY ONE resume from the following options:

1. RESUME_AI
   Suitable for:
   AI Engineer
   Machine Learning Engineer
   GenAI Engineer
   LLM Engineer
   Data Scientist
   NLP Engineer
   RAG Developer

2. RESUME_AUTOMATION
   Suitable for:
   Google Apps Script
   Automation Engineer
   Process Automation
   Workflow Automation
   Operations Automation

3. RESUME_DEV
   Suitable for:
   Software Engineer
   Backend Developer
   Full Stack Developer
   MERN Developer
   Web Developer

Return ONLY one value.

Example:
RESUME_AI

Job Description:

${jd}
`;

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    GEMINI_API_KEY;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: prompt
          }
        ]
      }
    ]
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(url, options);

  const result = JSON.parse(response.getContentText());

  return result.candidates[0].content.parts[0].text.trim();
}

function testResumeSelection() {

  const jd = `
Looking for an AI Engineer with experience in
Python, LLMs, LangChain, Vector Databases,
RAG Systems and Generative AI.
`;

  const selectedResume = selectResumeFromJD(jd);

  Logger.log(selectedResume);
}

function processResumeSelection() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName("Job Applications");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    const jd = data[i][4]; // Column E

    const existingResume = data[i][5]; // Column F

    if (!jd || existingResume) {
      continue;
    }

    const selectedResume = selectResumeFromJD(jd);

    sheet.getRange(i + 1, 6).setValue(selectedResume);

    Utilities.sleep(2000);
  }
}

function generateEmail(hrName, company, jobTitle, jd, selectedResume) {

  try {

    const prompt = `
You are Shivam Mishra applying for jobs.

Write a concise cold email for a recruiter.

Details:

Candidate Name: Shivam Mishra
Company: ${company}
HR Name: ${hrName}
Role: ${jobTitle}
Selected Resume: ${selectedResume}

Job Description:
${jd}

Rules:

- Maximum 120 words
- Sound human, not AI generated
- No exaggerated praise
- No phrases like:
  "I am excited"
  "I am thrilled"
  "groundbreaking"
  "ideal candidate"
  "profound interest"

- Briefly mention relevant skills from the JD
- Mention attached resume
- End politely
- Return email body only
`;

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      GEMINI_API_KEY;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true   // IMPORTANT 🔥
    };

    const response = UrlFetchApp.fetch(url, options);

    const code = response.getResponseCode();

    // 🔥 If API fails → fallback
    if (code !== 200) {
      Logger.log("Gemini API failed with code: " + code);
      return generateFallbackEmail(hrName, company, jobTitle);
    }

    const result = JSON.parse(response.getContentText());

    const text =
      result?.candidates?.[0]?.content?.parts?.[0]?.text;

    // 🔥 If response broken → fallback
    if (!text) {
      Logger.log("Gemini returned empty response");
      return generateFallbackEmail(hrName, company, jobTitle);
    }

    return text.trim();

  } catch (error) {

    Logger.log("Gemini Exception: " + error);

    // 🔥 FINAL SAFETY NET
    return generateFallbackEmail(hrName, company, jobTitle);
  }
}

function testEmailGeneration() {

  const email = generateEmail(
    "Rahul",
    "OpenAI",
    "AI Engineer",
    "Experience with LLMs, RAG, LangChain and Python",
    "RESUME_AI"
  );

  Logger.log(email);
}


function generateSubjectsForSheet() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Job Applications");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    const jobTitle = data[i][3];
    const existingSubject = data[i][7];

    if (!jobTitle || existingSubject) {
      continue;
    }

    const subject =
      `Application for ${jobTitle} Role - Shivam Mishra`;

    sheet.getRange(i + 1, 8).setValue(subject);
  }
}

function getResumeFile(resumeName) {

  const folder = DriveApp.getFolderById(RESUME_FOLDER_ID);

  const files = folder.getFilesByName(resumeName + ".pdf");

  if (!files.hasNext()) {
    throw new Error("Resume not found: " + resumeName);
  }

  return files.next();
}

function testResumeFetch() {

  const file = getResumeFile("RESUME_AI");

  Logger.log(file.getName());
}

function testBlob() {

  const file = getResumeFile("RESUME_AI");

  const blob = file.getBlob();

  Logger.log(blob.getName());
}

function sendTestEmail() {

  const file = getResumeFile("RESUME_AI");

  const blob = file.getBlob();

  GmailApp.sendEmail(
    "shivammishra825236@gmail.com",
    "HirePilot AI Test",
    "This is a test email sent from HirePilot AI.",
    {
      attachments: [blob]
    }
  );

  Logger.log("Test Email Sent");
}

function sendApplications1() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Job Applications");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    try {

      const hrEmail = data[i][2];
      const selectedResume = data[i][5];
      const emailBody = data[i][6];
      const subject = data[i][7];
      const status = data[i][8];

      if (
        !hrEmail ||
        !selectedResume ||
        !emailBody ||
        !subject ||
        status === "Sent"
      ) {
        continue;
      }

      const resumeFile = getResumeFile(selectedResume);

      GmailApp.sendEmail(
        hrEmail,
        subject,
        emailBody,
        {
          attachments: [resumeFile.getBlob()]
        }
      );

      sheet.getRange(i + 1, 9).setValue("Sent");
      sheet.getRange(i + 1, 10).setValue(new Date());

      Utilities.sleep(3000);

    } catch (error) {

      sheet.getRange(i + 1, 9).setValue("Failed");
      sheet.getRange(i + 1, 11).setValue(error.toString());

    }
  }
}

function sendApplications() {

  Logger.log("=== FUNCTION STARTED ===");

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Job Applications");

  const data = sheet.getDataRange().getValues();

  Logger.log("Total Rows: " + data.length);

  for (let i = 1; i < data.length; i++) {

    Logger.log("----- Processing Row " + (i + 1) + " -----");

    try {

      const hrEmail = data[i][2];          // Column C
      const selectedResume = data[i][5];   // Column F
      const emailBody = data[i][6];        // Column G
      const subject = data[i][7];          // Column H
      const status = data[i][8];           // Column I

      Logger.log("Email: " + hrEmail);
      Logger.log("Resume: " + selectedResume);
      Logger.log("Subject: " + subject);
      Logger.log("Status: " + status);

      if (!hrEmail) {
        Logger.log("SKIPPED: Missing Email");
        continue;
      }

      if (!selectedResume) {
        Logger.log("SKIPPED: Missing Resume");
        continue;
      }

      if (!emailBody) {
        Logger.log("SKIPPED: Missing Email Body");
        continue;
      }

      if (!subject) {
        Logger.log("SKIPPED: Missing Subject");
        continue;
      }

      if (status === "Sent") {
        Logger.log("SKIPPED: Already Sent");
        continue;
      }

      Logger.log("Fetching Resume...");

      const resumeFile = getResumeFile(selectedResume);

      Logger.log("Resume Found: " + resumeFile.getName());

      GmailApp.sendEmail(
        hrEmail,
        subject,
        emailBody,
        {
          attachments: [resumeFile.getBlob()]
        }
      );

      Logger.log("EMAIL SENT SUCCESSFULLY");

      sheet.getRange(i + 1, 9).setValue("Sent");      // Column I
      sheet.getRange(i + 1, 10).setValue(new Date()); // Column J

      Utilities.sleep(3000);

    } catch (error) {

      Logger.log("ERROR: " + error);

      sheet.getRange(i + 1, 9).setValue("Failed"); // Column I
      sheet.getRange(i + 1, 11).setValue(error.toString()); // Column K
    }
  }

  Logger.log("=== FUNCTION COMPLETED ===");
}

function debugSheetData() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Job Applications");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    Logger.log("Row " + (i + 1));

    Logger.log("Column G Value:");
    Logger.log(data[i][6]);

  }
}

function testEmailGenerationAgain() {

  const email = generateEmail(
    "Rahul",
    "OpenAI",
    "AI Engineer",
    "Experience with LLMs, LangChain, RAG and Python",
    "RESUME_AI"
  );

  Logger.log(email);
}

function generateEmailsForSheet() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Job Applications");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    const hrName = data[i][1];
    const company = data[i][0];
    const jobTitle = data[i][3];
    const jd = data[i][4];
    const selectedResume = data[i][5];

    Logger.log("Generating Email For Row " + (i + 1));

    const emailBody = generateEmail(
      hrName,
      company,
      jobTitle,
      jd,
      selectedResume
    );

    sheet.getRange(i + 1, 7).setValue(emailBody);

    Logger.log("Saved Email For Row " + (i + 1));

    Utilities.sleep(2000);
  }
}

function debugSendApplications() {

  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Job Applications");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    Logger.log("==========");
    Logger.log("Row: " + (i + 1));

    Logger.log("Email: " + data[i][2]);
    Logger.log("Resume: " + data[i][5]);
    Logger.log("Generated Email: " + data[i][6]);
    Logger.log("Subject: " + data[i][7]);
    Logger.log("Status: " + data[i][8]);

  }
}

function generateFallbackEmail(hrName, company, jobTitle) {

  const template =
    HtmlService.createTemplateFromFile("template");

  template.hrName = hrName || "Hiring Team";
  template.company = company || "your company";
  template.jobTitle = jobTitle || "role";

  const htmlBody = template.evaluate().getContent();

  return htmlBody;
}

function runHirePilot() {

  processResumeSelection();

  Utilities.sleep(3000);

  generateEmailsForSheet();

  Utilities.sleep(3000);

  generateSubjectsForSheet();

  Utilities.sleep(3000);

  sendApplications();

}