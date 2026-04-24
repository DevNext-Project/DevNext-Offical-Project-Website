const { useState, useEffect, useCallback, useRef, useMemo } = React;

const GRID_SIZE = 4;

const TILE_COLORS = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

const TILE_TEXT_COLORS = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2',
};

const getEmptyCoordinates = (board) => {
  const empty = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      if (board[y][x] === 0) {
        empty.push({ x, y });
      }
    }
  }
  return empty;
};

const addRandomTile = (board) => {
  const emptyCoords = getEmptyCoordinates(board);
  if (emptyCoords.length === 0) return board;

  const randomCoord = emptyCoords[Math.floor(Math.random() * emptyCoords.length)];
  const newValue = Math.random() < 0.9 ? 2 : 4;

  const newBoard = board.map(row => [...row]);
  newBoard[randomCoord.y][randomCoord.x] = newValue;
  return newBoard;
};

const initializeBoard = () => {
  let board = Array.from({ length: GRID_SIZE }, () => new Array(GRID_SIZE).fill(0));
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
};

const checkGameOver = (board) => {
  // Check for empty cells
  if (getEmptyCoordinates(board).length > 0) return false;

  // Check for possible merges
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const current = board[y][x];
      if (
        (x < GRID_SIZE - 1 && board[y][x + 1] === current) ||
        (y < GRID_SIZE - 1 && board[y + 1][x] === current)
      ) {
        return false;
      }
    }
  }
  return true;
};

const Game2048 = () => {
  const savedState = useMemo(() => {
    try {
      const item = localStorage.getItem('2048GameState');
      return item ? JSON.parse(item) : null;
    } catch (e) { return null; }
  }, []);

  const [board, setBoard] = useState(savedState?.board ?? initializeBoard());
  const [score, setScore] = useState(savedState?.score ?? 0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(savedState?.gameOver ?? false);
  const [gameWon, setGameWon] = useState(savedState?.gameWon ?? false);
  const [hasContinued, setHasContinued] = useState(savedState?.hasContinued ?? false);
  const gameAreaRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('2048HighScore');
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('2048HighScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const stateToSave = { board, score, gameOver, gameWon, hasContinued };
    localStorage.setItem('2048GameState', JSON.stringify(stateToSave));
  }, [board, score, gameOver, gameWon, hasContinued]);

  useEffect(() => {
    if (gameAreaRef.current) gameAreaRef.current.focus();
  }, []);

  const move = useCallback((direction) => {
    if (gameOver || (gameWon && !hasContinued)) return;

    let newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = score;
    let won = gameWon;

    const slide = (row) => {
      let filtered = row.filter(val => val !== 0);
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          newScore += filtered[i];
          if (filtered[i] === 2048) won = true;
          filtered.splice(i + 1, 1);
        }
      }
      while (filtered.length < GRID_SIZE) filtered.push(0);
      return filtered;
    };

    if (direction === 'LEFT' || direction === 'RIGHT') {
      for (let y = 0; y < GRID_SIZE; y++) {
        let row = newBoard[y];
        if (direction === 'RIGHT') row.reverse();
        let newRow = slide(row);
        if (direction === 'RIGHT') newRow.reverse();
        if (newBoard[y].join(',') !== newRow.join(',')) moved = true;
        newBoard[y] = newRow;
      }
    } else if (direction === 'UP' || direction === 'DOWN') {
      for (let x = 0; x < GRID_SIZE; x++) {
        let col = [newBoard[0][x], newBoard[1][x], newBoard[2][x], newBoard[3][x]];
        if (direction === 'DOWN') col.reverse();
        let newCol = slide(col);
        if (direction === 'DOWN') newCol.reverse();
        for (let y = 0; y < GRID_SIZE; y++) {
          if (newBoard[y][x] !== newCol[y]) moved = true;
          newBoard[y][x] = newCol[y];
        }
      }
    }

    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      if (won && !gameWon) setGameWon(true);
      if (checkGameOver(newBoard)) setGameOver(true);
    }
  }, [board, score, gameOver, gameWon, hasContinued]);

  const handleKeyDown = (e) => {
    if ([37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
    if (e.key === 'ArrowUp') move('UP');
    if (e.key === 'ArrowDown') move('DOWN');
    if (e.key === 'ArrowLeft') move('LEFT');
    if (e.key === 'ArrowRight') move('RIGHT');
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setHasContinued(false);
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  const continueGame = () => {
    setHasContinued(true);
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  // Simple Swipe Detection for Mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 30;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchMove = (e) => {
    setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) move('LEFT');
      else move('RIGHT');
    } else if (!isHorizontal && Math.abs(distanceY) > minSwipeDistance) {
      if (distanceY > 0) move('UP');
      else move('DOWN');
    }
  };

  return (
    <div 
      className="flex flex-col xl:flex-row items-center justify-center flex-1 bg-gray-900 gap-6 outline-none py-6 overflow-y-auto"
      role="button"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      ref={gameAreaRef}
      data-name="2048-wrapper"
      data-file="components/Game2048.js"
    >
      <div className="flex flex-col items-center w-full max-w-lg">
        {/* Header & Stats */}
        <div className="flex justify-between w-full max-w-md mb-6 px-4">
          <div className="flex-1">
            <h1 className="text-5xl font-black text-yellow-500 mb-2">2048</h1>
            <p className="text-gray-400 text-sm">Join the numbers to win!</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-gray-800 p-2 rounded-lg border border-gray-700 min-w-[80px] text-center">
              <div className="text-gray-400 text-xs font-bold">SCORE</div>
              <div className="text-xl font-bold text-white">{score}</div>
            </div>
            <div className="bg-gray-800 p-2 rounded-lg border border-gray-700 min-w-[80px] text-center">
              <div className="text-gray-400 text-xs font-bold">BEST</div>
              <div className="text-xl font-bold text-yellow-500">{highScore}</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between w-full max-w-md mb-4 px-4">
          <button 
            className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg shadow-[0_4px_0_#854d0e] active:shadow-[0_0px_0_#854d0e] active:translate-y-1 transition-all"
            onClick={resetGame}
          >
            New Game
          </button>
          <div className="text-gray-400 text-sm flex items-center">
            Use arrow keys or swipe
          </div>
        </div>

        {/* Game Board */}
        <div 
          className="relative bg-[#bbada0] p-3 rounded-xl shadow-2xl flex-shrink-0 touch-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div 
            className="grid gap-3" 
            style={{
              gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
              width: 'min(90vw, 50vh, 400px)',
              height: 'min(90vw, 50vh, 400px)'
            }}
          >
            {board.map((row, y) => row.map((val, x) => (
              <div 
                key={`${y}-${x}`} 
                className="w-full h-full rounded-md flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-inner"
                style={{
                  backgroundColor: val > 0 ? (TILE_COLORS[val] || '#3c3a32') : '#cdc1b4',
                  color: val > 0 ? (TILE_TEXT_COLORS[val] || '#f9f6f2') : 'transparent',
                  transition: 'background-color 0.15s ease-in-out'
                }}
              >
                {val > 0 ? val : ''}
              </div>
            )))}
          </div>
          
          {/* Game Won Overlay */}
          {gameWon && !hasContinued && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-yellow-500/80 rounded-xl p-6 text-center z-10 backdrop-blur-sm">
              <h2 className="text-white font-black text-5xl mb-4 drop-shadow-md">You Win!</h2>
              <div className="flex gap-4">
                <button
                  className="bg-gray-900 hover:bg-black text-white font-bold py-3 px-6 rounded-xl shadow-[0_4px_0_#000] active:shadow-[0_0px_0_#000] active:translate-y-1 transition-all text-lg"
                  onClick={continueGame}
                >
                  Keep Going
                </button>
                <button
                  className="bg-white hover:bg-gray-100 text-yellow-600 font-bold py-3 px-6 rounded-xl shadow-[0_4px_0_#d1d5db] active:shadow-[0_0px_0_#d1d5db] active:translate-y-1 transition-all text-lg"
                  onClick={resetGame}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl p-6 text-center z-10 backdrop-blur-sm">
              <h2 className="text-gray-300 font-bold text-4xl mb-6 drop-shadow-md">Game Over!</h2>
              <button
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_6px_0_#854d0e] active:shadow-[0_0px_0_#854d0e] active:translate-y-1.5 transition-all text-lg"
                onClick={resetGame}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Gaming Controller for Mobile/Mouse users */}
        <div className="flex justify-center items-center gap-8 mt-6 w-full max-w-sm lg:hidden">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36">
            <div />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-t-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => { move('UP'); if (gameAreaRef.current) gameAreaRef.current.focus(); }}
            >
              <div className="icon-arrow-up text-xl"></div>
            </button>
            <div />
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-l-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => { move('LEFT'); if (gameAreaRef.current) gameAreaRef.current.focus(); }}
            >
              <div className="icon-arrow-left text-xl"></div>
            </button>
            <div className="bg-gray-800 rounded-full w-8 h-8 self-center justify-self-center shadow-inner border border-gray-700 flex items-center justify-center"><div className="w-2 h-2 bg-gray-600 rounded-full"></div></div>
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-r-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => { move('RIGHT'); if (gameAreaRef.current) gameAreaRef.current.focus(); }}
            >
              <div className="icon-arrow-right text-xl"></div>
            </button>
            
            <div />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-b-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => { move('DOWN'); if (gameAreaRef.current) gameAreaRef.current.focus(); }}
            >
              <div className="icon-arrow-down text-xl"></div>
            </button>
            <div />
          </div>
        </div>

      </div>
    </div>
  );
};
