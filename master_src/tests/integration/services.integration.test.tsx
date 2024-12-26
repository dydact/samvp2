import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react'
import { IntegrationTest } from '@shared/components/IntegrationTest'

describe('Service Integration Tests', () => {
  it('should connect to all required services', async () => {
    render(<IntegrationTest />)
    
    // Wait for loading to complete
    expect(await screen.findByText('Integration Test Results')).toBeInTheDocument()
    
    // Check individual services
    expect(screen.getByText(/hospitalRun:/)).toBeInTheDocument()
    expect(screen.getByText(/healthcareCRM:/)).toBeInTheDocument()
    expect(screen.getByText(/goalert:/)).toBeInTheDocument()
  })
}) 