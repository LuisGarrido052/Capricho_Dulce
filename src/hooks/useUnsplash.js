import { useEffect, useState } from 'react'

const CONFIG = {
  UNSPLASH_ACCESS_KEY: 'HtQreZOas3YROzZBpF4eNJej6uduHR_gTt8uycicQVU',
  UNSPLASH_ENDPOINT: 'https://api.unsplash.com/search/photos',
  UNSPLASH_QUERIES: ['pastry', 'cake', 'dessert'],
  UNSPLASH_PER_PAGE: 5
}

export default function useUnsplash() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetchPhotos() {
      setLoading(true)
      try {
        const collected = []
        for (const query of CONFIG.UNSPLASH_QUERIES) {
          if (collected.length >= CONFIG.UNSPLASH_PER_PAGE) break
          const url = new URL(CONFIG.UNSPLASH_ENDPOINT)
          url.searchParams.set('query', query)
          url.searchParams.set('per_page', String(CONFIG.UNSPLASH_PER_PAGE))
          url.searchParams.set('orientation', 'landscape')
          url.searchParams.set('content_filter', 'high')

          const res = await fetch(url.toString(), {
            headers: { Authorization: `Client-ID ${CONFIG.UNSPLASH_ACCESS_KEY}` }
          })
          if (!res.ok) continue
          const data = await res.json()
          const results = Array.isArray(data.results) ? data.results : []
          const mapped = results.map((photo, index) => ({
            id: photo.id || `${query}-${index}`,
            imageUrl: photo?.urls?.regular || photo?.urls?.full || photo?.urls?.small || '',
            alt: photo?.alt_description || query,
            author: photo?.user?.name || 'Unsplash',
            link: photo?.links?.html || '#',
            query
          })).filter(i => i.imageUrl)

          for (const item of mapped) {
            const dup = collected.some(c => c.id === item.id || c.imageUrl === item.imageUrl)
            if (!dup) collected.push(item)
            if (collected.length >= CONFIG.UNSPLASH_PER_PAGE) break
          }
        }
        if (mounted) setPhotos(collected.slice(0, CONFIG.UNSPLASH_PER_PAGE))
      } catch (e) {
        if (mounted) setError(e.message || String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPhotos()
    return () => { mounted = false }
  }, [])

  return { photos, loading, error }
}
