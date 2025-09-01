import React from 'react';
import { Wifi, Fish, Coffee, Mountain, Users } from 'lucide-react';

const AmenitiesSection = () => {
  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Fish, label: 'Fishing Included' },
    { icon: Coffee, label: 'Self-Catering' },
    { icon: Mountain, label: 'Nature Reserve' },
    { icon: Users, label: 'Great for Families'}
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2 text-muted-foreground">
              <amenity.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">{amenity.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmenitiesSection;