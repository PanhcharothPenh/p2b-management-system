// One place for branding. Put real files in /public: logo.png, logo-mark.png, favicon.png
import { useState } from 'react';

export default function Logo({ mark = false, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`flex items-center gap-2 font-bold ${className}`}>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-xs text-white">P2B</div>
        {!mark && <span>P2B</span>}
      </div>
    );
  }
  return (
    <img
      src={mark ? '/logo-mark.png' : '/logo.png'}
      alt="P2B"
      className={`h-8 w-auto ${className}`}
      onError={() => setFailed(true)}
    />
  );
}
