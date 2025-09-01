import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Accommodations', path: '/accommodations' },
    { name: 'Activities', path: '/activities' },
    { name: 'Booking', path: '/booking' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-[var(--shadow-soft)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <div>
              <h1 className="text-xl font-montserrat font-bold text-primary">Rivendell Trout Estate</h1>
              <p className="text-xs text-muted-foreground">Luxury Flyfishing Retreat</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'text-primary after:scale-x-100' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              asChild 
              className="btn-luxury hidden md:inline-flex"
            >
              <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
            
            <Button
              asChild
              size="sm"
              variant="outline"
              className="btn-outline-luxury hidden sm:inline-flex"
            >
              <a href="https://wa.me/27836458313" target="_blank" rel="noopener noreferrer">
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </a>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path) 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-2">
                <Button 
                  asChild 
                  className="btn-hero w-full"
                >
                  <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
                    Book Now
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="btn-outline-luxury w-full"
                >
                  <a href="https://wa.me/27836458313" target="_blank" rel="noopener noreferrer">
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;