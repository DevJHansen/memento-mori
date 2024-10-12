import React from 'react';

interface StorageUsageProps {
  totalSpace: number;
  usedSpace: number;
}

const StorageUsage: React.FC<StorageUsageProps> = ({
  totalSpace,
  usedSpace,
}) => {
  const bytesToGB = (bytes: number) => bytes / 1024 ** 3;

  const usedSpaceGB = bytesToGB(usedSpace).toFixed(2);
  const percentageUsed = (usedSpace / totalSpace) * 100;
  const percentageLeft = 100 - percentageUsed;

  return (
    <div className="w-full max-w-md mx-auto">
      <h3 className="text-lg md:text-xl text-center font-bold mb-4">
        Storage Usage
      </h3>
      <div className="bg-primary rounded-lg overflow-hidden">
        <div
          className="bg-accent h-8"
          style={{ width: `${percentageUsed}%` }}
        ></div>
      </div>
      <div className="flex justify-between md:text-sm text-xs mt-2">
        <span>{usedSpaceGB} GB used</span>
        <span>{percentageLeft.toFixed(2)}% left</span>
      </div>
    </div>
  );
};

export default StorageUsage;
