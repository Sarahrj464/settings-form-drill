import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SettingsForm from './SettingsForm.jsx'

function fillValidRequiredFields() {
  fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jordan Lee' } })
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jordan@example.com' } })
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secure123' } })
}

describe('SettingsForm', () => {
  it('does not show validation errors on initial load', () => {
    render(<SettingsForm />)

    expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('aria-invalid', 'false')
  })

  it('requires a non-whitespace name and describes the invalid field', () => {
    render(<SettingsForm />)
    const name = screen.getByLabelText(/full name/i)

    fireEvent.change(name, { target: { value: '   ' } })
    fireEvent.blur(name)

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(name).toHaveAttribute('aria-invalid', 'true')
    expect(name).toHaveAttribute('aria-describedby', 'name-error')
    expect(screen.getByText('Name is required')).toHaveAttribute('aria-live', 'polite')
  })

  it('validates the trimmed name length and accepts the 2–50 character range', () => {
    render(<SettingsForm />)
    const name = screen.getByLabelText(/full name/i)

    fireEvent.change(name, { target: { value: ' A ' } })
    fireEvent.blur(name)
    expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()

    fireEvent.change(name, { target: { value: `  ${'A'.repeat(51)}  ` } })
    fireEvent.blur(name)
    expect(screen.getByText('Name must be 50 characters or fewer')).toBeInTheDocument()

    fireEvent.change(name, { target: { value: '  Alex Lee  ' } })
    fireEvent.blur(name)
    expect(screen.queryByText(/Name must be/)).not.toBeInTheDocument()
    expect(name).toHaveValue('Alex Lee')
  })

  it('validates required and malformed email addresses on blur', () => {
    render(<SettingsForm />)
    const email = screen.getByLabelText(/email address/i)

    fireEvent.blur(email)
    expect(screen.getByText('Email is required')).toBeInTheDocument()

    fireEvent.change(email, { target: { value: 'not-an-email' } })
    fireEvent.blur(email)
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument()
    expect(email).toHaveAttribute('aria-describedby', 'email-error')

    fireEvent.change(email, { target: { value: '  alex@example.com  ' } })
    fireEvent.blur(email)
    expect(screen.queryByText('Enter a valid email address')).not.toBeInTheDocument()
    expect(email).toHaveValue('alex@example.com')
  })

  it('requires a password with at least 8 characters and a number', () => {
    render(<SettingsForm />)
    const password = screen.getByLabelText(/password/i)

    fireEvent.change(password, { target: { value: 'abcdefgh' } })
    fireEvent.blur(password)
    expect(screen.getByText('Password must contain at least 1 number')).toBeInTheDocument()

    fireEvent.change(password, { target: { value: 'abc123' } })
    fireEvent.blur(password)
    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument()

    fireEvent.change(password, { target: { value: 'abcd1234' } })
    fireEvent.blur(password)
    expect(screen.queryByText(/Password must/)).not.toBeInTheDocument()
  })

  it('limits bio to 160 characters and marks the counter red at 150', () => {
    render(<SettingsForm />)
    const bio = screen.getByLabelText('Bio')
    const counter = screen.getByText('0/160')

    expect(bio).toHaveAttribute('maxLength', '160')
    expect(counter).not.toHaveClass('near-limit')

    fireEvent.change(bio, { target: { value: 'a'.repeat(149) } })
    expect(screen.getByText('149/160')).not.toHaveClass('near-limit')

    fireEvent.change(bio, { target: { value: 'a'.repeat(150) } })
    expect(screen.getByText('150/160')).toHaveClass('near-limit')

    fireEvent.change(bio, { target: { value: 'a'.repeat(161) } })
    expect(screen.getByText('160/160')).toHaveClass('near-limit')
    expect(bio).toHaveValue('a'.repeat(160))
  })

  it('focuses the first invalid field when submitting an invalid form', () => {
    render(<SettingsForm />)

    fireEvent.click(screen.getByRole('button', { name: 'Save settings' }))

    expect(screen.getByLabelText(/full name/i)).toHaveFocus()
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
  })

  it('shows the saved message on valid submit and trims values', () => {
    render(<SettingsForm />)
    fillValidRequiredFields()
    fireEvent.change(screen.getByLabelText('Bio'), { target: { value: '  Hello there  ' } })

    fireEvent.click(screen.getByRole('button', { name: 'Save settings' }))

    expect(screen.getByRole('status')).toHaveTextContent('Settings saved.')
    expect(screen.getByLabelText('Bio')).toHaveValue('Hello there')
    expect(screen.getByLabelText(/full name/i)).toHaveValue('Jordan Lee')
  })
})
