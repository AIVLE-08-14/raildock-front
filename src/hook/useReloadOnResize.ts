import { useEffect, useRef } from 'react'

function useReloadOnResize(delay = 300) {
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = window.setTimeout(() => {
        window.location.reload()
      }, delay)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [delay])
}

export default useReloadOnResize
