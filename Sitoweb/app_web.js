import { db, storage } from './firebase-config.js';
import { ref, push, set, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a list of cities from your database
async function getCities(db) {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
// Funzione per aggiungere animazione al click
function addClickAnimation(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
        console.log(`Navigating to ${elementId} page...`);
        const href = this.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      }, 200);
    });
  }
}

// Aggiungi l'animazione a tutte le carte presenti nella pagina
function initializeCards() {
  const cardIds = ['resources', 'projects', 'courses'];
  cardIds.forEach(id => {
    if (document.getElementById(id)) {
      addClickAnimation(id);
    }
  });
}

// Animazione semplice per il titolo
function animateTitle() {
  const title = document.querySelector('h1');
  if (title) {
    title.style.opacity = '0';
    title.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
      title.style.opacity = '1';
    }, 500);
  }
}

// Inizializza tutte le funzionalità quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', function() {
  initializeCards();
  animateTitle();

  const projectForm = document.getElementById('projectForm');
  const projectList = document.getElementById('projectList');

  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titolo = document.getElementById('titolo').value;
      const descrizione = document.getElementById('descrizione').value;
      const file = document.getElementById('file')?.files[0];
      const immagine = document.getElementById('immagine')?.files[0];
    
      let fileUrl = '';
      let imageUrl = '';

      try {
        if (file) {
          const fileRef = storageRef(storage, `projects/${file.name}`);
          await uploadBytes(fileRef, file);
          fileUrl = await getDownloadURL(fileRef);
        }

        if (immagine) {
          const imageRef = storageRef(storage, `covers/${immagine.name}`);
          await uploadBytes(imageRef, immagine);
          imageUrl = await getDownloadURL(imageRef);
        }

        const newProject = {
          titolo,
          descrizione,
          fileUrl,
          imageUrl,
          dataCreazione: new Date().toISOString()
        };

        const projectsRef = ref(db, 'projects');
        const newProjectRef = push(projectsRef);
        await set(newProjectRef, newProject);

        console.log('Progetto salvato con successo!');
        projectForm.reset();
      } catch (error) {
        console.error('Errore durante il salvataggio del progetto:', error);
      }
    });
  }

  if (projectList) {
    const projectsRef = ref(db, 'projects');
    onValue(projectsRef, (snapshot) => {
      projectList.innerHTML = '';
      snapshot.forEach((childSnapshot) => {
        const project = childSnapshot.val();
        const projectElement = document.createElement('div');
        projectElement.innerHTML = `
          <h3>${project.titolo}</h3>
          <p>${project.descrizione}</p>
          ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.titolo}" style="max-width: 200px;">` : ''}
          <p>Data: ${new Date(project.dataCreazione).toLocaleString()}</p>
          ${project.fileUrl ? `<a href="${project.fileUrl}" target="_blank">Scarica progetto</a>` : ''}
        `;
        projectList.appendChild(projectElement);
      });
    });
  }
});