
import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("my-notes")) || [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const titleRef = useRef(null);

  // Save notes whenever the list changes.
  useEffect(() => {
    localStorage.setItem("my-notes", JSON.stringify(notes));
  }, [notes]);

  // Focus the title input.
  useEffect(() => {
    titleRef.current?.focus();
  }, [editingId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both a title and note content.");
      return;
    }

    if (editingId !== null) {
      setNotes((previousNotes) =>
        previousNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                updatedAt: new Date().toISOString(),
              }
            : note
        )
      );
      setEditingId(null);
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };

      setNotes((previousNotes) => [newNote, ...previousNotes]);
    }

    setTitle("");
    setContent("");
    titleRef.current?.focus();
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((previousNotes) =>
        previousNotes.filter((note) => note.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
    titleRef.current?.focus();
  };

  const filteredNotes = notes.filter((note) =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="app">
      <header className="header">
        <a className="logo" href="#">
          <span className="logo-icon">✎</span>
          NoteSpace
        </a>
        <span className="header-label">YOUR PERSONAL SPACE</span>
      </header>

      <main className="main">
        <section className="welcome">
          <p className="eyebrow">YOUR IDEAS, ORGANIZED</p>
          <h1>Capture your thoughts.</h1>
          <p className="subtitle">
            A simple space to write things down and keep them close.
          </p>
        </section>

        <section className="editor">
          <h2>{editingId !== null ? "Edit your note" : "Create a note"}</h2>

          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              type="text"
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              aria-label="Note title"
            />

            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              maxLength={5000}
              aria-label="Note content"
            />

            <div className="editor-footer">
              <span className="hint">
                {content.length}/5000 characters
              </span>

              <div className="actions">
                {editingId !== null && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}

                <button type="submit" className="save-btn">
                  {editingId !== null ? "Update note" : "+ Add note"}
                </button>
              </div>
            </div>
          </form>
        </section>

        <section className="notes-section">
          <div className="notes-heading">
            <div>
              <h2>Your notes</h2>
              <p>
                {notes.length} {notes.length === 1 ? "note" : "notes"} saved
              </p>
            </div>

            <input
              className="search"
              type="search"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notes"
            />
          </div>

          {filteredNotes.length > 0 ? (
            <div className="notes-grid">
              {filteredNotes.map((note, index) => (
                <article
                  className={`note-card note-color-${index % 4}`}
                  key={note.id}
                >
                  <div className="note-top">
                    <span className="note-symbol">✦</span>
                    <span className="note-date">
                      {formatDate(note.updatedAt || note.createdAt)}
                    </span>
                  </div>

                  <h3>{note.title}</h3>
                  <p className="note-content">{note.content}</p>

                  <div className="note-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(note)}
                      aria-label={`Edit ${note.title}`}
                    >
                      ✎ Edit
                    </button>
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => handleDelete(note.id)}
                      aria-label={`Delete ${note.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">✎</div>
              <h3>{search ? "No matching notes" : "Nothing here yet"}</h3>
              <p>
                {search
                  ? "Try another search term."
                  : "Your ideas deserve a place. Create your first note above!"}
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>Made with React & care. Keep your ideas growing. ✨</p>
      </footer>
    </div>
  );
}

export default App;
