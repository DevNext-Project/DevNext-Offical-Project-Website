function Team() {
  try {
    const members = [
      {
        name: "ゆーくら",
        role: "代表 / 創設者",
        avatar: "https://cdn.discordapp.com/avatars/1307914917898096724/140d70c629454ce050831b993888058c.png?size=1024"
      },
      {
        name: "ふにゃくん.exe",
        role: "HTML開発者",
        avatar: "https://cdn.grapesjs.com/workspaces/cmn9om61s6caj5go0qlgn3yeg/assets/b2112307-90ff-4d0e-9e66-a8aa75d46aee__1c9b3e308f982494d02d20751f012d20.png"
      }
    ];

    return (
      <section id="team" className="bg-[var(--bg-card)]/30 border-t border-white/5" data-name="team" data-file="components/Team.js">
        <div className="section-padding">
          <div className="text-center mb-16">
            <span className="text-[var(--primary)] font-bold tracking-wider text-sm uppercase mb-4 block">Our Team</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              DevNext-Project開発者・利用者の声
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {members.map((member, index) => (
              <div key={index} className="bg-[var(--bg-card)] rounded-2xl p-8 border border-white/10 flex flex-col relative overflow-hidden group hover:border-[var(--primary)]/50 transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-4">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-16 h-16 rounded-full border-2 border-[var(--primary)] object-cover bg-black"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=5865F2&color=fff';
                    }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-sm text-[var(--primary)] font-medium">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Team component error:', error);
    return null;
  }
}
