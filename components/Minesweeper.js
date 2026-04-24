const { useState, useEffect, useCallback } = React;

const ROWS = 10;
const COLS = 10;
const MINES = 12;

const createBoard = () => {
  let board = Array(ROWS).fill().map((_, y) => 
    Array(COLS).fill().map((_, x) => ({
      x, y, isMine: false, isRevealed: false, isFlagged: false, neighborMines: 0
    }))
  );
  
  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const x = Math.floor(Math.random() * COLS);
    const y = Math.floor(Math.random() * ROWS);
    if (!board[y][x].isMine) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbors
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!board[y][x].isMine) {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const ny = y + dy, nx = x + dx;
            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && board[ny][nx].isMine) {
              count++;
            }
          }
        }
        board[y][x].neighborMines = count;
      }
    }
  }
  return board;
};

const Minesweeper = () => {
  const [board, setBoard] = useState(createBoard());
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flags, setFlags] = useState(MINES);

  const checkWin = (currentBoard) => {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (!currentBoard[y][x].isMine && !currentBoard[y][x].isRevealed) return false;
      }
    }
    return true;
  };

  const revealCell = (x, y) => {
    if (gameOver || gameWon || board[y][x].isRevealed || board[y][x].isFlagged) return;

    let newBoard = [...board.map(row => [...row])];
    
    if (newBoard[y][x].isMine) {
      // Game Over, reveal all mines
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const floodFill = (cx, cy) => {
      if (cx < 0 || cx >= COLS || cy < 0 || cy >= ROWS) return;
      if (newBoard[cy][cx].isRevealed || newBoard[cy][cx].isFlagged) return;
      
      newBoard[cy][cx].isRevealed = true;
      
      if (newBoard[cy][cx].neighborMines === 0) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            floodFill(cx + dx, cy + dy);
          }
        }
      }
    };

    floodFill(x, y);
    setBoard(newBoard);
    
    if (checkWin(newBoard)) setGameWon(true);
  };

  const toggleFlag = (e, x, y) => {
    e.preventDefault();
    if (gameOver || gameWon || board[y][x].isRevealed) return;

    let newBoard = [...board.map(row => [...row])];
    if (!newBoard[y][x].isFlagged && flags > 0) {
      newBoard[y][x].isFlagged = true;
      setFlags(f => f - 1);
    } else if (newBoard[y][x].isFlagged) {
      newBoard[y][x].isFlagged = false;
      setFlags(f => f + 1);
    }
    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(createBoard());
    setGameOver(false);
    setGameWon(false);
    setFlags(MINES);
  };

  const getNumberColor = (num) => {
    const colors = ['text-transparent', 'text-blue-500', 'text-green-500', 'text-red-500', 'text-purple-500', 'text-yellow-600', 'text-cyan-500', 'text-black', 'text-gray-600'];
    return colors[num];
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 bg-gray-900 py-8 px-4" data-name="minesweeper-wrapper" data-file="components/Minesweeper.js">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6 px-2">
          <div>
            <h1 className="text-4xl font-black text-red-500 mb-1">MINESWEEPER</h1>
            <p className="text-gray-400 text-sm">Clear without detonating!</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700 min-w-[80px] text-center">
            <div className="text-red-400 text-xs font-bold">FLAGS</div>
            <div className="text-2xl font-bold text-white">{flags}</div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-2xl border-t-4 border-red-600 relative inline-block mx-auto w-full">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
            {board.map((row, y) => row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                onClick={() => revealCell(x, y)}
                onContextMenu={(e) => toggleFlag(e, x, y)}
                className={`aspect-square flex items-center justify-center text-lg sm:text-xl font-bold rounded-sm cursor-pointer select-none transition-colors
                  ${cell.isRevealed 
                    ? cell.isMine 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-900/50 shadow-inner' 
                    : 'bg-gray-600 hover:bg-gray-500 shadow-sm border-t border-l border-gray-500 border-b border-r border-gray-700'}
                `}
              >
                {cell.isRevealed ? (
                  cell.isMine ? <div className="icon-bomb"></div> : <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines > 0 ? cell.neighborMines : ''}</span>
                ) : (
                  cell.isFlagged ? <div className="icon-flag text-red-500"></div> : ''
                )}
              </div>
            )))}
          </div>

          {(gameOver || gameWon) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-2xl p-6 text-center z-10 backdrop-blur-sm">
              <h2 className={`${gameWon ? 'text-green-400' : 'text-red-500'} font-black text-4xl mb-6 drop-shadow-md`}>
                {gameWon ? 'MISSION ACCOMPLISHED!' : 'BOOM! GAME OVER'}
              </h2>
              <button
                className={`${gameWon ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'} text-white font-bold py-3 px-8 rounded-xl shadow-[0_6px_0_rgba(0,0,0,0.5)] active:shadow-[0_0px_0_rgba(0,0,0,0.5)] active:translate-y-1.5 transition-all text-lg flex items-center gap-2`}
                onClick={resetGame}
              >
                <div className="icon-rotate-cw"></div> Try Again
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4 text-gray-400 text-sm">
          <div className="flex items-center gap-2"><kbd className="bg-gray-700 px-2 py-1 rounded">Left Click</kbd> = Reveal</div>
          <div className="flex items-center gap-2"><kbd className="bg-gray-700 px-2 py-1 rounded">Right Click</kbd> = Flag</div>
        </div>
      </div>
    </div>
  );
};
