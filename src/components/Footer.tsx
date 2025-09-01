import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-forest-deep text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/0ac0ee05-a386-4903-895c-18286d8c5a3f.png" 
                alt="Rivendell Trout Estate Logo" 
                className="h-10 w-auto"
              />
              <div>
                <h3 className="text-lg font-montserrat font-bold">Rivendell Trout Estate</h3>
                <p className="text-sm text-gold-soft">Luxury Flyfishing Retreat</p>
              </div>
            </div>
            <p className="text-sm text-stone-light">
              An exclusive flyfishing retreat in Lydenburg, South Africa, offering luxury 
              self-catering cottages and pristine river fishing experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-montserrat font-semibold text-gold-luxury">Quick Links</h4>
            <nav className="flex flex-col space-y-2">
              <Link to="/accommodations" className="text-sm hover:text-gold-soft transition-colors">
                Accommodations
              </Link>
              <Link to="/activities" className="text-sm hover:text-gold-soft transition-colors">
                Activities
              </Link>
              <Link to="/booking" className="text-sm hover:text-gold-soft transition-colors">
                Booking
              </Link>
              <Link to="/blog" className="text-sm hover:text-gold-soft transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="text-sm hover:text-gold-soft transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-montserrat font-semibold text-gold-luxury">Contact</h4>
            <div className="space-y-3">
              <a 
                href="mailto:stay@hospitality.partners" 
                className="flex items-center space-x-2 text-sm hover:text-gold-soft transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>stay@hospitality.partners</span>
              </a>
              <a 
                href="https://wa.me/27836458313" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm hover:text-gold-soft transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>+27 83 645 8313</span>
              </a>
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <div>
                  <p>Natalshoop Farm</p>
                  <p>Mt. Anderson Nature Reserve</p>
                  <p>Lydenburg, 1110, RSA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media & CTA */}
          <div className="space-y-4">
            <h4 className="text-lg font-montserrat font-semibold text-gold-luxury">Connect</h4>
            <div className="flex space-x-3">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-gold-luxury text-gold-text hover:bg-gold-luxury hover:text-forest-deep"
              >
                <a 
                  href="https://www.facebook.com/rivendelltroutestate/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-gold-luxury text-gold-text hover:bg-gold-luxury hover:text-forest-deep"
              >
                <a 
                  href="https://www.instagram.com/rivendelltrout_estate/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </Button>
            </div>
            <Button 
              asChild 
              className="w-full btn-luxury"
            >
              <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
                Book Direct & Save
              </a>
            </Button>
          </div>
        </div>

        <div className="border-t border-forest-light mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-stone-light">
              © 2025 Rivendell Trout Estate. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-stone-light">
              <Link to="/privacy" className="hover:text-gold-soft transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gold-soft transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;