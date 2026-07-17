import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Gift, ArrowRight } from 'lucide-react';

interface CongratulationsScreenProps {
  userEmail: string;
  onContinue: () => void;
}

export default function CongratulationsScreen({ userEmail, onContinue }: CongratulationsScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; left: string; top: string; scale: number; delay: number }[]>([]);
  const [confetti, setConfetti] = useState<{ id: number; left: string; delay: number; color: string; duration: number }[]>([]);
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; delay: number; size: number }[]>([]);

  useEffect(() => {
    // Generate sparkle coordinates
    const sparkleList = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 80 + 10}%`,
      scale: Math.random() * 0.8 + 0.4,
      delay: Math.random() * 3,
    }));
    setSparkles(sparkleList);

    // Generate falling confetti properties
    const colors = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#34D399', '#FBBF24'];
    const confettiList = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 98 + 1}%`,
      delay: Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 4 + 4,
    }));
    setConfetti(confettiList);

    // Generate floating glowing particles
    const particleList = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 90 + 5}%`,
      top: `${Math.random() * 90 + 5}%`,
      delay: Math.random() * 5,
      size: Math.random() * 6 + 4,
    }));
    setParticles(particleList);
  }, []);

  const handleContinue = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/user/welcome-reward-shown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('swiftpay_token')}`
        }
      });
      if (response.ok) {
        onContinue();
      } else {
        // Fallback to local continuation if network fails
        onContinue();
      }
    } catch (err) {
      console.error('Error marking welcome reward shown:', err);
      onContinue();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 text-white font-sans flex flex-col justify-center items-center p-4">
      
      {/* Background soft glowing lights / radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-blue-500/10 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '6s' }} />
      </div>

      {/* Floating particles */}
      {particles.map((p) => (
        <motion.div
          key={`part-${p.id}`}
          className="absolute rounded-full bg-indigo-300/20 blur-[1px] pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, 0],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: 8 + (p.id % 4),
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Twinkling Sparkles */}
      {sparkles.map((s) => (
        <motion.div
          key={`spark-${s.id}`}
          className="absolute text-yellow-300/60 pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
          }}
          animate={{
            scale: [0, s.scale, 0],
            opacity: [0, 0.9, 0],
            rotate: [0, 180],
          }}
          transition={{
            duration: 3 + (s.id % 3),
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="w-5 h-5 fill-yellow-300/20 text-yellow-300" />
        </motion.div>
      ))}

      {/* Falling Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti.map((c) => (
          <motion.div
            key={`conf-${c.id}`}
            className="absolute w-2 h-4 rounded-sm"
            style={{
              left: c.left,
              backgroundColor: c.color,
              top: '-20px',
            }}
            animate={{
              y: ['0vh', '105vh'],
              rotate: [0, 360 + (c.id * 10)],
              x: ['0px', `${(c.id % 2 === 0 ? 1 : -1) * (30 + (c.id % 10))}px`],
            }}
            transition={{
              duration: c.duration,
              repeat: Infinity,
              delay: c.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Content wrapper with scale entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-lg flex flex-col items-center relative z-10 py-6"
      >
        
        {/* Floating SwiftPay Logo at the top */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-sm tracking-tighter">SP</span>
            </div>
            <span className="text-xl font-black font-display tracking-tight bg-gradient-to-r from-teal-400 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">
              SwiftPay
            </span>
          </div>
        </motion.div>

        {/* Large Glowing Success checkmark badge with light rays behind it */}
        <div className="relative mb-6">
          {/* Glowing aura / light rays effect */}
          <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl scale-125 animate-pulse" />
          <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-teal-400/20 rounded-full blur-md animate-spin" style={{ animationDuration: '10s' }} />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center border-2 border-teal-300/30 shadow-[0_0_30px_rgba(20,184,166,0.4)] relative z-10"
          >
            <Check className="w-12 h-12 text-teal-200 stroke-[3]" />
          </motion.div>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-indigo-100 to-teal-100 bg-clip-text text-transparent">
            🎉 Congratulations!
          </h1>
          <p className="text-indigo-300 font-medium text-lg mt-1 tracking-wide">
            You are qualified!
          </p>
        </div>

        {/* Floating Gift Box Illustration */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-6"
        >
          {/* Soft shadow on the floor below the gift */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/40 rounded-full blur-sm scale-75 animate-pulse" />
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-teal-500/30 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shadow-indigo-500/20 relative">
            <Gift className="w-8 h-8 text-teal-300 animate-bounce" style={{ animationDuration: '3s' }} />
            {/* Floating currency symbols nearby */}
            <motion.span
              animate={{ y: [0, -15, 0], x: [0, 8, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -right-3 text-lg font-bold text-teal-300/80 pointer-events-none"
            >
              ₦
            </motion.span>
            <motion.span
              animate={{ y: [0, -20, 0], x: [0, -10, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3.2, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}
              className="absolute -bottom-2 -left-3 text-sm font-bold text-indigo-300/80 pointer-events-none"
            >
              ₦
            </motion.span>
          </div>
        </motion.div>

        {/* Reward Card with gentle breathing animation */}
        <motion.div
          animate={{ scale: [1, 1.015, 1], boxShadow: ['0 10px 30px -10px rgba(99,102,241,0.2)', '0 15px 35px -5px rgba(20,184,166,0.3)', '0 10px 30px -10px rgba(99,102,241,0.2)'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Subtle glow grid in background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-indigo-500/5 to-transparent pointer-events-none" />

          <p className="text-indigo-200 text-xs tracking-wider uppercase font-semibold">
            You have been gifted
          </p>
          <div className="my-2 select-all">
            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(20,184,166,0.3)] font-mono">
              ₦200,000
            </span>
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase mb-4 shadow-[0_0_10px_rgba(20,184,166,0.15)] animate-pulse">
            FREE
          </span>
          <p className="text-indigo-100 text-sm leading-relaxed max-w-sm mx-auto">
            This reward has been successfully added to your SwiftPay wallet.
          </p>
        </motion.div>

        {/* Welcome Card */}
        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 mb-8 text-center shadow-lg">
          <h2 className="text-lg font-bold text-teal-300 mb-1">Welcome to SwiftPay</h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs mx-auto">
            We're excited to have you join our community. Enjoy secure, fast and reliable financial services.
          </p>
        </div>

        {/* Continue Button with glowing pulse effect */}
        <motion.button
          onClick={handleContinue}
          disabled={isSubmitting}
          whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(20,184,166,0.6)' }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              '0 0 12px rgba(99,102,241,0.3)',
              '0 0 22px rgba(20,184,166,0.5)',
              '0 0 12px rgba(99,102,241,0.3)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-indigo-600 to-indigo-700 text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all border border-teal-300/20 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? 'Loading...' : (
            <>
              Continue to Dashboard
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </motion.button>

      </motion.div>
    </div>
  );
}
