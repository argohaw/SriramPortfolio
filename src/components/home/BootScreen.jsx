import { motion } from 'framer-motion'
import { FaForward } from 'react-icons/fa6'
import ElectricLogo from './ElectricLogo'

const BOOT_STEPS = [
  { at: 0.03, text: 'Powering cryogenic chamber', status: '15 mK' },
  { at: 0.16, text: 'Initializing qubit lattice', status: '9 QB' },
  { at: 0.32, text: 'Entangling quantum states', status: 'OK' },
  { at: 0.48, text: 'Calibrating error correction', status: '99.97%' },
  { at: 0.64, text: 'Charging S-core plasma field', status: '9.8 kV' },
  { at: 0.8, text: 'Decrypting SRIRAMASIVAM.profile', status: 'OK' },
  { at: 0.97, text: 'Quantum engine online', status: 'READY' },
]

const LAYOUT = {
  tablet: {
    wrap: 'grid w-full grid-cols-[1fr_1.15fr] items-center gap-12 px-10 py-10 short:gap-8 short:py-6',
    logo: 'mx-auto w-full max-w-[24rem] short:max-w-[17rem]',
    title: 'text-3xl xl:text-4xl',
    log: 'min-h-[11rem] text-sm',
  },
  phone: {
    wrap: 'flex w-full flex-col justify-center gap-6 px-5 py-8 shorter:gap-4 shorter:py-5',
    logo: 'mx-auto w-full max-w-[12.5rem] shorter:max-w-[8rem]',
    title: 'text-xl',
    log: 'min-h-[10.5rem] text-[0.7rem]',
  },
}

export default function BootScreen({ progress, onSkip, variant = 'tablet' }) {
  const pct = Math.round(progress * 100)
  const steps = BOOT_STEPS.filter((s) => progress >= s.at)
  const current = steps[steps.length - 1]?.text ?? 'Establishing power link'
  const l = LAYOUT[variant]

  return (
    <div className={l.wrap}>
      <div className={l.logo}>
        <ElectricLogo progress={progress} />
      </div>

      <div className="font-mono">
        <p className="font-display text-[0.65rem] tracking-[0.4em] text-accent-soft uppercase">System boot sequence</p>
        <h2 className={`text-gradient mt-2 font-display font-bold ${l.title}`}>Quantum Processor Engine</h2>
        <p className="mt-1 text-xs tracking-wider text-muted">SR-QPU · 9-qubit lattice · NX-7 OS</p>

        <ul className={`mt-5 space-y-1.5 ${l.log}`} aria-hidden="true">
          {steps.map((step) => (
            <motion.li
              key={step.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="flex justify-between gap-3"
            >
              <span className="truncate text-fg">
                <span className="text-primary">&gt;</span> {step.text}
              </span>
              <span className={`shrink-0 ${step.status === 'READY' ? 'text-primary' : 'text-accent-soft'}`}>[{step.status}]</span>
            </motion.li>
          ))}
          {progress < 1 && <li className="animate-pulse text-accent-soft">_</li>}
        </ul>

        <div className="mt-5">
          <div className="mb-2 flex items-end justify-between gap-4 text-xs">
            <span className="truncate text-muted">{current}…</span>
            <span className="font-display text-xl font-bold text-primary tabular-nums">{String(pct).padStart(3, '0')}%</span>
          </div>
          <div
            className="cyber-clip relative h-2.5 overflow-hidden border border-primary/30 bg-surface [--cut-tl:6px] [--cut-br:6px]"
            role="progressbar"
            aria-label="Loading portfolio"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
          >
            <div
              className="neon-bg h-full shadow-[0_0_12px_var(--color-accent)] transition-[width] duration-150 ease-linear"
              style={{ width: `${pct}%` }}
            />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0_10px,rgb(10_15_13/0.9)_10px_12px)]" />
          </div>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="cyber-clip mt-6 inline-flex items-center gap-2 border border-fg/25 px-4 py-2 font-display text-[0.65rem] tracking-[0.25em] text-muted uppercase transition [--cut-tl:8px] [--cut-br:8px] hover:border-accent hover:bg-accent/10 hover:text-fg"
        >
          Skip boot <FaForward size={10} />
        </button>
      </div>
    </div>
  )
}
