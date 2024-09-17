let countries = [];
let currentQuestion = 0;
let score = 0;
const maxQuestions = 10;

fetch('https://restcountries.com/v3.1/all?fields=name,capital&lang=fr')
    .then(response => response.json())
    .then(data => {
        countries = data;
        shuffleArray(countries);
        startQuiz();
    })
    .catch(error => console.error('Erreur lors du chargement des données:', error));

function startQuiz() {
    currentQuestion = 0; // Réinitialiser la question courante
    score = 0; // Réinitialiser le score
    document.getElementById('score').textContent = `Score: ${score}`; // Mettre à jour l'affichage du score
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= maxQuestions) {
        endQuiz(); 
        return;
    }

    const country = countries[currentQuestion];
    const capital = country.capital ? country.capital[0] : "N/A";
    
    // Filtrer les pays avec des capitales valides
    const validCountries = countries.filter(c => c.capital && c.capital[0]);
    const choices = [capital, ...getRandomCapitals(3, validCountries)];

    // Mélanger les options de réponse
    shuffleArray(choices);

    // Afficher la question
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
    // Extraire les capitales valides
    const capitals = validCountries.map(country => country.capital[0]);

    // Mélanger les capitales et prendre un nombre aléatoire
    capitals.sort(() => 0.5 - Math.random());
    return capitals.slice(0, count);
}

function checkAnswer(selected, correct) {
    const buttons = document.querySelectorAll('button');
    
    // Appliquer les couleurs sur les boutons en fonction de la réponse
    buttons.forEach(button => {
        if (button.textContent === correct) {
            button.style.backgroundColor = 'green'; // Bonne réponse en vert
        } else if (button.textContent === selected) {
            button.style.backgroundColor = 'red'; // Mauvaise réponse en rouge
        }
        button.disabled = true; // Désactiver les boutons après une réponse
    });

    if (selected === correct) {
        score++; // Incrémenter le score si la réponse est correcte
    }

    document.getElementById('score').textContent = `Score: ${score}`; // Mettre à jour l'affichage du score

    setTimeout(() => {
        currentQuestion++;
        showQuestion(); // Passer à la question suivante après un court délai
    }, 1000); // Pause d'une seconde avant de passer à la question suivante
}

function endQuiz() {
    document.getElementById('question').textContent = `Quiz terminé ! Votre score est ${score} sur ${maxQuestions}.`;
    document.getElementById('choices').innerHTML = '';
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Recommencer';
    restartButton.onclick = () => restartQuiz();
    document.getElementById('choices').appendChild(restartButton);
}

function restartQuiz() {
    currentQuestion = 0; // Réinitialiser la question courante
    score = 0; // Réinitialiser le score
    document.getElementById('score').textContent = `Score: ${score}`; // Mettre à jour l'affichage du score
    shuffleArray(countries); // Optionnel: Réinitialiser l'ordre des pays
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
        "value": 100, /* Nombre de particules */
      },
      "color": {
        "value": "#f45324", /* Couleur des particules */
      },
      "shape": {
        "type": "circle", /* Forme des particules */
      },
      "opacity": {
        "value": 0.5, /* Transparence des particules */
      },
      "size": {
        "value": 3, /* Taille des particules */
      },
      "move": {
        "direction": "top", /* Direction du mouvement */
        "speed": 2 /* Vitesse de déplacement */
      }
    }
  });
  
// Configuration pour Particles.js
