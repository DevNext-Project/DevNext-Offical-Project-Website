function Footer() {
  try {
    const currentYear = 2026;
    
    return (
      <footer className="bg-[#0b0c0f] border-t border-white/10 pt-16 pb-8" data-name="footer" data-file="components/Footer.js">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="lg:col-span-2">
              <span className="text-2xl font-bold tracking-tight text-white mb-4 block">
                DevNext <span className="text-[var(--primary)]">Project</span>
              </span>
              <p className="text-[var(--text-muted)] max-w-sm mb-6">
                Discordを拠点とする情報交流・支援組織。安全で快適なコミュニティ運営をサポートします。
              </p>
              <div className="flex items-center gap-2 text-[var(--text-muted)] hover:text-white transition-colors">
                <div className="icon-mail"></div>
                <a href="mailto:usen-offical@proton.me">usen-offical@proton.me</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">リンク</h4>
              <ul className="space-y-3 text-[var(--text-muted)]">
                <li><a href="#features" className="hover:text-[var(--primary)] transition-colors">特徴</a></li>
                <li><a href="#about" className="hover:text-[var(--primary)] transition-colors">私たちについて</a></li>
                <li><a href="#team" className="hover:text-[var(--primary)] transition-colors">チーム</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">アクション</h4>
              <ul className="space-y-3 text-[var(--text-muted)]">
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">DevNext Toolsを起動</a></li>
                <li><a href="#" className="hover:text-[var(--primary)] transition-colors">その他ツール</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--text-muted)] text-sm">
              &copy; {currentYear} USEN Alliance. All rights reserved.
            </p>
            <div className="flex space-x-4 text-[var(--text-muted)]">
              {/* Optional social icons could go here */}
            </div>
          </div>
        </div>
      </footer>
    );
  } catch (error) {
    console.error('Footer component error:', error);
    return null;
  }
}
