# Question-Paper-Generator

- Version: 1.0 (Core Release)
- Date: October 15, 2025
- Status: Live with Core Functionality

## Introduction & Project Goal

The Automated Question Paper Generator is a web-based tool designed to address a common and time-consuming problem for educators: manually creating exam papers from a master question bank. The traditional method of copying, pasting, and reformatting questions is inefficient and prone to errors.

This system streamlines that entire workflow into a simple, three-step process: Upload, Select, and Generate. It empowers educators to create professionally formatted, print-ready question papers in seconds by combining a user-friendly web interface with the power of Google Sheets.

## System Architecture

The application is built on a modern, serverless architecture. This approach is cost-effective, secure, and requires no dedicated server management. The workflow is divided into three distinct layers:

1.  Frontend (Client-Side): A user-facing web page built with HTML, CSS, and JavaScript. This is where the teacher interacts with the app. It runs entirely within their web browser, handling the file upload and question selection.

2.  Data Transfer (API Layer): When the user is ready, the frontend sends only the selected questions to the backend using a secure JavaScript fetch API call. This acts as a bridge between the user's browser and Google's services.

3.  Backend (Server-Side): This layer is powered by Google Sheets and Google Apps Script. The Apps Script is deployed as a Web App that listens for incoming data. It receives the selected questions and acts as an intelligent "document-builder," programmatically arranging them into a pre-designed, formatted template.

## How to Use the Application: A Guide for Teacher

This guide will walk you through using the generator. There are two parts: a one-time setup of your question bank and the simple process of generating a paper.

### Part A: One-Time Setup - Preparing Your Question Bank

This is the most important step to ensure the app works correctly. You only have to do this once for each question bank.

1. The Problem with Converted Files: Files converted directly from Word often contain all the information (question, options, answer) in a single column, which the application cannot read.

2. The Correct Format: You must organise this data into a proper Excel or Google Sheets table. The very first row must contain these exact headers:

   - Question_Text
   - Question_Type (Use 'MCQ', 'Short', or 'Long')
   - Option_A
   - Option_B
   - Option_C
   - Option_D
   - Correct_Answer

3. Action - Clean Your File: Open your question bank file. Manually structure it to match the reference table below. For Short/Long answer questions, simply leave the option and answer columns blank.

Reference Table Format:

```
Question_Text                                           | Question_Type |   Option_A  | Option_B | Option_C | Option_D | Correct_Answer |
| :---------------------------------------------------- | :-----------: | ----------: | -------: | -------: | -------: | -------------: |
Which device is called the brain of the computer?       | MCQ           | Motherboard |   CPU    |    RAM   | Hard Disk |      CPU      |
What is the main difference between RAM and ROM?        | Short         |             |          |          |           |
Explain the evolution of computer generations in detail.| Long          |             |          |          |           |
```

4. Save this cleaned file as an .xlsx file on your computer. Your question bank is now ready to be used by the application.

### Part B: Generating a Question Paper

1.  Open the App: Locate the index.html file on your computer and double-click it. It will open in your web browser.

2.  Upload Your File: Click the "Choose a file..." button and select your newly cleaned question bank (.xlsx) file.

3.  Select Questions: A checklist of all the questions from your file will appear. Check the box next to each question you want to include in your paper. You can use the "Check All" and "Uncheck All" buttons for convenience.

4.  Generate: Once you are happy with your selection, click the green "Generate Question Paper" button. A spinner will show that it's working.

5.  Done! After a few seconds, you'll see a success message. Open your designated Google Sheet. A new tab named Generated Paper with a timestamp will contain your complete, professionally formatted question paper.

## Technical Setup & Deployment (For Administrators)

This section details the initial one-time setup required to get the system online.

1. Google Sheet Preparation:
   - Create a new Google Sheet.
   - Create a sheet and name it `Template`. Design this sheet exactly how you want the final paper to look, using colored cells as placeholders.
   - Find and copy the Spreadsheet ID from the URL.
2. Google Apps Script Deployment:
   - In the sheet, go to Extensions > Apps Script.
   - Paste the Code.gs script content into the editor.
   - Replace the SPREADSHEET_ID placeholder with your actual ID.
   - Click Deploy > New deployment.
   - Configure it as a Web app with access set to "Anyone".
   - Authorise the script's permissions.
   - Copy the final Web app URL.
3. Frontend Configuration:
   - Open the app.js file.
   - Paste the copied Web app URL into the WEB_APP_URL constant.
   - Save the file.
4. Distribution:
   - The three frontend files (index.html, style.css, app.js) can be zipped and sent to users, or hosted on a simple web server or internal school portal for easy access.

## Project Roadmap

### v1.0: Core Functionality (Previous State - October 2025)

- Features:
  - Successful upload and parsing of a structured .xlsx file.
  - Dynamic generation of a question checklist in the browser.
  - Ability to select a mix of MCQ, Short, and Long answer questions.
  - Generation of a highly-formatted question paper in Google Sheets by populating a pre-designed template with colored placeholders.
- Known Issues:
  - Limited error handling for incorrectly formatted upload files.
  - The user interface is functional but could be more intuitive with more feedback.

### v1.1: Stability & UX Improvements (Current State - October 2025)

- Enhanced Error Handling: Improve the file validation in app.js. Provide clearer, user-friendly error messages if the required columns (Question_Text, Question_Type) are missing.
- UI Refinements:
  - Add a live counter that displays "X questions selected".
  - Improve the loading state and success/error messages to be more explicit.
  - Ensure the design is fully responsive for different screen sizes.
- State Persistence: Use browser localStorage to remember a user's checkbox selections if they accidentally refresh the page.

### v1.5: Feature Enhancements (Next Goals)

- Advanced Question Filtering: Add dropdown menus at the top of the checklist to filter questions by Question_Type or a new Topic/Unit column from the Excel file. This would allow a teacher to instantly see all "MCQ" questions about "Unit 1".

- Randomisation Engine: Add a feature like "Select 10 random MCQ questions" to automate selection for quick quizzes.

- Dynamic Marks and Totals: Allow teachers to assign marks to each question section in the UI (e.g., "Short answers are worth 5 marks each"). The Google Sheet template would then automatically calculate and display the total marks for the paper.

### v2.0: Advanced Capabilities (Long-Term Vision)

- Multiple Output Formats: Add buttons to export the final paper directly as a PDF or a Microsoft Word document from the web interface, in addition to the Google Sheet.

- Template Customisation: Allow the user to change header details (like School Name, Subject Code, Exam Date) directly in the web form instead of having them hard-coded in the script.

- Version Control: Save generated papers in new, timestamped tabs (e.g., "Paper-2025-10-15") instead of overwriting the old one, creating a history of generated papers within the same Google Sheet.
