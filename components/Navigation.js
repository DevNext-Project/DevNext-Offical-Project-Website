const Navigation = () => {
  const path = window.location.pathname;
  const isTetris = path.includes('index.html') || path === '/' || path.endsWith('/');
  const isSnake = path.includes('snake.html');
  const is2048 = path.includes('2048.html');
  const isMemory = path.includes('memory.html');
  const isMinesweeper = path.includes('minesweeper.html');

  return (
    <div className="bg-gray-800/95 backdrop-blur-sm p-3 sm:p-4 shadow-md flex flex-col xl:flex-row items-center justify-between gap-3 sm:gap-4 border-b border-gray-700 w-full z-50 sticky top-0" data-name="navigation" data-file="components/Navigation.js">
      <div className="flex items-center gap-2 text-white font-black text-xl sm:text-2xl tracking-wider shrink-0">
        <div className="icon-gamepad-2 text-blue-500"></div>
        <span>DevNext MiniGames</span>
      </div>
      <div className="flex overflow-x-auto w-full xl:w-auto pb-2 xl:pb-0 scrollbar-hide justify-start xl:justify-center gap-2 px-2 snap-x">
        <a 
          href="index.html" 
          className={`snap-center shrink-0 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg text-sm sm:text-base ${isTetris ? 'bg-blue-600 text-white shadow-blue-900/50 scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
        >
          <div className="icon-layout-grid text-lg"></div>
          TETRIS
        </a>
        <a 
          href="snake.html" 
          className={`snap-center shrink-0 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg text-sm sm:text-base ${isSnake ? 'bg-green-600 text-white shadow-green-900/50 scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
        >
          <div className="icon-move text-lg"></div>
          SNAKE
        </a>
        <a 
          href="2048.html" 
          className={`snap-center shrink-0 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg text-sm sm:text-base ${is2048 ? 'bg-yellow-600 text-white shadow-yellow-900/50 scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
        >
          <div className="icon-grid-2x2 text-lg"></div>
          2048
        </a>
        <a 
          href="memory.html" 
          className={`snap-center shrink-0 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg text-sm sm:text-base ${isMemory ? 'bg-purple-600 text-white shadow-purple-900/50 scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
        >
          <div className="icon-brain text-lg"></div>
          MEMORY
        </a>
        <a 
          href="minesweeper.html" 
          className={`snap-center shrink-0 px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg text-sm sm:text-base ${isMinesweeper ? 'bg-red-600 text-white shadow-red-900/50 scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
        >
          <div className="icon-bomb text-lg"></div>
          MINESWEEPER
        </a>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};
