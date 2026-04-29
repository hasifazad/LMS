// ThemeToggle.jsx
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark' ||
            (!('theme' in localStorage) &&
                window.matchMedia('(prefers-color-scheme: dark)').matches)
    })

    // useEffect(() => {
    //     const root = window.document.documentElement
    //     if (isDark) {
    //         root.classList.add('dark')
    //         localStorage.setItem('theme', 'dark')
    //     } else {
    //         root.classList.remove('dark')
    //         localStorage.setItem('theme', 'light')
    //     }
    // }, [isDark])

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white transition-colors"
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    )
}

export default ThemeToggle
