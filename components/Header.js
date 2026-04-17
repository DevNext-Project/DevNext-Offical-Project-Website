function Header() {
  try {
    const [currentTime, setCurrentTime] = React.useState(new Date());

    React.useEffect(() => {
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const dateStr = currentTime.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
    const timeStr = currentTime.toLocaleTimeString('ja-JP', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
      <header className="fixed top-0 w-full z-50 bg-[var(--bg-dark)]/80 backdrop-blur-md border-b border-white/10 flex flex-col" data-name="header" data-file="components/Header.js">
        {/* Top Time Bar */}
        <div className="w-full bg-[#0b0c0f]/90 py-1.5 flex justify-center items-center font-mono text-[10px] sm:text-xs tracking-widest border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
              <span className="text-green-400 font-semibold">SYSTEM ONLINE</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-[var(--primary)] font-medium glow-text">
              {dateStr} <span className="ml-1 text-white/80">{timeStr}</span>
            </span>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="w-full bg-yellow-500/10 border-b border-yellow-500/20 py-2.5 px-4 flex justify-center items-center backdrop-blur-md">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-yellow-100 max-w-7xl mx-auto">
            <div className="icon-triangle-alert text-yellow-500 flex-shrink-0 text-sm"></div>
            <span>現在ドメイン取得のためにyuucraft.comで代行しております。ドメインが確保でき次第devnext-project.netに切り替えます。少々お待ち下さい。</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <span className="text-xl font-bold tracking-tight text-white">
                DevNext <span className="text-[var(--primary)]">Project</span>
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-[var(--text-muted)] hover:text-white transition-colors">特徴</a>
              <a href="#about" className="text-[var(--text-muted)] hover:text-white transition-colors">私たちについて</a>
              <a href="#team" className="text-[var(--text-muted)] hover:text-white transition-colors">チーム</a>
            </nav>

            <div className="flex items-center">
              <a 
                href="#" 
                className="btn btn-primary px-4 py-2 text-sm"
              >
                <div className="icon-play mr-2 text-base"></div>
                DevNext Toolsを起動
              </a>
            </div>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}
