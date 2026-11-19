import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { AnimatePresence, motion, useMotionValueEvent } from 'framer-motion'
import { FaCircleCheck, FaCircleExclamation, FaEnvelope, FaLocationDot, FaPaperPlane } from 'react-icons/fa6'
import { profile } from '../../data/profile'
import Button from '../ui/Button'
import SocialLinks from '../ui/SocialLinks'
import ResumeMenu from '../ui/ResumeMenu'
import CyberDevice from '../home/CyberDevice'
import CityStreet from '../home/CityStreet'
import Footer from '../layout/Footer'
import { useDeviceForm } from '../../hooks/useDeviceForm'
import { useDeviceZoom } from '../../hooks/useDeviceZoom'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const initial = { name: '', email: '', message: '' }

function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Please enter your name.'
  if (!email.trim()) errors.email = 'Please enter your email.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.'
  if (!message.trim()) errors.message = 'Please write a message.'
  else if (message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

function Field({ id, label, error, as: Tag = 'input', className = '', ...props }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-display text-[0.7rem] tracking-[0.25em] text-muted uppercase">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-canvas/60 px-4 py-3 text-fg placeholder:text-muted/50 transition outline-none focus:border-accent focus:shadow-[0_0_18px_rgb(0_240_255/0.35)] ${
          error ? 'border-red-500/70' : 'border-fg/20'
        } ${className}`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [feedback, setFeedback] = useState('')

  const variant = useDeviceForm()
  const phone = variant === 'phone'
  // scrolling in: the circuit board shrinks back into this device's screen ("out" = reverse of the landing dive)
  const zoom = useDeviceZoom(variant, { id: 'contact', mode: 'out', snap: true })
  const { sectionRef, stickyRef, zoomRef, screenRef } = zoom.refs
  const mv = zoom.motion
  // only let people scroll / click inside the screen once its content has fully faded in
  const [interactive, setInteractive] = useState(false)
  useEffect(() => setInteractive(mv.contentOpacity.get() > 0.95), [mv.contentOpacity])
  useMotionValueEvent(mv.contentOpacity, 'change', (v) => setInteractive(v > 0.95))

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setStatus('error')
      setFeedback('Email service is not configured yet. Please reach out via email directly.')
      return
    }

    setStatus('sending')
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { from_name: form.name.trim(), from_email: form.email.trim(), reply_to: form.email.trim(), message: form.message.trim() },
        { publicKey: PUBLIC_KEY },
      )
      setStatus('success')
      setFeedback("Thanks! Your message has been sent — I'll get back to you soon.")
      setForm(initial)
    } catch {
      setStatus('error')
      setFeedback('Something went wrong while sending. Please try again or email me directly.')
    }
  }

  return (
    <section ref={sectionRef} className="relative z-[1]" aria-labelledby="contact-title">
      {/* "#contact" target sits at the END of the zoom-out, so nav links land with the form fully visible */}
      <span id="contact" className="pointer-events-none absolute inset-x-0 bottom-0 h-svh -scroll-mt-20" aria-hidden="true" />

      {/* Pinned stage: city street around the device, contact content on its screen */}
      <div ref={stickyRef} className="sticky overflow-hidden" style={{ top: zoom.stickyTop }}>
        <div className="absolute inset-0">
          <CityStreet active={zoom.backgroundActive} />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(10_15_13/0.15),rgb(10_15_13/0.65)_75%)]"
          aria-hidden="true"
        />

        {/* the footer lives inside this scene, so the page ends exactly where the form is fully visible */}
        <div className={`relative flex min-h-svh flex-col ${phone ? 'pt-20' : 'pt-24 short:pt-[4.5rem]'}`}>
          <div className="flex flex-1 items-center pb-3">
            <div className={`relative mx-auto w-full ${phone ? 'px-4' : 'max-w-[80rem] px-6 sm:px-12'}`}>
              <motion.div ref={zoomRef} className="relative will-change-transform" style={{ x: mv.x, y: mv.y, scale: mv.scale }}>
                <CyberDevice variant={variant} online screenRef={screenRef} contentOpacity={mv.contentOpacity} fit interactive={interactive}>
                  <div className={`w-full ${phone ? 'px-5 py-6' : 'px-10 py-8 xl:px-14 short:py-5'}`}>
                    <p className="font-mono text-xs tracking-[0.35em] text-accent-soft uppercase">
                      <span className="text-primary">&gt;</span> Get in touch
                    </p>
                    <h2 id="contact-title" className="text-gradient mt-1 font-display text-3xl font-bold tracking-wide sm:text-4xl">
                      Contact
                    </h2>
                    <div className={`mt-6 short:mt-4 ${phone ? 'flex flex-col gap-10' : 'grid grid-cols-2 gap-10 xl:gap-14'}`}>
                      <div className="flex flex-col">
                        <h3 className="font-display text-2xl leading-snug font-bold text-fg sm:text-3xl">
                          Let&apos;s build something <span className="text-gradient">extraordinary</span> together.
                        </h3>
                        <p className="mt-5 leading-relaxed text-fg short:mt-3">
                          Thanks for stopping by! Whether you have an exciting opportunity, a project idea, or just want to say hi, my
                          inbox is always open. Drop a message and I&apos;ll get back to you as soon as I can.
                        </p>
                        <ul className="mt-8 space-y-4 text-sm short:mt-5 short:space-y-3">
                          <li className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
                              <FaEnvelope />
                            </span>
                            <a href={`mailto:${profile.email}`} className="text-fg transition hover:text-accent-soft">
                              {profile.email}
                            </a>
                          </li>
                          <li className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
                              <FaLocationDot />
                            </span>
                            <span className="text-fg">{profile.location}</span>
                          </li>
                        </ul>
                        {/* opens upwards: the screen clips anything that overflows its bottom edge */}
                        <ResumeMenu align="left" placement="top" label="Download Resume" inline={phone} className="mt-8 self-start short:mt-5" />
                        <SocialLinks className="mt-8 md:mt-auto md:pt-8 short:mt-5 short:md:pt-5" />
                      </div>

                      <form onSubmit={onSubmit} noValidate className="space-y-5">
                        <Field id="name" label="Name" placeholder="Your name" autoComplete="name" value={form.name} onChange={onChange} error={errors.name} />
                        <Field
                          id="email"
                          label="Email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={form.email}
                          onChange={onChange}
                          error={errors.email}
                        />
                        <Field
                          id="message"
                          label="Message"
                          as="textarea"
                          rows={5}
                          placeholder="Tell me about your project or idea..."
                          value={form.message}
                          onChange={onChange}
                          error={errors.message}
                          className="resize-none short:h-28"
                        />
                        <Button type="submit" className="w-full" disabled={status === 'sending'}>
                          {status === 'sending' ? (
                            <>
                              <span className="h-4 w-4 animate-spin rounded-full border-2 border-canvas border-t-transparent" /> Sending...
                            </>
                          ) : (
                            <>
                              Send Message <FaPaperPlane />
                            </>
                          )}
                        </Button>

                        <div aria-live="polite">
                          <AnimatePresence>
                            {(status === 'success' || status === 'error') && (
                              <motion.p
                                key={status + feedback}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                                  status === 'success'
                                    ? 'border-primary/50 bg-primary/10 text-primary'
                                    : 'border-red-500/50 bg-red-500/10 text-red-300'
                                }`}
                              >
                                {status === 'success' ? <FaCircleCheck className="mt-0.5 shrink-0" /> : <FaCircleExclamation className="mt-0.5 shrink-0" />}
                                {feedback}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </form>
                    </div>
                  </div>
                </CyberDevice>
              </motion.div>
            </div>
          </div>
          <Footer compact />
        </div>
      </div>

      {/* scroll distance that drives the zoom-out */}
      <div className="h-[110svh]" aria-hidden="true" />
    </section>
  )
}
