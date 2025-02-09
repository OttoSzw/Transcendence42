// Fonction pour gérer l'affichage des sections en fonction de l'état
function showSection(sectionId)
{
    document.getElementById('connexion').style.display = 'none';
    document.getElementById('choix').style.display = 'none';
    document.getElementById('choix-jeu').style.display = 'none';
    document.getElementById('choix-compte').style.display = 'none';
    document.getElementById('choix-social').style.display = 'none';
    document.getElementById('choix-PONG').style.display = 'none';
    document.getElementById('choix-player').style.display = 'none';
    document.getElementById('choix-ia').style.display = 'none';
    document.getElementById('choix-tournois').style.display = 'none';
    document.getElementById('match-display').style.display = 'none';

    document.getElementById(sectionId).style.display = 'block';

    history.pushState({ section: sectionId }, "", `#${sectionId}`);
}

// // Fonction de soumission du formulaire
// document.getElementById('formConnexion').addEventListener('submit', function(e) {
//     e.preventDefault(); // Empêche le rechargement de la page

//     const password = document.querySelector('input[name="password"]').value;
//     const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

//     if (password === confirmPassword) {
//         // Masquer la section de connexion et afficher la section des choix
//         showSection('choix');
//     } else {
//         alert("Les mots de passe ne correspondent pas !");
//     }
// });


// Gérer les changements d'historique (par exemple, lorsque l'utilisateur utilise le bouton retour)
window.onpopstate = function(event) {
    if (event.state) {
        showSection(event.state.section);
    }
};

// Initialiser la page à la section appropriée selon l'URL
if (window.location.hash) {
    const section = window.location.hash.substring(1);
    showSection(section);
} else {
    showSection('connexion');
}

// Ajouter l'événement click pour le bouton "Pour aller plus vite"
document.getElementById('raccourcis').addEventListener('click', function() {
    showSection('choix');
});

document.getElementById('button-jeu').addEventListener('click', function() {
    showSection('choix-jeu'); // Afficher la section du jeu
});

document.getElementById('button-compte').addEventListener('click', function() {
    showSection('choix-compte'); // Afficher la section du compte
});

document.getElementById('button-social').addEventListener('click', function() {
    showSection('choix-social'); // Afficher la section du social
});

let players = [];
let matches = [];
let currentMatchIndex = 0;  // Index du match en cours

function startTournament() {
    players = [
        document.getElementById('player1').value.trim(),
        document.getElementById('player2').value.trim(),
        document.getElementById('player3').value.trim(),
        document.getElementById('player4').value.trim()
    ];

    // Vérification si tous les champs sont remplis
    if (players.some(player => player === "")) {
        alert("Tous les joueurs doivent avoir un nom!");
        return;
    }

    // Vérification que les noms des joueurs ne sont pas identiques
    if (new Set(players).size !== players.length) {
        alert("Les noms des joueurs doivent être uniques!");
        return;
    }

    players = shuffle(players);

    matches = [
        { player1: players[0], player2: players[1], winner: null },
        { player1: players[2], player2: players[3], winner: null }
    ];
// Afficher le premier match
displayMatch();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Génère un index aléatoire
        [array[i], array[j]] = [array[j], array[i]];    // Échange les éléments
    }
    return array;
}


function displayMatch() {
    // Masquer la section des choix de tournoi
    document.getElementById('match-display').style.display = 'block';
    document.getElementById('choix-tournois').style.display = 'none';

    // Match 1
    document.getElementById('match1-players').textContent = `${matches[0].player1} vs ${matches[0].player2}`;

    // Match 2
    document.getElementById('match2-players').textContent = `${matches[1].player1} vs ${matches[1].player2}`;

    // Finale (met à jour avec les gagnants)
    if (matches[0].winner && matches[1].winner) {
        document.getElementById('final-players').textContent = `${matches[0].winner} vs ${matches[1].winner}`;
        document.getElementById('start-final').style.display = 'inline';  // Afficher le bouton "Jouer" de la finale
    } else {
        document.getElementById('final-players').textContent = 'En attente des gagnants';
        document.getElementById('start-final').style.display = 'none';  // Masquer le bouton tant que les gagnants ne sont pas connus
    }
}

