import { useEffect, useState } from 'react';
import { Home, BarChart3, Trophy, ScanLine, Plus, Search, User, ArrowRight, Book as BookIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- TYPES ---
type View = 'LOGIN' | 'HOME' | 'STATS' | 'LEADERBOARD' | 'SCANNER';

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
  const pageContents = [
    // Page 1
    `Page 1: Title and Overview\n\nBook: "${title}"\nAuthor: ${author}\n\nPrologue:\nWelcome to this comprehensive study. In writing "${title}", ${author} sets out to bridge historical theories with modern developments. This first page outlines the fundamental philosophy and core tenets of the subject, establishing a solid baseline for both novice students and seasoned scholars.`,
    
    // Page 2
    `Page 2: Preface & Acknowledgments\n\nBy ${author}\n\nThis masterwork represents years of research, data collection, and qualitative analysis. Here, the author expresses gratitude to the university researchers, peer reviewers, and regional historians who contributed to compiling this volume. We highlight how our collective understanding evolved during key historical breakthrough moments, paving the way for the methodologies in this book.`,
    
    // Page 3
    `Page 3: Chapter 1 - Foundational Axioms\n\nEvery comprehensive journey must start with clear principles. For "${title}", this begins by identifying the underlying concepts and default assumptions. On this page, ${author} introduces the essential vocabulary and core metrics. Study these definitions carefully, as they form the essential architectural framework for everything that follows.`,
    
    // Page 4
    `Page 4: Chapter 1 - Evolutionary History\n\nHow did we arrive at our current modern perspective on "${title.split(' ')[0]}"? Tracing the heritage of this topic takes us back to early foundational debates and pioneering figures. By looking at historical milestones across the decades, we can see how successive generations of thinkers shaped the methodologies and tools we confidently use today.`,
    
    // Page 5
    `Page 5: Chapter 1 - Critical Perspectives and Debates\n\nNo active field of study is free from contention and competing schools of thought. Here, ${author} analyzes the major intellectual disagreements that continue to divide experts. By analyzing these divergent pathways, readers are encouraged to form their own critical judgments rather than passively accepting canonical ideas.`,
    
    // Page 6
    `Page 6: Chapter 2 - Operational Frameworks\n\nTransitioning from high-level philosophy to everyday practice, this chapter lays out the precise experimental designs and investigative models. We focus on establishing rigorous control protocols, eliminating measurement bias, and securing high-fidelity data feeds. These elements are vital to ensuring your results are replicable.`,
    
    // Page 7
    `Page 7: Chapter 2 - Internal Mechanisms\n\nLet us take a deeper look beneath the surface structure of "${title}". This section breaks down the entire system into discrete, approachable components. ${author} details how each individual layer interacts dynamically with the others to form a stable, functioning whole. Use the charts in the appendix to visualize these relationships.`,
    
    // Page 8
    `Page 8: Chapter 2 - Contextual & Regional Variables\n\nContext shapes outcome. On this page, the focus shifts to how localized factors affect our core model. ${author} examines case studies from distinct geographical regions, illustrating how culture, climate, and local infrastructure can alter or enhance the practical application of "${title}"'s primary concepts.`,
    
    // Page 9
    `Page 9: Chapter 3 - Empirical Modeling\n\nFor the mathematically inclined, this page introduces the quantitative formulas, statistical models, and validation tests that underpin "${title}". Study the algebraic derivations and scatterplots carefully. These figures demonstrate the high degree of mathematical certainty and empirical rigor behind the author's primary claims.`,
    
    // Page 10
    `Page 10: Chapter 3 - The Central Thesis\n\nThis is the core of "${title}". In this crucial section, ${author} fits all the puzzle pieces together to propose a groundbreaking unified thesis. This theory challenges several long-held assumptions in the scientific community and suggests a more robust, integrated approach to solving today's most burning questions.`,
    
    // Page 11
    `Page 11: Chapter 3 - Observational Notes\n\nWe step out of the office and into the field. On this page, we read the raw, unedited observations from ${author}'s personal logbooks. From triumphs in the laboratory to unexpected anomalies during field studies, these notes capture the excitement of direct discovery and the lessons learned when data refuses to behave.`,
    
    // Page 12
    `Page 12: Chapter 4 - Implementation Guidelines\n\nTheory must eventually yield to application. This chapter serves as a practical blueprint for implementing the ideas of "${title}" in your own professional and academic projects. ${author} outlines a straightforward, step-by-step workflow designed to maximize efficiency and minimize potential execution bottlenecks.`,
    
    // Page 13
    `Page 13: Chapter 4 - Local Case Study Analysis\n\nHere, we examine a highly specific real-world case study. We see how the theoretical systems of "${title}" were integrated into a pilot project in the region. ${author} highlights both the unexpected hurdles encountered during deployment and the impressive, highly positive outcomes achieved by the team.`,
    
    // Page 14
    `Page 14: Chapter 4 - Multi-System Integration\n\nHow do we scale these methods to interface with existing legacy frameworks? This section explores the delicate art of system integration. ${author} offers technical guidelines for ensuring seamless data exchange, maintaining system security, and training staff to use these modern tools.`,
    
    // Page 15
    `Page 15: Chapter 5 - Common Pitfalls & Misconceptions\n\nIn any complex field, misunderstandings can easily occur. In this introductory section of Chapter 5, ${author} identifies the most common traps that catch both beginners and experts off guard. Recognizing these mistakes ahead of time will save you precious hours of frustration and wasted resources.`,
    
    // Page 16
    `Page 16: Chapter 5 - Technology & Modern Toolsets\n\nThe digital revolution has dramatically altered how we study "${title.split(' ')[0]}". This page introduces the cutting-edge software suites, simulation runtimes, and collaborative cloud platforms currently of choice. Utilizing these digital tools will allow you to analyze data on a scale never before possible.`,
    
    // Page 17
    `Page 17: Chapter 5 - Future Horizons and Next-Gen Research\n\nWe look ahead to what the coming decades might hold. ${author} speculates on emergent trends, upcoming technological shifts, and open-ended research questions that remain unanswered. This serves as an inspiring call to action for the next generation of bright thinkers to carry the torch forward.`,
    
    // Page 18
    `Page 18: Summary & Key Takeaways\n\nWe draw near to the completion of this volume. On this page, ${author} synthesizes the key arguments, methodologies, and findings presented across all chapters. This concise summary reinforces the critical relationship between theoretical models and real-world results.`,
    
    // Page 19
    `Page 19: Epilogue & Final Remarks\n\nA warm personal note from the author. ${author} reflects on their personal journey writing "${title}", the importance of maintaining an open and curious mind, and the value of persistent study. The author expresses hope that this book has ignited a true passion in you to explore this fascinating field.`,
    
    // Page 20: Bibliographical References\n\nBibliography and suggested readings for "${title}" by ${author}.\n\nThis concludes the 20-page digital sample of our book. In this preview, we sought to display a diverse selection from each chapter to assist you in your studying. To read the complete text, please secure the physical copy of this work from Shelf A-12 in our library.`
  ];
  return pageContents;
};

const SAMPLE_BOOKS: Book[] = [
  { 
    id: 1, 
    title: 'Kannada Grammar', 
    author: 'M. Hiriyannayya', 
    category: 'History', 
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80',
    description: 'Deep and simple guidance on Kannada language grammar rules and structure.',
    isBorrowed: false,
    pages: generatePages('Kannada Grammar', 'M. Hiriyannayya')
  },
  { 
    id: 2, 
    title: 'Science World', 
    author: 'Jinadatta', 
    category: 'Science', 
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80',
    description: 'An introductory work on the amazing world of modern science and its wonders.',
    isBorrowed: false,
    pages: generatePages('Science World', 'Jinadatta')
  },
  { 
    id: 3, 
    title: 'Geography of Karnataka', 
    author: 'S. Rao', 
    category: 'Geography', 
    image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&q=80',
    description: 'Complete physical, environmental, and cultural geographical information about Karnataka.',
    isBorrowed: false,
    pages: generatePages('Geography of Karnataka', 'S. Rao')
  },
  { 
    id: 4, 
    title: 'Path of Technology', 
    author: 'K. Sharma', 
    category: 'Technical', 
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80',
    description: 'An insightful overview of information technology and its evolutionary history.',
    isBorrowed: false,
    pages: generatePages('Path of Technology', 'K. Sharma')
  },
  { 
    id: 5, 
    title: 'Ancient Kannada Literature', 
    author: 'R. Narasimhachar', 
    category: 'History', 
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80',
    description: 'An academic analysis of old Kannada poets and their classic literary works across centuries.',
    isBorrowed: false,
    pages: generatePages('Ancient Kannada Literature', 'R. Narasimhachar')
  },
  { 
    id: 6, 
    title: 'Environmental Science', 
    author: 'H. Nayak', 
    category: 'Science', 
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=300&q=80',
    description: 'A study on our surrounding environment and the critical significance of its preservation.',
    isBorrowed: false,
    pages: generatePages('Environmental Science', 'H. Nayak')
  },
  { 
    id: 7, 
    title: 'World Atlas', 
    author: 'B. Gupta', 
    category: 'Geography', 
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80',
    description: 'An interesting collection of physical and political maps regarding various nations of the world.',
    isBorrowed: false,
    pages: generatePages('World Atlas', 'B. Gupta')
  },
  { 
    id: 8, 
    title: 'Computer Education', 
    author: 'V. Patil', 
    category: 'Technical', 
    image: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=300&q=80',
    description: 'The best guide to learn foundational concepts of computers and electronic operating systems.',
    isBorrowed: false,
    pages: generatePages('Computer Education', 'V. Patil')
  },
  { 
    id: 9, 
    title: 'Kings of Mysore', 
    author: 'T. Ramanna', 
    category: 'History', 
    image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=300&q=80',
    description: 'The rich history and developmental contributions of the glorious Wodeyar dynasty of Mysore.',
    isBorrowed: false,
    pages: generatePages('Kings of Mysore', 'T. Ramanna')
  },
  { 
    id: 10, 
    title: 'Dance of Cells', 
    author: 'N. Krishna', 
    category: 'Science', 
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80',
    description: 'Detailed microscopic biological insights on how human cells function in the living body.',
    isBorrowed: false,
    pages: generatePages('Dance of Cells', 'N. Krishna')
  },
  { id: 11, title: 'Rivers of India', author: 'S. Matha', category: 'Geography', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=300&q=80', description: 'Key rivers of India and their strategic places of geographical origin.', isBorrowed: false, pages: generatePages('Rivers of India', 'S. Matha') },
  { id: 12, title: 'World of Electronics', author: 'R. Hegde', category: 'Technical', image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=300&q=80', description: 'Understandable guide to functional electronic components, systems, and devices.', isBorrowed: false, pages: generatePages('World of Electronics', 'R. Hegde') },
  { id: 13, title: 'Age of Kadambas', author: 'V. Shastri', category: 'History', image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=300&q=80', description: 'The establishment of the Kadamba dynasty and its historical reign and architecture.', isBorrowed: false, pages: generatePages('Age of Kadambas', 'V. Shastri') },
  { id: 14, title: 'Space Odyssey', author: 'M. Prasad', category: 'Science', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80', description: 'History of outer-space research, satellites, cosmic travels, and achievements of ISRO.', isBorrowed: false, pages: generatePages('Space Odyssey', 'M. Prasad') },
  { id: 15, title: 'Western Ghats', author: 'D. Kumar', category: 'Geography', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=300&q=80', description: 'Ecosystems of the Western Ghats mountain range and regional biodiversity protection.', isBorrowed: false, pages: generatePages('Western Ghats', 'D. Kumar') },
  { id: 16, title: 'Coding Mantra', author: 'S. Narayan', category: 'Technical', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80', description: 'Easy steps, structures, and programming tips for beginners learning to write software.', isBorrowed: false, pages: generatePages('Coding Mantra', 'S. Narayan') },
  { id: 17, title: 'Vijayanagara Empire', author: 'B. Venkappa', category: 'History', image: 'https://images.unsplash.com/photo-1569336415962-a4bd9f6dfc0f?auto=format&fit=crop&w=300&q=80', description: 'The historic golden era of Hampi and the legacy of the Vijayanagara Empire.', isBorrowed: false, pages: generatePages('Vijayanagara Empire', 'B. Venkappa') },
  { id: 18, title: 'Medicinal Plants', author: 'G. Naidu', category: 'Science', image: 'https://images.unsplash.com/photo-1505015920881-0f83c2f7c95e?auto=format&fit=crop&w=300&q=80', description: 'An introducing manual to various key healing herbs used historically in Ayurveda.', isBorrowed: false, pages: generatePages('Medicinal Plants', 'G. Naidu') },
  { id: 19, title: 'Deep Oceans', author: 'P. Gowda', category: 'Geography', image: 'https://images.unsplash.com/photo-1518340118873-19910ba7960d?auto=format&fit=crop&w=300&q=80', description: 'Secrets of marine life, pressure points, and ecology residing deep within the oceans.', isBorrowed: false, pages: generatePages('Deep Oceans', 'P. Gowda') },
  { id: 20, title: 'Learn Android', author: 'A. Kumar', category: 'Technical', image: 'https://images.unsplash.com/photo-1607706189992-3ed6796eb001?auto=format&fit=crop&w=300&q=80', description: 'Learn modern Android mobile application development from scratch in simple wording.', isBorrowed: false, pages: generatePages('Learn Android', 'A. Kumar') },
  { id: 21, title: 'Independence Struggle', author: 'K. Deshpande', category: 'History', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80', description: 'The heroic historic revolution and sacrifice of India fighting against colonial British rule.', isBorrowed: false, pages: generatePages('Independence Struggle', 'K. Deshpande') },
  { id: 22, title: 'When It Rains', author: 'U. Bhat', category: 'Science', image: 'https://images.unsplash.com/photo-1519692938322-632b6338f398?auto=format&fit=crop&w=300&q=80', description: 'The marvelous scientific mechanisms of rainfall, cloud formation, and the hydrological cycle.', isBorrowed: false, pages: generatePages('When It Rains', 'U. Bhat') },
  { id: 23, title: 'Mount Kailash', author: 'T. G.', category: 'Geography', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80', description: 'The unique geographical structure, glaciers, and spiritual importance of Kailash in the Himalayas.', isBorrowed: false, pages: generatePages('Mount Kailash', 'T. G.') },
  { id: 24, title: 'Web Design', author: 'J. Lewis', category: 'Technical', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=300&q=80', description: 'Learn how to construct, style, and launch highly user-friendly modern website interfaces.', isBorrowed: false, pages: generatePages('Web Design', 'J. Lewis') },
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
                  <h1 className="text-[#1A73E8] font-bold text-lg">Namma Pustaka</h1>
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
                </main>

                {/* BOTTOM NAVIGATION */}
                <nav className="h-16 bg-white border-t border-[#DADCE0] flex items-center justify-around shrink-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30">
                  <NavButton active={view === 'HOME'} icon={Home} label="Home" onClick={() => setView('HOME')} />
                  <NavButton active={view === 'STATS'} icon={BarChart3} label="Stats" onClick={() => setView('STATS')} />
                  <NavButton active={view === 'LEADERBOARD'} icon={Trophy} label="Leaderboard" onClick={() => setView('LEADERBOARD')} />
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
                      Close Profile
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
                      [Sign Out]
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
        <h2 className="text-xl font-bold text-[#5F6368]">Welcome</h2>
        <h2 className="text-4xl font-extrabold text-[#1A73E8] tracking-tight">Namma Pustaka</h2>
        <p className="text-[#1A73E8] text-[10px] mt-3 font-black uppercase tracking-[0.2em]">Smart Library Assistant</p>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A73E8] uppercase tracking-widest pl-1">Student Name</label>
          <input 
            type="text" 
            placeholder="e.g. Abhishek Kumar"
            className="geometric-input bg-gray-50 border-[#1A73E8]/30 focus:border-[#1A73E8] font-medium text-[#202124]"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2 pb-8">
          <label className="text-xs font-black text-[#1A73E8] uppercase tracking-widest pl-1">Student ID</label>
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
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'History', 'Science', 'Geography', 'Technical'];

  const filtered = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4">
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6368]" size={18} />
        <input 
          type="text"
          placeholder="Search books or authors..."
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
              <div className="absolute top-2 left-2 text-[9px] bg-black/40 text-white px-1.5 rounded-sm backdrop-blur-md font-bold uppercase tracking-widest font-mono">ID_{book.id}</div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-[#1A73E8] text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg font-sans">View Details</span>
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
                  {book.isBorrowed ? 'Borrowed' : 'Borrow'}
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
      <h2 className="text-xl font-bold text-[#202124] mb-4 px-1">My Reading Stats</h2>
      
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-[#DADCE0] shadow-sm text-center">
          <div className="text-3xl font-bold text-[#1A73E8]">{transactions.length}</div>
          <div className="text-[10px] uppercase font-bold text-[#5F6368]">Borrowed</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-[#DADCE0] shadow-sm text-center">
          <div className={`text-3xl font-bold ${overdueCount > 0 ? 'text-red-500' : 'text-[#1A73E8]'}`}>{overdueCount}</div>
          <div className="text-[10px] uppercase font-bold text-[#5F6368]">Overdue</div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-[#202124] mb-4 px-1">Books Currently With Me</h3>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12 opacity-30 text-xs">No books currently borrowed</div>
        ) : (
          transactions.map(t => {
            const book = books.find(b => b.id === t.bookId);
            return (
              <div key={t.id} className="bg-white border border-[#DADCE0] rounded-xl p-4 flex items-center gap-4">
                <img src={book?.image} className="w-12 h-16 object-cover rounded-md shadow-sm" />
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-[#202124] leading-tight">{book?.title}</h4>
                  <p className="text-[11px] text-[#5F6368]">Due Date: {new Date(t.dueDate).toLocaleDateString()}</p>
                </div>
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.isOverdue ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                  {t.isOverdue ? 'Overdue' : 'Active'}
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
    { name: 'Abhishek K', score: 12450, rank: '01' },
    { name: 'Rohan Sharma', score: 11200, rank: '02' },
    { name: 'Sneha Patil', score: 9800, rank: '03' },
    { name: 'Priya Verma', score: 8500, rank: '04' },
    { name: 'Vikram Singh', score: 7200, rank: '05' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-[#202124] mb-2 px-1">Leaderboard</h2>
      <p className="text-[11px] text-[#5F6368] mb-6 px-1">Reader engagement and points leaderboard</p>

      <div className="bg-white border border-[#DADCE0] rounded-xl overflow-hidden divide-y divide-[#DADCE0]">
        {leaders.map((leader) => (
          <div key={leader.rank} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <span className={`text-lg font-bold w-6 ${leader.rank === '01' ? 'text-[#1A73E8]' : 'text-[#5F6368]'}`}>{leader.rank}</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#202124]">{leader.name}</span>
                <span className="text-[11px] text-[#5F6368]">Level {6 - parseInt(leader.rank)} Reader</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-[#34A853]">{leader.score.toLocaleString()}</div>
              <div className="text-[10px] text-[#5F6368] uppercase font-bold">Pages</div>
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
      
      <h3 className="text-white font-bold mt-12 mb-2 text-center">Place QR Code inside the frame</h3>
      <p className="text-white/40 text-[11px] text-center px-8">Point the back camera at the book's QR code tag to scan and borrow it automatically.</p>

      <div className="mt-12 grid grid-cols-3 gap-4">
        {[1, 2, 3].map(id => (
          <button 
            key={id}
            onClick={() => onScan(id)}
            className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-[10px] hover:bg-white/20 transition-all font-bold font-mono"
          >
            TAG_{id}
          </button>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="mt-auto mb-8 text-[#1A73E8] text-xs font-bold uppercase tracking-widest bg-[#1A73E8]/10 px-8 py-3 rounded-full hover:bg-[#1A73E8]/20 transition-all font-sans"
      >
        Cancel Scan
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
  const [category, setCategory] = useState('History');

  const handleSubmit = () => {
    if (!title || !author) return;
    const newBook: Book = {
      id: Math.floor(Math.random() * 100000),
      title,
      author,
      category,
      image: 'https://images.unsplash.com/photo-1543004629-ff569587207c?auto=format&fit=crop&w=300&q=80',
      description: 'Newly added book in our repository layout. This book is now available for all students to read and borrow.',
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
          <h3 className="font-bold text-[#202124]">Add New Book</h3>
          <button onClick={onClose} className="text-[#5F6368] text-xs font-bold uppercase tracking-widest">[Cancel]</button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">Book Title</label>
            <input 
              type="text"
              placeholder="e.g. A New Horizon"
              className="geometric-input bg-gray-50 text-sm font-medium"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">Author</label>
            <input 
              type="text"
              placeholder="e.g. R. K. Narayan"
              className="geometric-input bg-gray-50 text-sm font-medium"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">Category</label>
            <select 
              className="geometric-input bg-gray-50 text-sm font-medium"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>History</option>
              <option>Science</option>
              <option>Geography</option>
              <option>Technical</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!title || !author}
          className="w-full geometric-btn py-3 mt-2 disabled:opacity-50 font-black uppercase tracking-widest"
        >
          Register Book
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
            <p className="text-sm text-[#5F6368] mb-4">by {book.author}</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${book.isBorrowed ? 'bg-orange-500' : 'bg-green-500'}`} />
              <span className={`text-[11px] font-bold ${book.isBorrowed ? 'text-orange-600' : 'text-green-600'}`}>
                {book.isBorrowed ? 'Currently Borrowed' : 'Available in Library'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#DADCE0]/30">
            <h4 className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest mb-2">About the Book</h4>
            <p className="text-[12px] leading-relaxed text-[#5F6368] font-medium font-sans">
              {book.description}
            </p>
            <div className="mt-3 flex items-center gap-2 text-[10px] text-[#1A73E8] font-bold">
              <BookIcon size={12} />
              <span>Preview Available (20 pages)</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl border border-[#DADCE0]/50">
            <h4 className="text-[10px] font-black text-[#5F6368] uppercase tracking-widest mb-2">Book Info</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-[#5F6368]">Library ID</p>
                <p className="text-xs font-bold text-[#202124] font-mono">NP-LIB-{book.id}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#5F6368]">Location</p>
                <p className="text-xs font-bold text-[#202124]">Shelf A-12</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={onRead}
              className="flex-grow flex items-center justify-center gap-2 border-2 border-[#1A73E8] text-[#1A73E8] py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1A73E8]/5 transition-colors font-sans"
            >
              Start Reading
            </button>
            <button 
              onClick={onScan}
              disabled={book.isBorrowed}
              className={`flex-grow geometric-btn py-4 flex items-center justify-center gap-2 font-sans ${book.isBorrowed ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
            >
              <ScanLine size={18} />
              {book.isBorrowed ? 'Already Borrowed' : 'Borrow Now'}
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
          <p className="text-[9px] text-[#5F6368] uppercase font-bold">Reading Mode</p>
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
          <div className="absolute top-4 right-6 text-[10px] font-bold text-gray-300 font-mono">Page {currentPage + 1} / 20</div>
          <div className="whitespace-pre-line text-sm leading-relaxed text-[#3C4043] font-sans">
            {book.pages[currentPage]}
          </div>
        </motion.div>
      </div>

      <footer className="h-20 border-t border-[#DADCE0] flex items-center justify-between px-6 shrink-0 bg-white pb-4 font-sans">
        <button 
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          className="flex items-center gap-2 text-xs font-black text-[#1A73E8] disabled:opacity-30 uppercase tracking-widest"
        >
          Previous
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-400">Progress</span>
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
          Next
        </button>
      </footer>
    </div>
  );
}
