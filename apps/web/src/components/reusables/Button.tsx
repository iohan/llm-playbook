import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
  children: string;
  icon?: ReactNode;
} & (
  | {
      to: string;
      onClick?: never;
    }
  | { to?: never; onClick: () => void }
);

const Button = (props: ButtonProps) => {
  if (props.onClick) {
    return (
      <button
        className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-80 cursor-pointer flex items-center gap-2"
        onClick={props.onClick}
      >
        {props.icon}
        <div>{props.children}</div>
      </button>
    );
  }

  if (props.to) {
    return (
      <Link
        to={props.to}
        className="rounded-xl bg-black px-4 py-2 text-white hover:opacity-80 cursor-pointer flex items-center gap-2"
      >
        {props.icon}
        <div>{props.children}</div>
      </Link>
    );
  }

  return null;
};

export default Button;
