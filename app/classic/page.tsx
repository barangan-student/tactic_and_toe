"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

type SquareValue = 'X' | 'O' | null;

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinningSquare: boolean;
  delay: number;
  winner: SquareValue | null; // Add winner prop
  disabled: boolean; // Add disabled prop
}

function Square({ value, onClick, isWinningSquare, delay, winner, disabled }: SquareProps) {
  const bgColorClass = isWinningSquare ? (winner === 'X' ? 'bg-red-500' : 'bg-blue-500') : '';
  const textColorClass = isWinningSquare ? 'text-white' : (value === 'X' ? 'text-red-500' : value === 'O' ? 'text-blue-500' : 'text-foreground');
  const variantClass = isWinningSquare ? 'default' : 'outline';

  let borderColorClass = '';
  if (!isWinningSquare && value === 'X') {
    borderColorClass = 'border-red-500';
  } else if (!isWinningSquare && value === 'O') {
    borderColorClass = 'border-blue-500';
  }

  // Dynamic hover classes
  let hoverClass = '';
  if (isWinningSquare) {
    hoverClass = winner === 'X' ? 'hover:bg-red-600' : 'hover:bg-blue-600'; // Darker winner color on hover
  } else if (value === 'X') {
    hoverClass = 'hover:text-red-600'; // Darker red text on hover for X
  } else if (value === 'O') {
    hoverClass = 'hover:text-blue-600'; // Darker blue text on hover for O
  } else {
    hoverClass = 'hover:bg-accent'; // Default accent hover for empty cells
  }

  const isUnclickable = Boolean(value) || Boolean(winner) || disabled; // disabled prop from parent (isAITurn)

  return (
    <Button
      className={`w-full h-full aspect-square text-4xl font-bold transition-all ${bgColorClass} ${textColorClass} ${hoverClass} ${borderColorClass} ${isUnclickable ? 'pointer-events-none' : ''}`}
      variant={variantClass}
      onClick={onClick}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {value}
    </Button>
  );
}

interface BoardProps {
  squares: SquareValue[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  winner: SquareValue | null;
  disabled: boolean; // Add disabled prop
}

function Board({ squares, onClick, winningLine, winner, disabled }: BoardProps) {
  const renderSquare = (i: number) => {
    const isWinningSquare = winningLine && winningLine.includes(i);
    const delay = isWinningSquare ? (winningLine?.indexOf(i) || 0) * 100 : 0;
    return <Square key={i} value={squares[i]} onClick={() => onClick(i)} isWinningSquare={isWinningSquare} delay={delay} winner={winner} disabled={disabled} />;
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full h-full">
      {Array(9).fill(null).map((_, i) => renderSquare(i))}
    </div>
  );
}

function calculateWinner(squares: SquareValue[]): { winner: SquareValue; line: number[] } | null {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function ClassicTicTacToe() {
  const router = useRouter(); // Call the useRouter hook
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<'playerVsPlayer' | 'playerVsAI'>('playerVsPlayer');
  const [isAITurn, setIsAITurn] = useState<boolean>(false); // New state for AI turn
  const [playerSymbol, setPlayerSymbol] = useState<SquareValue>(null); // New state for player's chosen symbol

  const toggleGameMode = () => {
    setGameMode(prevMode =>
      prevMode === 'playerVsPlayer' ? 'playerVsAI' : 'playerVsPlayer'
    );
    handleReset(); // Reset game when mode changes
  };

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const winningLine = winnerInfo?.line;

  const makeAIMove = useCallback(() => {
    const emptySquares = squares.map((sq, index) => sq === null ? index : null).filter(val => val !== null) as number[];

    if (emptySquares.length === 0 || winner) {
      setIsAITurn(false); // AI turn ends if game is over
      return;
    }

    const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
    const playerSymbolVal = playerSymbol;

    const newSquares = squares.slice();

    // 1. Check if AI can win
    for (let i = 0; i < emptySquares.length; i++) {
      const move = emptySquares[i];
      newSquares[move] = aiSymbol;
      if (calculateWinner(newSquares)?.winner === aiSymbol) {
        setSquares(newSquares);
        setXIsNext(playerSymbolVal === 'X'); // If AI played O, it's X's turn. If AI played X, it's O's turn.
        setIsAITurn(false); // AI turn ends
        return;
      }
      newSquares[move] = null; // Undo move
    }

    // 2. Check if Player can win (and block)
    for (let i = 0; i < emptySquares.length; i++) {
      const move = emptySquares[i];
      newSquares[move] = playerSymbolVal;
      if (calculateWinner(newSquares)?.winner === playerSymbolVal) {
        setSquares(squares.map((sq, idx) => idx === move ? aiSymbol : sq));
        setXIsNext(playerSymbolVal === 'X'); // If AI played O, it's X's turn. If AI played X, it's O's turn.
        setIsAITurn(false); // AI turn ends
        return;
      }
      newSquares[move] = null; // Undo move
    }

    // 3. Take center if available
    if (emptySquares.includes(4)) {
      setSquares(squares.map((sq, idx) => idx === 4 ? aiSymbol : sq));
      setXIsNext(playerSymbolVal === 'X'); // If AI played O, it's X's turn. If AI played X, it's O's turn.
      setIsAITurn(false); // AI turn ends
      return;
    }

    // 4. Take a corner if available
    const corners = [0, 2, 6, 8].filter(corner => emptySquares.includes(corner));
    if (corners.length > 0) {
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      setSquares(squares.map((sq, idx) => idx === randomCorner ? aiSymbol : sq));
      setXIsNext(playerSymbolVal === 'X'); // If AI played O, it's X's turn. If AI played X, it's O's turn.
      setIsAITurn(false); // AI turn ends
      return;
    }

    // 5. Take a side if available
    const sides = [1, 3, 5, 7].filter(side => emptySquares.includes(side));
    if (sides.length > 0) {
      const randomSide = sides[Math.floor(Math.random() * sides.length)];
      setSquares(squares.map((sq, idx) => idx === randomSide ? aiSymbol : sq));
      setXIsNext(playerSymbolVal === 'X'); // If AI played O, it's X's turn. If AI played X, it's O's turn.
      setIsAITurn(false); // AI turn ends
      return;
    }
    setIsAITurn(false); // AI turn ends if no move is made (e.g., draw)
  }, [squares, winner, setSquares, setXIsNext, playerSymbol]);

  const handleClick = useCallback((i: number) => {
    if (isAITurn) return; // Prevent player input during AI turn
    if (gameMode === 'playerVsAI' && playerSymbol === null) return; // Prevent move if symbol not chosen in AI mode

    const winnerInfo = calculateWinner(squares);
    if (winnerInfo?.winner || squares[i]) {
      return;
    }

    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }, [squares, xIsNext, isAITurn, gameMode, playerSymbol]);

  const handlePlayerSymbolSelect = useCallback((symbol: SquareValue) => {
    setPlayerSymbol(symbol);
    setXIsNext(true); // X always starts first. If player chose O, AI (X) will make the first move.
  }, []);

  useEffect(() => {
    if (gameMode === 'playerVsAI' && playerSymbol !== null) { // Only proceed if AI mode and symbol chosen
      const aiIsX = playerSymbol === 'O'; // If player is O, AI is X
      const aiTurn = (aiIsX && xIsNext) || (!aiIsX && !xIsNext); // AI moves if (AI is X and it's X's turn) OR (AI is O and it's O's turn)

      if (aiTurn) {
        const winnerInfo = calculateWinner(squares);
        if (!winnerInfo?.winner && !squares.every(Boolean)) {
          setIsAITurn(true);
          const timer = setTimeout(() => {
            makeAIMove();
          }, 500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [xIsNext, gameMode, squares, makeAIMove, setIsAITurn, playerSymbol]);

  const handleReset = useCallback(() => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setPlayerSymbol(null); // Reset player symbol on game reset
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

  let status: React.ReactNode;
  if (winner) {
    status = (
      <span>
        Winner:{" "}
        <span className={winner === 'X' ? 'text-red-500' : 'text-blue-500'}>
          {winner}
        </span>
      </span>
    );
  } else if (squares.every(Boolean)) {
    status = `Draw!`;
  } else if (gameMode === 'playerVsAI' && playerSymbol === null) {
    status = `Choose your symbol:`;
  } else {
    status = (
      <span>
        Current player:{" "}
        <span className={xIsNext ? 'text-red-500' : 'text-blue-500'}>
          {xIsNext ? 'X' : 'O'}
        </span>
      </span>
    );
  }

    return (

      <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-background text-foreground relative">

        <div className="absolute top-4 left-4">

          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>

            <ArrowLeft className="h-6 w-6" />

          </Button>

        </div>

        <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-8">

          <div className="w-full md:flex-1 text-center md:flex md:flex-col md:justify-center md:-mt-28">

            <h1 className="text-4xl lg:text-6xl font-bold mb-4 md:mb-4">Classic Tic-Tac-Toe</h1>

            <p className="text-muted-foreground lg:text-xl text-balance">The original 3x3 grid game.</p>

          </div>

          <div className="flex flex-col items-center justify-center gap-6 w-full md:w-auto md:flex-grow">

            <div className="game-board w-full max-w-64 sm:max-w-80 md:max-w-96 aspect-square flex-shrink-0">

              <Board squares={squares} onClick={handleClick} winningLine={winningLine} winner={winner} disabled={isAITurn} />

            </div>

            <div className="game-info mt-4 text-lg flex flex-col items-center gap-4 w-full max-w-64 sm:max-w-80 md:max-w-96">

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
