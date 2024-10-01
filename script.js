let countries = [];
let currentQuestion = 0;
let score = 0;
const maxQuestions = 10;
let timer;
let timeLeft = 5;
const apiUrl = 'https://66fbe1b88583ac93b40d9d61.mockapi.io/score'; // URL de l'API MockAPI

// Masquer le quiz tant que le joueur n'a pas commencé
document.getElementById('quiz-container').style.display = 'none';
document.getElementById('scoreboard').style.display = 'none'; // Masquer le tableau des scores au début

document.getElementById('start-button').addEventListener('click', function() {
    const playerName = document.getElementById('player-name').value; // Récupérer le nom du joueur

    if (playerName === '') {
        alert('Veuillez entrer votre nom pour commencer le quiz.');
        return; // Empêcher de démarrer si le nom n'est pas entré
    }

    // Masquer la div start-container
    document.getElementById('start-container').style.display = 'none';

    // Masquer le bouton de démarrage et le champ du nom
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('player-name').style.display = 'none';
    document.getElementById('scoreboard').style.display = 'none'; // Cacher les scores durant le quiz

    // Afficher le quiz
    document.getElementById('quiz-container').style.display = 'block';

    startQuiz(); // Démarrer le quiz
});

fetch('https://restcountries.com/v3.1/all?fields=name,capital&lang=fr')
    .then(response => response.json())
    .then(data => {
        countries = data;
        shuffleArray(countries); // Mélanger les pays pour varier les questions
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

    // Mettre à jour la progression des questions
    document.getElementById('question-progress').textContent = `Question ${currentQuestion + 1} sur ${maxQuestions}`;

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
    document.getElementById('question').textContent = `Quiz terminé ! Votre score est de ${score} sur ${maxQuestions}.`;
    document.getElementById('choices').innerHTML = '';

    // Envoyer le score à MockAPI et afficher les scores immédiatement après
    envoyerScore(score).then(() => afficherScores());

    const restartButton = document.createElement('button');
    restartButton.textContent = 'Recommencer';
    restartButton.onclick = () => location.reload(); // Recharger la page pour revenir à l'état initial
    document.getElementById('choices').appendChild(restartButton);
}

// Fonction pour envoyer le score à l'API MockAPI
function envoyerScore(score) {
    const playerName = document.getElementById('player-name').value; // Utiliser le nom du joueur entré
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            joueur: playerName,
            score: score,
            date: new Date(),
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score envoyé avec succès:', data);
    })
    .catch(error => {
        console.error('Erreur lors de l\'envoi du score:', error);
    });
}

// Fonction pour afficher les scores à partir de MockAPI et supprimer les anciens
function afficherScores() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            let scoreBoard = document.getElementById('scoreboard');
            scoreBoard.innerHTML = '<h2>Historique des Scores</h2>';
            document.getElementById('scoreboard').style.display = 'block'; // Afficher le tableau des scores

            // Trier les scores par date (les plus récents en premier)
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Garder seulement les 3 derniers scores et supprimer les plus anciens
            const scoresToShow = data.slice(0, 3);
            const scoresToDelete = data.slice(3);

            scoresToShow.forEach(entry => {
                let p = document.createElement('p');
                p.textContent = `${entry.joueur} : ${entry.score} points`;
                scoreBoard.appendChild(p);
            });

            // Supprimer les anciens scores de l'API
            scoresToDelete.forEach(score => {
                fetch(`${apiUrl}/${score.id}`, { method: 'DELETE' })
                    .then(() => {
                        console.log(`Score supprimé : ${score.id}`);
                    })
                    .catch(error => {
                        console.error('Erreur lors de la suppression des scores:', error);
                    });
            });
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des scores:', error);
        });
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
        "value": ["#f1b9bd", "#91ccec", "#fde49f", "#dfe0e2"],
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