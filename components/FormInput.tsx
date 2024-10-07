import React from 'react';
import { FormFieldLabel } from './FormFieldLabel';

interface FormInputProps {
  id: string;
  label: string;
  value: string | number | null;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  min?: string | number;
  minLength?: number;
  disabled?: boolean;
  error?: boolean;
  max?: number;
  maxLength?: number;
  className?: string;
  labelStyle?: string;
  inputRef?: React.RefObject<HTMLTextAreaElement>;
}

const formInput =
  ' w-full px-4 py-2 text-white leading-tight focus:outline-none rounded-md bg-backgroundLight h-10';
const formDisabled = 'bg-transparent border-[2px]';

export const insertNewLineInTextArea = (
  e: React.FormEvent<HTMLTextAreaElement>
): string => {
  const start = e.currentTarget.selectionStart;
  const end = e.currentTarget.selectionEnd;
  const target = e.target as HTMLTextAreaElement;
  const { value } = target;

  target.value =
    value.substring(0, start) + '\n' + value.substring(end, value.length);

  e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 1;

  return target.value;
};

export const FormInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  min,
  minLength,
  disabled = false,
  error = false,
  max,
  maxLength,
  className = '',
  labelStyle = '',
  inputRef,
}: FormInputProps) => {
  return (
    <div className="mb-4 mt-auto">
      <FormFieldLabel
        error={error}
        id={id}
        label={label}
        required={required}
        labelStyle={labelStyle}
      />
      {type === 'textarea' ? (
        <textarea
          className={`${formInput} ${disabled && formDisabled} ${className}`}
          id={id}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          minLength={minLength}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const mutatedText = insertNewLineInTextArea(e);
              onChange(mutatedText);
            }
          }}
          ref={inputRef}
        />
      ) : (
        <>
          <input
            className={`${formInput} ${disabled && formDisabled} ${className}`}
            id={id}
            type={type}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            min={min}
            minLength={minLength}
            disabled={disabled}
            max={max}
            maxLength={maxLength}
          />
        </>
      )}
    </div>
  );
};
