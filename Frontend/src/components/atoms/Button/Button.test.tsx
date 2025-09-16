import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn--secondary')
  })

  it('applies correct size class', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('btn--lg')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('btn--disabled')
  })

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByRole('button')).toHaveClass('btn--loading')
    expect(screen.getByRole('button').querySelector('.btn__spinner')).toBeInTheDocument()
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('does not call onClick when loading', () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})