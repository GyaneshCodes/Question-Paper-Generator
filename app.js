document.addEventListener("DOMContentLoaded", () => {
  const fileUploader = document.getElementById("fileUploader");
  const questionListDiv = document.getElementById("questionList");
  const submitButton = document.getElementById("submitButton");
  const selectionArea = document.getElementById("selection-area");
  const checkAllBtn = document.getElementById("checkAllBtn");
  const uncheckAllBtn = document.getElementById("uncheckAllBtn");
  const counterSpan = document.getElementById("counter");
  const mcqCounterSpan = document.getElementById("mcqCounter");
  const shortCounterSpan = document.getElementById("shortCounter");
  const longCounterSpan = document.getElementById("longCounter");
  const loader = document.getElementById("loader");
  const statusMessage = document.getElementById("status-message");

  const WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbwxq4q3CbMXQ-4MVmw5peLmnpgRPFHh9bJE9NK2joRgXpw1jRXkWnvRcqiecWYFCItdbg/exec";

  let allQuestions = [];

  fileUploader.addEventListener("change", handleFileUpload);
  submitButton.addEventListener("click", generateQuestionPaper);
  checkAllBtn.addEventListener("click", () => toggleAllCheckboxes(true));
  uncheckAllBtn.addEventListener("click", () => toggleAllCheckboxes(false));
  questionListDiv.addEventListener("change", updateSelectionCounter);

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    localStorage.removeItem("selectedQuestions");

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        allQuestions = XLSX.utils.sheet_to_json(worksheet);

        if (!validateHeaders(allQuestions[0])) {
          throw new Error(
            "Invalid file format. Ensure columns 'Question_Text' and 'Question_Type' exist."
          );
        }

        displayQuestions();
        selectionArea.style.display = "block";
        submitButton.disabled = false;
        statusMessage.textContent =
          "File loaded successfully. Please select questions.";
        statusMessage.style.color = "green";
      } catch (error) {
        console.error("File processing error:", error);
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.style.color = "red";
        resetUI();
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function displayQuestions() {
    questionListDiv.innerHTML = "";
    allQuestions.forEach((q, index) => {
      const questionType = (q.Question_Type || "N/A").toLowerCase();
      const questionItem = `
        <div class="question-item">
            <input type="checkbox" id="q_${index}" value="${index}" data-type="${questionType}">
            <label for="q_${index}">${
        q.Question_Text || "No question text found."
      }</label>
            <span class="type-badge badge-${questionType}">${questionType.toUpperCase()}</span>
        </div>
      `;
      questionListDiv.innerHTML += questionItem;
    });
    loadSelections();
    updateSelectionCounter();
  }

  async function generateQuestionPaper() {
    const selectedQuestions = [];
    const checkboxes = document.querySelectorAll(
      '#questionList input[type="checkbox"]:checked'
    );

    if (checkboxes.length === 0) {
      statusMessage.textContent = "Please select at least one question.";
      statusMessage.style.color = "orange";
      return;
    }

    checkboxes.forEach((cb) => {
      selectedQuestions.push(allQuestions[cb.value]);
    });

    loader.style.display = "block";
    submitButton.disabled = true;
    statusMessage.textContent = "Generating your paper... Please wait.";
    statusMessage.style.color = "#333";

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(selectedQuestions),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        statusMessage.textContent = `Success! ${result.message}`;
        statusMessage.style.color = "green";
        localStorage.removeItem("selectedQuestions"); // Clear selections on success
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Error sending data:", error);
      statusMessage.textContent = `An error occurred: ${error.message}`;
      statusMessage.style.color = "red";
    } finally {
      loader.style.display = "none";
      submitButton.disabled = false;
    }
  }

  function validateHeaders(firstQuestion) {
    if (!firstQuestion) return false;
    const requiredHeaders = ["Question_Text", "Question_Type"];
    const availableHeaders = Object.keys(firstQuestion);
    return requiredHeaders.every((header) => availableHeaders.includes(header));
  }

  function toggleAllCheckboxes(checked) {
    const checkboxes = document.querySelectorAll(
      '#questionList input[type="checkbox"]'
    );
    checkboxes.forEach((cb) => (cb.checked = checked));
    updateSelectionCounter();
  }

  function updateSelectionCounter() {
    const selectedCheckboxes = document.querySelectorAll(
      '#questionList input[type="checkbox"]:checked'
    );
    const selectedCount = selectedCheckboxes.length;

    let mcqCount = 0;
    let shortCount = 0;
    let longCount = 0;

    selectedCheckboxes.forEach((cb) => {
      const type = cb.getAttribute("data-type");
      if (type === "mcq") mcqCount++;
      else if (type === "short") shortCount++;
      else if (type === "long") longCount++;
    });

    counterSpan.textContent = `Selected: ${selectedCount}`;
    mcqCounterSpan.textContent = `MCQs: ${mcqCount}`;
    shortCounterSpan.textContent = `Short: ${shortCount}`;
    longCounterSpan.textContent = `Long: ${longCount}`;

    saveSelections();
  }

  function saveSelections() {
    const selectedCheckboxes = document.querySelectorAll(
      '#questionList input[type="checkbox"]:checked'
    );
    const selectedIndices = Array.from(selectedCheckboxes).map(
      (cb) => cb.value
    );
    localStorage.setItem("selectedQuestions", JSON.stringify(selectedIndices));
  }

  function loadSelections() {
    const selectedIndices =
      JSON.parse(localStorage.getItem("selectedQuestions")) || [];
    selectedIndices.forEach((index) => {
      const checkbox = document.getElementById(`q_${index}`);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }

  function resetUI() {
    selectionArea.style.display = "none";
    submitButton.disabled = true;
    allQuestions = [];
    questionListDiv.innerHTML = "";
    updateSelectionCounter();
  }
});
