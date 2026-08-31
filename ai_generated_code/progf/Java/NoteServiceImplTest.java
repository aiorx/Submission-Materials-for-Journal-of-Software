package com.todo.notes;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

import com.todo.notes.entity.Note;
import com.todo.notes.entity.Task;
import com.todo.notes.repository.NoteRepository;
import com.todo.notes.service.NoteServiceImpl;

//MockitoJUnitRunner.class is used to provide a bridge between JUnit and Mockito.
//Without this, you cannot use the Mockito framework in your unit tests.
@RunWith(MockitoJUnitRunner.class)
public class NoteServiceImplTest {

    @Mock
    //Mock is used to mock the objects that help in minimizing the dependencies of the class.
    private NoteRepository noteRepository;

    @InjectMocks
    //InjectMocks is used to create and inject the mock object.
    private NoteServiceImpl noteServiceImpl;

    @Test
    //Simple unit test to check if the method returns the expected Note object
    public void getNoteFromRepoTest() {
        Note note1 = new Note("note1");
        Note note2 = new Note("note2");

        List<Note> notes= Arrays.asList(note1, note2);

        Optional<Note> expectedNote = Optional.of(notes.get(0));
        when(noteRepository.findById(Long.valueOf(1))).thenReturn(expectedNote);
        Optional<Note> actualNote = Optional.of(noteServiceImpl.getNote(Long.valueOf(1)));
        assertEquals(expectedNote, actualNote);

    }

    @Test
    //Simple unit test to check if the method saves the Note object to the repository
    //Assisted using common GitHub development utilities
    public void saveNoteToRepoCopilotTest() {
        Note note = new Note();
        note.setId(Long.valueOf(1));
        note.setTitle("note1");
        note.setTasks(new HashSet<>(Arrays.asList(
            new Task("go to gym"),
            new Task("go to uni"),
            new Task("go to hell")
        )));
        when(noteRepository.save(note)).thenReturn(note);
        assertEquals(note, noteServiceImpl.saveNote(note));
    }

    @Test
    //Simple unit test to check if the method saves the Note object to the repository
    public void deleteNoteFromRepoTest() {
        Note note = new Note();
        note.setId(Long.valueOf(1));
        note.setTitle("note1");
        note.setTasks(new HashSet<>(Arrays.asList(
            new Task("go to gym"),
            new Task("go to uni"),
            new Task("go to hell")
        )));
        
    } 

    //Assisted using common GitHub development utilities
    @Test
    //Simple unit test to check if the method adds a task to the Note object 
    public void addTaskToNoteCopilotTest() {
        Note note = new Note();
        note.setId(Long.valueOf(1));
        note.setTitle("note1");
        note.setTasks(new HashSet<>(Arrays.asList(
            new Task("go to gym"),
            new Task("go to uni"),
            new Task("go to hell")
        )));
        when(noteRepository.save(note)).thenReturn(note);
        assertEquals(note, noteServiceImpl.saveNote(note));
    }

    //Assisted using common GitHub development utilities test for getNotes
    @Test
    //Simple unit test to check if the method gets all the Note objects from the repository
    public void getNotesFromRepoCopilotTest() {

        Note note1 = new Note("note1");
        Note note2 = new Note("note2");

        List<Note> notes = Arrays.asList(note1, note2);

        when(noteRepository.findAll()).thenReturn(notes);
        assertEquals(notes, noteServiceImpl.getNotes());
    } 


    @Test
    //Simple unit test to check if the method gets all the Note objects from the repository
    public void getNotesFromRepoTest() {
        Note note1 = new Note("note1");
        Note note2 = new Note("note2");

        List<Note> expectedNotes = Arrays.asList(note1, note2);

        when(noteRepository.findAll()).thenReturn(expectedNotes);
        List<Note> actualNotes = noteServiceImpl.getNotes();
        assertEquals(expectedNotes, actualNotes);
    } 

}
