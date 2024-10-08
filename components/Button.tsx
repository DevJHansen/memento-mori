import { LoadingSpinner } from './LoadingSpinner';

interface Props {
  onClick?: () => void;
  text: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  outline?: boolean;
  children?: React.ReactNode;
  preventDefault?: boolean;
}

export const Button = ({
  onClick,
  text,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  outline = false,
  children,
  preventDefault = false,
}: Props) => {
  return (
    <button
      className={`${
        outline
          ? 'border-accent cursor-pointer border-2 text-center text-accent font-bold py-2 px-4 rounded-md min-w-[120px] flex items-center justify-center'
          : 'bg-accent border-accent border-2 cursor-pointer text-white text-center font-bold py-2 px-4 rounded-md min-w-[120px] flex items-center justify-center'
      } ${className} ${loading && 'opacity-50'} ${
        disabled && 'bg-backgroundLight  border-0 border-backgroundLight'
      }`}
      onClick={() => {
        if (loading) return;
        if (disabled) return;
        if (preventDefault) return;
        if (!onClick) return;
        onClick();
      }}
      disabled={disabled}
      type={type}
    >
      {text} {children} {loading && <LoadingSpinner className="ml-2" />}
    </button>
  );
};
