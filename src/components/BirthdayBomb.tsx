import { motion } from 'framer-motion';
import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #ff7a00 0%, #ff8c00 30%, #000 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const BombContainer = styled(motion.div)`
  position: relative;
  z-index: 15; /* above background */
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bomb = styled(motion.div)`
  width: 150px;
  height: 150px;
  background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
  border-radius: 50%;
  position: relative;
  box-shadow: 
    inset 0 -5px 15px rgba(255,255,255,0.3),
    inset 0 5px 15px rgba(0,0,0,0.5),
    0 5px 15px rgba(0,0,0,0.8);
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 15px;
    background: #333;
    border-radius: 15px 15px 0 0;
    box-shadow: 0 -2px 5px rgba(0,0,0,0.5);
  }
`;

const Fuse = styled(motion.div)<{ $burning: boolean }>`
  position: absolute;
  top: -35px;
  left: calc(50% - 1px);
  width: 2px;
  height: 30px;
  background: ${props => props.$burning ? 
    'linear-gradient(to bottom, #ff4400, #ff8800)' : 
    'linear-gradient(45deg, #8B4513, #654321)'};
  transform-origin: bottom;
  box-shadow: ${props => props.$burning ? '0 0 10px #ff4400' : 'none'};

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -1px;
    width: 4px;
    height: 4px;
    background: ${props => props.$burning ? '#ff4400' : '#ff8800'};
    border-radius: 50%;
    box-shadow: ${props => props.$burning ? '0 0 10px #ff4400' : 'none'};
  }
`;

const FireButton = styled(motion.button)`
  padding: 12px 30px;
  font-size: 20px;
  margin-top: 30px;
  background: linear-gradient(45deg, #ff4400, #ff8800);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: bold;
  box-shadow: 
    0 0 20px rgba(255, 68, 0, 0.3),
    inset 0 2px 5px rgba(255,255,255,0.3),
    inset 0 -2px 5px rgba(0,0,0,0.3);

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ContentContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 20px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  z-index: 30;
`;

const BirthdayText = styled(motion.h1)`
  font-size: 4rem;
  background: linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 30px;
`;

const WishesText = styled(motion.p)`
  font-size: 1.5rem;
  text-align: center;
  line-height: 1.6;
  max-width: 800px;
  margin: 20px auto;
  color: #fff;
`;

const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const PhotoLeft = styled.div`
  width: 260px;
  flex: 0 0 260px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  background: rgba(255,255,255,0.03);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Confetti = styled(motion.div)<{ $color: string; $size: number }>`
  position: absolute;
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  background: ${props => props.$color};
  border-radius: 2px;
  z-index: 20;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.25); /* lighter so image shows through */
  z-index: 1;
`;

const BirthdayBomb = () => {
  const [isExploded, setIsExploded] = useState(false);
  const [isFuseBurning, setIsFuseBurning] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<Array<{
    color: string;
    size: number;
    endX: number;
    endY: number;
    rotate: number;
  }>>([]);

  const confettiColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#ff1493', '#7fffd4', '#ffd700'
  ];


  const generateConfetti = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const pieces = Array.from({ length: 40 }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 200 + Math.random() * Math.max(window.innerWidth, window.innerHeight);
      return {
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        size: 18 + Math.floor(Math.random() * 24),
        endX: centerX + Math.cos(angle) * distance,
        endY: centerY + Math.sin(angle) * distance,
        rotate: Math.random() * 720 - 360,
      };
    });
    setConfettiPieces(pieces);
  };

  const handleExplosion = () => {
    if (!isFuseBurning) {
      setIsFuseBurning(true);
      // Start fuse burning animation (visually via Fuse animate prop)
      // After 5s, trigger explosion
      setTimeout(() => {
        generateConfetti();
        setIsExploded(true);
      }, 5000);
    }
  };

  return (
    <Container>
      <Overlay />
      {!isExploded && (
        <BombContainer>
          <Bomb
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <Fuse
              $burning={isFuseBurning}
              animate={isFuseBurning ? {
                height: [30, 0],
                transition: { duration: 5, ease: "linear" }
              } : {}}
            />
          </Bomb>
          <FireButton
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleExplosion}
            disabled={isFuseBurning}
          >
            {isFuseBurning ? "BOOM!" : "FIRE!"}
          </FireButton>
        </BombContainer>
      )}

      {isExploded && (
        <>
          {confettiPieces.map((p, i) => {
            const startX = window.innerWidth / 2;
            const startY = window.innerHeight / 2;
            return (
              <Confetti
                key={i}
                $color={p.color}
                $size={p.size}
                initial={{ x: startX, y: startY, scale: 0 }}
                animate={{ x: p.endX, y: p.endY, scale: 1, rotate: p.rotate }}
                transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.4, ease: 'easeOut' }}
              />
            );
          })}
          <ContentContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <BirthdayText
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Happy Birthday! 🎉
            </BirthdayText>
            
            <PhotoRow>
              <PhotoLeft>
                <img src="/images/wish.png" alt="Brother" />
              </PhotoLeft>
              <WishesText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                style={{ textAlign: 'left', maxWidth: 700 }}
              >
                Dear Usman Bhai,
                <br /><br />
                On this special day, I wish you a birthday that's as extraordinary as you are! 
                May your journey through life be filled with endless adventures, boundless joy, 
                and achievements that make your heart smile. You're not just my brother, 
                you're my best friend and my inspiration.
                <br /><br />
                May this year bring you everything your heart desires and more! 
                Keep shining bright and spreading happiness wherever you go! 🎂✨
              </WishesText>
            </PhotoRow>
          </ContentContainer>
        </>
      )}
    </Container>
  );
};

export default BirthdayBomb;