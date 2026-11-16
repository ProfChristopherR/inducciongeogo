import React, { useState } from 'react'
import { Terminal, Check, AlertCircle, Copy } from 'lucide-react'

export const PromptEngineeringLab: React.FC = () => {
  const [role, setRole] = useState('Experto en programación de Arduino y robótica escolar')
  const [hardware, setHardware] = useState('Arduino UNO + Sensor Ultrasónico HC-SR04 (Trig=9, Echo=10) + Buzzer o parlante (Pin 11)')
  const [logic, setLogic] = useState('Medir distancia en centímetros. Más de 30 cm: pitido lento. Entre 15 y 30 cm: pitido rápido. Menos de 15 cm: alarma continua.')
  const [constraints, setConstraints] = useState('Usa código C++ claro para Arduino IDE, explica cada parte con comentarios breves y sin pausas largas que traben el sensor.')

  const [copied, setCopied] = useState(false)

  const assembledPrompt = `Actúa como ${role}.
Escribe un programa en C++ para Arduino IDE usando estas piezas: ${hardware}.
Lo que debe hacer el proyecto:
${logic}
Reglas del código:
${constraints}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(assembledPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 max-w-3xl mx-auto">
        <h2 id="c2-st1-title" className="text-3xl font-extrabold tracking-tight text-slate-900">
          ¿Cómo Pedirle Código a la IA sin Errores?
        </h2>
        <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
          Un <strong>prompt</strong> es la instrucción que le escribes a la Inteligencia Artificial. Si le pides las cosas a medias, se equivoca; si le das los datos exactos de tu circuito, el código funciona a la primera.
        </p>
      </div>

      {/* Bad vs Good Prompt */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="apple-glass rounded-3xl border-2 border-red-200 bg-red-50/70 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-red-700">
            <AlertCircle className="size-5 shrink-0" />
            <span>Pedido Incompleto (Falla en la sala):</span>
          </div>
          <div className="rounded-2xl bg-white p-4 font-mono text-sm text-slate-800 border border-red-200 leading-relaxed">
            &ldquo;Hazme un código para Arduino que use un sensor y suene una alarma cuando algo se acerque.&rdquo;
          </div>
          <p className="text-sm text-slate-700 font-medium leading-relaxed">
            <strong>¿Por qué falla?</strong> No le dices en qué pines conectaste los cables. La IA adivina números al azar y cuando cargas el programa, no suena nada.
          </p>
        </div>

        <div className="apple-glass rounded-3xl border-2 border-emerald-200 bg-emerald-50/70 p-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-800">
            <Check className="size-5 shrink-0" />
            <span>Fórmula de 4 Pasos (Funciona de Verdad):</span>
          </div>
          <div className="rounded-2xl bg-white p-4 text-sm text-slate-800 border border-emerald-200 space-y-1.5 font-medium leading-relaxed">
            <div><strong className="text-blue-700">1. Rol:</strong> Quién quieres que sea la IA (experto en Arduino).</div>
            <div><strong className="text-emerald-700">2. Piezas y Pines:</strong> Placa y números exactos donde conectaste todo.</div>
            <div><strong className="text-amber-700">3. Reglas de Distancia:</strong> Qué pasa en cada distancia en cm.</div>
            <div><strong className="text-sky-700">4. Estilo:</strong> Código ordenado y explicado línea por línea.</div>
          </div>
        </div>
      </div>

      {/* Interactive Prompt Generator */}
      <div className="apple-glass rounded-3xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Terminal className="size-5 text-blue-700" />
            Armador de Prompts en Vivo
          </h3>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800 shadow-sm transition-colors"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? '¡Prompt Copiado!' : 'Copiar para enviar a la IA'}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">1. Rol de la IA:</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">2. Placa, Sensor y Pines:</label>
            <input
              type="text"
              value={hardware}
              onChange={(e) => setHardware(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">3. Qué debe pasar según la distancia:</label>
            <input
              type="text"
              value={logic}
              onChange={(e) => setLogic(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">4. Reglas del código:</label>
            <input
              type="text"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Result */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-900 block mb-1.5">
            Prompt Listo para Proyectar y Copiar:
          </span>
          <pre className="font-mono text-sm text-slate-900 whitespace-pre-wrap leading-relaxed font-semibold">
            {assembledPrompt}
          </pre>
        </div>
      </div>
    </div>
  )
}
