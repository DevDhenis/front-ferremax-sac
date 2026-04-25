import React from 'react';
import { Button } from 'primereact/button';

const ActionButton = ({
  icon,
  label,
  color = 'primary',
  onClick,
  tooltip,
  className = '',
  disabled = false,
  loading = false,
  children,
  iconPos = 'left',
  rounded = true,
  size = 'sm', // 'sm', 'md', 'lg'
}) => {
  const colorMap = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    success: 'bg-green-500 hover:bg-green-600',
    info: 'bg-cyan-500 hover:bg-cyan-600',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    danger: 'bg-red-500 hover:bg-red-600',
    alert: 'bg-orange-500 hover:bg-orange-600',
  };

  const colorClass = colorMap[color] || colorMap.primary;

  const buttonLabel = children ? undefined : label;
  const iconClass = icon ? `pi ${icon}` : undefined;
  const isIconButton = icon && !children && !label;

  let customClasses = '';

  if (isIconButton) {
    customClasses += 'p-button-icon-only';
  }

  if (rounded) {
    customClasses += ' p-button-rounded';
  }

  let sizeClass = '';
  if (size === 'sm') {
    sizeClass = 'p-button-sm';
  } else if (size === 'lg') {
    sizeClass = 'p-button-lg';
  }

  const baseClasses = `border-none text-white`;

  return (
    <Button
      label={buttonLabel}
      icon={iconClass}
      iconPos={iconPos}
      onClick={onClick}
      className={`${baseClasses} ${sizeClass} ${customClasses} ${colorClass} ${className}`}
      disabled={disabled}
      tooltip={tooltip}
      tooltipOptions={{ position: 'top' }}
      loading={loading}
    >
      {children}
    </Button>
  );
};

export default ActionButton;