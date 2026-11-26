import React from 'react';

const INK = '#4A2E1B';

/**
 * Bald toddler boy in bright yellow shirt with red/blue trim (Caillou-inspired storybook cartoon)
 */
export const BoyCharacter: React.FC<{
  mood?: 'happy' | 'cheering' | 'curious';
  className?: string;
}> = ({ mood = 'happy', className = 'w-full h-auto max-w-full' }) => {
  const armsUp = mood === 'cheering';
  return (
    <svg viewBox="0 0 180 200" className={className} fill="none" aria-hidden="true">
      {/* Ground shadow */}
      <ellipse cx="90" cy="188" rx="44" ry="8" fill="#000000" fillOpacity="0.1" />

      {/* Shoes */}
      <ellipse cx="72" cy="178" rx="14" ry="8" fill="#E63946" stroke={INK} strokeWidth="4" />
      <ellipse cx="108" cy="178" rx="14" ry="8" fill="#E63946" stroke={INK} strokeWidth="4" />
      <path d="M62 178H82" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M98 178H118" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

      {/* Legs */}
      <rect x="65" y="148" width="14" height="28" rx="7" fill="#FFD3B0" stroke={INK} strokeWidth="4" />
      <rect x="101" y="148" width="14" height="28" rx="7" fill="#FFD3B0" stroke={INK} strokeWidth="4" />

      {/* Blue Shorts */}
      <path
        d="M58 134H122L126 156C126 159 123 161 120 161H96L90 150L84 161H60C57 161 54 159 54 156L58 134Z"
        fill="#3B82F6"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Arms */}
      {armsUp ? (
        <>
          <path
            d="M56 105C36 92 26 70 30 56"
            stroke="#FFD3B0"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d="M56 105C36 92 26 70 30 56"
            stroke={INK}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="30" cy="54" r="9" fill="#FFD3B0" stroke={INK} strokeWidth="4" />
          <path
            d="M124 105C144 92 154 70 150 56"
            stroke="#FFD3B0"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <circle cx="150" cy="54" r="9" fill="#FFD3B0" stroke={INK} strokeWidth="4" />
        </>
      ) : (
        <>
          <path
            d="M57 104C42 115 36 128 38 136"
            stroke="#FFD3B0"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <circle cx="38" cy="137" r="9" fill="#FFD3B0" stroke={INK} strokeWidth="4" />
          <path
            d="M123 102C140 94 148 80 146 69"
            stroke="#FFD3B0"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <circle cx="146" cy="67" r="9" fill="#FFD3B0" stroke={INK} strokeWidth="4" />
        </>
      )}

      {/* Bright Yellow Shirt */}
      <path
        d="M58 92C58 84 68 80 90 80C112 80 122 84 122 92L126 136C126 140 122 142 118 142H62C58 142 54 140 54 136L58 92Z"
        fill="#FFD43B"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Shirt red collar */}
      <path
        d="M72 82C77 92 103 92 108 82"
        fill="#EF4444"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Shirt sleeves */}
      <path
        d="M58 88L42 101L51 114L62 106Z"
        fill="#FFD43B"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M122 88L138 101L129 114L118 106Z"
        fill="#FFD43B"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Blue sleeve stripes */}
      <path d="M44 103L52 112" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
      <path d="M136 103L128 112" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />

      {/* Ears */}
      <circle cx="48" cy="52" r="9" fill="#FFD3B0" stroke={INK} strokeWidth="4" />
      <circle cx="132" cy="52" r="9" fill="#FFD3B0" stroke={INK} strokeWidth="4" />

      {/* Bald Round Head */}
      <circle cx="90" cy="49" r="41" fill="#FFD3B0" stroke={INK} strokeWidth="4.5" />

      {/* Subtle cute head shine */}
      <path
        d="M68 23C75 18 85 16 93 17"
        stroke="#FFF4EA"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Rosy Cheeks */}
      <ellipse cx="64" cy="59" rx="7" ry="4.5" fill="#FF9AA2" opacity="0.65" />
      <ellipse cx="116" cy="59" rx="7" ry="4.5" fill="#FF9AA2" opacity="0.65" />

      {/* Expressive Eyes */}
      <circle cx="75" cy="47" r="5.5" fill={INK} />
      <circle cx="105" cy="47" r="5.5" fill={INK} />
      <circle cx="73" cy="45" r="2" fill="#FFFFFF" />
      <circle cx="103" cy="45" r="2" fill="#FFFFFF" />

      {/* Happy Eyebrows */}
      <path d="M67 36C71 32 78 32 82 35" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M98 35C102 32 109 32 113 36" stroke={INK} strokeWidth="3" strokeLinecap="round" />

      {/* Tiny Button Nose */}
      <path d="M88 53C90 56 92 56 93 53" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />

      {/* Smile */}
      {mood === 'cheering' ? (
        <path
          d="M73 61C77 75 103 75 107 61Z"
          fill="#E63946"
          stroke={INK}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      ) : mood === 'curious' ? (
        <ellipse cx="90" cy="66" rx="6" ry="7" fill="#E63946" stroke={INK} strokeWidth="3.2" />
      ) : (
        <path
          d="M74 62C80 72 100 72 106 62"
          stroke={INK}
          strokeWidth="3.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
};

/**
 * Red-haired toddler little sister in a cheerful pink dress
 */
export const SisterCharacter: React.FC<{
  mood?: 'happy' | 'yummy' | 'cheering';
  className?: string;
}> = ({ mood = 'happy', className = 'w-full h-auto max-w-full' }) => {
  const armsUp = mood === 'cheering' || mood === 'yummy';
  return (
    <svg viewBox="0 0 180 200" className={className} fill="none" aria-hidden="true">
      {/* Ground shadow */}
      <ellipse cx="90" cy="188" rx="42" ry="8" fill="#000000" fillOpacity="0.1" />

      {/* Red-orange hair pigtails behind head */}
      <circle cx="43" cy="48" r="18" fill="#EA580C" stroke={INK} strokeWidth="4" />
      <circle cx="137" cy="48" r="18" fill="#EA580C" stroke={INK} strokeWidth="4" />
      <circle cx="38" cy="62" r="12" fill="#F97316" stroke={INK} strokeWidth="3.5" />
      <circle cx="142" cy="62" r="12" fill="#F97316" stroke={INK} strokeWidth="3.5" />

      {/* Shoes */}
      <ellipse cx="74" cy="179" rx="12" ry="7.5" fill="#EC4899" stroke={INK} strokeWidth="4" />
      <ellipse cx="106" cy="179" rx="12" ry="7.5" fill="#EC4899" stroke={INK} strokeWidth="4" />

      {/* Legs */}
      <rect x="68" y="152" width="12" height="24" rx="6" fill="#FFD9BE" stroke={INK} strokeWidth="4" />
      <rect x="100" y="152" width="12" height="24" rx="6" fill="#FFD9BE" stroke={INK} strokeWidth="4" />

      {/* Arms */}
      {armsUp ? (
        <>
          <path d="M58 112C39 99 30 82 34 69" stroke="#FFD9BE" strokeWidth="13" strokeLinecap="round" />
          <circle cx="34" cy="67" r="8" fill="#FFD9BE" stroke={INK} strokeWidth="3.8" />
          <path d="M122 112C141 99 150 82 146 69" stroke="#FFD9BE" strokeWidth="13" strokeLinecap="round" />
          <circle cx="146" cy="67" r="8" fill="#FFD9BE" stroke={INK} strokeWidth="3.8" />
        </>
      ) : (
        <>
          <path d="M58 112C44 123 39 134 42 142" stroke="#FFD9BE" strokeWidth="13" strokeLinecap="round" />
          <circle cx="42" cy="143" r="8" fill="#FFD9BE" stroke={INK} strokeWidth="3.8" />
          <path d="M122 112C136 123 141 134 138 142" stroke="#FFD9BE" strokeWidth="13" strokeLinecap="round" />
          <circle cx="138" cy="143" r="8" fill="#FFD9BE" stroke={INK} strokeWidth="3.8" />
        </>
      )}

      {/* Pink Dress */}
      <path
        d="M64 96C64 90 73 86 90 86C107 86 116 90 116 96L134 154C135 158 132 161 128 161H52C48 161 45 158 46 154L64 96Z"
        fill="#F472B6"
        stroke={INK}
        strokeWidth="4.2"
        strokeLinejoin="round"
      />
      {/* Cute dress white collar */}
      <path
        d="M72 88L84 100L90 93L96 100L108 88"
        fill="#FFFFFF"
        stroke={INK}
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      {/* Dress heart pocket */}
      <path
        d="M90 138C90 138 80 131 80 125C80 121 83 119 86 119C88 119 89.5 120.5 90 122C90.5 120.5 92 119 94 119C97 119 100 121 100 125C100 131 90 138 90 138Z"
        fill="#FCE7F3"
        stroke={INK}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      {/* Puff sleeves */}
      <circle cx="58" cy="104" r="11" fill="#F472B6" stroke={INK} strokeWidth="4" />
      <circle cx="122" cy="104" r="11" fill="#F472B6" stroke={INK} strokeWidth="4" />

      {/* Face */}
      <circle cx="90" cy="54" r="37" fill="#FFD9BE" stroke={INK} strokeWidth="4.2" />

      {/* Red-orange hair bangs */}
      <path
        d="M53 52C52 24 72 14 90 14C108 14 128 24 127 52C120 38 110 35 101 38C95 30 85 30 79 38C70 35 60 38 53 52Z"
        fill="#EA580C"
        stroke={INK}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Cute hair bows */}
      <circle cx="54" cy="36" r="6" fill="#F472B6" stroke={INK} strokeWidth="3" />
      <circle cx="126" cy="36" r="6" fill="#F472B6" stroke={INK} strokeWidth="3" />

      {/* Rosy Cheeks */}
      <ellipse cx="66" cy="64" rx="6.5" ry="4" fill="#FF8FA3" opacity="0.7" />
      <ellipse cx="114" cy="64" rx="6.5" ry="4" fill="#FF8FA3" opacity="0.7" />

      {/* Eyes */}
      {mood === 'yummy' ? (
        <>
          <path d="M69 54C73 48 79 48 83 54" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <path d="M97 54C101 48 107 48 111 54" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="76" cy="53" r="5" fill={INK} />
          <circle cx="104" cy="53" r="5" fill={INK} />
          <circle cx="74.5" cy="51" r="1.8" fill="#FFFFFF" />
          <circle cx="102.5" cy="51" r="1.8" fill="#FFFFFF" />
        </>
      )}

      {/* Smile */}
      {mood === 'yummy' || mood === 'cheering' ? (
        <path
          d="M76 66C80 78 100 78 104 66Z"
          fill="#EC4899"
          stroke={INK}
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      ) : (
        <path d="M77 67C83 75 97 75 103 67" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      )}
    </svg>
  );
};

/**
 * Cute Gray Pet Cat (Gilbert-inspired tabby cartoon cat)
 */
export const GrayCatCharacter: React.FC<{
  mood?: 'happy' | 'peeking' | 'purring';
  className?: string;
}> = ({ mood = 'happy', className = 'w-full h-auto max-w-full' }) => {
  if (mood === 'peeking') {
    return (
      <svg viewBox="0 0 140 90" className={className} fill="none" aria-hidden="true">
        {/* Ears */}
        <path d="M36 48L28 12L60 32Z" fill="#94A3B8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M104 48L112 12L80 32Z" fill="#94A3B8" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
        <path d="M38 40L35 22L50 32Z" fill="#FDA4AF" />
        <path d="M102 40L105 22L90 32Z" fill="#FDA4AF" />
        {/* Head top peeking */}
        <path
          d="M26 78C26 42 46 28 70 28C94 28 114 42 114 78Z"
          fill="#94A3B8"
          stroke={INK}
          strokeWidth="4.2"
        />
        {/* Stripes */}
        <path d="M64 31V44M70 29V45M76 31V44" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" />
        {/* Big curious eyes */}
        <circle cx="54" cy="58" r="7" fill="#FEF08A" stroke={INK} strokeWidth="3" />
        <circle cx="86" cy="58" r="7" fill="#FEF08A" stroke={INK} strokeWidth="3" />
        <circle cx="54" cy="58" r="3.5" fill={INK} />
        <circle cx="86" cy="58" r="3.5" fill={INK} />
        <circle cx="52.5" cy="56.5" r="1.4" fill="#FFF" />
        <circle cx="84.5" cy="56.5" r="1.4" fill="#FFF" />
        {/* Little paws */}
        <ellipse cx="42" cy="78" rx="12" ry="8" fill="#CBD5E1" stroke={INK} strokeWidth="3.5" />
        <ellipse cx="98" cy="78" rx="12" ry="8" fill="#CBD5E1" stroke={INK} strokeWidth="3.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 180 170" className={className} fill="none" aria-hidden="true">
      {/* Ground shadow */}
      <ellipse cx="90" cy="158" rx="48" ry="8" fill="#000000" fillOpacity="0.1" />

      {/* Curled Gray Tail */}
      <path
        d="M124 134C152 132 162 108 150 92C142 82 131 89 135 99"
        stroke="#94A3B8"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M124 134C152 132 162 108 150 92C142 82 131 89 135 99"
        stroke={INK}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Fluffy Body */}
      <ellipse cx="90" cy="124" rx="40" ry="34" fill="#94A3B8" stroke={INK} strokeWidth="4.2" />
      {/* Light gray belly */}
      <ellipse cx="90" cy="130" rx="23" ry="22" fill="#E2E8F0" />

      {/* Paws */}
      <ellipse cx="70" cy="152" rx="13" ry="8.5" fill="#CBD5E1" stroke={INK} strokeWidth="3.8" />
      <ellipse cx="110" cy="152" rx="13" ry="8.5" fill="#CBD5E1" stroke={INK} strokeWidth="3.8" />

      {/* Ears */}
      <path d="M52 54L42 18L76 38Z" fill="#94A3B8" stroke={INK} strokeWidth="4.2" strokeLinejoin="round" />
      <path d="M128 54L138 18L104 38Z" fill="#94A3B8" stroke={INK} strokeWidth="4.2" strokeLinejoin="round" />
      <path d="M54 46L50 28L66 38Z" fill="#FDA4AF" />
      <path d="M126 46L130 28L114 38Z" fill="#FDA4AF" />

      {/* Head */}
      <ellipse cx="90" cy="68" rx="42" ry="35" fill="#94A3B8" stroke={INK} strokeWidth="4.2" />

      {/* Tabby Forehead Stripes */}
      <path d="M82 36V49M90 34V50M98 36V49" stroke="#64748B" strokeWidth="3.8" strokeLinecap="round" />

      {/* Soft Muzzle */}
      <ellipse cx="90" cy="79" rx="18" ry="13" fill="#E2E8F0" />

      {/* Eyes */}
      {mood === 'purring' ? (
        <>
          <path d="M65 65C70 58 77 58 81 65" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <path d="M99 65C103 58 110 58 115 65" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="73" cy="64" r="7" fill="#BEF264" stroke={INK} strokeWidth="3" />
          <circle cx="107" cy="64" r="7" fill="#BEF264" stroke={INK} strokeWidth="3" />
          <circle cx="73" cy="64" r="3.6" fill={INK} />
          <circle cx="107" cy="64" r="3.6" fill={INK} />
          <circle cx="71.5" cy="62" r="1.5" fill="#FFF" />
          <circle cx="105.5" cy="62" r="1.5" fill="#FFF" />
        </>
      )}

      {/* Pink Triangle Nose */}
      <path d="M84 74H96L90 81Z" fill="#FB7185" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      {/* Cat Mouth */}
      <path d="M82 84C85 88 89 87 90 83C91 87 95 88 98 84" stroke={INK} strokeWidth="3" strokeLinecap="round" />

      {/* Whiskers */}
      <path d="M40 72L58 75M38 82L57 81" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />
      <path d="M140 72L122 75M142 82L123 81" stroke={INK} strokeWidth="2.8" strokeLinecap="round" />

      {/* Cute Red Collar */}
      <path d="M62 98C75 106 105 106 118 98" stroke="#EF4444" strokeWidth="7" strokeLinecap="round" />
      <circle cx="90" cy="105" r="6" fill="#FACC15" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
};

/* =========================================================
   GAME 1: TOYS & MATCHING SILHOUETTES
   ========================================================= */

export type ToyId = 'dinossauro' | 'foguete' | 'carrinho';

export const ToyIllustration: React.FC<{
  type: ToyId;
  silhouette?: boolean;
  className?: string;
}> = ({ type, silhouette = false, className = 'w-full h-auto max-w-full' }) => {
  const silFill = '#8B5A2B';
  const silStroke = '#5C3A1A';

  if (type === 'dinossauro') {
    return (
      <svg viewBox="0 0 160 150" className={className} fill="none" aria-hidden="true">
        {silhouette ? (
          <path
            d="M42 42C42 22 68 18 76 34C80 42 74 56 76 70C92 66 116 74 124 94C132 102 146 98 148 106C150 116 132 124 116 120V136H98V122H72V136H54V112C48 98 48 76 52 56C44 54 42 48 42 42Z"
            fill={silFill}
            fillOpacity="0.34"
            stroke={silStroke}
            strokeWidth="4.5"
            strokeDasharray="8 6"
            strokeLinejoin="round"
          />
        ) : (
          <>
            {/* Back spikes */}
            <path d="M74 56L84 48L82 62Z" fill="#FACC15" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
            <path d="M86 64L98 58L94 72Z" fill="#FACC15" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
            <path d="M100 72L112 68L108 82Z" fill="#FACC15" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
            {/* Main friendly green dino body */}
            <path
              d="M36 42C36 22 68 16 77 34C81 42 74 58 77 72C94 68 116 76 124 96C134 104 148 98 150 107C152 117 132 125 116 120V136C116 139 113 141 110 141H100C97 141 94 139 94 136V122H74V136C74 139 71 141 68 141H58C55 141 52 139 52 136V110C46 96 48 76 52 58C42 57 36 50 36 42Z"
              fill="#22C55E"
              stroke={INK}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Yellow belly & cute spots */}
            <path d="M56 84C68 82 78 96 78 118H56C52 106 52 92 56 84Z" fill="#FEF08A" />
            <circle cx="96" cy="94" r="6" fill="#16A34A" />
            <circle cx="110" cy="102" r="4.5" fill="#16A34A" />
            {/* Eye & big friendly smile */}
            <circle cx="56" cy="36" r="5" fill={INK} />
            <circle cx="54.5" cy="34.5" r="1.8" fill="#FFF" />
            <path d="M40 46C46 52 58 52 64 47" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="65" cy="44" r="4" fill="#FDA4AF" opacity="0.7" />
          </>
        )}
      </svg>
    );
  }

  if (type === 'foguete') {
    return (
      <svg viewBox="0 0 160 150" className={className} fill="none" aria-hidden="true">
        {silhouette ? (
          <path
            d="M80 14C104 34 114 64 110 98L130 118L108 122L98 134H62L52 122L30 118L50 98C46 64 56 34 80 14Z"
            fill={silFill}
            fillOpacity="0.34"
            stroke={silStroke}
            strokeWidth="4.5"
            strokeDasharray="8 6"
            strokeLinejoin="round"
          />
        ) : (
          <>
            {/* Little Flame */}
            <path d="M68 122C68 138 80 146 80 146C80 146 92 138 92 122Z" fill="#F97316" stroke={INK} strokeWidth="3.5" />
            <path d="M74 122C74 132 80 138 80 138C80 138 86 132 86 122Z" fill="#FACC15" />
            {/* Side Fins */}
            <path d="M52 86L28 116L54 118Z" fill="#EF4444" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M108 86L132 116L106 118Z" fill="#EF4444" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            {/* Rocket Body */}
            <path
              d="M80 14C104 34 112 66 106 120H54C48 66 56 34 80 14Z"
              fill="#F8FAFC"
              stroke={INK}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            {/* Red Nose Cone */}
            <path
              d="M80 14C92 24 99 36 103 48H57C61 36 68 24 80 14Z"
              fill="#EF4444"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Yellow Stripe */}
            <rect x="54" y="106" width="52" height="14" rx="4" fill="#FACC15" stroke={INK} strokeWidth="3.8" />
            {/* Porthole Window */}
            <circle cx="80" cy="74" r="16" fill="#38BDF8" stroke={INK} strokeWidth="4" />
            <path d="M72 68C75 64 81 63 85 66" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  // carrinho
  return (
    <svg viewBox="0 0 160 150" className={className} fill="none" aria-hidden="true">
      {silhouette ? (
        <path
          d="M22 86C22 72 34 68 46 66L58 42C62 34 70 32 82 32H100C112 32 118 38 124 48L134 66C144 68 148 76 148 88V108C148 114 142 118 134 118H126C124 128 116 134 106 134C96 134 88 128 86 118H70C68 128 60 134 50 134C40 134 32 128 30 118H24C20 118 18 114 18 108V86Z"
          fill={silFill}
          fillOpacity="0.34"
          stroke={silStroke}
          strokeWidth="4.5"
          strokeDasharray="8 6"
          strokeLinejoin="round"
        />
      ) : (
        <>
          {/* Car Body */}
          <path
            d="M20 88C20 74 32 68 46 66L58 42C62 34 70 32 82 32H98C110 32 116 38 122 48L132 66C144 68 148 78 148 90V108C148 114 143 118 136 118H26C21 118 18 114 18 108V88Z"
            fill="#3B82F6"
            stroke={INK}
            strokeWidth="4.5"
            strokeLinejoin="round"
          />
          {/* Yellow Racing Stripe */}
          <rect x="20" y="92" width="126" height="12" fill="#FACC15" stroke={INK} strokeWidth="3" />
          {/* Windows */}
          <path
            d="M64 44H84V66H52L64 44Z"
            fill="#BAE6FD"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path
            d="M92 44H110L122 66H92V44Z"
            fill="#BAE6FD"
            stroke={INK}
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Headlight */}
          <ellipse cx="141" cy="84" rx="6" ry="7" fill="#FEF08A" stroke={INK} strokeWidth="3" />
          {/* Wheels */}
          <circle cx="52" cy="116" r="18" fill="#334155" stroke={INK} strokeWidth="4.2" />
          <circle cx="52" cy="116" r="8" fill="#F8FAFC" stroke={INK} strokeWidth="3" />
          <circle cx="114" cy="116" r="18" fill="#334155" stroke={INK} strokeWidth="4.2" />
          <circle cx="114" cy="116" r="8" fill="#F8FAFC" stroke={INK} strokeWidth="3" />
        </>
      )}
    </svg>
  );
};

/* =========================================================
   GAME 2: FRUITS & COLORED PLATES
   ========================================================= */

export type FruitColor = 'vermelho' | 'amarelo' | 'verde' | 'azul';

export const FruitIllustration: React.FC<{
  color: FruitColor;
  className?: string;
}> = ({ color, className = 'w-full h-auto max-w-full' }) => {
  if (color === 'vermelho') {
    // Maçã vermelha
    return (
      <svg viewBox="0 0 130 130" className={className} fill="none" aria-hidden="true">
        <path d="M65 36C65 24 72 16 78 14" stroke="#78350F" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M68 26C82 14 96 20 94 32C84 36 74 34 68 26Z" fill="#22C55E" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
        <path
          d="M65 40C50 30 24 42 26 74C28 104 48 118 65 112C82 118 102 104 104 74C106 42 80 30 65 40Z"
          fill="#EF4444"
          stroke={INK}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path d="M41 58C38 66 38 75 41 82" stroke="#FCA5A5" strokeWidth="6" strokeLinecap="round" />
        {/* Cute kawaii smile */}
        <circle cx="54" cy="74" r="3.8" fill={INK} />
        <circle cx="76" cy="74" r="3.8" fill={INK} />
        <path d="M58 84C62 89 68 89 72 84" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }

  if (color === 'amarelo') {
    // Banana amarela
    return (
      <svg viewBox="0 0 130 130" className={className} fill="none" aria-hidden="true">
        <path
          d="M92 22C98 24 102 30 100 36C106 68 84 108 32 106C22 106 18 96 24 90C46 84 74 62 82 32C84 24 87 21 92 22Z"
          fill="#FACC15"
          stroke={INK}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path d="M88 22L97 26" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
        <path d="M40 96C62 92 80 74 88 48" stroke="#FEF08A" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="66" cy="76" r="3.5" fill={INK} />
        <circle cx="79" cy="64" r="3.5" fill={INK} />
        <path d="M70 82C76 82 81 78 82 72" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (color === 'verde') {
    // Pera verde
    return (
      <svg viewBox="0 0 130 130" className={className} fill="none" aria-hidden="true">
        <path d="M65 28C65 18 70 13 75 12" stroke="#78350F" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M68 23C82 14 93 20 90 30C80 33 72 30 68 23Z" fill="#16A34A" stroke={INK} strokeWidth="3.2" strokeLinejoin="round" />
        <path
          d="M65 28C80 28 84 44 88 58C95 70 102 82 98 98C94 112 80 118 65 118C50 118 36 112 32 98C28 82 35 70 42 58C46 44 50 28 65 28Z"
          fill="#4ADE80"
          stroke={INK}
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
        <path d="M45 78C43 86 44 94 49 99" stroke="#BBF7D0" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="55" cy="82" r="3.8" fill={INK} />
        <circle cx="75" cy="82" r="3.8" fill={INK} />
        <path d="M59 91C63 96 67 96 71 91" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
      </svg>
    );
  }

  // Mirtilo azul (blueberries)
  return (
    <svg viewBox="0 0 130 130" className={className} fill="none" aria-hidden="true">
      {/* Leaf behind */}
      <path d="M64 36C74 16 96 18 98 34C86 42 72 42 64 36Z" fill="#22C55E" stroke={INK} strokeWidth="3.5" strokeLinejoin="round" />
      {/* Back berry */}
      <circle cx="84" cy="60" r="24" fill="#2563EB" stroke={INK} strokeWidth="4.2" />
      <path d="M77 41L84 46L91 41" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Front main berry */}
      <circle cx="54" cy="78" r="32" fill="#3B82F6" stroke={INK} strokeWidth="4.5" />
      <path d="M45 50L54 57L63 50" stroke={INK} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 68C32 76 34 84 38 90" stroke="#93C5FD" strokeWidth="5" strokeLinecap="round" />
      <circle cx="46" cy="79" r="3.8" fill={INK} />
      <circle cx="64" cy="79" r="3.8" fill={INK} />
      <path d="M50 88C54 92 58 92 61 88" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      {/* Small side berry */}
      <circle cx="92" cy="92" r="20" fill="#60A5FA" stroke={INK} strokeWidth="4" />
    </svg>
  );
};

/* =========================================================
   GAME 3: LIVING ROOM FURNITURE FOR HIDE & SEEK
   ========================================================= */

export type HidingSpotId = 'sofa' | 'poltrona' | 'cortina' | 'caixa';

export const FurnitureIllustration: React.FC<{
  type: HidingSpotId;
  className?: string;
}> = ({ type, className = 'w-full h-auto max-w-full' }) => {
  if (type === 'sofa') {
    return (
      <svg viewBox="0 0 220 150" className={className} fill="none" aria-hidden="true">
        {/* Legs */}
        <rect x="26" y="124" width="14" height="18" rx="4" fill="#92400E" stroke={INK} strokeWidth="3.8" />
        <rect x="180" y="124" width="14" height="18" rx="4" fill="#92400E" stroke={INK} strokeWidth="3.8" />
        {/* Backrest */}
        <rect x="26" y="28" width="168" height="68" rx="22" fill="#38BDF8" stroke={INK} strokeWidth="4.5" />
        {/* Cushions */}
        <rect x="34" y="76" width="76" height="44" rx="14" fill="#0EA5E9" stroke={INK} strokeWidth="4" />
        <rect x="110" y="76" width="76" height="44" rx="14" fill="#0EA5E9" stroke={INK} strokeWidth="4" />
        {/* Armrests */}
        <rect x="14" y="62" width="28" height="66" rx="14" fill="#0284C7" stroke={INK} strokeWidth="4.2" />
        <rect x="178" y="62" width="28" height="66" rx="14" fill="#0284C7" stroke={INK} strokeWidth="4.2" />
        {/* Cute throw pillow */}
        <rect x="136" y="48" width="32" height="30" rx="8" transform="rotate(8 136 48)" fill="#FACC15" stroke={INK} strokeWidth="3.5" />
      </svg>
    );
  }

  if (type === 'poltrona') {
    return (
      <svg viewBox="0 0 180 150" className={className} fill="none" aria-hidden="true">
        <rect x="36" y="124" width="14" height="18" rx="4" fill="#92400E" stroke={INK} strokeWidth="3.8" />
        <rect x="130" y="124" width="14" height="18" rx="4" fill="#92400E" stroke={INK} strokeWidth="3.8" />
        <rect x="34" y="24" width="112" height="74" rx="26" fill="#FB923C" stroke={INK} strokeWidth="4.5" />
        <rect x="42" y="78" width="96" height="44" rx="14" fill="#F97316" stroke={INK} strokeWidth="4" />
        <rect x="20" y="64" width="30" height="64" rx="14" fill="#EA580C" stroke={INK} strokeWidth="4.2" />
        <rect x="130" y="64" width="30" height="64" rx="14" fill="#EA580C" stroke={INK} strokeWidth="4.2" />
        <circle cx="90" cy="54" r="6" fill="#FED7AA" stroke={INK} strokeWidth="3" />
      </svg>
    );
  }

  if (type === 'cortina') {
    return (
      <svg viewBox="0 0 180 160" className={className} fill="none" aria-hidden="true">
        {/* Sunny window behind */}
        <rect x="26" y="24" width="128" height="114" rx="12" fill="#BAE6FD" stroke={INK} strokeWidth="4.2" />
        <circle cx="112" cy="58" r="16" fill="#FDE047" />
        <path d="M26 84H154M90 24V138" stroke="#FFFFFF" strokeWidth="6" />
        {/* Curtain rod */}
        <rect x="10" y="14" width="160" height="12" rx="6" fill="#D97706" stroke={INK} strokeWidth="3.8" />
        {/* Left & Right wavy curtains */}
        <path
          d="M22 26H76C70 68 62 96 74 146H22C16 106 24 68 22 26Z"
          fill="#34D399"
          stroke={INK}
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        <path
          d="M158 26H104C110 68 118 96 106 146H158C164 106 156 68 158 26Z"
          fill="#34D399"
          stroke={INK}
          strokeWidth="4.2"
          strokeLinejoin="round"
        />
        {/* Curtain folds */}
        <path d="M40 34V136M56 34V136" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
        <path d="M124 34V136M140 34V136" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // Caixa de Brinquedos
  return (
    <svg viewBox="0 0 190 150" className={className} fill="none" aria-hidden="true">
      {/* Lid */}
      <rect x="20" y="36" width="150" height="24" rx="10" fill="#F43F5E" stroke={INK} strokeWidth="4.5" />
      {/* Box body */}
      <rect x="28" y="58" width="134" height="78" rx="12" fill="#FDE047" stroke={INK} strokeWidth="4.5" />
      {/* Side handles */}
      <path d="M40 74H60M130 74H150" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {/* Painted Star */}
      <path
        d="M95 72L102 88L120 90L106 101L110 118L95 109L80 118L84 101L70 90L88 88L95 72Z"
        fill="#38BDF8"
        stroke={INK}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      {/* Corner feet */}
      <rect x="34" y="134" width="18" height="10" rx="4" fill="#E11D48" stroke={INK} strokeWidth="3.5" />
      <rect x="138" y="134" width="18" height="10" rx="4" fill="#E11D48" stroke={INK} strokeWidth="3.5" />
    </svg>
  );
};

/* =========================================================
   GAME 4: UNIFIED 400x400 PARK SCENE FOR THE 4-PIECE PUZZLE
   ========================================================= */

export const ParkSceneContent: React.FC = () => (
  <g>
    {/* Sky */}
    <rect x="0" y="0" width="400" height="400" fill="#BAE6FD" />

    {/* Rainbow spanning top-left to top-right */}
    <path d="M70 230A140 140 0 0 1 330 230" stroke="#F87171" strokeWidth="14" fill="none" />
    <path d="M84 230A126 126 0 0 1 316 230" stroke="#FBBF24" strokeWidth="14" fill="none" />
    <path d="M98 230A112 112 0 0 1 302 230" stroke="#4ADE80" strokeWidth="14" fill="none" />
    <path d="M112 230A98 98 0 0 1 288 230" stroke="#60A5FA" strokeWidth="14" fill="none" />

    {/* Smiling Sun (top-left quadrant) */}
    <g transform="translate(76, 74)">
      <circle cx="0" cy="0" r="34" fill="#FDE047" stroke={INK} strokeWidth="4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="0"
          y1="-42"
          x2="0"
          y2="-52"
          stroke="#F59E0B"
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(${deg})`}
        />
      ))}
      <circle cx="-11" cy="-4" r="3.5" fill={INK} />
      <circle cx="11" cy="-4" r="3.5" fill={INK} />
      <path d="M-10 8C-5 15 5 15 10 8" stroke={INK} strokeWidth="3.2" strokeLinecap="round" />
    </g>

    {/* Fluffy Clouds */}
    <g fill="#FFFFFF" stroke={INK} strokeWidth="3.2">
      <path d="M150 66C150 56 160 50 170 52C176 42 194 44 198 56C206 56 212 64 208 72H150Z" />
      <path d="M235 88C235 80 243 75 251 77C257 69 271 71 274 80C281 80 286 87 282 94H235Z" />
    </g>

    {/* Big Park Tree (top-right quadrant extending down) */}
    <rect x="304" y="148" width="34" height="122" rx="8" fill="#A16207" stroke={INK} strokeWidth="4" />
    <circle cx="322" cy="112" r="54" fill="#22C55E" stroke={INK} strokeWidth="4.2" />
    <circle cx="282" cy="128" r="36" fill="#4ADE80" stroke={INK} strokeWidth="4" />
    <circle cx="356" cy="126" r="34" fill="#16A34A" stroke={INK} strokeWidth="4" />
    {/* Apples on tree */}
    <circle cx="305" cy="100" r="7" fill="#EF4444" stroke={INK} strokeWidth="2.5" />
    <circle cx="342" cy="118" r="7" fill="#EF4444" stroke={INK} strokeWidth="2.5" />
    <circle cx="286" cy="134" r="6.5" fill="#EF4444" stroke={INK} strokeWidth="2.5" />

    {/* Little Blue Bird flying in top-right */}
    <g transform="translate(232, 134)">
      <ellipse cx="0" cy="0" rx="14" ry="10" fill="#38BDF8" stroke={INK} strokeWidth="3" />
      <path d="M-12 0L-22 -6L-20 5Z" fill="#0284C7" stroke={INK} strokeWidth="2.5" />
      <path d="M12 -2L22 0L12 4Z" fill="#F59E0B" stroke={INK} strokeWidth="2.2" />
      <circle cx="5" cy="-2" r="2.2" fill={INK} />
    </g>

    {/* Rolling Green Hills */}
    <path d="M0 245Q110 205 220 245T400 238V400H0Z" fill="#86EFAC" stroke={INK} strokeWidth="4" />
    <path d="M0 282Q160 250 300 286T400 278V400H0Z" fill="#4ADE80" stroke={INK} strokeWidth="4" />

    {/* Park Path */}
    <path d="M150 400C170 340 220 310 265 270" stroke="#FDE68A" strokeWidth="36" strokeLinecap="round" fill="none" />

    {/* Caillou & Sister playing in bottom-left */}
    <g transform="translate(26, 224) scale(0.76)">
      {/* Simplified vibrant Caillou */}
      <rect x="65" y="148" width="14" height="24" rx="7" fill="#FFD3B0" stroke={INK} strokeWidth="4.5" />
      <rect x="101" y="148" width="14" height="24" rx="7" fill="#FFD3B0" stroke={INK} strokeWidth="4.5" />
      <path d="M58 134H122L126 158H96L90 148L84 158H54Z" fill="#3B82F6" stroke={INK} strokeWidth="4.5" />
      <path d="M58 90H122L126 138H54Z" fill="#FFD43B" stroke={INK} strokeWidth="4.5" />
      <circle cx="90" cy="52" r="38" fill="#FFD3B0" stroke={INK} strokeWidth="4.8" />
      <circle cx="76" cy="49" r="5" fill={INK} />
      <circle cx="104" cy="49" r="5" fill={INK} />
      <path d="M76 64C82 73 98 73 104 64" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </g>

    {/* Red Ball between them */}
    <circle cx="182" cy="348" r="22" fill="#EF4444" stroke={INK} strokeWidth="4" />
    <path d="M168 334C178 340 186 352 192 365" stroke="#FEF08A" strokeWidth="5" strokeLinecap="round" />

    {/* Gray Cat & Flowers in bottom-right */}
    <g transform="translate(236, 250) scale(0.76)">
      <ellipse cx="90" cy="124" rx="38" ry="32" fill="#94A3B8" stroke={INK} strokeWidth="4.8" />
      <ellipse cx="90" cy="130" rx="20" ry="20" fill="#E2E8F0" />
      <path d="M52 54L42 18L76 38Z" fill="#94A3B8" stroke={INK} strokeWidth="4.5" />
      <path d="M128 54L138 18L104 38Z" fill="#94A3B8" stroke={INK} strokeWidth="4.5" />
      <ellipse cx="90" cy="68" rx="40" ry="33" fill="#94A3B8" stroke={INK} strokeWidth="4.8" />
      <circle cx="74" cy="64" r="6" fill="#BEF264" stroke={INK} strokeWidth="3" />
      <circle cx="106" cy="64" r="6" fill="#BEF264" stroke={INK} strokeWidth="3" />
      <circle cx="74" cy="64" r="3" fill={INK} />
      <circle cx="106" cy="64" r="3" fill={INK} />
      <path d="M84 74H96L90 81Z" fill="#FB7185" />
      <path d="M62 98C75 106 105 106 118 98" stroke="#EF4444" strokeWidth="7" strokeLinecap="round" />
    </g>

    {/* Cheerful Park Flowers */}
    {[
      { x: 42, y: 365, c: '#F472B6' },
      { x: 132, y: 374, c: '#FACC15' },
      { x: 245, y: 374, c: '#F472B6' },
      { x: 356, y: 356, c: '#C084FC' },
    ].map((f, i) => (
      <g key={i} transform={`translate(${f.x}, ${f.y})`}>
        <circle cx="-8" cy="0" r="7" fill={f.c} stroke={INK} strokeWidth="2.5" />
        <circle cx="8" cy="0" r="7" fill={f.c} stroke={INK} strokeWidth="2.5" />
        <circle cx="0" cy="-8" r="7" fill={f.c} stroke={INK} strokeWidth="2.5" />
        <circle cx="0" cy="8" r="7" fill={f.c} stroke={INK} strokeWidth="2.5" />
        <circle cx="0" cy="0" r="6" fill="#FDE047" stroke={INK} strokeWidth="2.5" />
      </g>
    ))}
  </g>
);

/* =========================================================
   UI CARTOON ICONS (House, Star)
   ========================================================= */

export const CartoonHouseIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <path
      d="M8 31L32 10L56 31H49V53C49 55 47 57 45 57H19C17 57 15 55 15 53V31H8Z"
      fill="#FFF9E8"
      stroke={INK}
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <path
      d="M5 31L32 8L59 31"
      stroke="#EF4444"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="25" y="36" width="14" height="21" rx="4" fill="#F59E0B" stroke={INK} strokeWidth="3.8" />
    <circle cx="35" cy="47" r="2.2" fill={INK} />
  </svg>
);

export const CartoonStarIcon: React.FC<{ filled?: boolean; className?: string }> = ({
  filled = true,
  className = 'w-8 h-8',
}) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <path
      d="M32 7L39.6 22.4L56.6 24.9L44.3 36.9L47.2 53.8L32 45.8L16.8 53.8L19.7 36.9L7.4 24.9L24.4 22.4L32 7Z"
      fill={filled ? '#FACC15' : '#E2E8F0'}
      stroke={filled ? INK : '#94A3B8'}
      strokeWidth="4"
      strokeLinejoin="round"
    />
    {filled && (
      <path d="M27 24L31 15" stroke="#FEF9C3" strokeWidth="3.5" strokeLinecap="round" />
    )}
  </svg>
);
