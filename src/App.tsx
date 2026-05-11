import { useEffect, useState, useRef } from 'react';
import { Home, BarChart3, Trophy, ScanLine, Plus, Search, User, ArrowRight, Book as BookIcon, MessageSquare, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
type View = 'LOGIN' | 'HOME' | 'STATS' | 'LEADERBOARD' | 'SCANNER' | 'ASSISTANT';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  isBorrowed: boolean;
  pages: string[];
}

interface Transaction {
  id: number;
  bookId: number;
  dueDate: number;
  isOverdue: boolean;
}

const generatePages = (title: string, author: string) => {
  return Array.from({ length: 20 }, (_, i) => 
    `ಪುಟ ${i + 1}: ${title} - ಅಧ್ಯಾಯ ${Math.floor(i/4) + 1}\n\nಇದು ${author} ಅವರಿಂದ ಬರೆಯಲ್ಪಟ್ಟ "${title}" ಪುಸ್ತಕದ ಒಂದು ಮಾದರಿ ಪುಟ. ಈ ಭಾಗದಲ್ಲಿ, ನಾವು ${title.split(' ')[0]} ವಿಷಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದ ಆಳವಾದ ಪರಿಕಲ್ಪನೆಗಳನ್ನು ಮತ್ತು ಆಧುನಿಕ ತಂತ್ರಜ್ಞಾನದ ಜಗತ್ತಿನಲ್ಲಿ ಅದರ ಪ್ರಭಾವವನ್ನು ಅನ್ವೇಷಿಸುತ್ತೇವೆ.\n\nಈ ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೌಶಲಗಳನ್ನು ಬೆಳೆಸಿಕೊಳ್ಳಲು ನಿರಂತರ ಅಭ್ಯಾಸ ಮತ್ತು ಓದುವಿಕೆ ಅಗತ್ಯ. ನೀವು ಈ ಪುಟಗಳನ್ನು ಓದುತ್ತಾ ಹೋದಂತೆ, ${author} ಅವರು ಹಂಚಿಕೊಳ್ಳುತ್ತಿರುವ ಜ್ಞಾನದ ಸಂಪತ್ತನ್ನು ಕಲ್ಪಿಸಿಕೊಳ್ಳಿ. ಈ ಲೈಬ್ರರಿ ಸಹಾಯಕ ಸಿಮ್ಯುಲೇಟರ್ ನಮ್ಮ ಸಂಗ್ರಹದಲ್ಲಿರುವ ಯಾವುದೇ ಪುಸ್ತಕದ ಮೊದಲ 20 ಪುಟಗಳನ್ನು ಪೂರ್ವವೀಕ್ಷಣೆ ಮಾಡಲು ನಿಮಗೆ ಅನುಮತಿಸುತ್ತದೆ, ಇದರಿಂದ ನೀವು ಶೆಲ್ಫ್ A-12 ರಿಂದ ಭೌತಿಕ ಪ್ರತಿಯನ್ನು ಎರವಲು ಪಡೆಯಬೇಕೆ ಎಂದು ನಿರ್ಧರಿಸಲು ಸಹಾಯವಾಗುತ್ತದೆ.`
  );
};

const SAMPLE_BOOKS: Book[] = [
  { 
    id: 1, 
    title: 'ಕನ್ನಡ ವ್ಯಾಕರಣ', 
    author: 'ಎಂ. ಹಿರಿಯಣ್ಣಯ್ಯ', 
    category: 'ಚರಿತ್ರೆ', 
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
    description: 'ಕನ್ನಡ ಭಾಷೆಯ ವ್ಯಾಕರಣದ ಬಗ್ಗೆ ಆಳವಾದ ಮತ್ತು ಸರಳವಾದ ಮಾಹಿತಿ ನೀಡುವ ಪುಸ್ತಕ.',
    isBorrowed: false,
    pages: generatePages('ಕನ್ನಡ ವ್ಯಾಕರಣ', 'ಎಂ. ಹಿರಿಯಣ್ಣಯ್ಯ')
  },
  { 
    id: 2, 
    title: 'ವಿಜ್ಞಾನ ಲೋಕ', 
    author: 'ಜಿನದತ್ತ', 
    category: 'ವಿಜ್ಞಾನ', 
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    description: 'ಆಧುನಿಕ ವಿಜ್ಞಾನದ ಅದ್ಭುತ ಲೋಕವನ್ನು ಪರಿಚಯಿಸುವ ಕೃತಿ.',
    isBorrowed: false,
    pages: generatePages('ವಿಜ್ಞಾನ ಲೋಕ', 'ಜಿನದತ್ತ')
  },
  { 
    id: 3, 
    title: 'ಕರ್ನಾಟಕ ಭೂಗೋಳ', 
    author: 'ಎಸ್. ರಾವ್', 
    category: 'ಭೂಗೋಳ', 
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&q=80',
    description: 'ಕರ್ನಾಟಕದ ನೈಸರ್ಗಿಕ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ಭೂಗೋಳದ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.',
    isBorrowed: false,
    pages: generatePages('ಕರ್ನಾಟಕ ಭೂಗೋಳ', 'ಎಸ್. ರಾವ್')
  },
  { 
    id: 4, 
    title: 'ತಂತ್ರಜ್ಞಾನದ ದಾರಿ', 
    author: 'ಕೆ. ಶರ್ಮ', 
    category: 'ತಾಂತ್ರಿಕ', 
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80',
    description: 'ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಅದರ ಬೆಳವಣಿಗೆಯ ಇತಿಹಾಸ.',
    isBorrowed: false,
    pages: generatePages('ತಂತ್ರಜ್ಞಾನದ ದಾರಿ', 'ಕೆ. ಶರ್ಮ')
  },
  { 
    id: 5, 
    title: 'ಹಳೆಗನ್ನಡ ಸಾಹಿತ್ಯ', 
    author: 'ಆರ್. ನರಸಿಂಹಾಚಾರ್', 
    category: 'ಚರಿತ್ರೆ', 
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80',
    description: 'ಹಳೆಗನ್ನಡದ ಕವಿಗಳು ಮತ್ತು ಅವರ ಕೃತಿಗಳ ಬಗ್ಗೆ ವಿಶ್ಲೇಷಣೆ.',
    isBorrowed: false,
    pages: generatePages('ಹಳೆಗನ್ನಡ ಸಾಹಿತ್ಯ', 'ಆರ್. ನರಸಿಂಹಾಚಾರ್')
  },
  { 
    id: 6, 
    title: 'ಪರಿಸರ ವಿಜ್ಞಾನ', 
    author: 'ಎಚ್. ನಾಯಕ್', 
    category: 'ವಿಜ್ಞಾನ', 
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=300&q=80',
    description: 'ನಮ್ಮ ಸುತ್ತಮುತ್ತಲಿನ ಪರಿಸರ ಮತ್ತು ಅದರ ರಕ್ಷಣೆಯ ಮಹತ್ವ.',
    isBorrowed: false,
    pages: generatePages('ಪರಿಸರ ವಿಜ್ಞಾನ', 'ಎಚ್. ನಾಯಕ್')
  },
  { 
    id: 7, 
    title: 'ವಿಶ್ವ ಭೂಪಟ', 
    author: 'ಬಿ. ಗುಪ್ತ', 
    category: 'ಭೂಗೋಳ', 
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80',
    description: 'ಜಗತ್ತಿನ ವಿವಿಧ ರಾಷ್ಟ್ರಗಳ ಬಗ್ಗೆ ಆಸಕ್ತಿದಾಯಕ ಮಾಹಿತಿ.',
    isBorrowed: false,
    pages: generatePages('ವಿಶ್ವ ಭೂಪಟ', 'ಬಿ. ಗುಪ್ತ')
  },
  { 
    id: 8, 
    title: 'ಕಂಪ್ಯೂಟರ್ ಶಿಕ್ಷಣ', 
    author: 'ವಿ. ಪಾಟೀಲ್', 
    category: 'ತಾಂತ್ರಿಕ', 
    image: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=300&q=80',
    description: 'ಕಂಪ್ಯೂಟರ್ ಮೂಲಭೂತ ಅಂಶಗಳನ್ನು ಕಲಿಯಲು ಉತ್ತಮ ಪುಸ್ತಕ.',
    isBorrowed: false,
    pages: generatePages('ಕಂಪ್ಯೂಟರ್ ಶಿಕ್ಷಣ', 'ವಿ. ಪಾಟೀಲ್')
  },
  { 
    id: 9, 
    title: 'ಮೈಸೂರು ಅರಸರು', 
    author: 'ಟಿ. ರಾಮಣ್ಣ', 
    category: 'ಚರಿತ್ರೆ', 
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=300&q=80',
    description: 'ಒಡೆಯರ್ ಮನೆತನದ ಇತಿಹಾಸ ಮತ್ತು ಮೈಸೂರಿನ ಅಭಿವೃದ್ಧಿ.',
    isBorrowed: false,
    pages: generatePages('ಮೈಸೂರು ಅರಸರು', 'ಟಿ. ರಾಮಣ್ಣ')
  },
  { 
    id: 10, 
    title: 'ಜೀವಕೋಶಗಳ ಆಟ', 
    author: 'ಎನ್. ಕೃಷ್ಣ', 
    category: 'ವಿಜ್ಞಾನ', 
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80',
    description: 'ಮಾನವ ದೇಹದ ಜೀವಕೋಶಗಳ ಕಾರ್ಯವೈಖರಿಯ ಬಗ್ಗೆ ವಿವರ.',
    isBorrowed: false,
    pages: generatePages('ಜೀವಕೋಶಗಳ ಆಟ', 'ಎನ್. ಕೃಷ್ಣ')
  },
  { id: 11, title: 'ಭಾರತದ ನದಿಗಳು', author: 'ಎಸ್. ಮಠ', category: 'ಭೂಗೋಳ', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80', description: 'ಭಾರತದ ಪ್ರಮುಖ ನದಿಗಳು ಮತ್ತು ಅವುಗಳ ಉಗಮಸ್ಥಾನಗಳು.', isBorrowed: false, pages: generatePages('ಭಾರತದ ನದಿಗಳು', 'ಎಸ್. ಮಠ') },
  { id: 12, title: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಜಗತ್ತು', author: 'ಆರ್. ಹೆಗಡೆ', category: 'ತಾಂತ್ರಿಕ', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=300&q=80', description: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಉಪಕರಣಗಳ ಕಾರ್ಯನಿರ್ವಹಣೆಯ ಬಗ್ಗೆ ಮಾಹಿತಿ.', isBorrowed: false, pages: generatePages('ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಜಗತ್ತು', 'ಆರ್. ಹೆಗಡೆ') },
  { id: 13, title: 'ಕದಂಬರ ಕಾಲ', author: 'ವಿ. ಶಾಸ್ತ್ರಿ', category: 'ಚರಿತ್ರೆ', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=300&q=80', description: 'ಕದಂಬ ರಾಜವಂಶದ ಸ್ಥಾಪನೆ ಮತ್ತು ಅವರ ಆಳ್ವಿಕೆ.', isBorrowed: false, pages: generatePages('ಕದಂಬರ ಕಾಲ', 'ವಿ. ಶಾಸ್ತ್ರಿ') },
  { id: 14, title: 'ಅಂತರಿಕ್ಷ ಯಾನ', author: 'ಎಂ. ಪ್ರಸಾದ್', category: 'ವಿಜ್ಞಾನ', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80', description: 'ಬಾಹ್ಯಾಕಾಶ ಸಂಶೋಧನೆಯ ಇತಿಹಾಸ ಮತ್ತು ಇಸ್ರೋ ಸಾಧನೆಗಳು.', isBorrowed: false, pages: generatePages('ಅಂತರಿಕ್ಷ ಯಾನ', 'ಎಂ. ಪ್ರಸಾದ್') },
  { id: 15, title: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು', author: 'ಡಿ. ಕುಮಾರ್', category: 'ಭೂಗೋಳ', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80', description: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ವೈವಿಧ್ಯತೆ ಮತ್ತು ಜೀವಸಂಕುಲದ ರಕ್ಷಣೆ.', isBorrowed: false, pages: generatePages('ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು', 'ಡಿ. ಕುಮಾರ್') },
  { id: 16, title: 'ಕೋಡಿಂಗ್ ಮಂತ್ರ', author: 'ಎಸ್. ನಾರಾಯಣ್', category: 'ತಾಂತ್ರಿಕ', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80', description: 'ಕೋಡಿಂಗ್ ಕಲಿಯುವವರಿಗೆ ಸುಲಭ ಹಂತಗಳು ಮತ್ತು ಸಲಹೆಗಳು.', isBorrowed: false, pages: generatePages('ಕೋಡಿಂಗ್ ಮಂತ್ರ', 'ಎಸ್. ನಾರಾಯಣ್') },
  { id: 17, title: 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ', author: 'ಬಿ. ವೆಂಕಪ್ಪ', category: 'ಚರಿತ್ರೆ', image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f6dfc0f?auto=format&fit=crop&w=300&q=80', description: 'ಹಂಪಿಯ ವೈಭವ ಮತ್ತು ವಿಜಯನಗರದ ಇತಿಹಾಸ.', isBorrowed: false, pages: generatePages('ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ', 'ಬಿ. ವೆಂಕಪ್ಪ') },
  { id: 18, title: 'ಔಷಧೀಯ ಸಸ್ಯಗಳು', author: 'ಜಿ. ನಾಯ್ಡು', category: 'ವಿಜ್ಞಾನ', image: 'https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?auto=format&fit=crop&w=300&q=80', description: 'ಆಯುರ್ವೇದದಲ್ಲಿ ಬಳಸುವ ಪ್ರಮುಖ ಗಿಡಮೂಲಿಕೆಗಳ ಪರಿಚಯ.', isBorrowed: false, pages: generatePages('ಔಷಧೀಯ ಸಸ್ಯಗಳು', 'ಜಿ. ನಾಯ್ಡು') },
  { id: 19, title: 'ಸಮುದ್ರಗಳ ಆಳ', author: 'ಪಿ. ಗೌಡ', category: 'ಭೂಗೋಳ', image: 'https://images.unsplash.com/photo-1518340118873-19910ba7960d?auto=format&fit=crop&w=300&q=80', description: 'ಸಾಗರಗಳ ಒಳಗಿನ ಜೀವಜಗತ್ತಿನ ರಹಸ್ಯಗಳು.', isBorrowed: false, pages: generatePages('ಸಮುದ್ರಗಳ ಆಳ', 'ಪಿ. ಗೌಡ') },
  { id: 20, title: 'ಆಂಡ್ರಾಯ್ಡ್ ಕಲಿ', author: 'ಎ. ಕುಮಾರ್', category: 'ತಾಂತ್ರಿಕ', image: 'https://images.unsplash.com/photo-1607706189992-3ed6796eb001?auto=format&fit=crop&w=300&q=80', description: 'ಆಂಡ್ರಾಯ್ಡ್ ಆಪ್ ಅಭಿವೃದ್ಧಿಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕಲಿಯಿರಿ.', isBorrowed: false, pages: generatePages('ಆಂಡ್ರಾಯ್ಡ್ ಕಲಿ', 'ಎ. ಕುಮಾರ್') },
  { id: 21, title: 'ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟ', author: 'ಕೆ. ದೇಶಪಾಂಡೆ', category: 'ಚರಿತ್ರೆ', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80', description: 'ಬ್ರಿಟಿಷರ ವಿರುದ್ಧ ಭಾರತದ ಸ್ವಾತಂತ್ರ್ಯ ಸಂಗ್ರಾಮದ ಕಥೆ.', isBorrowed: false, pages: generatePages('ಸ್ವಾತಂತ್ರ್ಯ ಹೋರಾಟ', 'ಕೆ. ದೇಶಪಾಂಡೆ') },
  { id: 22, title: 'ಮಳೆ ಬಂದಾಗ', author: 'ಯು. ಭಟ್', category: 'ವಿಜ್ಞಾನ', image: 'https://images.unsplash.com/photo-1519692938322-632b6338f398?auto=format&fit=crop&w=300&q=80', description: 'ಮಳೆ ಸುರಿಯುವ ವಿಜ್ಞಾನ ಮತ್ತು ಜಲಚಕ್ರದ ವಿವರಣೆ.', isBorrowed: false, pages: generatePages('ಮಳೆ ಬಂದಾಗ', 'ಯು. ಭಟ್') },
  { id: 23, title: 'ಕೈಲಾಸ ಪರ್ವತ', author: 'ಟಿ. ಜಿ', category: 'ಭೂಗೋಳ', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80', description: 'ಹಿಮಾಲಯದ ಮಡಿಲಲ್ಲಿರುವ ಕೈಲಾಸದ ಭೌಗೋಳಿಕ ಮಹತ್ವ.', isBorrowed: false, pages: generatePages('ಕೈಲಾಸ ಪರ್ವತ', 'ಟಿ. ಜಿ') },
  { id: 24, title: 'ವೆಬ್ ಡಿಸೈನ್', author: 'ಜೆ. ಲೂಯಿಸ್', category: 'ತಾಂತ್ರಿಕ', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=300&q=80', description: 'ಸುಂದರವಾದ ವೆಬ್‌ಸೈಟ್‌ಗಳನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಲು ಕಲಿಯಿರಿ.', isBorrowed: false, pages: generatePages('ವೆಬ್ ಡಿಸೈನ್', 'ಜೆ. ಲೂಯಿಸ್') },
];

export default function App() {
  const [view, setView] = useState<View>('LOGIN');
  const [student, setStudent] = useState<{ name: string; id: string } | null>(null);
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [readingBook, setReadingBook] = useState<Book | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('namma_student');
    if (saved) {
      setStudent(JSON.parse(saved));
      setView('HOME');
    }
  }, []);

  const handleLogin = (name: string, id: string) => {
    const data = { name, id };
    setStudent(data);
    localStorage.setItem('namma_student', JSON.stringify(data));
    setView('HOME');
  };

  const handleScan = (bookId: number) => {
    const newTx: Transaction = {
      id: Date.now(),
      bookId,
      dueDate: Date.now() + 14 * 24 * 60 * 60 * 1000,
      isOverdue: false
    };
    
    // Update book status
    setBooks(prev => prev.map(b => b.id === bookId ? { ...b, isBorrowed: true } : b));
    
    setTransactions(prev => [...prev, newTx]);
    setView('STATS');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#E8EAED] p-4 font-sans">
      {/* PHONE MOCKUP FRAME */}
      <div className="w-[360px] h-[740px] bg-black rounded-[48px] border-[12px] border-[#333] relative overflow-hidden shadow-2xl flex flex-col">
        {/* PHONE SCREEN CONTAINER */}
        <div className="w-full h-full bg-white flex flex-col relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {view === 'LOGIN' ? (
              <LoginView onLogin={handleLogin} />
            ) : (
              <div className="flex flex-col h-full">
                {/* TOOLBAR */}
                <header className="h-14 bg-white border-b border-[#DADCE0] flex items-center justify-between px-4 shrink-0 shadow-sm z-30">
                  <h1 className="text-[#1A73E8] font-bold text-lg">ನಮ್ಮ ಪುಸ್ತಕ</h1>
                  <button 
                    onClick={() => setShowProfile(true)}
                    className="w-9 h-9 rounded-full bg-[#F1F3F4] flex items-center justify-center overflow-hidden border border-[#DADCE0]"
                  >
                    <User size={20} className="text-[#1A73E8]" />
                  </button>
                </header>

                <main className="flex-grow overflow-y-auto pb-4">
                  {view === 'HOME' && (
                    <HomeView 
                      searchQuery={searchQuery} 
                      setSearchQuery={setSearchQuery} 
                      books={books} 
                      onScanClick={() => setView('SCANNER')} 
                      onBookClick={(book) => setSelectedBook(book)}
                    />
                  )}
                  {view === 'STATS' && (
                    <StatsView 
                      transactions={transactions} 
                      books={books} 
                    />
                  )}
                  {view === 'LEADERBOARD' && <LeaderboardView />}
                  {view === 'ASSISTANT' && <AssistantView books={books} />}
                </main>

                {/* BOTTOM NAVIGATION */}
                <nav className="h-16 bg-white border-t border-[#DADCE0] flex items-center justify-around shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30">
                  <NavButton active={view === 'HOME'} icon={Home} label="ಹೋಮ್" onClick={() => setView('HOME')} />
                  <NavButton active={view === 'STATS'} icon={BarChart3} label="ಸ್ಥಿತಿ" onClick={() => setView('STATS')} />
                  <NavButton active={view === 'ASSISTANT'} icon={MessageSquare} label="ಸಹಾಯಕ" onClick={() => setView('ASSISTANT')} />
                  <NavButton active={view === 'LEADERBOARD'} icon={Trophy} label="ಬೋರ್ಡ್" onClick={() => setView('LEADERBOARD')} />
                </nav>

                {/* FAB */}
                {view === 'HOME' && (
                  <button 
                    onClick={() => setShowAddBook(true)}
                    className="absolute bottom-20 right-4 w-14 h-14 bg-[#1A73E8] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#174EA6] transition-all z-40 active:scale-90"
                  >
                    <Plus size={32} />
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>

          {/* ADD BOOK MODAL */}
          <AnimatePresence>
            {showAddBook && (
              <AddBookModal 
                onClose={() => setShowAddBook(false)}
                onAdd={(newBook) => {
                  setBooks(prev => [newBook, ...prev]);
                  setShowAddBook(false);
                }}
              />
            )}
          </AnimatePresence>

          {/* BOOK DETAILS MODAL */}
          <AnimatePresence>
            {selectedBook && (
              <BookDetailsModal 
                book={selectedBook} 
                onClose={() => setSelectedBook(null)}
                onScan={() => {
                  setSelectedBook(null);
                  setView('SCANNER');
                }}
                onRead={() => {
                  setReadingBook(selectedBook);
                  setSelectedBook(null);
                }}
              />
            )}
          </AnimatePresence>

          {/* SCANNER OVERLAY */}
          <AnimatePresence>
            {readingBook && (
              <ReaderModal 
                book={readingBook} 
                onClose={() => setReadingBook(null)} 
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {view === 'SCANNER' && (
              <ScannerView onScan={(id) => handleScan(id)} onBack={() => setView('HOME')} />
            )}
          </AnimatePresence>

          {/* PROFILE DIALOG */}
          <AnimatePresence>
            {showProfile && (
              <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full bg-white rounded-2xl p-6 shadow-2xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-[#1A73E8]/10 flex items-center justify-center text-[#1A73E8]">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#202124]">{student?.name}</h3>
                      <p className="text-xs text-[#5F6368]">{student?.id}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowProfile(false)}
                      className="w-full geometric-btn py-3"
                    >
                      ಪ್ರೊಫೈಲ್ ಮುಚ್ಚಿ
                    </button>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('namma_student');
                        setStudent(null);
                        setView('LOGIN');
                        setShowProfile(false);
                      }}
                      className="w-full border border-red-200 text-red-500 py-3 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors uppercase tracking-widest"
                    >
                      [ಲಾಗ್‌ಔಟ್ ಮಾಡಿ]
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}

// --- SUB-VIEWS ---

function AssistantView({ books }: { books: Book[] }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
    { role: 'assistant', text: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಸ್ಮಾರ್ಟ್ ಲೈಬ್ರರಿ ಸಹಾಯಕ. ನಿಮಗೆ ಯಾವ ರೀತಿಯ ಪುಸ್ತಕಗಳನ್ನು ಓದಲು ಇಷ್ಟ? ನಾನು ನಿಮಗೆ ಉತ್ತಮ ಶಿಫಾರಸುಗಳನ್ನು ನೀಡಬಲ್ಲೆ.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const availableBooks = books.slice(0, 15).map(b => `${b.title} - ${b.author} (${b.category})`).join(', ');
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `ನೀವು "ನಮ್ಮ ಪುಸ್ತಕ" ಲೈಬ್ರರಿಯ ಸ್ನೇಹಪರ ಮತ್ತು ಸಹಾಯಕ ಇನ್ಫರ್ಮೇಷನ್ ಅಸಿಸ್ಟೆಂಟ್.
          ನಮ್ಮ ಲೈಬ್ರರಿಯಲ್ಲಿರುವ ಪುಸ್ತಕಗಳ ಪಟ್ಟಿ: [${availableBooks}].
          
          ನಿಯಮಗಳು:
          1. ಯಾವಾಗಲೂ ಕನ್ನಡದಲ್ಲಿ (KANNADA) ಮಾತ್ರ ಉತ್ತರಿಸಿ.
          2. ಓದುಗರಿಗೆ ಪ್ರೋತ್ಸಾಹ ನೀಡಿ ಮತ್ತು ಸ್ವಾಗತಿಸಿ.
          3. ಬಳಕೆದಾರರು ಯಾವುದೇ ಪುಸ್ತಕದ ಬಗ್ಗೆ ಕೇಳಿದರೆ, ಆ ಪುಸ್ತಕದ ಒಂದು ಸಣ್ಣ ಸಾರಾಂಶವನ್ನು (Summary) ನೀಡಿ.
          4. ಯಾವುದಾದರೂ ಪುಸ್ತಕ ಒಳ್ಳೆಯದು ಅಂತ ಕೇಳಿದರೆ, ನಮ್ಮ ಪಟ್ಟಿಯಲ್ಲಿರುವ ಪುಸ್ತಕಗಳ ಆಧಾರದ ಮೇಲೆ ಶಿಫಾರಸು ಮಾಡಿ.
          5. ನಿಮ್ಮ ಉತ್ತರಗಳು ಸಂಕ್ಷಿಪ್ತವಾಗಿ ಮತ್ತು ಉಪಯುಕ್ತವಾಗಿರಲಿ.
          6. "I can't talk now" ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಉತ್ತರ ನೀಡಬೇಡಿ.`
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', text: response.text || 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಇನ್ನೊಮ್ಮೆ ಕೇಳಿ.' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'ಸಂಪರ್ಕ ದೋಷ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F9FA]">
      <div className="p-4 bg-white border-b border-[#DADCE0] flex items-center gap-2 sticky top-0 z-10 shadow-sm">
        <Sparkles size={18} className="text-[#1A73E8]" />
        <div>
          <h3 className="text-xs font-black text-[#1A73E8] uppercase tracking-widest">ನಮ್ಮ ಎಐ ಸಹಾಯಕ</h3>
          <p className="text-[10px] text-[#5F6368] font-bold uppercase">ಎಐ ಚಾಲಿತ ಮಾರ್ಗದರ್ಶನ</p>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' 
              ? 'bg-[#1A73E8] text-white rounded-tr-none shadow-md font-medium' 
              : 'bg-white text-[#202124] rounded-tl-none border border-[#DADCE0] shadow-sm'
            }`}>
              {m.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-[#DADCE0] flex items-center gap-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-[#DADCE0] pb-6">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="ಸಲಹೆಗಾಗಿ ಕೇಳಿ..."
            className="flex-grow bg-[#F1F3F4] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A73E8]/20 transition-all font-medium"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-[#1A73E8] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[#174EA6] active:scale-90 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (n: string, i: string) => void }) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ x: -360 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full p-8 pt-20"
    >
      <div className="w-20 h-20 bg-[#1A73E8] rounded-[24px] flex items-center justify-center text-white mb-8 shadow-xl">
        <BookIcon size={40} />
      </div>
      
      <div className="flex flex-col items-center mb-10 text-center">
        <h2 className="text-xl font-bold text-[#5F6368]">ಸ್ವಾಗತ</h2>
        <h2 className="text-4xl font-extrabold text-[#1A73E8] tracking-tight">ನಮ್ಮ ಪುಸ್ತಕ</h2>
        <p className="text-[#1A73E8] text-[10px] mt-3 font-black uppercase tracking-[0.2em]">ಸ್ಮಾರ್ಟ್ ಲೈಬ್ರರಿ ಸಹಾಯಕ</p>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A73E8] uppercase tracking-widest pl-1">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</label>
          <input 
            type="text" 
            placeholder="ಉದಾ: ಅಭಿಷೇಕ್ ಕುಮಾರ್"
            className="geometric-input bg-gray-50 border-[#1A73E8]/30 focus:border-[#1A73E8] font-medium text-[#202124]"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2 pb-8">
          <label className="text-xs font-black text-[#1A73E8] uppercase tracking-widest pl-1">ವಿದ್ಯಾರ್ಥಿ ಐಡಿ</label>
          <input 
            type="text" 
            placeholder="NP-2024-001"
            className="geometric-input bg-gray-50 border-[#1A73E8]/30 focus:border-[#1A73E8] font-medium text-[#202124]"
            value={id}
            onChange={e => setId(e.target.value)}
          />
        </div>

        <button 
          onClick={() => onLogin(name, id)}
          disabled={!name || !id}
          className="w-16 h-16 bg-[#1A73E8] text-white rounded-full mx-auto flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
        >
          <ArrowRight size={28} />
        </button>
      </div>
    </motion.div>
  );
}

function HomeView({ searchQuery, setSearchQuery, books, onScanClick, onBookClick }: { searchQuery: string, setSearchQuery: Function, books: Book[], onScanClick: () => void, onBookClick: (b: Book) => void }) {
  const [activeCategory, setActiveCategory] = useState('ಎಲ್ಲಾ');
  const categories = ['ಎಲ್ಲಾ', 'ಚರಿತ್ರೆ', 'ವಿಜ್ಞಾನ', 'ಭೂಗೋಳ', 'ತಾಂತ್ರಿಕ'];

  const filtered = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'ಎಲ್ಲಾ' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6368]" size={18} />
        <input 
          type="text"
          placeholder="ಪುಸ್ತಕಗಳು ಅಥವಾ ಲೇಖಕರನ್ನು ಹುಡುಕಿ..."
          className="w-full bg-[#F1F3F4] border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#1A73E8]/20 transition-all font-medium"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat 
              ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-md' 
              : 'bg-white text-[#5F6368] border-[#DADCE0] hover:border-[#1A73E8]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(book => (
          <motion.div 
            key={book.id} 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              console.log('Book clicked:', book.title);
              onBookClick(book);
            }}
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-[#DADCE0] rounded-xl p-2 flex flex-col h-full group hover:ring-2 hover:ring-[#1A73E8]/20 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <div className="aspect-[3/4] bg-[#E8EAED] rounded-lg mb-2 overflow-hidden relative">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 text-[9px] bg-black/40 text-white px-1.5 rounded-sm backdrop-blur-md font-bold uppercase tracking-widest">ID_{book.id}</div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-[#1A73E8] text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg font-kannada">ವಿವರಗಳನ್ನು ನೋಡಿ</span>
              </div>
            </div>
            <div className="flex flex-col flex-grow px-1">
              <h4 className="text-[13px] font-bold text-[#202124] truncate leading-tight group-hover:text-[#1A73E8] transition-colors">{book.title}</h4>
              <p className="text-[11px] text-[#5F6368] truncate mb-2">{book.author}</p>
              
              <div className="mt-auto space-y-1.5">
                <button 
                  disabled={book.isBorrowed}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!book.isBorrowed) onScanClick();
                  }}
                  className={`w-full py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    book.isBorrowed 
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                    : 'bg-[#1A73E8]/5 text-[#1A73E8] border border-[#1A73E8]/10 hover:bg-[#1A73E8] hover:text-white'
                  }`}
                >
                  {book.isBorrowed ? 'ಎರವಲು ಪಡೆದಿದೆ' : 'ಎರವಲು ಪಡೆಯಿರಿ'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatsView({ transactions, books }: { transactions: Transaction[], books: Book[] }) {
  const overdueCount = transactions.filter(t => t.isOverdue).length;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#202124] mb-4 px-1">ನನ್ನ ಓದುವ ಅಂಕಿಅಂಶಗಳು</h2>
      
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-[#DADCE0] shadow-sm text-center">
          <div className="text-3xl font-bold text-[#1A73E8]">{transactions.length}</div>
          <div className="text-[10px] uppercase font-bold text-[#5F6368]">ಎರವಲು ಪಡೆದವು</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DADCE0] shadow-sm text-center">
          <div className={`text-3xl font-bold ${overdueCount > 0 ? 'text-red-500' : 'text-[#1A73E8]'}`}>{overdueCount}</div>
          <div className="text-[10px] uppercase font-bold text-[#5F6368]">ಸಮಯ ಮೀರಿದವು</div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-[#202124] mb-4 px-1">ಪ್ರಸ್ತುತ ನನ್ನ ಬಳಿ ಇರುವ ಪುಸ್ತಕಗಳು</h3>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12 opacity-30 text-xs">ಯಾವುದೇ ಪುಸ್ತಕಗಳನ್ನು ಎರವಲು ಪಡೆದಿಲ್ಲ</div>
        ) : (
          transactions.map(t => {
            const book = books.find(b => b.id === t.bookId);
            return (
              <div key={t.id} className="bg-white border border-[#DADCE0] rounded-xl p-4 flex items-center gap-4">
                <img src={book?.image} className="w-12 h-16 object-cover rounded-md shadow-sm" />
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-[#202124] leading-tight">{book?.title}</h4>
                  <p className="text-[11px] text-[#5F6368]">ಕೊನೆಯ ದಿನಾಂಕ: {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.isOverdue ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                  {t.isOverdue ? 'ಸಮಯ ಮೀರಿದೆ' : 'ಸಕ್ರಿಯ'}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function LeaderboardView() {
  const leaders = [
    { name: 'ಅಭಿಷೇಕ್ ಕೆ', score: 12450, rank: '01' },
    { name: 'ರೋಹನ್ ಶರ್ಮಾ', score: 11200, rank: '02' },
    { name: 'ಸ್ನೇಹಾ ಪಾಟೀಲ್', score: 9800, rank: '03' },
    { name: 'ಪ್ರಿಯಾ ವರ್ಮಾ', score: 8500, rank: '04' },
    { name: 'ವಿಕ್ರಮ್ ಸಿಂಗ್', score: 7200, rank: '05' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#202124] mb-2 px-1">ಶ್ರೇಯಾಂಕ ಪಟ್ಟಿ</h2>
      <p className="text-[11px] text-[#5F6368] mb-6 px-1">ಓದುಗರ ತೊಡಗಿಸಿಕೊಳ್ಳುವಿಕೆಯ ಶ್ರೇಯಾಂಕಗಳು</p>

      <div className="bg-white border border-[#DADCE0] rounded-xl overflow-hidden divide-y divide-[#DADCE0]">
        {leaders.map((leader) => (
          <div key={leader.rank} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold w-6 ${leader.rank === '01' ? 'text-[#1A73E8]' : 'text-[#5F6368]'}`}>{leader.rank}</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#202124]">{leader.name}</span>
                <span className="text-[11px] text-[#5F6368]">{6 - parseInt(leader.rank)} ನೇ ಹಂತದ ಓದುಗ</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#34A853]">{leader.score.toLocaleString()}</div>
              <div className="text-[10px] text-[#5F6368] uppercase font-bold">ಪುಟಗಳು</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScannerView({ onScan, onBack }: { onScan: (id: number) => void, onBack: () => void }) {
  return (
    <motion.div 
      initial={{ y: 740 }}
      animate={{ y: 0 }}
      exit={{ y: 740 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6"
    >
      <div className="w-64 h-64 border-2 border-white rounded-[40px] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-white/5" />
        <div className="w-full h-0.5 bg-[#1A73E8] absolute animate-[scan_2s_infinite]" />
        <ScanLine size={48} className="text-white opacity-40" />
      </div>
      
      <h3 className="text-white font-bold mt-12 mb-2 text-center">ಕ್ಯೂಆರ್ ಕೋಡ್ ಅನ್ನು ಇಲ್ಲಿ ತೋರಿಸಿ</h3>
      <p className="text-white/40 text-[11px] text-center px-8">ಪುಸ್ತಕದ ಕ್ಯೂಆರ್ ಟ್ಯಾಗ್ ಅನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಹಿಂಬದಿಯ ಕ್ಯಾಮೆರಾವನ್ನು ಅದರತ್ತ ತೋರಿಸಿ.</p>

      <div className="mt-12 grid grid-cols-3 gap-4">
        {[1, 2, 3].map(id => (
          <button 
            key={id}
            onClick={() => onScan(id)}
            className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-[10px] hover:bg-white/20 transition-all font-bold"
          >
            ಟ್ಯಾಗ್_{id}
          </button>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="mt-auto mb-8 text-[#1A73E8] text-xs font-bold uppercase tracking-widest bg-[#1A73E8]/10 px-8 py-3 rounded-full hover:bg-[#1A73E8]/20 transition-all"
      >
        ಸ್ಕ್ಯಾನ್ ರದ್ದುಗೊಳಿಸಿ
      </button>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </motion.div>
  );
}

function NavButton({ active, icon: Icon, label, onClick }: { active: boolean, icon: any, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center relative gap-0.5 w-full h-full transition-colors ${active ? 'text-[#1A73E8]' : 'text-[#5F6368]'}`}
    >
      <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#1A73E8]/5' : ''}`}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className="text-[10px] font-bold">{label}</span>
      {active && (
        <motion.div 
          layoutId="nav-dot"
          className="w-1 h-1 bg-[#1A73E8] rounded-full absolute -bottom-1"
        />
      )}
    </button>
  );
}

function AddBookModal({ onClose, onAdd }: { onClose: () => void, onAdd: (b: Book) => void }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('ಚರಿತ್ರೆ');

  const handleSubmit = () => {
    if (!title || !author) return;
    const newBook: Book = {
      id: Math.floor(Math.random() * 100000),
      title,
      author,
      category,
      image: 'https://images.unsplash.com/photo-1543004629-ff569587207c?auto=format&fit=crop&w=300&q=80',
      description: 'ನಮ್ಮ ಪುಸ್ತಕ ಸಂಗ್ರಹಕ್ಕೆ ಹೊಸದಾಗಿ ಸೇರಿಸಲಾದ ಪುಸ್ತಕ. ಈ ಪುಸ್ತಕ ಈಗ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಎರವಲು ಪಡೆಯಲು ಲಭ್ಯವಿದೆ.',
      isBorrowed: false,
      pages: generatePages(title, author)
    };
    onAdd(newBook);
  };

  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 300, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 300, opacity: 0 }}
        className="w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-[#202124]">ಹೊಸ ಪುಸ್ತಕ ಸೇರಿಸಿ</h3>
          <button onClick={onClose} className="text-[#5F6368] text-xs font-bold uppercase tracking-widest">[ರದ್ದುಮಾಡಿ]</button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">ಪುಸ್ತಕದ ಹೆಸರು</label>
            <input 
              type="text"
              placeholder="ಉದಾ: ಹೊಸ ಹಾದಿ"
              className="geometric-input bg-gray-50 text-sm font-medium"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">ಲೇಖಕರು</label>
            <input 
              type="text"
              placeholder="ಉದಾ: ಆರ್. ಕೆ. ನಾರಾಯಣ್"
              className="geometric-input bg-gray-50 text-sm font-medium"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">ವರ್ಗ</label>
            <select 
              className="geometric-input bg-gray-50 text-sm font-medium"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>ಚರಿತ್ರೆ</option>
              <option>ವಿಜ್ಞಾನ</option>
              <option>ಭೂಗೋಳ</option>
              <option>ತಾಂತ್ರಿಕ</option>
              <option>ಇತರೆ</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!title || !author}
          className="w-full geometric-btn py-3 mt-2 disabled:opacity-50 font-black uppercase tracking-widest"
        >
          ನೋಂದಾಯಿಸಿ
        </button>
      </motion.div>
    </div>
  );
}

function BookDetailsModal({ book, onClose, onScan, onRead }: { book: Book, onClose: () => void, onScan: () => void, onRead: () => void }) {
  return (
    <div className="absolute inset-0 z-[110] flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: 500 }}
        animate={{ y: 0 }}
        exit={{ y: 500 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full bg-white rounded-t-[32px] p-6 shadow-2xl relative z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F1F3F4] flex items-center justify-center text-[#5F6368]"
        >
          ✕
        </button>

        <div className="flex gap-6 mb-8 mt-4">
          <div className="w-32 aspect-[3/4] rounded-xl overflow-hidden shadow-lg shrink-0">
            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-end">
            <span className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest mb-1">{book.category}</span>
            <h2 className="text-xl font-bold text-[#202124] leading-tight mb-1">{book.title}</h2>
            <p className="text-sm text-[#5F6368] mb-4">{book.author} ಅವರಿಂದ</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${book.isBorrowed ? 'bg-orange-500' : 'bg-green-500'}`} />
              <span className={`text-[11px] font-bold ${book.isBorrowed ? 'text-orange-600' : 'text-green-600'}`}>
                {book.isBorrowed ? 'ಪ್ರಸ್ತುತ ಎರವಲು ಪಡೆಯಲಾಗಿದೆ' : 'ಲೈಬ್ರರಿಯಲ್ಲಿ ಲಭ್ಯವಿದೆ'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#DADCE0]/30">
            <h4 className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest mb-2">ಪುಸ್ತಕದ ಬಗ್ಗೆ</h4>
            <p className="text-[12px] leading-relaxed text-[#5F6368] font-medium">
              {book.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-[#1A73E8] font-bold">
              <BookIcon size={12} />
              <span>ಪೂರ್ವವೀಕ್ಷಣೆ ಲಭ್ಯವಿದೆ (20 ಪುಟಗಳು)</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-[#DADCE0]/50">
            <h4 className="text-[10px] font-black text-[#5F6368] uppercase tracking-widest mb-2">ಪುಸ್ತಕದ ಮಾಹಿತಿ</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#5F6368]">ಲೈಬ್ರರಿ ಐಡಿ</p>
                <p className="text-xs font-bold text-[#202124]">NP-LIB-{book.id}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#5F6368]">ಸ್ಥಳ</p>
                <p className="text-xs font-bold text-[#202124]">ಶೆಲ್ಫ್ A-12</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onRead}
              className="flex-grow flex items-center justify-center gap-2 border-2 border-[#1A73E8] text-[#1A73E8] py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1A73E8]/5 transition-colors"
            >
              ಓದಲು ಪ್ರಾರಂಭಿಸಿ
            </button>
            <button 
              onClick={onScan}
              disabled={book.isBorrowed}
              className={`flex-grow geometric-btn py-4 flex items-center justify-center gap-2 ${book.isBorrowed ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              <ScanLine size={18} />
              {book.isBorrowed ? 'ಈಗಾಗಲೇ ಎರವಲು ಪಡೆಯಲಾಗಿದೆ' : 'ಈಗಲೇ ಎರವಲು ಪಡೆಯಿರಿ'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ReaderModal({ book, onClose }: { book: Book, onClose: () => void }) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div className="absolute inset-0 z-[150] bg-white flex flex-col">
      <header className="h-14 border-b border-[#DADCE0] flex items-center justify-between px-4 shrink-0 bg-white">
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-[#202124] truncate max-w-[200px] uppercase tracking-wide">{book.title}</h3>
          <p className="text-[9px] text-[#5F6368] uppercase font-bold">ಓದುವ ಹಂತ</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#5F6368] self-center">✕</button>
      </header>

      <div className="flex-grow overflow-y-auto p-6 bg-[#F8F9FA]">
        <motion.div 
          key={currentPage}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-[#DADCE0] min-h-[400px] relative font-serif"
        >
          <div className="absolute top-4 right-6 text-[10px] font-bold text-gray-300">ಪುಟ {currentPage + 1} / 20</div>
          <div className="whitespace-pre-line text-sm leading-relaxed text-[#3C4043]">
            {book.pages[currentPage]}
          </div>
        </motion.div>
      </div>

      <footer className="h-20 border-t border-[#DADCE0] flex items-center justify-between px-6 shrink-0 bg-white pb-4">
        <button 
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          className="flex items-center gap-2 text-xs font-black text-[#1A73E8] disabled:opacity-30 uppercase tracking-widest"
        >
          ಹಿಂದಿನ ಪುಟ
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-400">ಪುಟಗಳ ಸಂಖ್ಯೆ</span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${Math.floor(currentPage / 4) === i ? 'bg-[#1A73E8]' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>
        <button 
          disabled={currentPage === 19}
          onClick={() => setCurrentPage(p => Math.min(19, p + 1))}
          className="flex items-center gap-2 text-xs font-black text-[#1A73E8] disabled:opacity-30 uppercase tracking-widest"
        >
          ಮುಂದಿನ ಪುಟ
        </button>
      </footer>
    </div>
  );
}
