import React from 'react';
import {
  MdErrorOutline,
  MdWarning,
  MdCheckCircleOutline,
  MdInfoOutline,
} from 'react-icons/md';

interface Props {
  severity: 'error' | 'warning' | 'success' | 'info';
  message: string;
}

export default function AlertBox({ severity, message }: Props) {
  const severityStyles = {
    error: 'border-[1px] border-red-500 text-red-700',
    warning: 'border-[1px] border-yellow-500 text-yellow-700',
    success: 'border-[1px] border-green-500 text-green-700',
    info: 'border-[1px] border-blue-500 text-blue-700',
  };

  const severityIcons = {
    error: <MdErrorOutline className="text-red-700 text-xl" />,
    warning: <MdWarning className="text-yellow-700 text-xl" />,
    success: <MdCheckCircleOutline className="text-green-700 text-xl" />,
    info: <MdInfoOutline className="text-blue-700 text-xl" />,
  };

  return (
    <div
      className={`border-l-4 px-4 py-2 rounded-md mb-4 flex items-center ${severityStyles[severity]}`}
      role="alert"
    >
      <div className="mr-3">{severityIcons[severity]}</div>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
}
