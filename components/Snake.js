const { useState, useEffect, useCallback, useRef, useMemo } = React;

const SNAKE_BOARD_SIZE = 20;
const INITIAL_SPEED = 200;

const createEmptyBoard = () =>
  Array.from(Array(SNAKE_BOARD_SIZE), () => new Array(SNAKE_BOARD_SIZE).fill('clear'));

const generateFood = (snakeBody) => {
  let newFood;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * SNAKE_BOARD_SIZE),
      y: Math.floor(Math.random() * SNAKE_BOARD_SIZE)
    };
    if (!snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

const Snake = () => {
  const savedState = useMemo(() => {
    try {
      const item = localStorage.getItem('snakeGameState');
      return item ? JSON.parse(item) : null;
    } catch (e) { return null; }
  }, []);

  const [snake, setSnake] = useState(savedState?.snake ?? [
    { x: 10, y: 15 },
    { x: 10, y: 16 },
    { x: 10, y: 17 }
  ]);
  const [direction, setDirection] = useState(savedState?.direction ?? { x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState(savedState?.nextDirection ?? { x: 0, y: -1 });
  const [food, setFood] = useState(savedState?.food ?? { x: 10, y: 5 });
  const [gameOver, setGameOver] = useState(savedState?.gameOver ?? false);
  const [gameStarted, setGameStarted] = useState(savedState?.gameStarted ?? false);
  const [isPaused, setIsPaused] = useState((savedState?.gameStarted && !savedState?.gameOver) ? true : false);
  const [score, setScore] = useState(savedState?.score ?? 0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(savedState?.speed ?? INITIAL_SPEED);
  
  const gameAreaRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('snakeHighScore');
    if (stored) setHighScore(parseInt(stored, 10));
  }, []);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [gameOver, score, highScore]);

  useEffect(() => {
    const stateToSave = { snake, direction, nextDirection, food, gameOver, gameStarted, score, speed };
    localStorage.setItem('snakeGameState', JSON.stringify(stateToSave));
  }, [snake, direction, nextDirection, food, gameOver, gameStarted, score, speed]);

  // Focus management
  useEffect(() => {
    if (gameStarted && !isPaused && gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  }, [gameStarted, isPaused]);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + nextDirection.x,
        y: head.y + nextDirection.y
      };

      // Check collision with walls
      if (
        newHead.x < 0 || 
        newHead.x >= SNAKE_BOARD_SIZE || 
        newHead.y < 0 || 
        newHead.y >= SNAKE_BOARD_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setSpeed(s => Math.max(50, s - 5)); // Increase speed
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      setDirection(nextDirection); // Officially apply the next direction
      return newSnake;
    });
  }, [nextDirection, food, gameOver, gameStarted, isPaused]);

  // Game Loop
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [moveSnake, speed, gameStarted, gameOver, isPaused]);

  const handleKeyDown = (e) => {
    if (!gameStarted || gameOver || isPaused) return;

    if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
      e.preventDefault();
    }

    // Prevent 180 degree turns
    switch(e.keyCode) {
      case 38: // UP
        if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
        break;
      case 40: // DOWN
        if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
        break;
      case 37: // LEFT
        if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
        break;
      case 39: // RIGHT
        if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
        break;
    }
  };

  const handleDirectionBtn = (dx, dy) => {
    // Prevent 180 degree turns
    if (dx !== 0 && direction.x === 0) setNextDirection({ x: dx, y: 0 });
    if (dy !== 0 && direction.y === 0) setNextDirection({ x: 0, y: dy });
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  const startGame = () => {
    setSnake([
      { x: 10, y: 15 },
      { x: 10, y: 16 },
      { x: 10, y: 17 }
    ]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameOver(false);
    setGameStarted(true);
    setIsPaused(false);
    setFood(generateFood([{ x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 }]));
    if (gameAreaRef.current) gameAreaRef.current.focus();
  };

  const togglePause = () => {
    if (!gameStarted || gameOver) return;
    setIsPaused(prev => !prev);
  };

  // Render Board
  const board = createEmptyBoard();
  if (gameStarted || gameOver) {
    snake.forEach((segment, index) => {
      if (segment.y >= 0 && segment.y < SNAKE_BOARD_SIZE && segment.x >= 0 && segment.x < SNAKE_BOARD_SIZE) {
        board[segment.y][segment.x] = index === 0 ? 'head' : 'body';
      }
    });
    board[food.y][food.x] = 'food';
  }

  return (
    <div 
      className="flex flex-col xl:flex-row items-center justify-center flex-1 bg-gray-900 gap-6 outline-none py-6 overflow-y-auto"
      role="button"
      tabIndex="0"
      onKeyDown={handleKeyDown}
      ref={gameAreaRef}
      data-name="snake-wrapper"
      data-file="components/Snake.js"
    >
      {/* Game Board and Controller Container */}
      <div className="flex flex-col items-center w-full max-w-lg">
        <div className="relative bg-gray-800 p-3 rounded-xl shadow-2xl flex-shrink-0">
          <div 
            className="grid bg-gray-900 border-2 border-gray-700" 
            style={{
              gridTemplateRows: `repeat(${SNAKE_BOARD_SIZE}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${SNAKE_BOARD_SIZE}, minmax(0, 1fr))`,
              width: 'min(90vw, 50vh, 450px)',
              height: 'min(90vw, 50vh, 450px)'
            }}
          >
            {board.map((row, y) => row.map((cell, x) => (
              <div 
                key={`${x}-${y}`} 
                className={`w-full h-full border border-gray-800/50 ${
                  cell === 'head' ? 'bg-green-400 rounded-sm z-10 scale-105 shadow-[0_0_10px_rgba(74,222,128,0.5)]' :
                  cell === 'body' ? 'bg-green-600 rounded-sm shadow-inner' :
                  cell === 'food' ? 'bg-red-500 rounded-full scale-75 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]' :
                  'bg-transparent'
                }`}
              />
            )))}
          </div>
          
          {/* Start Screen */}
          {!gameStarted && !gameOver && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-[0_6px_0_#14532d] active:shadow-[0_0px_0_#14532d] active:translate-y-1.5 transition-all text-xl flex items-center gap-2"
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
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-[0_6px_0_#14532d] active:shadow-[0_0px_0_#14532d] active:translate-y-1.5 transition-all text-lg flex items-center gap-2"
                onClick={startGame}
              >
                <div className="icon-play text-xl"></div>
                TRY AGAIN
              </button>
            </div>
          )}
        </div>

        {/* Gaming Controller */}
        <div className="flex lg:hidden justify-center items-center gap-8 mt-6 w-full max-w-sm">
          {/* D-PAD */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 w-36 h-36">
            <div />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-t-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => handleDirectionBtn(0, -1)}
            >
              <div className="icon-arrow-up text-xl"></div>
            </button>
            <div />
            
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-l-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => handleDirectionBtn(-1, 0)}
            >
              <div className="icon-arrow-left text-xl"></div>
            </button>
            <div className="bg-gray-800 rounded-full w-8 h-8 self-center justify-self-center shadow-inner border border-gray-700" />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-r-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => handleDirectionBtn(1, 0)}
            >
              <div className="icon-arrow-right text-xl"></div>
            </button>
            
            <div />
            <button 
              className="bg-gray-700 hover:bg-gray-600 rounded-b-lg shadow-[0_4px_0_#374151] active:shadow-[0_0px_0_#374151] active:translate-y-1 flex items-center justify-center text-white" 
              onClick={() => handleDirectionBtn(0, 1)}
            >
              <div className="icon-arrow-down text-xl"></div>
            </button>
            <div />
          </div>
        </div>
      </div>

      {/* Side Stats and Controls */}
      <div className="flex flex-col gap-6 w-72 mt-4 xl:mt-0">
        <div className="bg-gray-800 p-4 rounded-xl flex flex-col gap-4 shadow-lg border-t-4 border-green-900">
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
            <span className="text-4xl font-mono text-white text-right block text-green-400">{score}</span>
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

        <div className="text-gray-400 text-sm bg-gray-800 p-4 rounded-xl hidden md:block border border-gray-700">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <div className="icon-circle-help text-lg"></div>
            操作方法
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <div>
                <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white mr-1">↑</kbd>
                <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white mr-1">↓</kbd>
                <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white mr-1">←</kbd>
                <kbd className="bg-gray-700 px-2 py-1 rounded shadow border border-gray-600 font-mono text-white">→</kbd>
              </div>
              <span>移動方向の変更</span>
            </li>
            <li className="text-xs text-gray-500 mt-2">
              ※壁や自分自身にぶつかるとゲームオーバーになります。赤いリンゴを食べてスコアを稼ぎましょう！
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
