export default function LeafLogo({ size = 28 }) {
  const gid = 'vita-leaf-grad'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gid} x1="6" y1="3" x2="26" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8FE0B8" />
          <stop offset="0.5" stopColor="#4A9B7F" />
          <stop offset="1" stopColor="#2C6B52" />
        </linearGradient>
      </defs>

      <path
        d="M16 2.5C25.5 6.2 28 17.5 22.3 26.8c-1.7 2.8-4.6 4.2-6.3 4.2s-4.6-1.4-6.3-4.2C3.99 17.5 6.5 6.2 16 2.5Z"
        fill={`url(#${gid})`}
      />

      <path
        d="M16 5.5C15.4 13 15.4 22 15.9 30.5"
        stroke="#1F4F3C"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.55"
      />

      <path
        d="M16 11.5 21 8.6M16 16.5 22 14.4M16 21.3 20.8 19.6M16 11.5 11 8.6M16 16.5 10 14.4M16 21.3 11.2 19.6"
        stroke="#1F4F3C"
        strokeWidth="0.85"
        strokeLinecap="round"
        opacity="0.42"
      />

      <path
        d="M12.5 7C10 10 8.7 14.5 9.2 19"
        stroke="#FFFFFF"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.22"
      />
    </svg>
  )
}
