import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent } from 'framer-motion'
import { FaArrowRight, FaChevronDown } from 'react-icons/fa6'
import { profile } from '../../data/profile'
import { useTypewriter } from '../../hooks/useTypewriter'
import { useBootSequence } from '../../hooks/useBootSequence'
import { useDeviceForm } from '../../hooks/useDeviceForm'
import Button from '../ui/Button'
import FitText from '../ui/FitText'
import CyberDevice from '../home/CyberDevice'
import BootScreen from '../home/BootScreen'
import ElectricLogo from '../home/ElectricLogo'
import CityStreet from '../home/CityStreet'
import { useDeviceZoom } from '../../hooks/useDeviceZoom'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const rise = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const LAYOUT = {
  tablet: {
    wrap: 'grid w-full grid-cols-[1.5fr_1fr] items-center gap-10 px-10 py-10 xl:px-16 short:py-6',
    logo: 'w-full max-w-[22rem] short:max-w-[16rem]',
    nameMax: [110, 84], // px caps for first / last name lines
    tagline: 'text-base',
  },
  phone: {
    wrap: 'flex w-full flex-col gap-7 px-5 py-8 shorter:gap-4 shorter:py-5',
    logo: 'w-full max-w-[11rem] shorter:max-w-[7rem]',
    nameMax: [56, 44],
    tagline: 'text-sm',
  },
}

function HomeScreen({ variant }) {
  const role = useTypewriter(profile.roles)
  const phone = variant === 'phone'
  const l = LAYOUT[variant]

  const visual = (
    <motion.div
      className={`flex flex-col items-center ${phone ? 'order-first' : ''}`}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className={l.logo}>
        <ElectricLogo />
      </div>
    </motion.div>
  )

  return (
    <div className={l.wrap}>
      <motion.div className="min-w-0" variants={stagger} initial="hidden" animate="show">
        <motion.p
          variants={rise}
          className="cyber-clip mb-4 inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-4 py-1 font-display text-[0.6rem] tracking-[0.3em] text-accent-soft uppercase [--cut-tl:8px] [--cut-br:8px]"
        >
          <span className="h-1.5 w-1.5 animate-pulse bg-accent shadow-[0_0_8px_var(--color-accent)]" />
          Available for opportunities
        </motion.p>
        <motion.p variants={rise} className="font-mono text-sm tracking-[0.3em] text-muted uppercase">
          <span className="text-primary">&gt;</span> Hello, I&apos;m
        </motion.p>

        {/* Name: each line auto-sizes to fill the screen width */}
        <motion.h1
          variants={rise}
          className="relative mt-2 font-display leading-[1.08] font-black tracking-wide uppercase drop-shadow-[0_0_25px_rgb(0_240_255/0.28)]"
        >
          <span className="block">
            <FitText max={l.nameMax[0]} className="text-gradient">
              {profile.firstName}
            </FitText>
          </span>
          <span className="block">
            <FitText max={l.nameMax[1]} className="text-chrome">
              {profile.lastName}
            </FitText>
          </span>
        </motion.h1>

        <motion.p variants={rise} className="mt-4 h-8 font-mono text-lg text-fg sm:text-xl">
          {/* aria-label isn't allowed on a <p>; screen readers get the full role list as text instead */}
          <span className="sr-only">{profile.roles.join(', ')}</span>
          <span aria-hidden="true">
            <span className="text-primary">&gt; </span>
            {role}
            <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-accent align-middle text-transparent">|</span>
          </span>
        </motion.p>
        <motion.p variants={rise} className={`mt-4 max-w-2xl leading-relaxed text-muted ${l.tagline}`}>
          {profile.tagline}
        </motion.p>
        <motion.div variants={rise} className={`mt-7 flex flex-wrap gap-4 ${phone ? '[&>*]:flex-1' : ''}`}>
          <Button as="a" href="#projects">
            View Projects <FaArrowRight />
          </Button>
          <Button as="a" href="#contact" variant="outline">
            Contact Me
          </Button>
        </motion.div>
      </motion.div>

      {visual}
    </div>
  )
}

export default function Home() {
  const { progress, done, finish } = useBootSequence()
  const variant = useDeviceForm()
  const zoom = useDeviceZoom(variant, { id: 'home', mode: 'in' })
  const { sectionRef, stickyRef, zoomRef, screenRef } = zoom.refs
  const mv = zoom.motion
  // once the screen content fades out during the dive, it must not be clickable / focusable
  const [interactive, setInteractive] = useState(true)
  useEffect(() => setInteractive(mv.contentOpacity.get() > 0.95), [mv.contentOpacity])
  useMotionValueEvent(mv.contentOpacity, 'change', (v) => setInteractive(v > 0.95))
  // the city's lights (and the android's visor) power up with the boot sequence
  const cityPower = done ? 1 : 0.1 + 0.9 * progress

  return (
    <section id="home" ref={sectionRef} className="relative z-0">
      {/* Pinned stage — stays on screen while the extra scroll distance below drives the zoom */}
      <div ref={stickyRef} className="sticky overflow-hidden" style={{ top: zoom.stickyTop }}>
        {/* futuristic city street — an android meets people and robots; click to make it wave */}
        <div className="absolute inset-0">
          <CityStreet power={cityPower} active={zoom.backgroundActive} />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(10_15_13/0.15),rgb(10_15_13/0.65)_75%)]"
          aria-hidden="true"
        />

        <div className="relative flex min-h-svh items-center pt-20 pb-12 sm:pt-24 short:pt-[4.5rem] short:pb-6">
          <div className={`relative mx-auto w-full ${variant === 'phone' ? 'px-4' : 'max-w-[80rem] px-6 sm:px-12'}`}>
            {/* zoom wrapper: scales toward the screen centre as you scroll */}
            <motion.div ref={zoomRef} className="relative will-change-transform" style={{ x: mv.x, y: mv.y, scale: mv.scale }}>
              <CyberDevice variant={variant} online={done} screenRef={screenRef} contentOpacity={mv.contentOpacity} interactive={interactive}>
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.div
                      key="ready"
                      className="relative flex w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* flash as the OS hands over to the home screen */}
                      <motion.div
                        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-primary/40 via-accent/30 to-transparent"
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        aria-hidden="true"
                      />
                      <HomeScreen variant={variant} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="boot"
                      className="flex w-full"
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.4 }}
                    >
                      <BootScreen progress={progress} onSkip={finish} variant={variant} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CyberDevice>
            </motion.div>
          </div>
        </div>

        {done && (
          <motion.a
            href="#about"
            aria-label="Scroll to About section"
            className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-primary/70 transition hover:text-accent-soft ${interactive ? '' : 'pointer-events-none'}`}
            style={{ opacity: mv.contentOpacity }}
            tabIndex={interactive ? undefined : -1}
          >
            <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <FaChevronDown size={22} className="animate-float" />
            </motion.span>
          </motion.a>
        )}
      </div>

      {/* scroll distance that drives the dive-in */}
      <div className="h-[110svh]" aria-hidden="true" />
    </section>
  )
}
