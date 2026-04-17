function About() {
  try {
    return (
      <section id="about" className="section-padding" data-name="about" data-file="components/About.js">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[var(--primary)] font-bold tracking-wider text-sm uppercase mb-4 block">Who We Are</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            DevNext Projectは、あなたとともに。
          </h2>
          <div className="prose prose-invert prose-lg mx-auto text-[var(--text-muted)]">
            <p className="mb-6 leading-relaxed">
              DevNext-Projectは、すべてのツールをパブリックに公開し、教育や学習にも貢献できるように務めてまいります。
            </p>
            <p className="mb-8 leading-relaxed">
              2026年から活動を開始したDevNext Projectは、インターネットのサービス向上貢献を目標に日々活動しております。
            </p>
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('About component error:', error);
    return null;
  }
}
