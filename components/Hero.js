function Hero() {
  try {
    return (
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" data-name="hero" data-file="components/Hero.js">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)]/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="section-padding relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-tight">
            あなたとともに、<br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-blue-400">
              DevNext Project
            </span> は動く。
          </h1>
          
          <p className="mt-4 text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">DevNext Projectは、2026年から始動した、Web開発を中心とし静的コードでWebツールを常時無料で提供する組織です。</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#"
              className="btn btn-primary w-full sm:w-auto text-lg px-8 py-4"
            >
              <div className="icon-play mr-2"></div>
              DevNext Toolsを起動
            </a>
            <a 
              href="#"
              className="btn btn-outline w-full sm:w-auto text-lg px-8 py-4"
            >
              <div className="icon-package mr-2"></div>
              その他ツール
            </a>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Hero component error:', error);
    return null;
  }
}
