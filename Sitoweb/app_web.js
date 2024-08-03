// Funzione per aggiungere animazione al click
function addClickAnimation(elementId) {
    const element = document.getElementById(elementId);
    element.addEventListener('click', function(e) {
        e.preventDefault();
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            // Qui puoi aggiungere la navigazione alla pagina corrispondente
            console.log(`Navigating to ${elementId} page...`);
        }, 200);
    });
}

// Aggiungi l'animazione a tutte le carte
function initializeCards() {
    const cardIds = ['resources', 'projects', 'courses'];
    cardIds.forEach(addClickAnimation);
}

// Animazione semplice per il titolo
function animateTitle() {
    const title = document.querySelector('h1');
    title.style.opacity = '0';
    title.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        title.style.opacity = '1';
    }, 500);
}

// Inizializza tutte le funzionalità quando il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', function() {
    initializeCards();
    animateTitle();
});



// app_web.js
import { db, storage } from './firebase-config.js';
import { ref, push, onValue } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';

document.addEventListener('DOMContentLoaded', () => {
  const projectForm = document.getElementById('projectForm');
  const projectList = document.getElementById('projectList');

  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const titolo = document.getElementById('titolo').value;
      const descrizione = document.getElementById('descrizione').value;
      const file = document.getElementById('file').files[0];
      const immagine = document.getElementById('immagine').files[0];
    

      let fileUrl = '';
      let imageUrl = '';

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
      push(projectsRef, newProject);

      projectForm.reset();
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
console.log('Firebase inizializzato:', !!app);