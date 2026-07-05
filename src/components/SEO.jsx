import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'AI Studio'
const SITE_URL = 'https://ai-studio-alpha-two.vercel.app'
const DEFAULT_DESCRIPTION = 'Your all-in-one AI platform for chat, image generation, code writing, document creation, and more.'

export function SEO({ title, description, type = 'website' }) {
  const location = useLocation()
  const currentUrl = SITE_URL + location.pathname
  const pageTitle = title ? title + ' | ' + SITE_NAME : SITE_NAME
  const pageDescription = description || DEFAULT_DESCRIPTION

  useEffect(() => {
    document.title = pageTitle

    const metaTags = {
      'description': pageDescription,
      'og:title': pageTitle,
      'og:description': pageDescription,
      'og:url': currentUrl,
      'og:type': type,
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      const attribute = name.includes('og:') ? 'property' : 'name'
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    })
  }, [pageTitle, pageDescription, currentUrl, type])

  return null
}