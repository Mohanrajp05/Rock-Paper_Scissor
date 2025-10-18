const gameImages = ['🪨', '📄', '✂️'];

let playerScore = 0;
let computerScore = 0;
let drawScore = 0;
let gameInProgress = false;

const playerImage = document.getElementById('player-image');
const computerImage = document.getElementById('computer-image');
const resultMessage = document.getElementById('result-message');
const playAgainBtn = document.getElementById('play-again');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const drawScoreElement = document.getElementById('draw-score');
const choiceButtons = document.querySelectorAll('.choice-btn');
const playerNameInput = document.getElementById('player-name-input');
const saveNameButton = document.getElementById('save-name');
const playerNameLabel = document.getElementById('player-name-label');
const playerChoiceTitle = document.getElementById('player-choice-title');

function loadPlayerName() {
    try {
        const stored = localStorage.getItem('rpsPlayerName');
        return stored && stored.trim() ? stored.trim() : 'You';
    } catch (e) {
        return 'You';
    }
}

function applyPlayerName(name) {
    if (playerNameLabel) {
        playerNameLabel.textContent = name;
    }
    if (playerNameInput) {
        playerNameInput.value = name === 'You' ? '' : name;
    }
    if (playerChoiceTitle) {
        playerChoiceTitle.textContent = `${name} Choice`;
    }
}

function savePlayerName(name) {
    const cleaned = (name || '').trim().slice(0, 17);
    const finalName = cleaned || 'You';
    try {
        localStorage.setItem('rpsPlayerName', finalName);
    } catch (e) {
        // ignore
    }
    applyPlayerName(finalName);
}

function initGame() {

    playerImage.textContent = '❓';
    computerImage.textContent = '❓';
    resultMessage.textContent = '';
    resultMessage.className = 'result-message';
    playAgainBtn.style.display = 'none';
    gameInProgress = false;
    
    choiceButtons.forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    playerImage.classList.remove('winner');
    computerImage.classList.remove('winner');

    applyPlayerName(loadPlayerName());
}

function getComputerChoice() {
    return Math.floor(Math.random() * 3);
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice < 0 || userChoice > 2) {
        return { result: 'invalid', message: 'You typed an invalid number, You Lose!' };
    }
    
    if (userChoice === 0 && computerChoice === 2) {
        return { result: 'win', message: 'You Win!' };
    }
    
    if (computerChoice === 0 && userChoice === 2) {
        return { result: 'lose', message: 'You Lose!' };
    }
    
    if (computerChoice > userChoice) {
        return { result: 'lose', message: 'You Lose!' };
    }
    
    if (userChoice > computerChoice) {
        return { result: 'win', message: 'You Win!' };
    }
    
    if (computerChoice === userChoice) {
        return { result: 'draw', message: 'It\'s a Draw!' };
    }
}

function updateScore(result) {
    switch (result) {
        case 'win':
            playerScore++;
            break;
        case 'lose':
            computerScore++;
            break;
        case 'draw':
            drawScore++;
            break;
    }
    
    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
    drawScoreElement.textContent = drawScore;
}

function animateChoices() {
    const choices = ['🪨', '📄', '✂️'];
    let count = 0;
    
    const animation = setInterval(() => {
        computerImage.textContent = choices[count % 3];
        count++;
        
        if (count > 10) {
            clearInterval(animation);
        }
    }, 100);
}

function playGame(userChoice) {
    if (gameInProgress) return;
    
    gameInProgress = true;
    
    playerImage.textContent = gameImages[userChoice];
    
    choiceButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.6';
    });
    
    animateChoices();
    
    setTimeout(() => {
        const computerChoice = getComputerChoice();
        computerImage.textContent = gameImages[computerChoice];
        
        const gameResult = determineWinner(userChoice, computerChoice);
        
        updateScore(gameResult.result);
        
        resultMessage.textContent = gameResult.message;
        resultMessage.className = `result-message ${gameResult.result}`;
        
        if (gameResult.result === 'win') {
            playerImage.classList.add('winner');
        } else if (gameResult.result === 'lose') {
            computerImage.classList.add('winner');
        }
        
        playAgainBtn.style.display = 'inline-block';
        
    }, 1200);
}

choiceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const userChoice = parseInt(btn.dataset.choice);
        playGame(userChoice);
    });
});

playAgainBtn.addEventListener('click', initGame);

if (saveNameButton) {
    saveNameButton.addEventListener('click', () => {
        savePlayerName(playerNameInput ? playerNameInput.value : '');
    });
}
if (playerNameInput) {
    playerNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            savePlayerName(playerNameInput.value);
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (gameInProgress) return;
    
    switch (event.key) {
        case '0':
        case 'r':
        case 'R':
            playGame(0); // Rock
            break;
        case '1':
        case 'p':
        case 'P':
            playGame(1); // Paper
            break;
        case '2':
        case 's':
        case 'S':
            playGame(2); // Scissors
            break;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    applyPlayerName(loadPlayerName());
    initGame();
});

