import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { resolveIcon } from '@/lib/icons';
import { cn } from "@/lib/utils";

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
  // Map color to Shadcn variant
  const variantMap = {
    primary: 'default',
    secondary: 'secondary',
    danger: 'destructive',
    alert: 'destructive',
    success: 'success', // handled custom
    info: 'secondary',
    outline: 'outline',
  };

  const variant = variantMap[color] || 'default';

  // Handle custom success variant since Shadcn button doesn't have it by default
  const isSuccess = color === 'success';
  const customVariantClass = isSuccess 
    ? 'bg-success-bg text-success border border-success/20 hover:bg-success-bg/85' 
    : '';

  // Determine size variant for Shadcn
  const sizeMap = {
    sm: 'sm',
    md: 'default',
    lg: 'lg',
  };
  
  // Icon-only buttons mapping
  const isIconButton = icon && !children && !label;
  const sizeVariant = isIconButton 
    ? (size === 'sm' ? 'icon-sm' : size === 'lg' ? 'icon-lg' : 'icon')
    : (sizeMap[size] || 'default');

  // Renderiza el icono: acepta un componente lucide, un elemento React, o un
  // string heredado "pi pi-xxx" (mapeado a lucide vía resolveIcon).
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function') {
      const IconComp = icon;
      return <IconComp />;
    }
    const IconComp = resolveIcon(icon);
    return IconComp ? <IconComp /> : null;
  };

  const content = (
    <Button
      variant={isSuccess ? 'default' : variant}
      size={sizeVariant}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        customVariantClass, 
        rounded ? 'rounded-full' : 'rounded-lg', 
        isIconButton ? 'p-0 flex items-center justify-center shrink-0' : 'gap-1.5 flex items-center justify-center h-auto',
        size === 'sm' && !isIconButton ? 'px-3 py-1.5 text-xs' : '',
        size === 'lg' && !isIconButton ? 'px-6 py-3 text-base' : '',
        size === 'md' && !isIconButton ? 'px-4 py-2 text-sm' : '',
        className
      )}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        icon && iconPos === 'left' && renderIcon()
      )}

      {children || (label && <span className="font-semibold text-xs leading-none">{label}</span>)}

      {!loading && icon && iconPos === 'right' && renderIcon()}
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider delay={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-background text-xs px-2 py-1 rounded shadow-md border border-border/40">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

export default ActionButton;
