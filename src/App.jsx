import { useState } from 'react'
import './App.css'

const initialSettings = {
  name: 'Olivia Rhye',
  email: 'olivia@untitledui.com',
  username: 'olivia.rhye',
  timezone: 'America/Los_Angeles',
  productUpdates: true,
  securityAlerts: true,
}

const fields = [
  { name: 'name', label: 'Full name', hint: 'Your name as it appears on your profile.' },
  { name: 'email', label: 'Email address', hint: 'We’ll send account updates to this address.' },
  { name: 'username', label: 'Username', hint: 'Your unique username for your account.' },
]

function validate(values) {
  const errors = {}
  const name = values.name.trim()
  const email = values.email.trim()
  const username = values.username.trim()

  if (name.length < 2) errors.name = 'Please enter at least 2 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address, like name@example.com.'
  }
  if (!/^[a-zA-Z0-9._-]{3,20}$/.test(username)) {
    errors.username = 'Use 3–20 letters, numbers, dots, underscores, or hyphens.'
  }

  return errors
}

function Icon({ name, size = 18 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1-.1 1.8Z" transform="translate(-1 -1)" /></>,
    help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9a2.5 2.5 0 1 1 4.7 1.2c-.8 1-2.3 1.3-2.3 2.8M12 16.5h.01" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5M12 3v12" /></>,
  }

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  )
}

function App() {
  const [settings, setSettings] = useState(initialSettings)
  const [savedSettings, setSavedSettings] = useState(initialSettings)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [saved, setSaved] = useState(false)
  const errors = validate(settings)

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setSettings((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setSaved(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)

    if (Object.keys(errors).length > 0) {
      const firstInvalidField = fields.find(({ name }) => errors[name])
      document.getElementById(firstInvalidField.name)?.focus()
      return
    }

    setSavedSettings(settings)
    setSaved(true)
    setTouched({})
    setSubmitted(false)
  }

  function handleReset() {
    setSettings(savedSettings)
    setTouched({})
    setSubmitted(false)
    setSaved(false)
  }

  function fieldError(name) {
    return (submitted || touched[name]) && errors[name]
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home" aria-label="Layers home">
          <span className="brand-mark"><span /><span /><span /></span>
          <span>layers</span>
        </a>

        <div className="workspace-switcher">
          <div className="workspace-avatar">L</div>
          <div className="workspace-copy">
            <span className="workspace-label">WORKSPACE</span>
            <strong>Layers, Inc.</strong>
          </div>
          <span className="switcher-caret">⌄</span>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-heading">MENU</span>
          <a href="#overview" className="nav-link"><Icon name="grid" /> Overview</a>
          <a href="#analytics" className="nav-link"><Icon name="chart" /> Analytics</a>
          <a href="#team" className="nav-link"><Icon name="users" /> Team</a>
          <span className="nav-heading nav-heading-spaced">PREFERENCES</span>
          <a href="#settings" className="nav-link active" aria-current="page"><Icon name="settings" /> Settings</a>
        </nav>

        <div className="sidebar-bottom">
          <a href="#help" className="nav-link"><Icon name="help" /> Help & support</a>
          <div className="sidebar-profile">
            <div className="profile-avatar">OR</div>
            <div className="sidebar-profile-copy">
              <strong>Olivia Rhye</strong>
              <span>olivia@untitledui.com</span>
            </div>
            <button className="more-button" type="button" aria-label="More account options">···</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><Icon name="chevron" size={14} /><strong>Settings</strong></div>
          <button className="help-link" type="button"><Icon name="help" size={16} /> Help center</button>
        </header>

        <div className="settings-page">
          <div className="page-heading">
            <div>
              <span className="eyebrow">PREFERENCES</span>
              <h1>Account settings</h1>
              <p>Manage your personal information and how you’re notified.</p>
            </div>
            <div className="heading-avatar" aria-hidden="true">OR</div>
          </div>

          <div className="settings-layout">
            <nav className="settings-nav" aria-label="Settings sections">
              <a className="settings-nav-link selected" href="#profile">My profile</a>
              <a className="settings-nav-link" href="#preferences">Preferences</a>
              <a className="settings-nav-link" href="#notifications">Notifications</a>
              <a className="settings-nav-link" href="#security">Security</a>
            </nav>

            <form className="settings-form" onSubmit={handleSubmit} noValidate>
              <section className="form-card" id="profile">
                <div className="card-heading">
                  <div>
                    <h2>Personal information</h2>
                    <p>Update your photo and personal details here.</p>
                  </div>
                </div>

                <div className="avatar-row">
                  <div className="large-avatar">OR</div>
                  <div className="avatar-copy">
                    <strong>Your profile photo</strong>
                    <span>This will be displayed on your profile.</span>
                  </div>
                  <button className="upload-button" type="button"><Icon name="upload" size={16} /> Upload photo</button>
                </div>

                <div className="form-fields">
                  {fields.map(({ name, label, hint }) => {
                    const error = fieldError(name)
                    return (
                      <div className={`field-row${error ? ' has-error' : ''}`} key={name}>
                        <label htmlFor={name}>{label} <span className="required-mark">*</span></label>
                        <div className="field-control">
                          {name === 'username' && <span className="input-prefix">layers.com/</span>}
                          <input
                            className={name === 'username' ? 'with-prefix' : ''}
                            id={name}
                            name={name}
                            type={name === 'email' ? 'email' : 'text'}
                            value={settings[name]}
                            onChange={updateField}
                            onBlur={() => setTouched((current) => ({ ...current, [name]: true }))}
                            autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : 'username'}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? `${name}-error` : `${name}-hint`}
                          />
                          {error ? (
                            <span className="field-error" id={`${name}-error`}>{error}</span>
                          ) : (
                            <span className="field-hint" id={`${name}-hint`}>{hint}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  <div className="field-row">
                    <label htmlFor="timezone">Timezone</label>
                    <div className="field-control">
                      <select id="timezone" name="timezone" value={settings.timezone} onChange={updateField}>
                        <option value="America/Los_Angeles">(UTC−08:00) Pacific Time</option>
                        <option value="America/Denver">(UTC−07:00) Mountain Time</option>
                        <option value="America/Chicago">(UTC−06:00) Central Time</option>
                        <option value="America/New_York">(UTC−05:00) Eastern Time</option>
                        <option value="Europe/London">(UTC±00:00) London</option>
                        <option value="Europe/Paris">(UTC+01:00) Central European Time</option>
                        <option value="Asia/Tokyo">(UTC+09:00) Tokyo</option>
                      </select>
                      <span className="field-hint">Your timezone is used to schedule reports and notifications.</span>
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <span className="required-note"><span>*</span> Required fields</span>
                  <div className="form-actions">
                    <button className="button button-secondary" type="button" onClick={handleReset}>Cancel</button>
                    <button className="button button-primary" type="submit">Save changes</button>
                  </div>
                </div>
              </section>

              <section className="form-card notification-card" id="notifications">
                <div className="card-heading">
                  <div>
                    <h2>Notifications</h2>
                    <p>Choose which updates you’d like to receive.</p>
                  </div>
                </div>
                <label className="toggle-row" htmlFor="productUpdates">
                  <span className="toggle-copy"><strong>Product updates</strong><span>News about product features and improvements.</span></span>
                  <input id="productUpdates" name="productUpdates" type="checkbox" checked={settings.productUpdates} onChange={updateField} />
                  <span className="toggle-switch" aria-hidden="true" />
                </label>
                <label className="toggle-row" htmlFor="securityAlerts">
                  <span className="toggle-copy"><strong>Security alerts</strong><span>Important updates about your account security.</span></span>
                  <input id="securityAlerts" name="securityAlerts" type="checkbox" checked={settings.securityAlerts} onChange={updateField} />
                  <span className="toggle-switch" aria-hidden="true" />
                </label>
              </section>

              <div className="save-feedback" aria-live="polite" role={saved ? 'status' : undefined}>
                {saved && <><span className="success-icon"><Icon name="check" size={14} /></span> Your changes have been saved successfully.</>}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
