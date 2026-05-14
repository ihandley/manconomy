import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  ListingFeed,
  ListingFeedError,
  ListingFeedLoading,
} from './feedView'

describe('ListingFeed', () => {
  it('renders listing cards that navigate to listing detail', () => {
    render(
      <ListingFeed
        listings={[
          {
            id: 'listing-1',
            title: 'Cordless Drill',
            category: 'tools',
            condition: 'good',
            askingCredits: 25,
            thumbnailUrl: 'https://example.test/drill.jpg',
            sellerDisplayName: 'Ian',
          },
        ]}
      />
    )

    const card = screen.getByRole('link', { name: /cordless drill/i })
    expect(card).toHaveAttribute('href', '/app/listings/listing-1')
    expect(screen.getByText('25 credits')).toBeInTheDocument()
    expect(screen.getByText('good · tools')).toBeInTheDocument()
    expect(screen.getByText('Listed by Ian')).toBeInTheDocument()
    expect(document.querySelector('img')).toHaveAttribute(
      'src',
      'https://example.test/drill.jpg'
    )
  })

  it('renders empty, error, and loading states', () => {
    const { rerender } = render(<ListingFeed listings={[]} />)

    expect(
      screen.getByText('No active listings in your neighborhood yet.')
    ).toBeInTheDocument()

    rerender(<ListingFeedError message="database offline" />)
    expect(
      screen.getByText('Listings could not be loaded: database offline')
    ).toBeInTheDocument()

    rerender(<ListingFeedLoading />)
    expect(document.querySelectorAll('.h-28')).toHaveLength(3)
  })
})
