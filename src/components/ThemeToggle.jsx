import React from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = React.useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle('dark', d);
    localStorage.setItem('theme', d ? 'dark' : 'light');
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      const d = saved === 'dark';
      setDark(d);
      document.documentElement.classList.toggle('dark', d);
    }
  }, []);

  return (
    <button onClick={toggle} className="btn-ghost" aria-label="Toggle theme">
      {dark ? <Sun size={18}/> : <Moon size={18}/>}
    </button>
  );
}
