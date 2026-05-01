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
}

interface Transaction {
  id: number;
  bookId: number;
  dueDate: number;
  isOverdue: boolean;
}

const SAMPLE_BOOKS: Book[] = [
  { id: 1, title: 'Kotlin in Action', author: 'Dmitry Jemerov', category: 'Programming', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80' },
  { id: 2, title: 'Clean Code', author: 'Robert C. Martin', category: 'Computing', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80' },
  { id: 3, title: 'Modern Android', author: 'Google Devs', category: 'Mobile', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&w=300&q=80' },
  { id: 4, title: 'Data Structures', author: 'S. Lipschutz', category: 'Academic', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80' },
  { id: 5, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', category: 'Dev', image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=300&q=80' },
  { id: 6, title: 'Refactoring', author: 'Martin Fowler', category: 'Software', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=300&q=80' },
  { id: 7, title: 'Design Patterns', author: 'Gang of Four', category: 'Arch', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=300&q=80' },
  { id: 8, title: 'Android Internals', author: 'Jonathan Levin', category: 'System', image: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=300&q=80' },
  { id: 9, title: 'The Art of Computer Programming', author: 'Donald Knuth', category: 'Logic', image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=300&q=80' },
  { id: 10, title: 'Structure and Interpretation', author: 'Abelson & Sussman', category: 'LISP', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=300&q=80' },
  { id: 11, title: 'Cracking the Coding Interview', author: 'Gayle Laakmann', category: 'Interview', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80' },
  { id: 12, title: 'Effective Java', author: 'Joshua Bloch', category: 'Java', image: 'https://images.unsplash.com/photo-1511108690759-001047530c5e?auto=format&fit=crop&w=300&q=80' },
];

export default function App() {
  const [view, setView] = useState<View>('LOGIN');
  const [student, setStudent] = useState<{ name: string; id: string } | null>(null);
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);

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
                  <h1 className="text-[#1A73E8] font-bold text-lg">Namma-Pustaka</h1>
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
                  <NavButton active={view === 'LEADERBOARD'} icon={Trophy} label="Board" onClick={() => setView('LEADERBOARD')} />
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

          {/* SCANNER OVERLAY */}
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
                      CLOSE_PROFILE
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
                      [SIGNOUT_SESSION]
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
        <h2 className="text-xl font-bold text-[#5F6368]">Welcome to</h2>
        <h2 className="text-4xl font-extrabold text-[#1A73E8] tracking-tight">Namma-Pustaka</h2>
        <p className="text-[#1A73E8] text-[10px] mt-3 font-black uppercase tracking-[0.2em]">Smart Library Assistant</p>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black text-[#1A73E8] uppercase tracking-widest pl-1">Student Name</label>
          <input 
            type="text" 
            placeholder="Abhishek Kumar"
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

function HomeView({ searchQuery, setSearchQuery, books, onScanClick }: { searchQuery: string, setSearchQuery: Function, books: Book[], onScanClick: () => void }) {
  const filtered = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5F6368]" size={18} />
        <input 
          type="text"
          placeholder="Search for books or authors..."
          className="w-full bg-[#F1F3F4] border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#1A73E8]/20 transition-all"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filtered.map(book => (
          <motion.div 
            key={book.id} 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#DADCE0] rounded-xl p-2 flex flex-col h-full group hover:shadow-md transition-shadow duration-300"
          >
            <div className="aspect-[3/4] bg-[#E8EAED] rounded-lg mb-2 overflow-hidden relative">
              <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-2 left-2 text-[9px] bg-black/40 text-white px-1.5 rounded-sm backdrop-blur-md">ID_{book.id}</div>
            </div>
            <div className="flex flex-col flex-grow">
              <h4 className="text-[13px] font-bold text-[#202124] truncate leading-tight">{book.title}</h4>
              <p className="text-[11px] text-[#5F6368] truncate mb-2">{book.author}</p>
              <button 
                onClick={onScanClick}
                className="mt-auto secondary-btn py-1.5 text-[10px]"
              >
                Scan to Borrow
              </button>
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

      <h3 className="text-sm font-bold text-[#202124] mb-4 px-1">Currently Holding</h3>
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-12 opacity-30 text-xs">NO_BOOKS_BORROWED</div>
        ) : (
          transactions.map(t => {
            const book = books.find(b => b.id === t.bookId);
            return (
              <div key={t.id} className="bg-white border border-[#DADCE0] rounded-xl p-4 flex items-center gap-4">
                <img src={book?.image} className="w-12 h-16 object-cover rounded-md shadow-sm" />
                <div className="flex-grow">
                  <h4 className="text-sm font-bold text-[#202124] leading-tight">{book?.title}</h4>
                  <p className="text-[11px] text-[#5F6368]">Due: {new Date(t.dueDate).toLocaleDateString()}</p>
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
      <p className="text-[11px] text-[#5F6368] mb-6 px-1">Reader Engagement Rankings</p>

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
      
      <h3 className="text-white font-bold mt-12 mb-2">Align QR Code</h3>
      <p className="text-white/40 text-xs text-center px-8">Point the back camera at a book's QR tag to automatically register your borrow request.</p>

      <div className="mt-12 grid grid-cols-3 gap-4">
        {[1, 2, 3].map(id => (
          <button 
            key={id}
            onClick={() => onScan(id)}
            className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white text-xs hover:bg-white/20 transition-all"
          >
            TAG_{id}
          </button>
        ))}
      </div>

      <button 
        onClick={onBack}
        className="mt-auto mb-8 text-[#1A73E8] text-xs font-bold uppercase tracking-widest bg-[#1A73E8]/10 px-8 py-3 rounded-full hover:bg-[#1A73E8]/20 transition-all"
      >
        CANCEL_SCAN
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
  const [category, setCategory] = useState('Standard');

  const handleSubmit = () => {
    if (!title || !author) return;
    const newBook: Book = {
      id: Math.floor(Math.random() * 100000),
      title,
      author,
      category,
      image: 'https://images.unsplash.com/photo-1543004629-ff569587207c?auto=format&fit=crop&w=300&q=80'
    };
    onAdd(newBook);
  };

  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-bold text-[#202124]">Add New Book</h3>
          <button onClick={onClose} className="text-[#5F6368] text-xs font-bold uppercase tracking-widest">[CANCEL]</button>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">Book Title</label>
            <input 
              type="text"
              placeholder="e.g. Clean Architecture"
              className="geometric-input bg-gray-50 text-sm"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">Author</label>
            <input 
              type="text"
              placeholder="e.g. Robert C. Martin"
              className="geometric-input bg-gray-50 text-sm"
              value={author}
              onChange={e => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-[#1A73E8] uppercase tracking-widest">Category</label>
            <select 
              className="geometric-input bg-gray-50 text-sm"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>Programming</option>
              <option>Development</option>
              <option>Academic</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={!title || !author}
          className="w-full geometric-btn py-3 mt-2 disabled:opacity-50"
        >
          REGISTER_BOOK
        </button>
      </motion.div>
    </div>
  );
}
