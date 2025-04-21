import React from 'react';
import { SortOption } from '@/types/vocabulary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortSelectorProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * A reusable component for sorting vocabulary words
 */
const SortSelector: React.FC<SortSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
    { value: 'alphabetical', label: '알파벳순' },
  ];

  return (
    <div className={className}>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as SortOption)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 방식 선택" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortSelector;
