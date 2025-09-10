import { Search, Bell, Settings, User, Command } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { SearchPreview } from '@/components/SearchPreview';

export const DesktopHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchPreview, setShowSearchPreview] = useState(false);

  // Keyboard shortcut para abrir pesquisa
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearchPreview(true);
      } else if (e.key === 'Escape') {
        setShowSearchPreview(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchFocus = () => {
    setShowSearchPreview(true);
  };

  const handleSearchClose = () => {
    setShowSearchPreview(false);
    setSearchQuery('');
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-72 h-20 bg-background/95 backdrop-blur-sm border-b border-border z-30">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar na plataforma..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                className="pl-10 pr-16 w-80" 
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">
                  <Command className="h-3 w-3 inline mr-1" />K
                </kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Preview Modal */}
      <SearchPreview
        isOpen={showSearchPreview}
        onClose={handleSearchClose}
        query={searchQuery}
        onQueryChange={setSearchQuery}
      />
    </>
  );
};