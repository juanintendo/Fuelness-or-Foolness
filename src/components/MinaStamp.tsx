import React, { useState } from 'react';

interface MinaStampProps {
  className?: string;
  alt?: string;
}

export const MinaStamp: React.FC<MinaStampProps> = ({ 
  className = "w-10 h-11", 
  alt = "Mina Field Notes Postage Stamp" 
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative inline-block select-none overflow-visible ${className}`}>
      {!imageError ? (
        <img
          src="/Mina_Busy.png"
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain filter contrast-105"
        />
      ) : (
        /* Vector Fallback: High-precision serrated postage stamp of Mina taking notes */
        <svg
          viewBox="0 0 100 115"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Stamp background with perforated edges effect */}
          <path
            d="M 6 4 
               C 8 4, 8 0, 10 0 C 12 0, 12 4, 14 4 C 16 4, 16 0, 18 0 C 20 0, 20 4, 22 4 C 24 4, 24 0, 26 0 C 28 0, 28 4, 30 4 C 32 4, 32 0, 34 0 C 36 0, 36 4, 38 4 C 40 4, 40 0, 42 0 C 44 0, 44 4, 46 4 C 48 4, 48 0, 50 0 C 52 0, 52 4, 54 4 C 56 4, 56 0, 58 0 C 60 0, 60 4, 62 4 C 64 4, 64 0, 66 0 C 68 0, 68 4, 70 4 C 72 4, 72 0, 74 0 C 76 0, 76 4, 78 4 C 80 4, 80 0, 82 0 C 84 0, 84 4, 86 4 C 88 4, 88 0, 90 0 C 92 0, 92 4, 94 4
               L 96 4 C 96 6, 100 6, 100 8 C 100 10, 96 10, 96 12 C 96 14, 100 14, 100 16 C 100 18, 96 18, 96 20 C 96 22, 100 22, 100 24 C 100 26, 96 26, 96 28 C 96 30, 100 30, 100 32 C 100 34, 96 34, 96 36 C 96 38, 100 38, 100 40 C 100 42, 96 42, 96 44 C 96 46, 100 46, 100 48 C 100 50, 96 50, 96 52 C 96 54, 100 54, 100 56 C 100 58, 96 58, 96 60 C 96 62, 100 62, 100 64 C 100 66, 96 66, 96 68 C 96 70, 100 70, 100 72 C 100 74, 96 74, 96 76 C 96 78, 100 78, 100 80 C 100 82, 96 82, 96 84 C 96 86, 100 86, 100 88 C 100 90, 96 90, 96 92 C 96 94, 100 94, 100 96 C 100 98, 96 98, 96 100 C 96 102, 100 102, 100 104 C 100 106, 96 106, 96 108 C 96 110, 100 110, 100 112
               L 96 112
               C 94 112, 94 115, 92 115 C 90 115, 90 112, 88 112 C 86 112, 86 115, 84 115 C 82 115, 82 112, 80 112 C 78 112, 78 115, 76 115 C 74 115, 74 112, 72 112 C 70 112, 70 115, 68 115 C 66 115, 66 112, 64 112 C 62 112, 62 115, 60 115 C 58 115, 58 112, 56 112 C 54 112, 54 115, 52 115 C 50 115, 50 112, 48 112 C 46 112, 46 115, 44 115 C 42 115, 42 112, 40 112 C 38 112, 38 115, 36 115 C 34 115, 34 112, 32 112 C 30 112, 30 115, 28 115 C 26 115, 26 112, 24 112 C 22 112, 22 115, 20 115 C 18 115, 18 112, 16 112 C 14 112, 14 115, 12 115 C 10 115, 10 112, 8 112
               L 4 112
               C 4 110, 0 110, 0 108 C 0 106, 4 106, 4 104 C 4 102, 0 102, 0 100 C 0 98, 4 98, 4 96 C 4 94, 0 94, 0 92 C 0 90, 4 90, 4 88 C 4 86, 0 86, 0 84 C 0 82, 4 82, 4 80 C 4 78, 0 78, 0 76 C 0 74, 4 74, 4 72 C 4 70, 0 70, 0 68 C 0 66, 4 66, 4 64 C 4 62, 0 62, 0 60 C 0 58, 4 58, 4 56 C 4 54, 0 54, 0 52 C 0 50, 4 50, 4 48 C 4 46, 0 46, 0 44 C 0 42, 4 42, 4 40 C 4 38, 0 38, 0 36 C 0 34, 4 34, 4 32 C 4 30, 0 30, 0 28 C 0 26, 4 26, 4 24 C 4 22, 0 22, 0 20 C 0 18, 4 18, 4 16 C 4 14, 0 14, 0 12 C 0 10, 4 10, 4 8 C 4 6, 0 6, 0 4
               Z"
            fill="#F4F1EA"
            stroke="#1E1E1E"
            strokeWidth="1.2"
          />

          {/* Outer Stamp Rectangular Border */}
          <rect
            x="8"
            y="8"
            width="84"
            height="99"
            rx="1"
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="1.8"
          />

          {/* Inner Notched Border */}
          <path
            d="M 14 14 L 86 14 L 86 101 L 14 101 Z"
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="0.8"
          />

          {/* Armchair Base */}
          <path
            d="M 22 74 C 22 72 40 70 78 72 C 81 72 82 78 81 83 C 78 87 26 87 23 83 C 21 80 22 75 22 74 Z"
            fill="#EBE7DE"
            stroke="#1E1E1E"
            strokeWidth="1.2"
          />
          {/* Chair Legs */}
          <line x1="28" y1="86" x2="26" y2="95" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
          <line x1="55" y1="87" x2="56" y2="98" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
          <line x1="77" y1="85" x2="79" y2="93" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" />
          {/* Chair Backrest & Cushion */}
          <path
            d="M 72 50 C 76 52 82 58 80 72 L 72 73 C 70 60 70 54 72 50 Z"
            fill="#DCD7CD"
            stroke="#1E1E1E"
            strokeWidth="1.2"
          />
          <path
            d="M 68 58 C 76 59 79 66 77 74 C 71 74 68 66 68 58 Z"
            fill="#EBE7DE"
            stroke="#1E1E1E"
            strokeWidth="1"
          />

          {/* Mina Bare Legs */}
          <path
            d="M 40 60 C 37 66 26 80 22 93 C 21 95 24 96 26 95 C 31 87 40 75 45 66"
            fill="#F4F1EA"
            stroke="#1E1E1E"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M 45 61 C 42 68 32 82 28 94 C 27 96 30 96 32 95 C 37 87 46 75 49 66"
            fill="#F4F1EA"
            stroke="#1E1E1E"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          {/* Mina Shorts & Top */}
          <path
            d="M 50 62 C 54 62 61 66 59 72 C 55 73 49 71 49 65 Z"
            fill="#1E1E1E"
          />

          {/* Cozy Off-Shoulder Sweater */}
          <path
            d="M 52 42 C 58 43 68 47 67 59 C 65 67 55 66 51 60 C 47 55 49 46 52 42 Z"
            fill="#F4F1EA"
            stroke="#1E1E1E"
            strokeWidth="1.3"
          />

          {/* Arms holding notebook & pencil */}
          <path
            d="M 57 48 C 55 54 48 56 42 54"
            fill="none"
            stroke="#1E1E1E"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          {/* Hand with pencil */}
          <path
            d="M 44 43 L 41 48"
            stroke="#1E1E1E"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Spiral Notebook / Field Notes Journal */}
          <path
            d="M 40 46 L 54 50 L 51 60 L 37 56 Z"
            fill="#1E1E1E"
            stroke="#1E1E1E"
            strokeWidth="1"
          />
          {/* Inner notebook pages */}
          <path
            d="M 42 48 L 52 51 L 50 58 L 39 55 Z"
            fill="#F4F1EA"
          />
          {/* Spiral rings */}
          <circle cx="39" cy="48" r="0.8" fill="#1E1E1E" />
          <circle cx="38" cy="51" r="0.8" fill="#1E1E1E" />
          <circle cx="37" cy="54" r="0.8" fill="#1E1E1E" />

          {/* Mina Face & Cute Profile */}
          <path
            d="M 51 34 C 53 38 56 39 59 38 C 60 37 60 35 59 33 C 58 31 54 30 51 34 Z"
            fill="#F4F1EA"
            stroke="#1E1E1E"
            strokeWidth="1"
          />
          {/* Eye and smile */}
          <path
            d="M 55 35 C 56 34 57 34 58 35"
            stroke="#1E1E1E"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M 55 38 C 56 38.5 57 38.5 58 38"
            stroke="#1E1E1E"
            strokeWidth="0.8"
            strokeLinecap="round"
          />

          {/* Voluminous Curly Black Hair */}
          <path
            d="M 53 22 C 48 24 45 30 46 36 C 47 41 51 44 48 46 C 45 44 43 38 44 32 C 45 25 50 19 58 17 C 66 15 72 20 73 28 C 74 34 70 38 72 43 C 74 47 78 45 77 41 C 76 35 77 31 75 26 C 73 21 68 18 61 19 Z"
            fill="#1E1E1E"
          />
          <path
            d="M 64 36 C 68 38 74 41 73 47 C 72 51 68 52 65 48"
            fill="#1E1E1E"
          />

          {/* Cute Hair Bow with '<3' */}
          <path
            d="M 52 23 C 50 20 53 17 56 19 C 58 20 57 23 55 24 Z"
            fill="#F4F1EA"
            stroke="#1E1E1E"
            strokeWidth="1"
          />
          <path
            d="M 57 23 C 59 20 62 21 61 24 C 59 25 57 24 57 23 Z"
            fill="#F4F1EA"
            stroke="#1E1E1E"
            strokeWidth="1"
          />
          <circle cx="56" cy="22" r="1.5" fill="#F4F1EA" stroke="#1E1E1E" strokeWidth="0.8" />
          <text x="54.2" y="23" fontSize="2.8" fontFamily="monospace" fontWeight="bold" fill="#1E1E1E">&lt;3</text>
        </svg>
      )}
    </div>
  );
};
