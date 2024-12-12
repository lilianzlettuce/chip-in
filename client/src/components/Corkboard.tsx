import React, { useEffect, useState } from 'react';
import './Corkboard.css';
import { useParams } from 'react-router-dom';

type NoteType = 'Note' | 'Meeting' | 'Reminder' | 'TODO';

interface Note {
  _id: string;
  category: NoteType;
  content: string;
  urgent?: boolean;
}

const Corkboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteUrgent, setNewNoteUrgent] = useState(false);
  const [newNoteCategory, setNewNoteCategory] = useState<NoteType>('Note');
  const { householdId } = useParams();

  // Get env vars
  const PORT = process.env.REACT_APP_PORT || 6969;
  const SERVER_URL = process.env.REACT_APP_SERVER_URL || `http://localhost:${PORT}`;

  useEffect(() => {
    if (householdId) fetchNotes();
  }, [householdId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/note/${householdId}`);
      if (!response.ok) throw new Error('Error fetching notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAddNote = async () => {
    const newNote = {
      category: newNoteCategory,
      content: newNoteContent,
      urgent: newNoteUrgent,
    };

    try {
      const response = await fetch(`${SERVER_URL}/note/${householdId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      if (!response.ok) throw new Error('Error adding note');
      const createdNote = await response.json();
      setNotes([...notes, createdNote.note]);
      closeModal();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/note/${householdId}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting note');
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const toggleNotesVisibility = () => {
    setShowNotes(prevShowNotes => !prevShowNotes);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewNoteContent('');
    setNewNoteUrgent(false);
    setNewNoteCategory('Note');
  };

  return (
    <div className="corkboard">
      <div className="corkboard-header">
        <h3>Corkboard</h3>
        <div className="corkboard-actions">
          <button onClick={toggleNotesVisibility}>
            {showNotes ? 'Hide Notes' : 'Show Notes'}
          </button>
          <button onClick={openModal}>Add Note +</button>
        </div>
      </div>

      {showNotes && (
        <div className="corkboard-notes">
          {notes.map((note) => (
            <div key={note._id} className={`corkboard-note ${note.category}`}>
              <span>
                {note.urgent && <span className="urgent-icon">⚠️</span>}
                {note.category.charAt(0).toUpperCase() + note.category.slice(1)}:
              </span>
              <strong>{note.content}</strong>
              <button className="delete-note" onClick={() => deleteNote(note._id)}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Adding a New Note */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Note</h3>
            <label>
              Content:
              <input
                type="text"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
            </label>
            <label>
              Urgent:
              <input
                type="checkbox"
                checked={newNoteUrgent}
                onChange={(e) => setNewNoteUrgent(e.target.checked)}
              />
            </label>
            <label>
              Category:
              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value as NoteType)}
              >
                <option value="Note">Note</option>
                <option value="Meeting">Meeting</option>
                <option value="Reminder">Reminder</option>
                <option value="TODO">TODO</option>
              </select>
            </label>
            <div className="modal-actions">
              <button className="add-button" onClick={handleAddNote}>Add</button>
              <button className="cancel-button" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Corkboard;