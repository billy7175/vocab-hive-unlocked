import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  value: number;
  showLabel?: boolean;
  labelFormat?: (value: number) => string;
  className?: string;
  barClassName?: string;
  labelClassName?: string;
}

/**
 * A reusable progress bar component
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  labelFormat = (value) => `${Math.round(value)}%`,
  className,
  barClassName,
  labelClassName,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <Progress value={value} className={barClassName} />
      {showLabel && (
        <p className={cn("text-sm text-muted-foreground mt-1", labelClassName)}>
          {labelFormat(value)}
        </p>
      )}
    </div>
  );
};

export default ProgressBar;
