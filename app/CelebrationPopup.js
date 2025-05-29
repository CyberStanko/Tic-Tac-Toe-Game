"use client";
import { useEffect, useState } from 'react';
import './celebration.css';

export default function CelebrationPopup({ winner, onClose }) {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Create confetti pieces
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    }));
    setConfetti(confettiPieces);
  }, []);

  const handlePlayAgain = () => {
    // Reset the game state
    onClose();
    // Redirect to the game's starting page
    window.location.href = '/';
  };

  return (
    <div className="celebration-overlay">
      <div className="celebration-popup">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className="confetti"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              background: piece.color,
            }}
          />
        ))}
        <h2 className="celebration-title">🎉 Congratulations! 🎉</h2>
        <p className="celebration-message">
          {winner} has won the game!
        </p>
        <button 
          className="celebration-button" 
          onClick={handlePlayAgain}
          style={{ 
            position: 'relative',
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
} 