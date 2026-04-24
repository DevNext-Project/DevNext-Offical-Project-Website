const { useState, useEffect } = React;

const ICONS = [
  'icon-star', 'icon-heart', 'icon-moon', 'icon-sun',
  'icon-cloud', 'icon-snowflake', 'icon-zap', 'icon-flame'
];

const Memory = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.icon === secondCard.icon) {
        setMatched(m => [...m, newFlipped[0], newFlipped[1]]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          setTimeout(() => setGameWon(true), 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-gray-900 py-8 px-4" data-name="memory-wrapper" data-file="components/Memory.js">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6 px-2">
          <div>
            <h1 className="text-4xl font-black text-purple-500 mb-1">MEMORY</h1>
            <p className="text-gray-400 text-sm">Match the pairs!</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 min-w-[80px] text-center">
            <div className="text-gray-400 text-xs font-bold">MOVES</div>
            <div className="text-2xl font-bold text-white">{moves}</div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-2xl border-t-4 border-purple-600 relative">
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {cards.map((card, index) => {
              const isFlipped = flipped.includes(index) || matched.includes(index);
              const isMatched = matched.includes(index);
              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform preserve-3d flex items-center justify-center text-3xl sm:text-4xl shadow-md
                    ${isFlipped ? 'bg-purple-100 rotate-y-180' : 'bg-purple-600 hover:bg-purple-500'}
                    ${isMatched ? 'opacity-50 !bg-green-100 scale-95' : ''}
                  `}
                  style={{ perspective: '1000px' }}
                >
                  <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-100 text-purple-600' : 'opacity-0'}`}>
                    <div className={`${card.icon} ${isMatched ? 'text-green-600' : ''}`}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {gameWon && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl p-6 text-center z-10 backdrop-blur-sm">
              <h2 className="text-purple-400 font-black text-5xl mb-2 drop-shadow-md">You Win!</h2>
              <p className="text-white text-xl mb-6">Total Moves: {moves}</p>
              <button
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_6px_0_#4c1d95] active:shadow-[0_0px_0_#4c1d95] active:translate-y-1.5 transition-all text-lg"
                onClick={initializeGame}
              >
                Play Again
              </button>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={initializeGame}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 transition-all flex items-center gap-2"
          >
            <div className="icon-rotate-cw"></div> Restart
          </button>
        </div>
      </div>
    </div>
  );
};
