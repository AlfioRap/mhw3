// Spostare la tua chiave API in una posizione sicura
const API_KEY = "AIzaSyCXd8-DzhjLSwKvOTPJzFJkZHiKvsPNAJs";

// Elementi del DOM
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');

// URL API
const LYRICS_API_URL = 'https://api.lyrics.ovh';

// Funzione per cercare canzoni
async function searchSong(searchValue) {
    try {
        const response = await fetch(`${LYRICS_API_URL}/suggest/${searchValue}`);
        const data = await response.json();
        showSongs(data);
    } catch (error) {
        console.error("Errore nella ricerca delle canzoni:", error);
    }
}

// Funzione per visualizzare i risultati della ricerca
function showSongs(data) {
    if (data && data.data && data.data.length > 0) {
        const songs = data.data.map(song => `
            <li>
                <div>
                    <strong>${song.artist.name}</strong> - ${song.title}
                </div>
                <button class="get-lyrics" 
                    data-artist="${song.artist.name}" 
                    data-songtitle="${song.title}">
                    Ottieni Testo
                </button>
            </li>
        `).join('');
        result.innerHTML = `<ul class="song-list">${songs}</ul>`;
    } else {
        result.innerHTML = "<p>Nessuna canzone trovata.</p>";
    }
}

// Funzione per ottenere il testo della canzone
async function getLyrics(artist, songTitle) {
    try {
        const res = await fetch(`${LYRICS_API_URL}/v1/${artist}/${songTitle}`);
        const data = await res.json();
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        const lyricsContainer = document.createElement('div');
        lyricsContainer.innerHTML = `
            <h4><strong>${artist}</strong> - ${songTitle}</h4>
            <p>${lyrics}</p>
        `;
        result.appendChild(lyricsContainer);
    } catch (error) {
        console.error("Errore nel recupero del testo della canzone:", error);
    }
}

// Event listener per la ricerca di canzoni
form.addEventListener('submit', e => {
    e.preventDefault();
    const searchValue = search.value.trim();

    if (!searchValue) {
        alert("Si prega di inserire una query di ricerca");
    } else {
        searchSong(searchValue);
    }
});

// Event listener per ottenere i testi delle canzoni
result.addEventListener('click', async e => {
    const clickedElement = e.target;

    if (clickedElement.classList.contains('get-lyrics')) {
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        getLyrics(artist, songTitle);
    }
});
