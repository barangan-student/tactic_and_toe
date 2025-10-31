"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

type SquareValue = 'X' | '/' | null;

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinningSquare: boolean;
  delay: number;
  winner: 'X' | null;
  disabled: boolean; // New prop
  squareColor: 'red' | 'blue' | 'black' | null;
  hoveredSquare: number | null; // New prop
  setHoveredSquare: (index: number | null) => void; // New prop
  xIsNext: boolean; // New prop
  winningPlayerColor: 'red' | 'blue' | null; // New prop
}

function Square({ i, value, onClick, isWinningSquare, delay, winner, disabled, squareColor, hoveredSquare, setHoveredSquare, xIsNext, winningPlayerColor }: SquareProps & { i: number }) { // Added i to props
  let bgColorClass = '';
  let textColorClass = '';

  if (isWinningSquare) {
    bgColorClass = winningPlayerColor === 'red' ? 'bg-red-500' : 'bg-blue-500'; // Use winningPlayerColor
    textColorClass = 'text-white'; // White text for winning squares
  } else {
    bgColorClass = '';
    textColorClass = squareColor ? (squareColor === 'red' ? 'text-red-500' : (squareColor === 'blue' ? 'text-blue-500' : 'text-muted-foreground')) : 'text-foreground'; // Mark color based on squareColor
  }

  let hoverClass = '';
  let displayValue = value;
  let displayColor = textColorClass;

  const isClickable = !disabled && !winner && (value === null || value === '/'); // Clickable if empty or half-cross, and game not over/disabled
  const currentPlayerColor = xIsNext ? 'red' : 'blue';

  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const hoverSupport = !isTouchDevice; // If it's a touch device, no hover support
      setHasHover(hoverSupport);
    }
  }, [i]);

  if (hasHover && isClickable && hoveredSquare === i) {
    if (value === null) {
      displayValue = '/';
      displayColor = currentPlayerColor === 'red' ? 'text-red-500' : 'text-blue-500'; // Vibrant red/blue for preview text
    } else if (value === '/') {
      displayValue = 'X';
      displayColor = currentPlayerColor === 'red' ? 'text-red-500' : 'text-blue-500'; // Vibrant red/blue for preview text
    }
  }

  if (hasHover && isClickable) {
    hoverClass = 'hover:bg-accent'; // Revert to default accent hover background
  }

  const isUnclickable = !isClickable; // Inverse of isClickable

  return (
    <Button
      className={`w-full h-full aspect-square text-4xl font-bold transition-all ${bgColorClass} ${displayColor} ${hoverClass} ${isUnclickable ? 'pointer-events-none' : ''}`}
      variant={isWinningSquare ? 'default' : 'outline'}
      onClick={onClick}
      onMouseEnter={hasHover ? () => setHoveredSquare(i) : undefined}
      onMouseLeave={hasHover ? () => setHoveredSquare(null) : undefined}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {displayValue}
    </Button>
  );
}

interface BoardProps {
  squares: SquareValue[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  winner: 'X' | null;
  squareColors: ('red' | 'blue' | 'black' | null)[]; // Updated squareColors type
  hoveredSquare: number | null; // New prop
  setHoveredSquare: (index: number | null) => void; // New prop
  xIsNext: boolean; // New prop
  winningPlayerColor: 'red' | 'blue' | null; // New prop
  disabled: boolean; // New prop
}

function Board({ squares, onClick, winningLine, winner, squareColors, hoveredSquare, setHoveredSquare, xIsNext, winningPlayerColor, disabled }: BoardProps) {
  const renderSquare = (i: number) => {
    const isWinningSquare = Boolean(winningLine && winningLine.includes(i));
    const delay = isWinningSquare ? (winningLine?.indexOf(i) || 0) * 100 : 0;
    return <Square key={i} i={i} value={squares[i]} onClick={() => onClick(i)} isWinningSquare={isWinningSquare} delay={delay} winner={winner} squareColor={squareColors[i]} hoveredSquare={hoveredSquare} setHoveredSquare={setHoveredSquare} xIsNext={xIsNext} winningPlayerColor={winningPlayerColor} disabled={disabled} />;
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full h-full">
      {Array(9).fill(null).map((_, i) => renderSquare(i))}
    </div>
  );
}

function calculateWinner(squares: SquareValue[]): { winner: 'X'; line: number[] } | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] === 'X' && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: 'X', line: [a, b, c] };
    }
  }
  return null;
}

export default function CrissCross() {
  const router = useRouter(); // Call the useRouter hook
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<'playerVsPlayer' | 'playerVsAI'>('playerVsPlayer');
  const [isAITurn, setIsAITurn] = useState<boolean>(false); // New state for AI turn
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O' | null>(null); // New state for player's chosen symbol
  const [winningPlayerColor, setWinningPlayerColor] = useState<'red' | 'blue' | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);
  const [squareColors, setSquareColors] = useState<('red' | 'blue' | 'black' | null)[]>(Array(9).fill(null));

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner ?? null;
  const winningLine = winnerInfo?.line ?? null;

  const handleClick = useCallback((i: number) => {
    if (isAITurn) return; // Prevent player input during AI turn
    if (gameMode === 'playerVsAI' && playerSymbol === null) return; // Prevent move if symbol not chosen in AI mode
    if (winner) { // Game is already won
      return;
    }

    const newSquares = squares.slice();
    const newSquareColors = squareColors.slice();
    const currentPlayerColor = xIsNext ? 'red' : 'blue';

    if (newSquares[i] === null) {
      // Find any existing '/' marks and change their color to black
      for (let j = 0; j < squares.length; j++) { // Check original squares array
        if (squares[j] === '/') {
          newSquareColors[j] = 'black'; // Change to black
        }
      }
      newSquares[i] = '/';
      newSquareColors[i] = currentPlayerColor;
    } else if (newSquares[i] === '/') {
      newSquares[i] = 'X';
      newSquareColors[i] = currentPlayerColor; // X takes the color of the player who completes it
    } else if (newSquares[i] === 'X') { // Already an 'X', cannot change
      return;
    }

    setSquares(newSquares);
    setSquareColors(newSquareColors);

    // Check for winner after the move
    const newWinnerInfo = calculateWinner(newSquares);
    if (newWinnerInfo?.winner) {
      setWinningPlayerColor(currentPlayerColor);
    }

    setXIsNext(!xIsNext); // Always switch turns after a click
  }, [squares, xIsNext, squareColors, winner, setWinningPlayerColor, isAITurn, gameMode, playerSymbol]);

  const toggleGameMode = () => {
    setGameMode(prevMode =>
      prevMode === 'playerVsPlayer' ? 'playerVsAI' : 'playerVsPlayer'
    );
    handleReset(); // Reset game when mode changes
  };

  const handlePlayerSymbolSelect = useCallback((symbol: 'X' | 'O' | null) => {
    setPlayerSymbol(symbol);
    setXIsNext(true); // X always starts first. If player chose O, AI (X) will make the first move.
  }, []);

  // Helper function to simulate a move without updating state
  const simulateMove = useCallback((
    currentSquares: SquareValue[],
    currentSquareColors: ('red' | 'blue' | 'black' | null)[],
    moveIndex: number,
    playerColor: 'red' | 'blue',
  ) => {
    const simulatedSquares = currentSquares.slice();
    const simulatedSquareColors = currentSquareColors.slice();

    if (simulatedSquares[moveIndex] === null) {
      // Clear any existing '/' marks
      for (let j = 0; j < simulatedSquares.length; j++) {
        if (simulatedSquares[j] === '/') {
          simulatedSquareColors[j] = 'black';
        }
      }
      simulatedSquares[moveIndex] = '/';
      simulatedSquareColors[moveIndex] = playerColor;
    } else if (simulatedSquares[moveIndex] === '/') {
      simulatedSquares[moveIndex] = 'X';
      simulatedSquareColors[moveIndex] = playerColor;
    }
    return { simulatedSquares, simulatedSquareColors };
  }, []);


  // Helper function to find the best move using a simplified Minimax approach
  const findBestMove = useCallback((
    currentSquares: SquareValue[],
    currentSquareColors: ('red' | 'blue' | 'black' | null)[],
    isMaximizingPlayer: boolean, // true for AI, false for Player
    depth: number,
    aiPlayerColor: 'red' | 'blue',
    playerColor: 'red' | 'blue'
  ): { score: number; move: number | null } => {
    // Base cases:
    // 1. Check for winner
    const winnerInfo = calculateWinner(currentSquares);
    if (winnerInfo?.winner) {
      if (isMaximizingPlayer) { // If AI is the maximizing player, and there is a winner
        return { score: -100 + depth, move: null }; // Player wins, so AI gets a low score
      } else { // If Player is the maximizing player, and there is a winner
        return { score: 100 - depth, move: null }; // AI wins, so AI gets a high score
      }
    }

    // 2. Check for draw
    if (currentSquares.every(square => square === 'X')) {
      return { score: 0, move: null }; // Draw
    }

    // If max depth reached, return heuristic evaluation (for now, just 0)
    if (depth === 0) {
      return { score: 0, move: null }; // No look-ahead beyond this point
    }

    let bestScore = isMaximizingPlayer ? -Infinity : Infinity;
    let bestMove: number | null = null;

    const possibleMoves: { index: number; type: 'slash' | 'x' }[] = [];
    for (let i = 0; i < currentSquares.length; i++) {
      if (currentSquares[i] === null) {
        possibleMoves.push({ index: i, type: 'slash' });
      } else if (currentSquares[i] === '/') {
        possibleMoves.push({ index: i, type: 'x' });
      }
    }

    for (const moveOption of possibleMoves) {
      const { simulatedSquares, simulatedSquareColors } = simulateMove(
        currentSquares,
        currentSquareColors,
        moveOption.index,
        isMaximizingPlayer ? aiPlayerColor : playerColor,
      );

      const result = findBestMove(
        simulatedSquares,
        simulatedSquareColors,
        !isMaximizingPlayer, // Switch player
        depth - 1,
        aiPlayerColor,
        playerColor
      );

      if (isMaximizingPlayer) {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = moveOption.index;
        }
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = moveOption.index;
        }
      }
    }

    return { score: bestScore, move: bestMove };
  }, [simulateMove]);

  const makeAIMove = useCallback(() => {
    const emptySquares = squares.map((sq, index) => sq === null ? index : null).filter(val => val !== null) as number[];
    const slashSquares = squares.map((sq, index) => sq === '/' ? index : null).filter(val => val !== null) as number[];

    if (winner) { // Game is already won
      setIsAITurn(false);
      return;
    }

    const aiPlayerColor = xIsNext ? 'red' : 'blue'; // AI's color
    const playerColor = xIsNext ? 'blue' : 'red'; // Player's color

    // Use findBestMove to get the optimal move
    const { move: bestMove } = findBestMove(squares, squareColors, true, 4, aiPlayerColor, playerColor); // Look ahead 4 steps

    let move: number | null = bestMove;

    // If findBestMove didn't find a move (e.g., no immediate win/block in look-ahead),
    // fall back to simpler heuristics or random moves.
    if (move === null) {
      // 1. Check if AI can win by converting '/' to 'X'
      for (const i of slashSquares) {
        const testSquares = squares.slice();
        testSquares[i] = 'X';
        if (calculateWinner(testSquares)?.winner) {
          move = i;
          break;
        }
      }
    }

    // 2. Check if Player can win by converting '/' to 'X' and block it
    if (move === null) {
      for (const i of slashSquares) {
        const testSquares = squares.slice();
        testSquares[i] = 'X';
        if (calculateWinner(testSquares)?.winner) {
          move = i;
          break;
        }
      }
    }

    // 3. Complete a '/' to 'X' if available
    if (move === null && slashSquares.length > 0) {
      move = slashSquares[Math.floor(Math.random() * slashSquares.length)];
    }

    // 4. Place a '/' in an empty square
    if (move === null && emptySquares.length > 0) {
      move = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    // If a move is found, apply it
    if (move !== null) {
      const { simulatedSquares, simulatedSquareColors } = simulateMove(
        squares,
        squareColors,
        move,
        aiPlayerColor
      );

      setSquares(simulatedSquares);
      setSquareColors(simulatedSquareColors);

      // Check for winner after the move
      const newWinnerInfo = calculateWinner(simulatedSquares);
      if (newWinnerInfo?.winner) {
        setWinningPlayerColor(aiPlayerColor);
      }

      setXIsNext(!xIsNext);
    }

    setIsAITurn(false);
  }, [squares, winner, squareColors, xIsNext, setSquares, setSquareColors, setWinningPlayerColor, setIsAITurn, simulateMove, findBestMove]);



  const handleReset = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setSquareColors(Array(9).fill(null)); // Reset squareColors
    setWinningPlayerColor(null); // Reset winningPlayerColor
    setPlayerSymbol(null); // Reset playerSymbol to allow choosing X or O again
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default behavior (e.g., clicking a focused button)
        handleReset();
        // Blur the active element to remove focus from the last clicked cell
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleReset]);

  useEffect(() => {
    if (gameMode === 'playerVsAI' && playerSymbol !== null) { // Only proceed if AI mode and symbol chosen
      const aiIsX = playerSymbol === 'O'; // If player is O, AI is X
      const aiTurn = (aiIsX && xIsNext) || (!aiIsX && !xIsNext); // AI moves if (AI is X and it's X's turn) OR (AI is O and it's O's turn)

      if (aiTurn) {
        const winnerInfo = calculateWinner(squares);
        if (!winnerInfo?.winner && !squares.every(square => square === 'X')) { // Check for draw condition
          setIsAITurn(true);
          const timer = setTimeout(() => {
            makeAIMove();
          }, 500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [xIsNext, gameMode, squares, makeAIMove, setIsAITurn, playerSymbol, winner]);

  let status: React.ReactNode; // Change type to React.ReactNode
  if (winner) {
    status = (
      <span>
        Winner:{" "}
        <span className={winningPlayerColor === 'red' ? 'text-red-500' : 'text-blue-500'}>
          {winningPlayerColor === 'red' ? 'Red' : 'Blue'}
        </span>
      </span>
    );
  } else if (squares.every(square => square === 'X')) { // Check if all squares are 'X'
    status = `Draw!`;
  } else {
    status = (
      <span>
        Current player:{" "}
        <span className={xIsNext ? 'text-red-500' : 'text-blue-500'}>
          {xIsNext ? 'Red' : 'Blue'}
        </span>
      </span>
    );
  }

    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 md:p-8 bg-background text-foreground relative">
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-8">
          <div className="w-full md:flex-1 text-center md:flex md:flex-col md:justify-center md:-mt-28">
            <h1 className="text-4xl lg:text-6xl font-bold mb-4 md:mb-4">Criss Cross</h1>
            <p className="text-muted-foreground lg:text-xl text-balance">Master the grid, one diagonal at a time.</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-6 w-full md:flex-1">
            <div className="game-board w-full max-w-sm sm:max-w-md md:max-w-lg aspect-square flex-shrink-0">
              <Board squares={squares} onClick={handleClick} winningLine={winningLine} winner={winner} squareColors={squareColors} hoveredSquare={hoveredSquare} setHoveredSquare={setHoveredSquare} xIsNext={xIsNext} winningPlayerColor={winningPlayerColor} disabled={isAITurn} />
            </div>
                        <div className="game-info mt-4 text-lg flex flex-col items-center gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg">
            
                          <div className="text-xl font-medium">{status}</div>
            
                          {gameMode === 'playerVsAI' && playerSymbol === null ? (
            
                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            
                              <Button onClick={() => handlePlayerSymbolSelect('X')} className="w-full sm:flex-1 bg-red-500 text-white hover:bg-red-600" variant="default">
            
                                Play as X
            
                              </Button>
            
                              <Button onClick={() => handlePlayerSymbolSelect('O')} className="w-full sm:flex-1 bg-blue-500 text-white hover:bg-blue-600" variant="default">
            
                                Play as O
            
                              </Button>
            
                            </div>
            
                          ) : (
            
                            <>
            
                              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            
                                <Button onClick={handleReset} className="w-full sm:flex-1" variant="outline">
            
                                  Reset Game
            
                                </Button>
            
                                <Button onClick={toggleGameMode} variant="outline" className="w-full sm:flex-1">
            
                                  {gameMode === 'playerVsPlayer' ? 'Play vs AI' : 'Play vs Player'}
            
                                </Button>
            
                              </div>
            
                            </>
            
                          )}
            
                        </div>
          </div>
        </div>
      </div>
    );
}