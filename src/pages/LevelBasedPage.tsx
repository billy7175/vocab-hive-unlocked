import React from 'react';
import Header from '../components/layout/Header';
import VocabularyByLevel from '../components/VocabularyByLevel';

const LevelBasedPage: React.FC = () => {
  const handleSearch = (term: string) => {
    // Search functionality for the header
    console.log('Search term:', term);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header onSearch={handleSearch} />
      <VocabularyByLevel />
    </div>
  );
};

export default LevelBasedPage;