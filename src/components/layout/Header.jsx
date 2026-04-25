import { useEffect } from 'react'

export default function Header({ title = "", subtitle = "", children = "" }) {
  useEffect(() => {
    document.title = `BORAN S.A.C - ${title}`;
  }, []);

  return (
    <header className='grid-cols-1 gap-3 mb-5'>
      <h1 className='tituloSporte font-bold text-2xl text-blue-600'>{title}</h1>
      <span className='questSoporte text-sm font-light'>{subtitle}</span>
      {children}
    </header>
  )
}
