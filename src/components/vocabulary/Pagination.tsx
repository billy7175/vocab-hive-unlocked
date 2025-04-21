import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
  maxVisiblePages?: number;
  showSummary?: boolean;
  totalItems?: number;
  pageSize?: number;
}

/**
 * A reusable pagination component for navigating between pages
 */
const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  className = '',
  maxVisiblePages = 5,
  showSummary = false,
  totalItems = 0,
  pageSize = 10,
}) => {
  if (totalPages <= 1) return null;

  // Calculate visible page range
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Generate page items
  const pageItems = [];
  for (let i = startPage; i <= endPage; i++) {
    pageItems.push(
      <PaginationItem key={i}>
        <PaginationLink
          href="#"
          isActive={currentPage === i}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(i);
          }}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <PaginationRoot>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1 && !disabled) {
                  onPageChange(currentPage - 1);
                }
              }}
              aria-disabled={currentPage === 1 || disabled}
              className={currentPage === 1 || disabled ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {startPage > 1 && (
            <>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(1);
                  }}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              
              {startPage > 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            </>
          )}
          
          {pageItems}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(totalPages);
                  }}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages && !disabled) {
                  onPageChange(currentPage + 1);
                }
              }}
              aria-disabled={currentPage === totalPages || disabled}
              className={currentPage === totalPages || disabled ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationRoot>
      
      {showSummary && totalItems > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          총 {totalItems}개의 단어 중 {Math.min((currentPage - 1) * pageSize + 1, totalItems)} - {Math.min(currentPage * pageSize, totalItems)}
        </div>
      )}
    </div>
  );
};

export default Pagination;
