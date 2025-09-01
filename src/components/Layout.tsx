import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import SEOHead from './SEOHead';

interface LayoutProps {
  children: React.ReactNode;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
  };
}

const Layout = ({ children, seo }: LayoutProps) => {
  return (
    <>
      <SEOHead {...seo} />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;