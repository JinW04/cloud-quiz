// ==========================================
// 1. WELCOME SCREEN LOGIC
// ==========================================

// Grabs HTML elements for the welcome screen and stores the player's names
const welcomeModal = document.getElementById("welcome-modal");
const mainQuiz = document.getElementById("main-quiz");
const nicknameInput = document.getElementById("nickname-input");
const guestBtn = document.getElementById("guest-btn");
let playerName = ""; 

// Randomly generated names
function generateCloudName() {
    const adjectives = ["Azure", "Cloudy", "Serverless", "Data", "Virtual", "Automated", "Server", "Storage", "Blue", "Cloud", "Secure", "Code"];
    const nouns = ["Ninja", "Penguin", "Potato", "Wizard", "Dragon", "Packet", "Sheep", "Goat", "Warrior", "Archer", "Merchant", "Vanguard"];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 999);
    return `${randomAdj}${randomNoun}${randomNumber}`;
}

// Saves play name -> hide background -> starts quiz
function unlockQuiz(name) {
    playerName = name; 
    welcomeModal.style.display = "none"; 
    mainQuiz.classList.remove("blurred"); 
    startQuiz(); 
}

// EventListener for when the user enters a nickname or selects to play as a guest
nicknameInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        const enteredName = nicknameInput.value.trim();
        if (enteredName !== "") {
            unlockQuiz(enteredName);
        }
    }
});

guestBtn.addEventListener("click", () => {
    const randomName = generateCloudName();
    unlockQuiz(randomName);
});

// ==========================================
// 2. QUIZ LOGIC
// ==========================================

// Grabs HTML elements for the quiz and sets up variables to track progress
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");
let currentQuestionIndex = 0; 
let score = 0;

// Questiosn and answers
const questions = [
    {
        question: "PLACEHOLDER: What is 2 + 2?",
        answers: [
            { text: "3", correct: false },
            { text: "4", correct: true },
            { text: "5", correct: false },
            { text: "22", correct: false }
        ]
    }
];

// Resets the score and question (Starts a new fresh game)
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.style.display = "none"; 
    showQuestion();
}

// Displays question and creates the 4 answer buttons.
function showQuestion() {
    resetState(); 
    let currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button"); 
        button.innerHTML = answer.text; 
        button.classList.add("btn"); 
        
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button); 
    });
}

// Clears out the old answer buttons and hides the "Next" button.
function resetState() {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Checks answer, updates button color and shows next button
function selectAnswer(e) {
    const selectedButton = e.target; 
    const isCorrect = selectedButton.dataset.correct === "true"; 
    
    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++; 
    } else {
        selectedButton.classList.add("wrong");
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

// Moves to the next question or shows the final score screen if the quiz is over
nextButton.addEventListener("click", () => {
    currentQuestionIndex++; 
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        questionElement.innerHTML = `${playerName}, you scored ${score} out of ${questions.length}!`;
        resetState(); 
        nextButton.innerHTML = "Play Again"; 
        nextButton.style.display = "block";
        nextButton.addEventListener("click", startQuiz); 
    }
});