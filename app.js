const STORAGE_KEY = "bookLog";
const defaultBooks = [
  { id: 1, title: "Atomic Habits", author: "James Clear", status: "Finished", rating: 5, notes: "Very actionable and clear." },
  { id: 2, title: "Deep Work", author: "Cal Newport", status: "Finished", rating: 4, notes: "Great for focus habits." },
  { id: 3, title: "Clean Code", author: "Robert C. Martin", status: "Want to read", rating: 0, notes: "Plan to read later." },
  { id: 4, title: "The Pragmatic Programmer", author: "Andrew Hunt", status: "Want to read", rating: 0, notes: "Recommended for developers." },
  { id: 5, title: "You Don't Know JS", author: "Kyle Simpson", status: "Reading", rating: 3, notes: "Deep but rewarding." }
];

const table = document.getElementById("bookTable");
const summary = document.getElementById("summary");
const form = document.getElementById("bookForm");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const statusInput = document.getElementById("status");
const ratingInput = document.getElementById("rating");
const notesInput = document.getElementById("notes");

const books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultBooks;
let nextId = books.length ? Math.max(...books.map(book => book.id)) + 1 : 1;

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function renderSummary() {
  const counts = books.reduce((acc, book) => {
    acc[book.status] = (acc[book.status] || 0) + 1;
    return acc;
  }, {});

  summary.innerHTML = `
    <div class="summary-item">
      <span>Total books</span>
      <strong>${books.length}</strong>
    </div>
    <div class="summary-item">
      <span>Finished</span>
      <strong>${counts["Finished"] || 0}</strong>
    </div>
    <div class="summary-item">
      <span>Reading</span>
      <strong>${counts["Reading"] || 0}</strong>
    </div>
    <div class="summary-item">
      <span>Want to read</span>
      <strong>${counts["Want to read"] || 0}</strong>
    </div>
  `;
}

function renderBooks() {
  table.innerHTML = "";

  if (!books.length) {
    table.innerHTML = `
      <tr>
        <td colspan="6" class="empty">No books yet. Add one using the form above.</td>
      </tr>
    `;
    return;
  }

  books.forEach(book => {
    const row = document.createElement("tr");

    const ratingCell = book.status === "Finished"
      ? `<select onchange="updateRating(${book.id}, this.value)">
          <option value="0" ${book.rating === 0 ? "selected" : ""}>No rating</option>
          <option value="1" ${book.rating === 1 ? "selected" : ""}>1 star</option>
          <option value="2" ${book.rating === 2 ? "selected" : ""}>2 stars</option>
          <option value="3" ${book.rating === 3 ? "selected" : ""}>3 stars</option>
          <option value="4" ${book.rating === 4 ? "selected" : ""}>4 stars</option>
          <option value="5" ${book.rating === 5 ? "selected" : ""}>5 stars</option>
        </select>`
      : renderStars(book.rating);

    const notesCell = book.status === "Finished"
      ? `<textarea onchange="updateNotes(${book.id}, this.value)">${book.notes || ""}</textarea>`
      : `<span class="muted">Add notes after finishing.</span>`;

    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>
        <select onchange="updateStatus(${book.id}, this.value)">
          <option value="Want to read" ${book.status === "Want to read" ? "selected" : ""}>Want to read</option>
          <option value="Reading" ${book.status === "Reading" ? "selected" : ""}>Reading</option>
          <option value="Finished" ${book.status === "Finished" ? "selected" : ""}>Finished</option>
        </select>
      </td>
      <td>${ratingCell}</td>
      <td class="notes">${notesCell}</td>
      <td>
        <button class="delete" onclick="deleteBook(${book.id})">Delete</button>
      </td>
    `;

    table.appendChild(row);
  });
}

function renderStars(rating) {
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return rating > 0 ? `${filled}${empty}` : "—";
}

function addBook(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const status = statusInput.value;
  const rating = Number(ratingInput.value);
  const notes = notesInput.value.trim();

  if (!title || !author) {
    return;
  }

  books.unshift({
    id: nextId++,
    title,
    author,
    status,
    rating,
    notes
  });

  saveBooks();
  renderBooks();
  renderSummary();
  form.reset();
  titleInput.focus();
}

function updateStatus(id, newStatus) {
  const book = books.find(book => book.id === id);
  if (!book) return;

  book.status = newStatus;
  saveBooks();
  renderBooks();
  renderSummary();
}

function updateRating(id, newRating) {
  const book = books.find(book => book.id === id);
  if (!book) return;

  book.rating = Number(newRating);
  saveBooks();
  renderBooks();
}

function updateNotes(id, newNotes) {
  const book = books.find(book => book.id === id);
  if (!book) return;

  book.notes = newNotes;
  saveBooks();
}

function deleteBook(id) {
  const index = books.findIndex(book => book.id === id);
  if (index === -1) return;

  books.splice(index, 1);
  saveBooks();
  renderBooks();
  renderSummary();
}

form.addEventListener("submit", addBook);
renderSummary();
renderBooks();
