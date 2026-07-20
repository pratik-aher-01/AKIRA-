'use client'

export function LoadingDots() {
  return (
    <>
      <style>{`
        @keyframes dotBounce {
          0%,60%,100% { transform:translateY(0);    opacity:.3; }
          30%          { transform:translateY(-5px); opacity:1; }
        }
      `}</style>
      <div className="flex items-center gap-1.5 py-0.5">
        {[0,1,2].map(i => (
          <span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-violet-400"
            style={{ animation:`dotBounce 1.2s ease-in-out ${i*0.15}s infinite` }}
          />
        ))}
      </div>
    </>
  )
}