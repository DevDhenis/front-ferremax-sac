import React from 'react'

/**
 * Componente para secciones dentro de un contenedor
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la sección
 * @param {string} props.className - Clases adicionales para la sección
 * @param {boolean} props.columns - Indica si los elementos se deben organizar en columnas
 * @returns {React.ReactElement} Componente sección
 */
const Section = ({ children, className = '', columns = false }) => {
  return (
    <div className={`flex ${className || (columns ? 'flex-column' : '')}`}>
      {children}
    </div>
  );
};

export default Section;