"use client";

import { useEffect, useState } from 'react';
import { Search, Copy, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Bang {
  name: string;
  url: string;
}

interface Bangs {
  [key: string]: Bang;
}

export default function Home() {
  const [bangs, setBangs] = useState<Bangs>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we need to redirect based on query parameter
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (query) {
      handleRedirect(query);
    }

    // Load bangs configuration
    fetch('/bangs.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load bangs configuration');
        }
        return response.json();
      })
      .then(data => {
        setBangs(data);
      })
      .catch(err => {
        console.error('Error loading bangs:', err);
        setError('Failed to load bangs configuration');
      });
  }, []);

  const handleRedirect = (query: string) => {
    const bangMatch = query.match(/^(![\w]+)(?:\s+(.*))?$/);
    
    if (!bangMatch) {
      const searchTerms = encodeURIComponent(query);
      window.location.href = `https://tekir.co/search?q=${searchTerms}`;
      return;
    }

    const bangCommand = bangMatch[1];
    const searchTerms = bangMatch[2] ? encodeURIComponent(bangMatch[2]) : '';

    // Load bangs configuration and redirect
    fetch('/bangs.json')
      .then(response => response.json())
      .then(bangsData => {
        const bang = bangsData[bangCommand];
        
        if (bang) {
          const redirectUrl = bang.url.replace('{search}', searchTerms);
          window.location.href = redirectUrl;
        } else {
          const fallbackSearch = encodeURIComponent(query);
          window.location.href = `https://tekir.co/search?q=${fallbackSearch}`;
        }
      })
      .catch(err => {
        console.error('Error during redirect:', err);
        const fallbackSearch = encodeURIComponent(query);
        window.location.href = `https://tekir.co/search?q=${fallbackSearch}`;
      });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-destructive text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center max-w-lg mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">banglat</h1>
        <p className="mb-6 text-center">
          Bangs that literally work on your browser. Doesn't send your request to the server to parse it, instead fully works on your browser.
        </p>
        <p className="mb-6 text-center">
          To add Banglat to your browser shortcuts, just see these guides for {''}<Link className="hover:text-primary hover:underline" href="https://support.mozilla.org/en-US/kb/add-or-remove-search-engine-firefox#w_add-a-search-engine-from-the-address-bar">Firefox</Link> or <Link className="hover:text-primary hover:underline" href="https://support.google.com/chrome/answer/95426?hl=en&co=GENIE.Platform%3DDesktop&sjid=11739288043737509123-EU&oco=0">Chrome</Link>.
        </p>

        
        <div className="text-sm text-muted-foreground text-center mt-4">
          <div className="flex items-center justify-center space-x-4">
            <Link href="https://tekir.co" className="hover:text-primary hover:underline flex items-center">
              <span className="mr-1">🫶</span>
              <span>Kindly hosted by Tekir</span>
            </Link>
            <Link href="https://github.com/islemci/banglat" className="hover:text-primary hover:underline flex items-center">
              <span className="mr-1">👻</span>
              <span>Check out the source</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}