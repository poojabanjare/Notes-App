// DOM Elements
const toggleThemeBtn = document.getElementById('toggle-theme');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const noteColorInput = document.getElementById('note-color');
const addNoteBtn = document.getElementById('add-note');
const notesContainer = document.getElementById('notes-container');
const boldBtn = document.getElementById('bold-btn');
const italicBtn = document.getElementById('italic-btn');
const underlineBtn = document.getElementById('underline-btn');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

let editingIndex = -1; // Track index of the note being edited

// Toggle Dark/Light Mode
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleThemeBtn.textContent = document.body.classList.contains('dark-mode')
    ? '☀️ Light Mode'
    : '🌙 Dark Mode';
});

// Load Notes
function loadNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notesContainer.innerHTML = '';
  notes.forEach((note, index) => {
    createNoteElement(note.title, note.content, note.color, note.date, index);
  });
}

// Create Note Element
function createNoteElement(title, content, color, date, index) {
  const noteElement = document.createElement('div');
  noteElement.classList.add('note');
  noteElement.style.backgroundColor = color;

  noteElement.innerHTML = `
    <h3>${title}</h3>
    <p>${content}</p>
    <p class="note-date">${date}</p>
    <div class="note-actions">
      <button onclick="editNote(${index})" class="edit-btn">Edit</button>
      <button onclick="deleteNote(${index})" class="delete-btn">Delete</button>
    </div>
  `;

  notesContainer.appendChild(noteElement);
}

const backToNotesBtn = document.getElementById('back-to-notes');

// Search Notes
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const notes = JSON.parse(localStorage.getItem('notes')) || [];

  // Filter notes by title or content
  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm) ||
    note.content.toLowerCase().includes(searchTerm)
  );

  // Clear and display filtered notes
  notesContainer.innerHTML = '';
  filteredNotes.forEach((note, index) => {
    createNoteElement(note.title, note.content, note.color, note.date, index);
  });

  // Show back button if search term is present
  backToNotesBtn.style.display = searchTerm ? 'inline-block' : 'none';
});

// Back to All Notes
backToNotesBtn.addEventListener('click', () => {
  searchInput.value = ''; // Clear search input
  backToNotesBtn.style.display = 'none'; // Hide back button
  loadNotes(); // Reload all notes
});
// Add or Update Note
addNoteBtn.addEventListener('click', () => {
  const title = noteTitleInput.innerHTML.trim();
  const content = noteContentInput.innerHTML.trim();
  const color = noteColorInput.value;
  const date = new Date().toLocaleString();

  if (title && content) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    if (editingIndex >= 0) {
      // Update existing note
      notes[editingIndex] = { title, content, color, date };
      editingIndex = -1; // Reset editing index
      addNoteBtn.textContent = "Add Note"; // Reset button text
    } else {
      // Add new note
      notes.push({ title, content, color, date });
    }

    localStorage.setItem('notes', JSON.stringify(notes));
    noteTitleInput.innerHTML = '';
    noteContentInput.innerHTML = '';
    loadNotes();
  }
});

// Edit Note
window.editNote = (index) => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  const note = notes[index];

  noteTitleInput.innerHTML = note.title;
  noteContentInput.innerHTML = note.content;
  noteColorInput.value = note.color;

  editingIndex = index; // Set the index of the note being edited
  addNoteBtn.textContent = "Update Note"; // Change button text
  noteTitleInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// Delete Note
window.deleteNote = (index) => {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  loadNotes();
};

const deleteAllNotesBtn = document.getElementById('delete-all-notes');

// Delete All Notes
deleteAllNotesBtn.addEventListener('click', () => {
  const confirmDelete = confirm("Are you sure you want to delete all notes?");
  
  if (confirmDelete) {
    localStorage.removeItem('notes'); // Clear all notes from localStorage
    loadNotes(); // Reload the notes display
    alert("All notes have been deleted.");
  }
});

// Text Formatting
boldBtn.addEventListener('click', () => {
  document.execCommand('bold');
});

italicBtn.addEventListener('click', () => {
  document.execCommand('italic');
});

underlineBtn.addEventListener('click', () => {
  document.execCommand('underline');
});

// Search Notes
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.toLowerCase().trim();
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notesContainer.innerHTML = '';

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(query) || 
    note.content.toLowerCase().includes(query)
  );

  filteredNotes.forEach((note, index) => {
    createNoteElement(note.title, note.content, note.color, note.date, index);
  });
});

// Add Placeholder Functionality
function addPlaceholder(element, placeholderText) {
  if (!element.textContent.trim()) {
    element.textContent = placeholderText;
    element.classList.add('placeholder');
  }

  element.addEventListener('focus', () => {
    if (element.textContent === placeholderText) {
      element.textContent = '';
      element.classList.remove('placeholder');
    }
  });

  element.addEventListener('blur', () => {
    if (!element.textContent.trim()) {
      element.textContent = placeholderText;
      element.classList.add('placeholder');
    }
  });
}

// Apply placeholders to title and content inputs
addPlaceholder(noteTitleInput, 'Enter Title...');
addPlaceholder(noteContentInput, 'Enter your note...');

// Initial Load
loadNotes();