const { useState, useEffect, useCallback, useRef, useMemo } = React;

const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

const Cell = ({ type }) => {
  const isFilled = type !== 0;
  const color = TETROMINOS[type].color;
  
  return (
    <div
      className={`w-full h-full border ${isFilled ? 'border-white/20 shadow-inner' : 'border-gray-800'}`}
      style={{
        backgroundColor: color,
        boxShadow: isFilled ? 'inset 0 0 8px rgba(0,0,0,0.3)' : 'none'
      }}
      data-name="cell"
      data-file="components/Tetris.js"
    />
  );
};

const Tetris = () => {
  const savedState = useMemo(() => {
    try {
      const item = localStorage.getItem('tetrisGameState');
      return item ? JSON.parse(item) : null;
    } catch (e) { return null; }
  }, []);

  const [dropTime, setDropTime] = useState(
    (savedState?.gameStarted && !savedState?.gameOver) 
      ? (1000 / ((savedState?.level ?? 0) + 1) + 200) 
      : null
  );
  const [gameOver, setGameOver] = useState(savedState?.gameOver ?? false);
  const [gameStarted, setGameStarted] = useState(savedState?.gameStarted ?? false);
  const [isPaused, setIsPaused] = useState((savedState?.gameStarted && !savedState?.gameOver) ? true : false);
  const [score, setScore] = useState(savedState?.score ?? 0);
  const [highScore, setHighScore] = useState(0);
  const [rows, setRows] = useState(savedState?.rows ?? 0);
  const [level, setLevel] = useState(savedState?.level ?? 0);

  const [board, setBoard] = useState(savedState?.board ?? createBoard());
  const [player, setPlayer] = useState(savedState?.player ?? {
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
  });

  useEffect(() => {
    const stored = localStorage.getItem('tetrisHighScore');
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('tetrisHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    const stateToSave = { gameOver, gameStarted, score, rows, level, board, player };
    localStorage.setItem('tetrisGameState', JSON.stringify(stateToSave));
  }, [gameOver, gameStarted, score, rows, level, board, player]);

  const gameAreaRef = useRef(null);

  useEffect(() => {
    if (gameStarted && !isPaused && gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  }, [gameStarted, isPaused]);

  const rotate = (matrix, dir) => {
    const rotated = matrix.map((_, index) => matrix.map(col => col[index]));
    if (dir > 0) return rotated.map(row => row.reverse());
    return rotated.reverse();
  };

  const playerRotate = (dir) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        return; // Can't rotate, give up
      }
    }
    setPlayer(clonedPlayer);
  };

  const movePlayer = dir => {
    if (!checkCollision(player, board, { x: dir, y: 0 })) {
      setPlayer(p => ({ ...p, pos: { x: p.pos.x + dir, y: p.pos.y } }));
    }
  };

  const mergePlayer = (pos) => {
    let newBoard = board.map(row => [...row]);
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const drawY = y + pos.y;
          const drawX = x + pos.x;
          if (drawY >= 0 && drawY < BOARD_HEIGHT) {
            newBoard[drawY][drawX] = [value, 'merged'];
          }
        }
      });
    });

    let clearedCount = 0;
    newBoard = newBoard.reduce((ack, row) => {
      if (row.findIndex(cell => cell[0] === 0) === -1) {
        clearedCount += 1;
        ack.unshift(new Array(BOARD_WIDTH).fill([0, 'clear']));
        return ack;
      }
      ack.push(row);
      return ack;
    }, []);

    if (clearedCount > 0) {
      const linePoints = [40, 100, 300, 1200];
      setScore(prev => prev + linePoints[clearedCount - 1] * (level + 1));
      setRows(prev => {
        const newRows = prev + clearedCount;
        if (newRows > (level + 1) * 10) {
          setLevel(l => l + 1);
          setDropTime(1000 / (level + 2) + 200);
        }
        return newRows;
      });
    }

    setBoard(newBoard);
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape
    });
  };

  const drop = () => {
    if (gameOver || !gameStarted || isPaused) return;

    if (!checkCollision(player, board, { x: 0, y: 1 })) {
      setPlayer(p => ({ ...p, pos: { x: p.pos.x, y: p.pos.y + 1 } }));
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDropTime(null);
        setGameStarted(false);
        return;
      }
      mergePlayer(player.pos);
    }
  };

  const hardDrop = () => {
    if (gameOver || !gameStarted || isPaused) return;
    let tempY = 0;
    while (!checkCollision(player, board, { x: 0, y: tempY + 1 })) {
      tempY += 1;
    }
    mergePlayer({ x: player.pos.x, y: player.pos.y + tempY });
  };

  const dropPlayer = () => {
    setDropTime(null);
    drop();
    if (gameStarted && !gameOver && !isPaused) {
      setDropTime(1000 / (level + 1) + 200);
    }
  };

  const move = (e) => {
    if (!gameOver && gameStarted && !isPaused) {
      // Prevent default scrolling for game controls
      if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
      if (e.keyCode === 37) {
        movePlayer(-1);
      } else if (e.keyCode === 39) {
        movePlayer(1);
      } else if (e.keyCode === 40) {
        dropPlayer();
      } else if (e.keyCode === 38) {
        playerRotate(1);
      } else if (e.keyCode === 32) {
        hardDrop();
      }
    }
  };

  const keyUp = ({ keyCode }) => {
    if (!gameOver && gameStarted && !isPaused && keyCode === 40) {
      setDropTime(1000 / (level + 1) + 200);
    }
  };

  const startGame = () => {
    setBoard(createBoard());
    setPlayer({
      pos: { x: BOARD_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape
    });
    setDropTime(1000);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
    setScore(0);
    setRows(0);
    setLevel(0);
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  const togglePause = () => {
    if (!gameStarted || gameOver) return;
    setIsPaused(prev => !prev);
    if (!isPaused && gameAreaRef.current) {
      // Refocus happens in useEffect
    }
  };

  useInterval(() => {
    drop();
  }, isPaused ? null : dropTime);

  const displayBoard = board.map(row => [...row]);
  if (gameStarted && !gameOver) {
    player.tetromino.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          const drawY = y + player.pos.y;
          const drawX = x + player.pos.x;
          if (drawY >= 0 && drawY < BOARD_HEIGHT && drawX >= 0 && drawX < BOARD_WIDTH) {
            displayBoard[drawY][drawX] = [value, 'clear'];
          }
        }
      });
    });
  }

  // Refocus helper for on-screen buttons
  const executeAndFocus = (action) => {
    action();
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  return (
    <div 
      className="flex flex-col xl:flex-row items-center justify-center flex-1 bg-gray-900 gap-6 outline-none py-6 overflow-y-auto"
      role="button"
      tabIndex="0"
      onKeyDown={move}
      onKeyUp={keyUp}
      ref={gameAreaRef}
      data-name="tetris-wrapper"
      data-file="components/Tetris.js"
    >
      {/* Game Board and Controller Container */}
      <div className="flex flex-col items-center w-full max-w-lg">
        <div className="relative bg-gray-800 p-3 rounded-xl shadow-2xl flex-shrink-0">
          <div 
            className="grid bg-gray-900 border-2 border-gray-700" 
            style={{
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, minmax(0, 1fr))`,
              width: 'min(90vw, 32vh, 300px)',
              height: 'min(180vw, 64vh, 600px)'
            }}
          >
            {displayBoard.map(row => row.map((cell, x) => <Cell key={x} type={cell[0]} />))}
          </div>
          
          {/* Start Screen */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-[0_6px_0_#1e3a8a] active:shadow-[0_0px_0_#1e3a8a] active:translate-y-1.5 transition-all text-xl flex items-center gap-2"
                onClick={startGame}
              >
                <div className="icon-play text-2xl"></div>
                START
              </button>
            </div>
          )}

          {/* Pause Screen */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10 backdrop-blur-sm">
              <div className="text-center">
                <h2 className="text-yellow-500 font-bold text-4xl mb-6 tracking-widest">PAUSED</h2>
                <button
                  className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_6px_0_#854d0e] active:shadow-[0_0px_0_#854d0e] active:translate-y-1.5 transition-all text-xl flex items-center gap-2 mx-auto"
                  onClick={togglePause}
                >
                  <div className="icon-play text-xl"></div>
                  RESUME
                </button>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameOver && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 rounded-xl p-6 text-center z-10">
              <h2 className="text-red-500 font-bold text-4xl mb-2 drop-shadow-md">GAME OVER</h2>
              <p className="text-white text-xl mb-6">Score: {score}</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-[0_6px_0_#1e3a8a] active:shadow-[0_0px_0_#1e3a8a] active:translate-y-1.5 transition-all text-lg flex items-center gap-2"
                onClick={startGame}
              >
                <div className="icon-play text-xl"></div>
                TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* Gaming Controller (Visible on all screens, especially helpful for mobile) */}
        <div className="flex lg:hidden justify-center items-center gap-8 mt-4 w-full max-w-sm">
          {/* D-PAD */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36">
            <div />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-t-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => executeAndFocus(() => playerRotate(1))}
            >
              <div className="icon-arrow-up text-xl"></div>
            </button>
            <div />
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-l-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => executeAndFocus(() => movePlayer(-1))}
            >
              <div className="icon-arrow-left text-xl"></div>
            </button>
            <div className="bg-gray-800 rounded-full w-8 h-8 self-center justify-self-center shadow-inner border border-gray-700" />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-r-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => executeAndFocus(() => movePlayer(1))}
            >
              <div className="icon-arrow-right text-xl"></div>
            </button>
            
            <div />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-b-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => executeAndFocus(() => dropPlayer())}
            >
              <div className="icon-arrow-down text-xl"></div>
            </button>
            <div />
          </div>

          {/* ACTION BUTTON */}
          <div className="flex items-end pb-2">
            <button 
              className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 shadow-[0_6px_0_#7f1d1d] active:shadow-[0_0px_0_#7f1d1d] active:translate-y-1.5 transition-all flex items-center justify-center text-white font-black tracking-widest text-sm border-4 border-red-800"
              onClick={() => executeAndFocus(() => hardDrop())}
            >
              DROP
            </button>
          </div>
        </div>
      </div>

      {/* Side Stats and Controls */}
      <div className="flex flex-col gap-6 w-72">
        <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-4 shadow-lg border-t-4 border-blue-900">
          <div className="bg-gray-900 p-3 rounded-lg border border-yellow-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full -z-10"></div>
            <span className="text-yellow-500 text-sm block mb-1 uppercase tracking-wider font-bold flex items-center gap-1">
              <div className="icon-trophy text-sm"></div>
              Best Score
            </span>
            <span className="text-3xl font-mono text-yellow-400 text-right block">{highScore}</span>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <span className="text-gray-400 text-sm block mb-1 uppercase tracking-wider font-semibold">Score</span>
            <span className="text-3xl font-mono text-white text-right block">{score}</span>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <span className="text-gray-400 text-sm block mb-1 uppercase tracking-wider font-semibold">Lines</span>
            <span className="text-3xl font-mono text-white text-right block">{rows}</span>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
            <span className="text-gray-400 text-sm block mb-1 uppercase tracking-wider font-semibold">Level</span>
            <span className="text-3xl font-mono text-white text-right block">{level}</span>
          </div>
        </div>

        {/* Game Actions */}
        <div className="flex gap-3">
          <button 
            className={`flex-1 py-3 px-4 rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-[0_0px_0_rgba(0,0,0,0.5)] active:translate-y-1 transition-all flex items-center justify-center gap-2 font-bold ${
              !gameStarted || gameOver 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-600 hover:bg-yellow-500 text-white'
            }`}
            onClick={togglePause}
            disabled={!gameStarted || gameOver}
          >
            <div className={isPaused ? "icon-play" : "icon-pause"}></div>
            {isPaused ? 'RESUME' : 'PAUSE'}
          </button>
          <button 
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 transition-all flex items-center justify-center gap-2"
            onClick={startGame}
          >
            <div className="icon-rotate-cw"></div>
            RESET
          </button>
        </div>

        <div className="text-gray-400 text-sm bg-gray-800 p-4 rounded-xl hidden md:block">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <div className="icon-circle-help text-lg"></div>
            操作方法
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white">↑</kbd> 
              <span>回転</span>
            </li>
            <li className="flex items-center gap-3">
              <div>
                <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white mr-1">←</kbd>
                <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white">→</kbd>
              </div>
              <span>移動</span>
            </li>
            <li className="flex items-center gap-3">
              <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white">↓</kbd> 
              <span>落下 (ソフトドロップ)</span>
            </li>
            <li className="flex items-center gap-3">
              <kbd className="bg-gray-700 px-3 py-1 rounded shadow border border-gray-600 font-mono text-white min-w-[4rem] text-center">Space</kbd> 
              <span className="text-red-400 font-bold">即落とし (ハードドロップ)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
