import { useRef, useState } from 'react'

const initialValues = {
  name: '',
  email: '',
  password: '',
  bio: '',
}

const fieldOrder = ['name', 'email', 'password']

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const password = values.password.trim()

  if (!name) {
    errors.name = 'Name is required'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (name.length > 50) {
    errors.name = 'Name must be 50 characters or fewer'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  } else if (!/\d/.test(password)) {
    errors.password = 'Password must contain at least 1 number'
  }

  return errors
}

function SettingsForm() {
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)
  const nameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const validationErrors = validate(values)
  const errors = Object.fromEntries(
    Object.entries(validationErrors).filter(([field]) => submitted || touched[field]),
  )
  const bioIsNearLimit = values.bio.length >= 150

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({
      ...current,
      [name]: name === 'bio' ? value.slice(0, 160) : value,
    }))
    setSaved(false)
  }

  function handleBlur(event) {
    const { name, value } = event.target
    setTouched((current) => ({ ...current, [name]: true }))
    if (name === 'name' || name === 'email' || name === 'password') {
      setValues((current) => ({ ...current, [name]: value.trim() }))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    const currentErrors = validate(values)
    const firstInvalidField = fieldOrder.find((field) => currentErrors[field])

    if (firstInvalidField) {
      const fieldRefs = {
        name: nameRef,
        email: emailRef,
        password: passwordRef,
      }
      fieldRefs[firstInvalidField].current?.focus()
      return
    }

    setValues((current) => ({
      ...current,
      name: current.name.trim(),
      email: current.email.trim(),
      password: current.password.trim(),
      bio: current.bio.trim(),
    }))
    setSaved(true)
  }

  function fieldProps(name) {
    return {
      id: name,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : `${name}-hint`,
    }
  }

  return (
    <section className="settings-card" aria-labelledby="settings-title">
      <div className="settings-heading">
        <span className="settings-eyebrow">YOUR ACCOUNT</span>
        <h1 id="settings-title">Settings</h1>
        <p>Update your personal information and account details.</p>
      </div>

      <form className="settings-form" onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="name">Full name <span aria-hidden="true">*</span></label>
          <input
            {...fieldProps('name')}
            ref={nameRef}
            type="text"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Your full name"
          />
          {errors.name ? (
            <p className="field-message error-message" id="name-error" aria-live="polite">{errors.name}</p>
          ) : (
            <p className="field-message" id="name-hint">Enter your first and last name.</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email address <span aria-hidden="true">*</span></label>
          <input
            {...fieldProps('email')}
            ref={emailRef}
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
          {errors.email ? (
            <p className="field-message error-message" id="email-error" aria-live="polite">{errors.email}</p>
          ) : (
            <p className="field-message" id="email-hint">We’ll use this address for account updates.</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password <span aria-hidden="true">*</span></label>
          <input
            {...fieldProps('password')}
            ref={passwordRef}
            type="password"
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
          />
          {errors.password ? (
            <p className="field-message error-message" id="password-error" aria-live="polite">{errors.password}</p>
          ) : (
            <p className="field-message" id="password-hint">Use at least 8 characters and include a number.</p>
          )}
        </div>

        <div className="form-field">
          <div className="label-row">
            <label htmlFor="bio">Bio</label>
            <span className={`character-count${bioIsNearLimit ? ' near-limit' : ''}`} aria-live="polite">
              {values.bio.length}/160
            </span>
          </div>
          <textarea
            {...fieldProps('bio')}
            maxLength={160}
            rows={4}
            placeholder="A little about yourself"
            aria-describedby="bio-hint bio-counter"
          />
          <p className="field-message" id="bio-hint">Share a short introduction. Maximum 160 characters.</p>
          <span className="visually-hidden" id="bio-counter">{values.bio.length} of 160 characters used.</span>
        </div>

        <button className="save-button" type="submit">Save settings</button>
        <p className="save-message" role="status" aria-live="polite">
          {saved ? 'Settings saved.' : ''}
        </p>
      </form>
    </section>
  )
}

export default SettingsForm
