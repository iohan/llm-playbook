import { Link } from 'react-router-dom';
import { cn } from '../stateless/cn';
import { LucideIcon } from 'lucide-react';

type ButtonProps = {
  children?: string;
  icon?: LucideIcon;
  variant?: 'transparent' | 'transparent-no-outline';
} & (
  | {
      to: string;
      onClick?: never;
    }
  | { to?: never; onClick: () => void }
);

const Button = ({ icon: Icon, ...props }: ButtonProps) => {
  const primaryVariant = cn(
    'rounded-xl bg-black px-4 py-2 text-white hover:opacity-80 transition cursor-pointer flex items-center gap-2',
  );

  const transparentVariant = cn(
    'rounded-xl bg-transparent border border-gray-300 transition px-4 py-2 text-black hover:bg-gray-100 cursor-pointer flex items-center gap-2',
  );

  const transparentNoOutlineVariant = cn(
    transparentVariant,
    'border-transparent hover:border-gray-300 hover:bg-transparent',
  );

  const variant = () => {
    if (props.variant === 'transparent') return transparentVariant;
    if (props.variant === 'transparent-no-outline') return transparentNoOutlineVariant;
    return primaryVariant;
  };

  if (props.onClick) {
    return (
      <button className={variant()} onClick={props.onClick}>
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
