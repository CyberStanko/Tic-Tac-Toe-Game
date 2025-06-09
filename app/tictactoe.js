"use client";
import { useState, useEffect } from "react";
import "./tictactoe.css"; // Import the CSS file for styles
import CelebrationPopup from './CelebrationPopup';
import { useRef } from 'react';

function Square({ value, onSquareClick, isWinning, isPopOut }) {
    return (
        <button 
            className={`square ${isWinning ? 'winning-outline' : ''} ${isPopOut ? 'square-pop-out' : ''}`} 
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    const [popOutSquares, setPopOutSquares] = useState([]);
    const animationTriggeredRef = useRef(false); // To prevent re-triggering animation

    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        onPlay(nextSquares);
    }

    const result = calculateWinner(squares);
    const winner = result ? result.winner : null;
    const winningLine = result ? result.line : null;

    useEffect(() => {
        if (winningLine && !animationTriggeredRef.current) {
            // Only trigger if winningLine exists and animation hasn't been triggered for this win
            animationTriggeredRef.current = true; // Mark animation as triggered

            setPopOutSquares([]); // Ensure it's clear before new animation
            winningLine.forEach((squareIndex, i) => {
                setTimeout(() => {
                    setPopOutSquares(prev => [...prev, squareIndex]);
                }, i * 300); // Pop out each square with a 300ms delay
            });
        } else if (!winningLine) {
            // When there's no winner (e.g., game restart or undo)
            setPopOutSquares([]); // Clear any active pop-out animations
            animationTriggeredRef.current = false; // Reset the trigger for a new win
        }
    }, [winningLine]); // Dependency is winningLine

    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    const renderSquare = (i) => {
        const isWinningSquare = winningLine && winningLine.includes(i);
        const isCurrentlyPoppingOut = popOutSquares.includes(i);
        return (
            <Square 
                key={i}
                value={squares[i]} 
                onSquareClick={() => handleClick(i)}
                isWinning={isWinningSquare}
                isPopOut={isCurrentlyPoppingOut}
            />
        );
    };

    return (
        <>
            <div className="status">{status}</div>
            <div className="board">
                <div className="board-row">
                    {renderSquare(0)}
                    {renderSquare(1)}
                    {renderSquare(2)}
                </div>
                <div className="board-row">
                    {renderSquare(3)}
                    {renderSquare(4)}
                    {renderSquare(5)}
                </div>
                <div className="board-row">
                    {renderSquare(6)}
                    {renderSquare(7)}
                    {renderSquare(8)}
                </div>
            </div>
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [winner, setWinner] = useState(null);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        
        // Check for winner after each move
        const result = calculateWinner(nextSquares);
        if (result) {
            setWinner(result.winner);
            // Delay the celebration popup until after square animations (approx. 300ms * 3 = 900ms + buffer)
            setTimeout(() => {
                setShowCelebration(true);
            }, 1200); // Adjust delay as needed after testing
        }
    }

    function handleRestart() {
        setHistory([Array(9).fill(null)]);
        setCurrentMove(0);
        setShowCelebration(false);
        setWinner(null);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
            {showCelebration && (
                <CelebrationPopup 
                    winner={winner} 
                    onClose={handleRestart}
                />
            )}
        </div>
    );
}

function calculateWinner(squares) {
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
            return { winner: squares[a], line: lines[i] };
        }
    }
    return null;
}
