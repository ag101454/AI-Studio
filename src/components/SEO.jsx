import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_NAME = 'AI Studio'
const SITE_URL = 'https://ai-studio.vercel.app'
const DEFAULT_DESCRIPTION = 'Your all-in-one AI platform for chat, image generation, code writing, document creation, and more.'
const DEFAULT_IMAGE = 'https://ai-studio.vercel.app/og-image.png'

export function SEO({ title, description, image, type = 'website' }) {
  const location = useLocation()
  const currentUrl = SITE_URL + location.pathname
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const pageDescription = description || DEFAULT_DESCRIPTION
  const pageImage = image || DEFAULT_IMAGE

  useEffect(() => {
    document.title = pageTitle

    const metaTags = {
      'description': pageDescription,
      'og:title': pageTitle,
      'og:description': pageDescription,
      'og:image': pageImage,
      'og:url': currentUrl,
      'og:type': type,
      'og:site_name': SITE_NAME,
      'twitter:card': 'summary_large_image',
      'twitter:title': pageTitle,
      'twitter:description': pageDescription,
      'twitter:image': pageImage,
    }

    Object.entries(metaTags).forEach(([name, content]) => {
      let element = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(name.includes('og:') ? 'property' : 'name', name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    })
  }, [pageTitle, pageDescription, pageImage, currentUrl, type])

  return null
}