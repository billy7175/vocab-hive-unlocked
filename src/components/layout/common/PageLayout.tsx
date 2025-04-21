import React, { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import ScrollToTopButton from '@/components/layout/ScrollToTopButton';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  onSearch?: (term: string) => void;
  showHeader?: boolean;
  containerClassName?: string;
  headerClassName?: string;
  contentClassName?: string;
}

/**
 * A common layout component to ensure UI consistency across all pages
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  title,
  description,
  className,
  onSearch = () => console.log('Search not implemented on this page'),
  showHeader = true,
  containerClassName,
  headerClassName,
  contentClassName,
}) => {
  const handleSearch = (term: string) => {
    onSearch(term);
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {showHeader && <Header onSearch={handleSearch} className={headerClassName} />}
      <ScrollToTopButton />
      
      <main className={cn("container py-6 px-4 md:py-10", containerClassName)}>
        {(title || description) && (
          <div className="mb-8 text-center">
            {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
            {description && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className={cn("w-full", contentClassName)}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
