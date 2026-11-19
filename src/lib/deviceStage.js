import { motionValue } from 'framer-motion'

/*
 * Shared state for the circuit-board layer that sits "inside" the device.
 *
 * Two device stages drive it:
 *   - 'home'    (landing):  scroll down → dive INTO the device → board fills the screen
 *   - 'contact' (contact):  scroll down → board shrinks back OUT into the device screen
 * Between them the board is simply full-screen.
 *
 * Each stage registers its scroll range; only the stage nearest the current
 * scroll position writes the board's opacity/clip, so the two never fight —
 * even after an instant jump (e.g. opening a #link).
 */
export const board = {
  opacity: motionValue(0),
  clip: motionValue('none'),
  active: motionValue(false), // should the board animation run?
}

const stages = new Map() // id -> { start, end } in page scroll px

export function registerStage(id, range) {
  stages.set(id, range)
}

export function unregisterStage(id) {
  stages.delete(id)
}

/** True when stage `id` is the one whose scroll range is closest to `scrollY`. */
export function ownsBoard(id, scrollY) {
  let owner = null
  let best = Infinity
  for (const [sid, { start, end }] of stages) {
    const dist = scrollY < start ? start - scrollY : scrollY > end ? scrollY - end : 0
    if (dist < best) {
      best = dist
      owner = sid
    }
  }
  return owner === id
}
