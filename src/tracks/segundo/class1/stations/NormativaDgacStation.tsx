import React from 'react'
import { DgacBriefing } from '../../components/DgacBriefing'

export const NormativaDgacStation: React.FC = () => {
  return (
    <section aria-labelledby="seg-st5-title">
      <div id="seg-st5-title">
        <DgacBriefing showChecklist={false} />
      </div>
    </section>
  )
}
