import React from 'react';

const INK = '#4A2E1B';

/* =========================================================
   FARM ANIMALS (Game: Som dos Animais)
   ========================================================= */

export type AnimalId = 'vaca' | 'cachorro' | 'pato' | 'ovelha';

export const AnimalIllustration: React.FC<{
  animal: AnimalId;
  className?: string;
}> = ({ animal, className = 'w-full h-auto max-w-full' }) => {
  if (animal === 'vaca') {
    return (
      <svg viewBox="0 0 160 150" className={className} fill="none" aria-hidden="true">
        {/* Horns & Ears */}
        <path d="M52 38C44 24 52 16 62 24" fill="#FDE68A" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M108 38C116 24 108 16 98 24" fill="#FDE68A" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="38" cy="52" rx="16" ry="9" transform="rotate(-18 38 52)" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
        <ellipse cx="122" cy="52" rx="16" ry="9" transform="rotate(18 122 52)" fill="#FFFFFF" stroke={INK} strokeWidth="4" />
        {/* Body */}
        <ellipse cx="80" cy="112" rx="44" ry="30" fill="#FFFFFF" stroke={INK} strokeWidth="4.2" />
        <ellipse cx="100" cy="112" rx="16" ry="11" fill="#334155" />
        <ellipse cx="56" cy="122" rx="10" ry="8" fill="#334155" />
        {/* Head */}
        <rect x="44" y="34" width="72" height="62" rx="28" fill="#FFFFFF" stroke={INK} strokeWidth="4.2" />
        {/* Cow Patch */}
        <path d="M84 35C102 35 114 46 114 62C102 64 90 58 84 48Z" fill="#334155" />
        {/* Eyes */}
        <circle cx="66" cy="58" r="5" fill={INK} />
        <circle cx="94" cy="58" r="5" fill={INK} />
        <circle cx="64.5" cy="56" r="1.8" fill="#FFF" />
        <circle cx="92.5" cy="56" r="1.8" fill="#FFF" />
        {/* Big Pink Snout */}
        <ellipse cx="80" cy="84" rx="30" ry="18" fill="#FBCFE8" stroke={INK} strokeWidth="4" />
        <circle cx="69" cy="80" r="3.5" fill={INK} />
        <circle cx="91" cy="80" r="3.5" fill={INK} />
        <path d="M71 91C76 96 84 96 89 91" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (animal === 'cachorro') {
    return (
      <svg viewBox="0 0 160 150" className={className} fill="none" aria-hidden="true">
        {/* Floppy Ears */}
        <ellipse cx="38" cy="70" rx="16" ry="28" transform="rotate(14 38 70)" fill="#92400E" stroke={INK} strokeWidth="4.2" />
        <ellipse cx="122" cy="70" rx="16" ry="28" transform="rotate(-14 122 70)" fill="#92400E" stroke={INK} strokeWidth="4.2" />
        {/* Body */}
        <ellipse cx="80" cy="116" rx="38" ry="26" fill="#D97706" stroke={INK} strokeWidth="4.2" />
        <ellipse cx="80" cy="122" rx="20" ry="16" fill="#FEF3C7" />
        {/* Head */}
        <circle cx="80" cy="64" r="38" fill="#F59E0B" stroke={INK} strokeWidth="4.2" />
        {/* Cute eye patch */}
        <circle cx="65" cy="59" r="13" fill="#B45309" />
        {/* Eyes */}
        <circle cx="65" cy="59" r="5" fill={INK} />
        <circle cx="95" cy="59" r="5" fill={INK} />
        <circle cx="63.5" cy="57" r="1.8" fill="#FFF" />
        <circle cx="93.5" cy="57" r="1.8" fill="#FFF" />
        {/* Muzzle & Happy Tongue */}
        <ellipse cx="80" cy="79" rx="20" ry="14" fill="#FEF3C7" />
        <ellipse cx="80" cy="72" rx="8" ry="6" fill={INK} />
        <path d="M75 84C75 94 85 94 85 84Z" fill="#FB7185" stroke={INK} strokeWidth="2.8" />
        <path d="M70 81C74 86 78 85 80 81C82 85 86 86 90 81" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
        {/* Blue Collar */}
        <path d="M56 97C70 105 90 105 104 97" stroke="#3B82F6" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }

  if (animal === 'pato') {
    return (
      <svg viewBox="0 0 160 150" className={className} fill="none" aria-hidden="true">
        {/* Little Orange Feet */}
        <path d="M62 134L54 142H72L68 134Z" fill="#F97316" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M98 134L92 142H110L104 134Z" fill="#F97316" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        {/* Round Yellow Body */}
        <ellipse cx="82" cy="108" rx="44" ry="30" fill="#FACC15" stroke={INK} strokeWidth="4.2" />
        {/* Cute Wing */}
        <path d="M60 98C78 92 98 102 96 116C84 124 62 118 60 98Z" fill="#FDE047" stroke={INK} strokeWidth="3.8" />
        {/* Head & Hair Tuft */}
        <path d="M76 24C74 14 84 14 84 24C90 16 96 22 88 28" fill="#FACC15" stroke={INK} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="80" cy="58" r="32" fill="#FACC15" stroke={INK} strokeWidth="4.2" />
        {/* Eyes */}
        <circle cx="68" cy="52" r="5" fill={INK} />
        <circle cx="92" cy="52" r="5" fill={INK} />
        <circle cx="66.5" cy="50" r="1.8" fill="#FFF" />
        <circle cx="90.5" cy="50" r="1.8" fill="#FFF" />
        <ellipse cx="58" cy="61" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.7" />
        <ellipse cx="102" cy="61" rx="5.5" ry="3.5" fill="#FDA4AF" opacity="0.7" />
        {/* Orange Duck Beak */}
        <ellipse cx="80" cy="70" rx="18" ry="10" fill="#F97316" stroke={INK} strokeWidth="3.8" />
        <path d="M68 70C74 75 86 75 92 70" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }

  // Ovelha
  return (
    <svg viewBox="0 0 160 150" className={className} fill="none" aria-hidden="true">
      {/* Legs */}
      <rect x="56" y="122" width="12" height="20" rx="5" fill="#475569" stroke={INK} strokeWidth="3.5" />
      <rect x="92" y="122" width="12" height="20" rx="5" fill="#475569" stroke={INK} strokeWidth="3.5" />
      {/* Fluffy Wool Cloud Body */}
      <circle cx="52" cy="96" r="24" fill="#F8FAFC" stroke={INK} strokeWidth="4" />
      <circle cx="108" cy="96" r="24" fill="#F8FAFC" stroke={INK} strokeWidth="4" />
      <circle cx="80" cy="108" r="28" fill="#F8FAFC" stroke={INK} strokeWidth="4" />
      <circle cx="80" cy="84" r="30" fill="#F8FAFC" stroke={INK} strokeWidth="4" />
      {/* Ears */}
      <ellipse cx="44" cy="56" rx="14" ry="8" transform="rotate(-18 44 56)" fill="#FFE4C4" stroke={INK} strokeWidth="3.8" />
      <ellipse cx="116" cy="56" rx="14" ry="8" transform="rotate(18 116 56)" fill="#FFE4C4" stroke={INK} strokeWidth="3.8" />
      {/* Face */}
      <ellipse cx="80" cy="64" rx="26" ry="24" fill="#FFE4C4" stroke={INK} strokeWidth="4" />
      {/* Fluffy Wool Hair */}
      <circle cx="68" cy="40" r="13" fill="#FFFFFF" stroke={INK} strokeWidth="3.6" />
      <circle cx="82" cy="36" r="14" fill="#FFFFFF" stroke={INK} strokeWidth="3.6" />
      <circle cx="94" cy="41" r="12" fill="#FFFFFF" stroke={INK} strokeWidth="3.6" />
      {/* Eyes & Smile */}
      <circle cx="70" cy="63" r="4.5" fill={INK} />
      <circle cx="90" cy="63" r="4.5" fill={INK} />
      <circle cx="68.5" cy="61.5" r="1.6" fill="#FFF" />
      <circle cx="88.5" cy="61.5" r="1.6" fill="#FFF" />
      <path d="M74 74C77 79 83 79 86 74" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
};

/* =========================================================
   GEOMETRIC SHAPES (Game: Trem das Formas)
   ========================================================= */

export type ShapeId = 'circulo' | 'quadrado' | 'triangulo';

export const ShapeBlockIllustration: React.FC<{
  shape: ShapeId;
  silhouette?: boolean;
  className?: string;
}> = ({ shape, silhouette = false, className = 'w-full h-auto max-w-full' }) => {
  const fill = silhouette
    ? '#CBD5E1'
    : shape === 'circulo'
      ? '#EF4444'
      : shape === 'quadrado'
        ? '#3B82F6'
        : '#FACC15';

  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {shape === 'circulo' && (
        <>
          <circle
            cx="60"
            cy="60"
            r="44"
            fill={fill}
            fillOpacity={silhouette ? 0.55 : 1}
            stroke={silhouette ? '#64748B' : INK}
            strokeWidth="5"
            strokeDasharray={silhouette ? '9 7' : undefined}
          />
          {!silhouette && (
            <>
              <circle cx="48" cy="54" r="4.5" fill={INK} />
              <circle cx="72" cy="54" r="4.5" fill={INK} />
              <path d="M49 68C54 75 66 75 71 68" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
            </>
          )}
        </>
      )}

      {shape === 'quadrado' && (
        <>
          <rect
            x="18"
            y="18"
            width="84"
            height="84"
            rx="14"
            fill={fill}
            fillOpacity={silhouette ? 0.55 : 1}
            stroke={silhouette ? '#64748B' : INK}
            strokeWidth="5"
            strokeDasharray={silhouette ? '9 7' : undefined}
          />
          {!silhouette && (
            <>
              <circle cx="46" cy="54" r="4.5" fill={INK} />
              <circle cx="74" cy="54" r="4.5" fill={INK} />
              <path d="M48 68C54 75 66 75 72 68" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
            </>
          )}
        </>
      )}

      {shape === 'triangulo' && (
        <>
          <path
            d="M60 16L104 98H16L60 16Z"
            fill={fill}
            fillOpacity={silhouette ? 0.55 : 1}
            stroke={silhouette ? '#64748B' : INK}
            strokeWidth="5"
            strokeLinejoin="round"
            strokeDasharray={silhouette ? '9 7' : undefined}
          />
          {!silhouette && (
            <>
              <circle cx="50" cy="68" r="4.2" fill={INK} />
              <circle cx="70" cy="68" r="4.2" fill={INK} />
              <path d="M51 80C56 85 64 85 69 80" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}
        </>
      )}
    </svg>
  );
};

/* =========================================================
   DRESS-UP ACCESSORIES (Game: Vestir o Caillou)
   ========================================================= */

export type AccessoryId = 'chapeu' | 'oculos' | 'tenis';

export const AccessoryIllustration: React.FC<{
  item: AccessoryId;
  className?: string;
}> = ({ item, className = 'w-full h-auto max-w-full' }) => {
  if (item === 'chapeu') {
    return (
      <svg viewBox="0 0 140 100" className={className} fill="none" aria-hidden="true">
        <path
          d="M24 68C26 30 48 16 70 16C92 16 112 30 114 68Z"
          fill="#3B82F6"
          stroke={INK}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path
          d="M16 68H126C132 68 134 78 122 80H22C12 80 10 68 16 68Z"
          fill="#EF4444"
          stroke={INK}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <circle cx="70" cy="14" r="7" fill="#FACC15" stroke={INK} strokeWidth="3.5" />
        <path d="M58 42L68 34L78 42" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (item === 'oculos') {
    return (
      <svg viewBox="0 0 150 80" className={className} fill="none" aria-hidden="true">
        <rect x="14" y="18" width="52" height="42" rx="16" fill="#0EA5E9" stroke={INK} strokeWidth="4.5" />
        <rect x="84" y="18" width="52" height="42" rx="16" fill="#0EA5E9" stroke={INK} strokeWidth="4.5" />
        <path d="M66 34C71 28 79 28 84 34" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <path d="M26 30L36 26" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M96 30L106 26" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    );
  }

  // Tenis
  return (
    <svg viewBox="0 0 150 90" className={className} fill="none" aria-hidden="true">
      <g>
        <path
          d="M16 58C16 42 28 32 42 32H54L64 46H74C82 46 86 52 86 60V68H16V58Z"
          fill="#22C55E"
          stroke={INK}
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        <rect x="14" y="64" width="74" height="12" rx="6" fill="#FFFFFF" stroke={INK} strokeWidth="3.8" />
        <path d="M46 44H56M48 52H58" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      </g>
      <g transform="translate(52, 8)">
        <path
          d="M16 58C16 42 28 32 42 32H54L64 46H74C82 46 86 52 86 60V68H16V58Z"
          fill="#22C55E"
          stroke={INK}
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        <rect x="14" y="64" width="74" height="12" rx="6" fill="#FFFFFF" stroke={INK} strokeWidth="3.8" />
        <path d="M46 44H56M48 52H58" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/* =========================================================
   GARDEN FLOWERS & WATERING CAN (Game: Regar as Flores)
   ========================================================= */

export const FlowerIllustration: React.FC<{
  bloomed: boolean;
  petalColor: string;
  className?: string;
}> = ({ bloomed, petalColor, className = 'w-full h-auto max-w-full' }) => (
  <svg viewBox="0 0 140 170" className={className} fill="none" aria-hidden="true">
    {/* Clay Pot */}
    <path d="M36 122H104L96 162H44L36 122Z" fill="#EA580C" stroke={INK} strokeWidth="4.2" strokeLinejoin="round" />
    <rect x="30" y="110" width="80" height="16" rx="6" fill="#F97316" stroke={INK} strokeWidth="4.2" />

    {bloomed ? (
      <>
        {/* Tall Green Stem & Leaves */}
        <path d="M70 110V62" stroke="#16A34A" strokeWidth="8" strokeLinecap="round" />
        <path d="M70 96C50 86 44 74 56 70C66 72 70 84 70 96Z" fill="#22C55E" stroke={INK} strokeWidth="3.5" />
        <path d="M70 92C90 82 96 70 84 66C74 68 70 80 70 92Z" fill="#22C55E" stroke={INK} strokeWidth="3.5" />
        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <ellipse
            key={deg}
            cx="70"
            cy="26"
            rx="15"
            ry="20"
            fill={petalColor}
            stroke={INK}
            strokeWidth="3.8"
            transform={`rotate(${deg} 70 48)`}
          />
        ))}
        {/* Smiling Flower Center */}
        <circle cx="70" cy="48" r="18" fill="#FDE047" stroke={INK} strokeWidth="4" />
        <circle cx="64" cy="45" r="2.8" fill={INK} />
        <circle cx="76" cy="45" r="2.8" fill={INK} />
        <path d="M64 52C67 56 73 56 76 52" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      </>
    ) : (
      <>
        {/* Cute Tiny Sprout Waiting for Water */}
        <path d="M70 110V88" stroke="#16A34A" strokeWidth="7" strokeLinecap="round" />
        <path d="M70 94C54 88 50 76 62 76C68 78 70 86 70 94Z" fill="#4ADE80" stroke={INK} strokeWidth="3.5" />
        <path d="M70 94C86 88 90 76 78 76C72 78 70 86 70 94Z" fill="#4ADE80" stroke={INK} strokeWidth="3.5" />
      </>
    )}
  </svg>
);

export const WateringCanIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto max-w-full',
}) => (
  <svg viewBox="0 0 140 100" className={className} fill="none" aria-hidden="true">
    {/* Handle */}
    <path d="M84 36C116 20 128 66 96 76" stroke="#0284C7" strokeWidth="10" strokeLinecap="round" />
    <path d="M84 36C116 20 128 66 96 76" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    {/* Spout */}
    <path d="M46 66L16 38L24 30L54 52Z" fill="#38BDF8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
    <ellipse cx="18" cy="32" rx="10" ry="6" transform="rotate(-42 18 32)" fill="#FACC15" stroke={INK} strokeWidth="3.5" />
    {/* Can Body */}
    <rect x="44" y="34" width="54" height="50" rx="14" fill="#38BDF8" stroke={INK} strokeWidth="4.2" />
    <circle cx="71" cy="59" r="10" fill="#FEF08A" stroke={INK} strokeWidth="3" />
  </svg>
);

/* =========================================================
   MENU PREVIEW ICONS FOR NEW GAMES
   ========================================================= */

export const BalloonsPreviewIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto max-w-full',
}) => (
  <svg viewBox="0 0 150 130" className={className} fill="none" aria-hidden="true">
    <path d="M44 82Q40 104 48 122" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <path d="M76 74Q80 98 72 122" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <path d="M108 82Q112 104 102 122" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="44" cy="52" rx="24" ry="30" fill="#EF4444" stroke={INK} strokeWidth="4" />
    <ellipse cx="108" cy="52" rx="24" ry="30" fill="#38BDF8" stroke={INK} strokeWidth="4" />
    <ellipse cx="76" cy="42" rx="26" ry="32" fill="#FACC15" stroke={INK} strokeWidth="4" />
    <path d="M35 38C34 44 35 50 38 54" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M66 28C65 34 66 40 69 44" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
    <path d="M99 38C98 44 99 50 102 54" stroke="#FFF" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const XylophonePreviewIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto max-w-full',
}) => (
  <svg viewBox="0 0 160 110" className={className} fill="none" aria-hidden="true">
    <rect x="14" y="36" width="132" height="44" rx="10" fill="#B45309" stroke={INK} strokeWidth="4" />
    {[
      { x: 22, h: 78, y: 16, c: '#EF4444' },
      { x: 44, h: 72, y: 19, c: '#F97316' },
      { x: 66, h: 66, y: 22, c: '#FACC15' },
      { x: 88, h: 60, y: 25, c: '#22C55E' },
      { x: 110, h: 54, y: 28, c: '#38BDF8' },
      { x: 130, h: 48, y: 31, c: '#A855F7' },
    ].map((bar, i) => (
      <g key={i}>
        <rect x={bar.x} y={bar.y} width="18" height={bar.h} rx="7" fill={bar.c} stroke={INK} strokeWidth="3.5" />
        <circle cx={bar.x + 9} cy={bar.y + 10} r="2.5" fill="#FFF" />
        <circle cx={bar.x + 9} cy={bar.y + bar.h - 10} r="2.5" fill="#FFF" />
      </g>
    ))}
  </svg>
);

export const ButterflyPreviewIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto max-w-full',
}) => (
  <svg viewBox="0 0 160 130" className={className} fill="none" aria-hidden="true">
    <ellipse cx="46" cy="48" rx="34" ry="26" transform="rotate(-18 46 48)" fill="#F472B6" stroke={INK} strokeWidth="4.2" />
    <ellipse cx="114" cy="48" rx="34" ry="26" transform="rotate(18 114 48)" fill="#F472B6" stroke={INK} strokeWidth="4.2" />
    <ellipse cx="52" cy="88" rx="24" ry="20" transform="rotate(18 52 88)" fill="#FACC15" stroke={INK} strokeWidth="4.2" />
    <ellipse cx="108" cy="88" rx="24" ry="20" transform="rotate(-18 108 88)" fill="#FACC15" stroke={INK} strokeWidth="4.2" />
    <rect x="70" y="34" width="20" height="70" rx="10" fill="#38BDF8" stroke={INK} strokeWidth="4.2" />
    <path d="M74 36C66 18 54 16 52 24" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
    <path d="M86 36C94 18 106 16 108 24" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
  </svg>
);

export const TrainPreviewIcon: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto max-w-full',
}) => (
  <svg viewBox="0 0 170 110" className={className} fill="none" aria-hidden="true">
    {/* Chimney puff */}
    <circle cx="42" cy="18" r="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
    <circle cx="58" cy="14" r="7" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="3" />
    {/* Engine */}
    <rect x="34" y="28" width="16" height="22" rx="4" fill="#FACC15" stroke={INK} strokeWidth="3.8" />
    <rect x="24" y="46" width="66" height="38" rx="10" fill="#EF4444" stroke={INK} strokeWidth="4" />
    <rect x="60" y="28" width="34" height="56" rx="8" fill="#3B82F6" stroke={INK} strokeWidth="4" />
    <rect x="68" y="36" width="18" height="16" rx="4" fill="#BAE6FD" stroke={INK} strokeWidth="3" />
    {/* Car */}
    <rect x="102" y="54" width="52" height="30" rx="8" fill="#22C55E" stroke={INK} strokeWidth="4" />
    <polygon points="128,32 144,54 112,54" fill="#FACC15" stroke={INK} strokeWidth="3.8" strokeLinejoin="round" />
    {/* Wheels */}
    <circle cx="42" cy="88" r="11" fill="#334155" stroke={INK} strokeWidth="3.8" />
    <circle cx="76" cy="88" r="11" fill="#334155" stroke={INK} strokeWidth="3.8" />
    <circle cx="118" cy="88" r="10" fill="#334155" stroke={INK} strokeWidth="3.8" />
    <circle cx="142" cy="88" r="10" fill="#334155" stroke={INK} strokeWidth="3.8" />
  </svg>
);
