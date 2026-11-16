import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Radio, Volume2, VolumeX, Copy, Check, UserCheck } from 'lucide-react'

const ARDUINO_CPP_CODE = `/*
 * PROYECTO: RADAR ULTRASÓNICO DE PROXIMIDAD
 * Piezas: Arduino UNO + Sensor HC-SR04 + Buzzer (Parlante)
 * Especialidad Geogo - Liceo Bicentenario San Nicolás
 */

const int TRIG_PIN = 9;    // Emite el pulso de sonido
const int ECHO_PIN = 10;   // Escucha el eco que rebota
const int BUZZER_PIN = 11; // Parlante de alerta

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  Serial.begin(9600); // Envía datos al computador por USB
}

void loop() {
  // 1. Lanzar pulso ultrasónico muy corto
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // 2. Medir cuánto tardó el eco en volver
  long duration = pulseIn(ECHO_PIN, HIGH);

  // 3. Pasar tiempo a centímetros (velocidad del sonido)
  int distanceCm = duration * 0.0343 / 2;

  Serial.print("Distancia: ");
  Serial.print(distanceCm);
  Serial.println(" cm");

  // 4. Sonar distinto según qué tan cerca esté tu mano
  if (distanceCm < 15 && distanceCm > 0) {
    tone(BUZZER_PIN, 1800); // Peligro: alarma continua
  } else if (distanceCm <= 30) {
    tone(BUZZER_PIN, 1200, 80); // Precaución: pitido rápido
    delay(120);
  } else if (distanceCm <= 60) {
    tone(BUZZER_PIN, 800, 100); // Rastreo: pitido calmado
    delay(400);
  } else {
    noTone(BUZZER_PIN); // Despejado: silencio
  }

  delay(60);
}`

export const AiRadarLab: React.FC = () => {
  const [distance, setDistance] = useState<number>(45)
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false)
  const [codeCopied, setCodeCopied] = useState<boolean>(false)
  const [isSimulatingHand, setIsSimulatingHand] = useState<boolean>(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const sweepAngleRef = useRef<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      audioCtxRef.current = new AudioCtx()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const playBeep = useCallback((freq: number, durationMs: number) => {
    if (isAudioMuted) return
    try {
      const ctx = getAudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + durationMs / 1000)
    } catch {
      // Audio not available
    }
  }, [isAudioMuted])

  const simulateVolunteerHand = () => {
    if (isSimulatingHand) return
    setIsSimulatingHand(true)
    let currentD = 80
    const interval = setInterval(() => {
      currentD -= 3
      if (currentD <= 8) {
        clearInterval(interval)
        setTimeout(() => {
          setIsSimulatingHand(false)
        }, 1200)
      }
      setDistance(Math.max(8, currentD))
    }, 120)
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (distance < 15) {
      interval = setInterval(() => playBeep(1800, 80), 100)
    } else if (distance <= 30) {
      interval = setInterval(() => playBeep(1200, 100), 250)
    } else if (distance <= 60) {
      interval = setInterval(() => playBeep(800, 120), 600)
    }
    return () => clearInterval(interval)
  }, [distance, playBeep])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number

    const render = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height - 20
      const maxRadius = height - 40

      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = '#cbd5e1'
      ctx.lineWidth = 1.5

      for (let r = 0.25; r <= 1; r += 0.25) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, maxRadius * r, Math.PI, 0)
        ctx.stroke()
      }

      const angles = [Math.PI * 0.15, Math.PI * 0.3, Math.PI * 0.5, Math.PI * 0.7, Math.PI * 0.85]
      angles.forEach((ang) => {
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(centerX + Math.cos(ang) * maxRadius, centerY - Math.sin(ang) * maxRadius)
        ctx.stroke()
      })

      sweepAngleRef.current += 0.03
      if (sweepAngleRef.current > Math.PI) {
        sweepAngleRef.current = 0
      }

      const beamAngle = Math.PI - sweepAngleRef.current
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, maxRadius, beamAngle - 0.25, beamAngle)
      ctx.lineTo(centerX, centerY)
      ctx.fillStyle = 'rgba(2, 132, 199, 0.15)'
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + Math.cos(beamAngle) * maxRadius, centerY - Math.sin(beamAngle) * maxRadius)
      ctx.strokeStyle = '#0284c7'
      ctx.lineWidth = 3
      ctx.stroke()
      ctx.restore()

      const normDist = Math.min(1, Math.max(0.08, distance / 100))
      const targetRadius = maxRadius * normDist
      const targetAngle = Math.PI * 0.5

      const targetX = centerX + Math.cos(targetAngle) * targetRadius
      const targetY = centerY - Math.sin(targetAngle) * targetRadius

      ctx.save()
      ctx.beginPath()
      ctx.arc(targetX, targetY, distance < 15 ? 14 : 10, 0, Math.PI * 2)
      ctx.fillStyle = distance < 15 ? '#ef4444' : distance <= 30 ? '#f59e0b' : '#10b981'
      ctx.shadowColor = ctx.fillStyle
      ctx.shadowBlur = 10
      ctx.fill()
      ctx.restore()

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animationId)
  }, [distance])

  const copyCode = () => {
    navigator.clipboard.writeText(ARDUINO_CPP_CODE)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="c2-st2-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Radar Ultrasónico en Vivo con Arduino e IA
          </h2>
          <p className="text-sm sm:text-base font-medium text-slate-700 mt-1 max-w-3xl leading-relaxed">
            Cargamos el código en el Arduino y un voluntario acerca la mano al <strong>sensor HC-SR04</strong> (que mide distancias usando sonido invisible, igual que un murciélago) para escuchar la alarma.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50 shadow-xs"
          >
            {isAudioMuted ? <VolumeX className="size-4 text-red-600" /> : <Volume2 className="size-4 text-emerald-600" />}
            {isAudioMuted ? 'Audio Silenciado' : 'Audio Activo'}
          </button>
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 rounded-2xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 shadow-sm transition-colors"
          >
            {codeCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {codeCopied ? '¡Código Copiado!' : 'Copiar C++ para Arduino'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Radar Screen Visualizer (7 cols) */}
        <div className="lg:col-span-7 apple-glass flex flex-col justify-between rounded-3xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
            <div className="flex items-center gap-2">
              <Radio className="size-5 text-blue-700" />
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Pantalla del Radar en Tiempo Real
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-slate-600">DISTANCIA:</span>
              <span
                className={`font-mono text-base font-black px-3.5 py-1 rounded-xl ${
                  distance < 15
                    ? 'bg-red-100 text-red-700 border border-red-300 animate-pulse'
                    : distance <= 30
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {distance.toFixed(0)} cm
              </span>
            </div>
          </div>

          {/* Canvas Radar */}
          <div className="relative flex justify-center py-2 bg-white/80 rounded-2xl border border-slate-200">
            <canvas
              ref={canvasRef}
              width={480}
              height={220}
              className="w-full max-w-md h-auto"
            />
          </div>

          {/* Interactive Distance Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold">
              <span className="text-slate-800">Mueve para simular la mano del voluntario:</span>
              <button
                onClick={simulateVolunteerHand}
                disabled={isSimulatingHand}
                className="flex items-center gap-1.5 rounded-xl bg-blue-100 border border-blue-300 px-3.5 py-1.5 text-sm font-bold text-blue-900 hover:bg-blue-200 transition-colors"
              >
                <UserCheck className="size-4" />
                {isSimulatingHand ? 'Acercando mano...' : 'Simular en Sala'}
              </button>
            </div>

            <input
              type="range"
              min={5}
              max={100}
              step={1}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full cursor-pointer"
            />

            <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-bold">
              <div className={`p-2.5 rounded-xl border ${distance < 15 ? 'bg-red-100 border-red-300 text-red-900' : 'bg-white/70 border-slate-200 text-slate-600'}`}>
                &lt; 15 cm: Alarma
              </div>
              <div className={`p-2.5 rounded-xl border ${distance >= 15 && distance <= 30 ? 'bg-amber-100 border-amber-300 text-amber-900' : 'bg-white/70 border-slate-200 text-slate-600'}`}>
                15–30 cm: Cuidado
              </div>
              <div className={`p-2.5 rounded-xl border ${distance > 30 ? 'bg-emerald-100 border-emerald-300 text-emerald-900' : 'bg-white/70 border-slate-200 text-slate-600'}`}>
                &gt; 30 cm: Libre
              </div>
            </div>
          </div>
        </div>

        {/* Arduino C++ Code Walkthrough (5 cols) */}
        <div className="lg:col-span-5 apple-glass flex flex-col justify-between rounded-3xl p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                Código C++ para Arduino IDE
              </span>
              <span className="text-xs sm:text-sm font-bold text-blue-700">1° y 2° Medio</span>
            </div>

            <div className="mt-3 max-h-[290px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs sm:text-sm text-emerald-400 leading-relaxed">
              <pre>{ARDUINO_CPP_CODE}</pre>
            </div>
          </div>

          <div className="rounded-2xl bg-blue-50/90 p-4 border border-blue-200 text-sm text-slate-800 leading-relaxed font-medium">
            <strong className="text-blue-950 font-bold block mb-1">¿Cómo calcula la distancia?</strong>
            El sensor lanza un sonido que no oímos, cuenta los microsegundos que tarda en chocar y volver, y lo multiplica por la velocidad del sonido dividida en 2 (ida y vuelta).
          </div>
        </div>
      </div>
    </div>
  )
}
