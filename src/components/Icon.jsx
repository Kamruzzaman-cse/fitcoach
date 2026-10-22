/* Tiny inline SVG icon set (no icon library needed) */
const PATHS = {
  home: 'M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z',
  dumbbell: 'M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12',
  chart: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  food: 'M7 3v8a2 2 0 002 2v8M11 3v8M7 7h4M17 3c-2 2-2 6 0 8v10',
  chat: 'M21 12a8 8 0 01-11.6 7.1L4 21l1.9-5.4A8 8 0 1121 12z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 01-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 010-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 014 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 010 4h-.1a1.7 1.7 0 00-1.5 1z',
  check: 'M5 12l5 5L20 7',
  plus: 'M12 5v14M5 12h14',
  x: 'M6 6l12 12M18 6L6 18',
  swap: 'M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7',
  play: 'M7 4l13 8-13 8z',
  image: 'M4 5h16v14H4zM4 15l5-5 4 4 3-3 4 4',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  send: 'M4 12l16-8-6 16-2-7z',
  chevron: 'M9 6l6 6-6 6',
  back: 'M15 6l-6 6 6 6',
  flame: 'M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-3 2-4 2-7 2 1 3 3 3 5 1-2 1-5 0-9z',
  water: 'M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z'
}

export function Icon({ name, size = 22, className = '' }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
