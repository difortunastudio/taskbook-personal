interface DifortunaLogoProps {
  className?: string
  size?: number
  variant?: 'full' | 'simple'
}

export default function DifortunaLogo({ className = "", size = 32, variant = 'simple' }: DifortunaLogoProps) {
  if (variant === 'simple') {
    // Versión simple para headers - las iniciales "DF" en un círculo
    return (
      <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <div 
          className="rounded-full border-2 border-current flex items-center justify-center font-bold"
          style={{ width: size, height: size, fontSize: size * 0.35, letterSpacing: '-1px' }}
        >
          DF
        </div>
      </div>
    )
  }

  // Versión completa original
  return (
    <div className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg 
        viewBox="0 0 200 200" 
        width={size} 
        height={size}
        className="text-current"
      >
        {/* Círculo exterior */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        
        {/* Círculo interior */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        
        {/* Texto DIFORTUNA */}
        <text
          x="100"
          y="85"
          textAnchor="middle"
          fontSize="22"
          fontWeight="400"
          letterSpacing="3"
          fill="currentColor"
          fontFamily="serif"
        >
          DIFORTUNA
        </text>
        
        {/* Línea separadora */}
        <line
          x1="65"
          y1="105"
          x2="135"
          y2="105"
          stroke="currentColor"
          strokeWidth="1"
        />
        
        {/* Texto STUDIO */}
        <text
          x="100"
          y="130"
          textAnchor="middle"
          fontSize="16"
          fontWeight="300"
          letterSpacing="2"
          fill="currentColor"
          fontFamily="serif"
        >
          STUDIO
        </text>
      </svg>
    </div>
  )
}
