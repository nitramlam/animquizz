let countries = [];
let currentQuestion = 0;
let score = 0;
const maxQuestions = 10;
let timer;
let timeLeft = 5;

document.getElementById('quiz-container').style.display = 'none';

document.getElementById('start-button').addEventListener('click', function() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    startQuiz();
});

fetch('https://restcountries.com/v3.1/all?fields=name,capital&lang=fr')
    .then(response => response.json())
    .then(data => {
        countries = data;
        shuffleArray(countries);
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}/10`;
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= maxQuestions) {
        endQuiz(); 
        return;
    }

    timeLeft = 5;
    document.getElementById('timer').textContent = `Temps restant: ${timeLeft}`;

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Temps restant: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null, countries[currentQuestion].capital ? countries[currentQuestion].capital[0] : "N/A");
        }
    }, 1000);

    const country = countries[currentQuestion];
    const capital = country.capital ? country.capital[0] : "N/A";

    const validCountries = countries.filter(c => c.capital && c.capital[0]);
    const choices = [capital, ...getRandomCapitals(3, validCountries)];

    shuffleArray(choices);

    document.getElementById('question').textContent = `Quelle est la capitale de ${country.name.common} ?`;

    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = '';

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, capital);
        choicesContainer.appendChild(button);
    });
}

function getRandomCapitals(count, validCountries) {
    const capitals = validCountries.map(country => country.capital[0]);
    capitals.sort(() => 0.5 - Math.random());
    return capitals.slice(0, count);
}

function checkAnswer(selected, correct) {
    clearInterval(timer);

    const correctSound = document.getElementById('correct-sound');
    const wrongSound = document.getElementById('wrong-sound');

    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        if (button.textContent === correct) {
            button.style.backgroundColor = 'green';
            if (selected === correct) {
                correctSound.currentTime = 0;
                correctSound.play();
            }
        } else if (button.textContent === selected) {
            button.style.backgroundColor = 'red';
            if (selected !== correct) {
                wrongSound.currentTime = 0;
                wrongSound.play();
            }
        }
        button.disabled = true;
    });

    if (selected === correct) {
        score++;
    }

    document.getElementById('score').textContent = `Score: ${score}/10`;

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1000);
}

function endQuiz() {
    clearInterval(timer);
    document.getElementById('question').textContent = `Quiz terminé ! Votre score est de  ${score} sur ${maxQuestions}.`;
    document.getElementById('choices').innerHTML = '';
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Recommencer';
    restartButton.onclick = () => restartQuiz();
    document.getElementById('choices').appendChild(restartButton);
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}/10`;
    shuffleArray(countries);
    startQuiz();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

particlesJS('particles-js', {
    "particles": {
      "number": {
        "value": 9,
      },
      "color": {
        "value": ["#f1b9bd", "#91ccec", "#fde49f", "#dfe0e2", ],
      },
      "shape": {
        "type": "circle",
      },
      "opacity": {
        "value": 0.5,
      },
      "size": {
        "value": 150,
      },
      "move": {
        "direction": "none",
        "speed": 10
      }
    }
});