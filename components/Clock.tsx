import React, { useState, useEffect } from 'react';

export const Clock: React.FC<{ variant?: 'small' | 'large' }> = ({ variant = 'small' }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const dateStr = date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (variant === 'large') {
    return (
      <div className="flex flex-col items-center justify-center text-white">
        <div className="text-9xl font-bold font-mono tracking-tighter text-neon-blue drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
          {timeStr}
        </div>
        <div className="text-2xl font-light text-lab-100 mt-2 tracking-widest uppercase">
          {dateStr}
        </div>
      </div>
    );
  }

  return (
    <div className="text-right">
      <div className="text-4xl font-bold font-mono text-white">{timeStr}</div>
      <div className="text-sm text-lab-200">{dateStr}</div>
    </div>
  );
};