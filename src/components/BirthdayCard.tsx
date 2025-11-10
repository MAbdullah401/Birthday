import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

const CardContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #0f0c29, #302b63, #24243e);
  overflow: hidden;
  position: relative;
`;

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  z-index: 1;
`;

const FloatingText = styled(motion.h1)`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #ff0080, #ff8c00, #40e0d0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;

const Message = styled(motion.p)`
  font-size: 1.5rem;
  line-height: 1.6;
  margin: 1rem 0;
  color: #ffffff;
`;

const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const BirthdayCard = () => {
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // GSAP Animation Timeline
    const tl = gsap.timeline();
    
    tl.from('.birthday-title', {
      duration: 1.5,
      y: -100,
      opacity: 0,
      ease: 'elastic.out(1, 0.5)',
    })
    .from('.birthday-message', {
      duration: 1,
      scale: 0,
      opacity: 0,
      rotate: -180,
      ease: 'back.out(1.7)',
    }, '-=0.5');

    // Initialize particles
    if (particlesRef.current) {
      const particles = Array.from({ length: 100 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 3 - 1.5,
      }));

      const ctx = particlesRef.current.getContext('2d');
      if (!ctx) return;

      particlesRef.current.width = window.innerWidth;
      particlesRef.current.height = window.innerHeight;

      const animate = () => {
        if (!ctx || !particlesRef.current) return;
        
        ctx.clearRect(0, 0, particlesRef.current.width, particlesRef.current.height);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';

        particles.forEach(particle => {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();

          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x < 0 || particle.x > window.innerWidth) particle.speedX *= -1;
          if (particle.y < 0 || particle.y > window.innerHeight) particle.speedY *= -1;
        });

        requestAnimationFrame(animate);
      };

      animate();
    }
  }, []);

  return (
    <CardContainer>
      <ParticleCanvas ref={particlesRef} />
      <Card
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        <FloatingText
          className="birthday-title"
          animate={{
            y: [0, -10, 0],
            filter: [
              'hue-rotate(0deg)',
              'hue-rotate(360deg)',
              'hue-rotate(0deg)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Happy Birthday Brother! 🎉
        </FloatingText>
        <Message
          className="birthday-message"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          On this special day, I wish you endless joy, success, and amazing adventures ahead!
          May your day be filled with love, laughter, and unforgettable moments! 🎂
        </Message>
      </Card>
    </CardContainer>
  );
};

export default BirthdayCard;