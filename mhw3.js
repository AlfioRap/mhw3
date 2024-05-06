document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const menu = document.querySelector('.menu');
  const closeIcon = document.querySelector('.close-icon');

  menuIcon.addEventListener('click', function() {
    menu.classList.toggle('active');
  });

  closeIcon.addEventListener('click', function() {
    menu.classList.remove('active');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const images = [
      'im/uni.png',
      'im/sonny.png',
      'im/war.png',
      'im/net.png',
      'im/fed.png',
      'im/ral.png',
      'im/ads.png',
      'im/lav.png',
      'im/nik.png',
      'im/redb.png'
  ];

  let currentIndex = 0;

  const image1 = document.getElementById('image1');
  const image2 = document.getElementById('image2');
  const image3 = document.getElementById('image3');
  const image4 = document.getElementById('image4');
  const Back = document.getElementById('back');
  const Next = document.getElementById('next');

  function updateGallery() {
      image1.src = images[currentIndex];
      image2.src = images[currentIndex + 1];
      image3.src = images[currentIndex + 2];
      image4.src = images[currentIndex + 3];

      // Nascondi il pulsante "Back" quando siamo alla prima immagine
      if (currentIndex === 0) {
          Back.style.visibility = "hidden";
      } else {
          Back.style.visibility = "visible";
      }

      // Nascondi il pulsante "Next" quando siamo all'ultima immagine
      if (currentIndex >= images.length - 4) {
          Next.style.visibility = "hidden";
      } else {
          Next.style.visibility = "visible";
      }
  }

  Back.addEventListener('click', () => {
      if (currentIndex > 0) {
          currentIndex--;
          updateGallery();
      }
  });

  Next.addEventListener('click', () => {
      if (currentIndex < images.length - 4) {
          currentIndex++;
          updateGallery();
      }
  });

  const indicators = document.querySelectorAll('.indicator');

  indicators.forEach(indicator => {
      indicator.addEventListener('click', () => {
          const index = parseInt(indicator.dataset.index);
          currentIndex = index;
          updateGallery();
      });
  });

  updateGallery();
});






function onJson(json) {
  console.log('JSON ricevuto');
  // Svuotiamo la libreria
  const library = document.querySelector('#album-view');
  library.innerHTML = '';
  // Leggi il numero di risultati
  const results = json.albums.items;
  let num_results = results.length;
  // Mostriamone al massimo 6
  if(num_results > 6)
    num_results = 6;
  // Processa ciascun risultato
  for(let i=0; i<num_results; i++)
  {
    // Leggi il documento
    const album_data = results[i]
    // Leggiamo info
    const title = album_data.name;
    const selected_image = album_data.images[0].url;
    // Creiamo il div che conterrà immagine e didascalia
    const album = document.createElement('div');
    album.classList.add('album');
    // Creiamo l'immagine
    const img = document.createElement('img');
    img.src = selected_image;
    // Creiamo la didascalia
    const caption = document.createElement('span');
    caption.textContent = title;
    // Aggiungiamo immagine e didascalia al div
    album.appendChild(img);
    album.appendChild(caption);
    // Aggiungiamo il div alla libreria
    library.appendChild(album);
  }
}

function onResponse(response) {
  console.log('Risposta ricevuta');
  return response.json();
}

function search(event)
{
  // Impedisci il submit del form
  event.preventDefault();
  // Leggi valore del campo di testo
  const album_input = document.querySelector('#album');
  const album_value = encodeURIComponent(album_input.value);
  console.log('Eseguo ricerca: ' + album_value);
  // Esegui la richiesta
  fetch("https://api.spotify.com/v1/search?type=album&q=" + album_value,
    {
      headers:
      {
        'Authorization': 'Bearer ' + token
      }
    }
  ).then(onResponse).then(onJson);
}

function onTokenJson(json)
{
  // Imposta il token global
  token = json.access_token;
}

function onTokenResponse(response)
{
  return response.json();
}

// OAuth credentials --- NON SICURO!
const client_id = '576cf47bee724458a12602a5fe7f5008';
const client_secret = '9633a2b446da49b0b935d8c75e33092d';
// Dichiara variabile token
let token;
// All'apertura della pagina, richiediamo il token
fetch("https://accounts.spotify.com/api/token",
	{
   method: "post",
   body: 'grant_type=client_credentials',
   headers:
   {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
   }
  }
).then(onTokenResponse).then(onTokenJson);
// Aggiungi event listener al form
const form = document.querySelector('form');
form.addEventListener('submit', search)