import React from 'react'

export default function About() {
  return (
    <div className="wrap section">
      <span className="eyebrow">The studio</span>
      <h1 className="h-display" style={{ fontSize: 'clamp(32px, 4vw, 52px)', maxWidth: '16ch', marginTop: 10 }}>
        We design for the workshop, not the warehouse.
      </h1>
      <p className="pdp-desc" style={{ marginTop: 24 }}>
        CasaNova partners with eleven independent workshops across three regions. Each one specializes
        in a single material — oak, brass, wool, or clay — and every piece in the catalog passes
        through their hands rather than a factory line. We keep batches small on purpose: it's the
        only way the joinery stays visible and the finishes stay honest.
      </p>
      <p className="pdp-desc" style={{ marginTop: 16 }}>
        Most pieces are made after you order them, which is why lead times run two to four weeks.
        We think that's a fair trade for furniture that's built to be repaired rather than replaced.
      </p>
    </div>
  )
}
