import { cn } from '../stateless/cn';

const Switch = ({
  checked,
  disabled,
  onToggle,
}: {
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
      <div
        className={cn(
          `peer h-5 w-9 rounded-full bg-gray-300 after:absolute after:top-0.5 after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-disabled:cursor-not-allowed peer-checked:bg-emerald-300 peer-checked:after:translate-x-full peer-checked:after:border-white`,
        )}
      />
    </label>
  );
};

export default Switch;
