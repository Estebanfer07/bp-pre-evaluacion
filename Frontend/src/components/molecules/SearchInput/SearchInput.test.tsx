import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders with default placeholder', () => {
    render(<SearchInput onSearch={mockOnSearch} />)
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(<SearchInput onSearch={mockOnSearch} placeholder="Search clients..." />)
    expect(screen.getByPlaceholderText('Search clients...')).toBeInTheDocument()
  })

  it('calls onSearch with debounced value', async () => {
    render(<SearchInput onSearch={mockOnSearch} debounceDelay={100} />)
    
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'test search' } })
    
    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalledWith('test search')
    
    // Should call after debounce delay
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test search')
    }, { timeout: 200 })
  })

  it('shows and hides clear button based on input value', () => {
    render(<SearchInput onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('searchbox')
    
    // Clear button should not be visible initially
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument()
    
    // Type something
    fireEvent.change(input, { target: { value: 'test' } })
    
    // Clear button should be visible
    expect(screen.getByLabelText('Limpiar búsqueda')).toBeInTheDocument()
  })

  it('clears input when clear button is clicked', async () => {
    render(<SearchInput onSearch={mockOnSearch} debounceDelay={100} />)
    
    const input = screen.getByRole('searchbox') as HTMLInputElement
    
    // Type something
    fireEvent.change(input, { target: { value: 'test' } })
    expect(input.value).toBe('test')
    
    // Click clear button
    const clearButton = screen.getByLabelText('Limpiar búsqueda')
    fireEvent.click(clearButton)
    
    expect(input.value).toBe('')
    
    // Should call onSearch with empty string after debounce
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('')
    }, { timeout: 200 })
  })

  it('renders with default value', () => {
    render(<SearchInput onSearch={mockOnSearch} defaultValue="initial value" />)
    
    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('initial value')
  })

  it('is disabled when disabled prop is true', () => {
    render(<SearchInput onSearch={mockOnSearch} disabled />)
    
    const input = screen.getByRole('searchbox')
    expect(input).toBeDisabled()
    
    // Clear button should not show when disabled
    fireEvent.change(input, { target: { value: 'test' } })
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<SearchInput onSearch={mockOnSearch} className="custom-class" />)
    
    const container = screen.getByRole('searchbox').closest('.search-input')
    expect(container).toHaveClass('custom-class')
  })

  it('calls onSearch with initial value on mount', async () => {
    render(<SearchInput onSearch={mockOnSearch} defaultValue="initial" debounceDelay={0} />)
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('initial')
    })
  })
})