"use client";
import { useEffect, useState } from 'react';
import './celebration.css';

export default function CelebrationPopup({ winner, onClose }) {
  const [confetti, setConfetti] = useState([]);
  const [showTitle, setShowTitle] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Create confetti pieces
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    }));
    setConfetti(confettiPieces);

    // Sequence animations for popup content
    const titleDelay = 100; // Small delay for title
    const messageDelay = titleDelay + 300; // Message after title
    const buttonDelay = messageDelay + 300; // Button after message

    setTimeout(() => setShowTitle(true), titleDelay);
    setTimeout(() => setShowMessage(true), messageDelay);
    setTimeout(() => setShowButton(true), buttonDelay);

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
        <h2 className={`celebration-title ${showTitle ? 'pop-up-animation' : ''}`}>🎉 Congratulations! 🎉</h2>
        <p className={`celebration-message ${showMessage ? 'pop-up-animation' : ''}`}>
          {winner} has won the game!
        </p>
        <button 
          className={`celebration-button ${showButton ? 'pop-up-animation' : ''}`} 
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