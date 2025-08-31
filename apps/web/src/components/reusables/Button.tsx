import { Link } from 'react-router-dom';
import { cn } from '../stateless/cn';
import { LucideIcon } from 'lucide-react';

type ButtonProps = {
  children?: string;
  icon?: LucideIcon;
  variant?: 'transparent' | 'transparent-no-outline';
  disabled?: boolean;
  size?: 'small';
} & (
  | {
      to: string;
      onClick?: never;
    }
  | { to?: never; onClick: () => void }
);

const Button = ({ icon: Icon, ...props }: ButtonProps) => {
  const size =
    props.size === 'small' ? 'text-xs px-3 py-1 rounded-lg' : 'text-base px-4 py-2 rounded-xl';

  const baseButton = cn(
    size,
    'flex items-center gap-2 whitespace-nowrap cursor-pointer transition',
  );

  const primaryVariant = cn(baseButton, 'bg-black text-white hover:opacity-80');

  const transparentVariant = cn(
    baseButton,
    'bg-transparent border border-gray-300 text-black hover:bg-gray-100',
  );

  const disabledVariant = cn(
    baseButton,
    'bg-gray-200 text-gray-500 cursor-not-allowed hover:opacity-100',
  );

  const transparentNoOutlineVariant = cn(
    transparentVariant,
    'border-transparent hover:border-gray-300 hover:bg-transparent',
  );

  const variant = () => {
    if (props.disabled) return disabledVariant;
    if (props.variant === 'transparent') return transparentVariant;
    if (props.variant === 'transparent-no-outline') return transparentNoOutlineVariant;

    return primaryVariant;
  };

  if (props.onClick) {
    return (
      <button className={variant()} disabled={props.disabled} onClick={props.onClick}>
        {Icon && <Icon className="w-4 h-4" />}
        {props.children && <div>{props.children}</div>}
      </button>
    );
  }

  if (props.to) {
    return (
      <Link to={props.to} className={variant()}>
        {Icon && <Icon className="w-4 h-4" />}
        {props.children && <div>{props.children}</div>}
      </Link>
    );
  }

  return null;
};

export default Button;
