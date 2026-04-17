function Features() {
  try {
    const features = [
      {
        icon: "icon-shield-check",
        title: "静的コードで構築されたツールのみだから、安全99.99%。",
        description: "あなたのWebにのみ情報が保存され、こちら側から情報を閲覧することはありません。高品質を保ったまま、セキュリティを保護することができます。"
      },
      {
        icon: "icon-book-open",
        title: "教育用にも最適。誰でも使いやすいツールを提供",
        description: "静的コードはあなたのPCでのみ動作し、サーバーに情報は送信されません。安全な活動を重視したい環境でおすすめです。"
      },
      {
        icon: "icon-package",
        title: "豊富なツール・学べて遊べるソフトをご用意",
        description: "高速かつ高性能なサービスを24時間365日無料でご利用いただけます。Webならではの負担のストレスを軽減し、サービス利用者第一を重視しております。"
      }
    ];

    return (
      <section id="features" className="bg-[var(--bg-card)]/50 border-y border-white/5" data-name="features" data-file="components/Features.js">
        <div className="section-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-[var(--bg-dark)] p-8 rounded-2xl border border-white/10 hover:border-[var(--primary)]/50 transition-colors duration-300">
                <div className="w-12 h-12 bg-[var(--primary)]/10 rounded-xl flex items-center justify-center mb-6">
                  <div className={`${feature.icon} text-2xl text-[var(--primary)]`}></div>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Features component error:', error);
    return null;
  }
}
