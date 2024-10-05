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
          ? 'border-primary cursor-pointer border-2 text-center text-primary font-bold py-2 px-4 rounded-md min-w-[120px] flex items-center justify-center'
          : 'bg-primary border-primary border-2 cursor-pointer text-white text-center font-bold py-2 px-4 rounded-md min-w-[120px] flex items-center justify-center'
      } ${className} ${loading && 'opacity-50'} ${
        disabled && 'bg-gray-400  border-0 border-gray-400'
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
