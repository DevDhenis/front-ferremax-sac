import { useEffect } from 'react'

export default function Header({ title = "", subtitle = "", children = "" }) {
  useEffect(() => {
    document.title = `BORAN S.A.C - ${title}`;
  }, [title]);

  return (
    <header className='grid-cols-1 gap-3'>
      <h1 className='tituloSporte font-bold text-2xl text-primary'>{title}</h1>
      <span className='questSoporte text-sm font-light'>{subtitle}</span>
      {children}
    </header>
  )
}
