import { useState } from 'react'
import { motion, useMotionValueEvent } from 'framer-motion'
import CircuitBoard from './CircuitBoard'
import { board } from '../../lib/deviceStage'

/**
 * The single, fixed circuit-board layer — "inside the device". Its opacity and
 * clip-path are driven by whichever device stage (landing / contact) is nearest.
 * Stacking: above the landing and contact stages, below every other section.
 */
export default function CircuitLayer() {
  const [active, setActive] = useState(board.active.get())
  useMotionValueEvent(board.active, 'change', setActive)

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ opacity: board.opacity, clipPath: board.clip }}
      aria-hidden="true"
    >
      <CircuitBoard active={active} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(10_15_13/0.2),rgb(10_15_13/0.62))]" />
    </motion.div>
  )
}
