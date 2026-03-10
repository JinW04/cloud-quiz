// ==========================================
// 1. WELCOME SCREEN LOGIC
// ==========================================

// Grabs HTML elements for the welcome screen and stores the player's names
const welcomeModal = document.getElementById("welcome-modal");
const mainQuiz = document.getElementById("main-quiz");
const nicknameInput = document.getElementById("nickname-input");
const guestBtn = document.getElementById("guest-btn");
const timeElement = document.getElementById("time-left");
let timerInterval;
let timeLeft;
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
        question: "What is the food that can NEVER go bad(expire)?",
        answers: [
            { text: "Uncooked white rice", correct: false },
            { text: "Honey", correct: true },
            { text: "Pasta", correct: false },
            { text: "Canned food", correct: false }
        ]
    },
    {
                question: "What is the hardest natural substance on Earth?",
        answers: [
            {text: "Diamond", correct: true},
            {text: "Obsidian", correct: false},
            {text: "Ruby", correct: false},
            {text: "Topaz", correct: false}
        ]
    },
        {
                question: "How many cards are in a standard deck of playing cards?",
        answers: [
            {text: "30", correct: false},
            {text: "28", correct: false},
            {text: "32", correct: true},
            {text: "34", correct: false}
        ]
    },
        {
                question: "What is James Bond's code name?",
        answers: [
            {text: "07", correct: false},
            {text: "700", correct: false},
            {text: "0007", correct: false},
            {text: "007", correct: true}
        ]
    },
        {
                question: "Which country is the largest in the world?",
        answers: [
            {text: "Russia", correct: true},
            {text: "China", correct: false},
            {text: "America", correct: false},
            {text: "Canada", correct: false}
        ]
    },
        {
                question: "What travels the fastest out of the 4 options?",
        answers: [
            {text: "Sound", correct: false},
            {text: "Fighterjets", correct: false},
            {text: "Light", correct: true},
            {text: "A car", correct: false}
        ]
    },
        {
                question: "How many elements are in the periodic table?",
        answers: [
            {text: "120", correct: false},
            {text: "118", correct: true},
            {text: "181", correct: false},
            {text: "108", correct: false}
        ]
    },
        {
                question: "How many colors are in a rainbow?",
        answers: [
            {text: "6", correct: false},
            {text: "7", correct: true},
            {text: "4", correct: false},
            {text: "8", correct: false}
        ]
    },
        {
                question: "What fish species is Nemo?",
        answers: [
            {text: "Goldfish", correct: false},
            {text: "Nemo", correct: false},
            {text: "Silverfish", correct: false},
            {text: "Clownfish", correct: true}
        ]
    },
        {
                question: "What animal has the biggest eyes?",
        answers: [
            {text: "Colossal squid", correct: true},
            {text: "Blue whale", correct: false},
            {text: "African elephant", correct: false},
            {text: "Ostrich", correct: false}
        ]
    }
];

// Resets the score and question (Starts a new fresh game)
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    shuffleArray(questions)
    nextButton.style.display = "none"; 
    showQuestion();
}

// Countdown timer
function startTimer() {
    timeLeft = 20;
    timeElement.innerText = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeElement.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // Shows the "Ran out of time" message
            feedbackElement.innerHTML = "You ran out of time!";
            feedbackElement.style.color = "#e21b3c"; 

            // Reveal the correct answer and disable all buttons so they can't click late
            Array.from(answerButtons.children).forEach(button => {
                if (button.dataset.correct === "true") {
                    button.classList.add("correct");
                }
                button.disabled = true;
            });

            // Shows the next button
            nextButton.style.display = "block";
        }
    }, 1000);
}

// Displays question and creates the 4 answer buttons.
function showQuestion() {
    clearInterval(timerInterval);
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
    startTimer();
}

// Clears out the old answer buttons and hides the "Next" button.
function resetState() {
    nextButton.style.display = "none";
    feedbackElement.innerHTML = "";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// Checks answer, updates button color and shows next button
function selectAnswer(e) {
    clearInterval(timerInterval);
    const selectedButton = e.target; 
    const isCorrect = selectedButton.dataset.correct === "true"; 
    
    if (isCorrect) {
        selectedButton.classList.add("correct");
        score++; 
        
        // Show "Correct" message in green
        feedbackElement.innerHTML = "Correct!";
        feedbackElement.style.color = "#26890c"; 
    } else {
        selectedButton.classList.add("wrong");
        
        // Finds correct answer in the data
        const currentAnswers = questions[currentQuestionIndex].answers;
        const correctAnswer = currentAnswers.find(ans => ans.correct === true);
        
        // Show "Incorrect message" in red
        feedbackElement.innerHTML = `Incorrect! The correct answer is: ${correctAnswer.text}`;
        feedbackElement.style.color = "#e21b3c"; 
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

// Shuffles the questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const feedbackElement = document.getElementById("feedback-text");

function updateVisitorCount() {
    const countElement = document.getElementById("visit-count");
    const myAzureBackendUrl = "https://jin-backend-oslo01-c9bufqftdtajduap.swedencentral-01.azurewebsites.net/api/UpdateVisitorCount"; 

    fetch(myAzureBackendUrl)
        .then(response => response.json())
        .then(data => {
            countElement.innerText = data.count;
        })
        .catch(error => {
            console.error("Backend error:", error);
            countElement.innerText = "0"; // Fallback to 0 if it fails
        });
}

updateVisitorCount();