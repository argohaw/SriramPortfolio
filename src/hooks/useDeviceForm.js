import { useSyncExternalStore } from 'react'

// Portrait screens (phones, portrait tablets, narrow windows) get the phone device.
// Phones held sideways (short + touch) also count as phones.
const PHONE_QUERY = '(orientation: portrait), (max-height: 500px) and (pointer: coarse)'

const subscribe = (callback) => {
  const mq = window.matchMedia(PHONE_QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

/** Returns 'phone' or 'tablet' and updates live on rotate / resize. */
export function useDeviceForm() {
  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(PHONE_QUERY).matches ? 'phone' : 'tablet'),
    () => 'tablet',
  )
}
