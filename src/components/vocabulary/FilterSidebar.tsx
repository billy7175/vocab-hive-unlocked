
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tag, FilterOptions, SortOption } from "@/types/vocabulary";

interface FilterSidebarProps {
  allTags: Tag[];
  filterOptions: FilterOptions;
  sortOption: SortOption;
  onFilterChange: (newFilters: FilterOptions) => void;
  onSortChange: (newSort: SortOption) => void;
}

const FilterSidebar = ({
  allTags,
  filterOptions,
  sortOption,
  onFilterChange,
  onSortChange,
}: FilterSidebarProps) => {
  const [tagSearch, setTagSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleTagToggle = (tag: Tag) => {
    const isSelected = filterOptions.tags.some(t => t.id === tag.id);
    
    let newTags: Tag[];
    if (isSelected) {
      newTags = filterOptions.tags.filter(t => t.id !== tag.id);
    } else {
      newTags = [...filterOptions.tags, tag];
    }
    
    onFilterChange({
      ...filterOptions,
      tags: newTags,
    });
  };

  const handleDifficultyChange = (difficulty: string | null) => {
    onFilterChange({
      ...filterOptions,
      difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced' | null,
    });
  };

  const handleBookmarkedChange = (checked: boolean) => {
    onFilterChange({
      ...filterOptions,
      bookmarkedOnly: checked,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      tags: [],
      difficulty: null,
      bookmarkedOnly: false,
    });
    onSortChange('newest');
  };

  const filteredTags = allTags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const sidebarContent = (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-2">Sort by</h3>
        <RadioGroup 
          defaultValue={sortOption} 
          onValueChange={(value) => onSortChange(value as SortOption)}
          className="flex flex-col space-y-1.5"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="newest" />
            <Label htmlFor="newest" className="cursor-pointer">Newest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="oldest" id="oldest" />
            <Label htmlFor="oldest" className="cursor-pointer">Oldest</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="alphabetical" id="alphabetical" />
            <Label htmlFor="alphabetical" className="cursor-pointer">Alphabetical</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="popular" id="popular" />
            <Label htmlFor="popular" className="cursor-pointer">Popular</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-2">Difficulty</h3>
        <RadioGroup 
          defaultValue={filterOptions.difficulty || ""} 
          onValueChange={(value) => handleDifficultyChange(value || null)}
          className="flex flex-col space-y-1.5"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="any-difficulty" />
            <Label htmlFor="any-difficulty" className="cursor-pointer">Any</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="beginner" />
            <Label htmlFor="beginner" className="cursor-pointer">Beginner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="intermediate" id="intermediate" />
            <Label htmlFor="intermediate" className="cursor-pointer">Intermediate</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="advanced" id="advanced" />
            <Label htmlFor="advanced" className="cursor-pointer">Advanced</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="bookmarked" 
          checked={filterOptions.bookmarkedOnly}
          onCheckedChange={(checked) => handleBookmarkedChange(checked as boolean)}
        />
        <Label htmlFor="bookmarked" className="cursor-pointer">Bookmarked only</Label>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Tags</h3>
          {filterOptions.tags.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={() => onFilterChange({...filterOptions, tags: []})}
            >
              Clear
            </Button>
          )}
        </div>
        <div className="mb-2">
          <Input
            placeholder="Search tags..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1">
          {filteredTags.length > 0 ? (
            filteredTags.map((tag) => {
              const isSelected = filterOptions.tags.some(t => t.id === tag.id);
              return (
                <Badge 
                  key={tag.id}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag.name}
                </Badge>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No tags found</p>
          )}
        </div>
      </div>

      <Button onClick={handleClearFilters} variant="outline" className="w-full">
        Reset All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:block sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pb-12">
        {sidebarContent}
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden sticky top-[4.5rem] z-30 bg-background pb-2 pt-1 border-b">
        <Button 
          onClick={() => setShowMobileFilters(!showMobileFilters)} 
          variant="outline"
          className="w-full"
        >
          {showMobileFilters ? "Hide Filters" : "Show Filters & Sort Options"}
        </Button>
      </div>

      {/* Mobile sidebar */}
      {showMobileFilters && (
        <div className="md:hidden py-4 px-2 border-b mb-6">
          {sidebarContent}
        </div>
      )}
    </>
  );
};

export default FilterSidebar;
