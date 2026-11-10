/**
 * COMP4537 - Lab 1
 * Name: Victor Liu #A00971668 - Set C
 * Date: 2024-09-15
 * 
 * reader.js
 * 
 * note: code Assisted with basic coding tools has been commented where used.
 */

document.addEventListener('DOMContentLoaded', function () {

    var notesContainer = document.getElementById('notes-container');

    // CHATGPT: Disable editing for all textareas within notes
    var disableTextAreas = () => {
        var textareas = notesContainer.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            textarea.disabled = true; // Disable editing
        });
    };
    disableTextAreas();


    var hideDeleteButtons = () => {
        var deleteButtons = notesContainer.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.style.display = 'none'; // Hide delete buttons
        });
    };
    hideDeleteButtons();


    setInterval(() => {
        noteManager.getNotesFromStorage();
        noteManager.updateNotes(); // Update notes based on localStorage changes
    }, 2000);

    // CHATGPT: Update the notes if the "notes" key in localStorage changes in other tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'notes') {
            console.log("STORAGE CHANGED")
            noteManager.getNotesFromStorage();
            noteManager.updateNotes(); 
            disableTextAreas();
            hideDeleteButtons();
        }
    });
});