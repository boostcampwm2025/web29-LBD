import Home from './page'

import { render, screen } from '@testing-library/react'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /to get started, edit the page\.tsx file/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders the Next.js logo', () => {
    render(<Home />)

    const logo = screen.getByAltText('Next.js logo')

    expect(logo).toBeInTheDocument()
  })

  it('renders the Deploy Now link', () => {
    render(<Home />)

    const deployLink = screen.getByRole('link', { name: /deploy now/i })

    expect(deployLink).toBeInTheDocument()
    expect(deployLink).toHaveAttribute(
      'href',
      expect.stringContaining('vercel'),
    )
  })

  it('renders the Documentation link', () => {
    render(<Home />)

    const docsLink = screen.getByRole('link', { name: /documentation/i })

    expect(docsLink).toBeInTheDocument()
    expect(docsLink).toHaveAttribute(
      'href',
      expect.stringContaining('nextjs.org/docs'),
    )
  })
})
