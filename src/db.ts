import Dexie, { Table } from 'dexie';

export interface Book {
  id?: number;
  title: string;
  author: string;
  category: string;
  coverId: string; // Used for simulated covers
}

export interface Student {
  id: string; // Student ID
  name: string;
}

export interface BorrowTransaction {
  id?: number;
  studentId: string;
  bookId: number;
  issueDate: number;
  dueDate: number;
  returned: boolean;
}

export class LibraryDB extends Dexie {
  books!: Table<Book>;
  students!: Table<Student>;
  transactions!: Table<BorrowTransaction>;

  constructor() {
    super('LibraryDB');
    this.version(1).stores({
      books: '++id, title, author, category',
      students: 'id, name',
      transactions: '++id, studentId, bookId, returned',
    });
  }
}

export const db = new LibraryDB();

// Seed data helper
export async function seedDatabase() {
  const booksCount = await db.books.count();
  if (booksCount === 0) {
    await db.books.bulkAdd([
      { title: 'CRASH_OVERRIDE', author: 'Zero Cool', category: 'Hacking', coverId: '1' },
      { title: 'NEUROMANCER_V2', author: 'Gibson.sys', category: 'Cyberpunk', coverId: '2' },
      { title: 'GHOST_IN_SHELL', author: 'Masamune.K', category: 'Manga', coverId: '3' },
      { title: 'SNOW_CRASH', author: 'Stephenson.exe', category: 'Sci-Fi', coverId: '4' },
      { title: 'DO_ANDROIDS_DREAM', author: 'Dick.Pk', category: 'Classic', coverId: '5' },
      { title: 'THE_DIAMOND_AGE', author: 'Stephenson.exe', category: 'Post-Cyber', coverId: '6' },
      { title: 'BRAVE_NEW_VIRTUAL', author: 'Huxley.io', category: 'Dystopia', coverId: '7' },
      { title: 'THE_MODULAR_BRAIN', author: 'Restak.sys', category: 'Neuro', coverId: '8' },
      { title: 'PATTERN_RECOGNITION', author: 'Gibson.sys', category: 'Contemporary', coverId: '9' },
      { title: 'READY_PLAYER_ZERO', author: 'Cline.sys', category: 'VR', coverId: '10' },
      { title: 'HARD_BOILED_WONDER', author: 'Murakami.sys', category: 'Surreal', coverId: '11' },
      { title: 'CRYPTOMICON', author: 'Stephenson.exe', category: 'Crypto', coverId: '12' },
    ]);
  }
}
