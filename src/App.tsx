import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePlatformStore, initGlobalTimer } from './store/usePlatformStore'
import { TRACKS } from './tracks/registry'
import { TrackPicker } from './components/home/TrackPicker'
import { EducationalHeader } from './components/shared/EducationalHeader'
import { StationNavigator } from './components/shared/StationNavigator'
import { PremilitarModal } from './components/shared/PremilitarModal'

export default function App() {
  const {
    activeTrack,
    activeClass,
    stationIndex,
    isPremilitarModalOpen,
    setPremilitarModal
  } = usePlatformStore()

  useEffect(() => {
    initGlobalTimer()
  }, [])

  if (!activeTrack) {
    return (
      <div className="min-h-screen apple-ambient-bg text-slate-900 font-sans selection:bg-blue-600/15 selection:text-blue-900 relative overflow-x-hidden">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-36 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-[110px]" />
          <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-[130px]" />
          <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-sky-500/8 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <TrackPicker />
        </div>

        <PremilitarModal
          isOpen={isPremilitarModalOpen}
          onClose={() => setPremilitarModal(false)}
        />
      </div>
    )
  }

  const track = TRACKS[activeTrack]
  const currentClass = track.classes.find((c) => c.id === activeClass) ?? track.classes[0]
  const stations = currentClass.stations
  const currentStation = stations[stationIndex] ?? stations[0]
  const StationComponent = currentStation.Component
  const stationNames = stations.map((s) => s.title)

  return (
    <div className="min-h-screen apple-ambient-bg text-slate-900 flex flex-col font-sans selection:bg-blue-600/15 selection:text-blue-900 relative overflow-x-hidden">
      {/* Subtle Ambient Light Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className={`absolute -top-36 left-1/4 h-96 w-96 rounded-full blur-[110px] ${
            activeTrack === 'octavo' ? 'bg-emerald-500/10' : 'bg-indigo-500/12'
          }`}
        />
        <div className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-500/8 blur-[130px]" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-sky-500/8 blur-[120px]" />
      </div>

      {/* Apple Glassmorphic Top Header & Progress Ribbon */}
      <EducationalHeader
        trackId={activeTrack}
        currentStationTitle={currentStation.title}
        currentStationNumber={stationIndex + 1}
        totalStations={stations.length}
        minuteRange={currentStation.minutes}
      />

      {/* Main Educational Screen (1 Station at a time) */}
      <main className="relative z-10 flex-1 pb-28 pt-2">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTrack}-${activeClass}-${currentStation.id}`}
              initial={{ opacity: 0, y: 12, scale: 0.992, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, scale: 0.992, filter: 'blur(5px)' }}
              transition={{ duration: 0.32, ease: [0.23, 1, 0.32, 1] }}
            >
              <StationComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom Floating Glass Dock Navigator */}
      <StationNavigator
        trackId={activeTrack}
        stationIndex={stationIndex}
        totalStations={stations.length}
        stationNames={stationNames}
      />

      {/* Liceo San Nicolás Premilitar Project Showcase Modal */}
      <PremilitarModal
        isOpen={isPremilitarModalOpen}
        onClose={() => setPremilitarModal(false)}
      />
    </div>
  )
}
