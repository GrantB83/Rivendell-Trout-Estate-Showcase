import React from 'react';
import { Link } from 'react-router-dom';
import { Bed, Bath, Users, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RoomDetailsModal from './RoomDetailsModal';

interface RoomDetail {
  room: string;
  bed: string;
  bathroom: string;
}

interface Cottage {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  features: string[];
  description: string;
  images: string[];
  highlights: string[];
  roomingDetails: RoomDetail[];
  additionalInfo?: string;
}

interface CottageCardProps {
  cottage: Cottage;
}

const CottageCard = ({ cottage }: CottageCardProps) => {
  return (
    <Card className="card-luxury overflow-hidden">
      <div className="relative">
        <img 
          src={cottage.images[0]}
          alt={`${cottage.name} cottage at Rivendell Trout Estate`}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop&crop=center`;
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {cottage.highlights.map((highlight, index) => (
            <span key={index} className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
              {highlight}
            </span>
          ))}
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-montserrat font-bold text-primary mb-2">
              {cottage.name}
            </h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{cottage.bedrooms} bed</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{cottage.bathrooms} bath</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Up to {cottage.maxGuests}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <p className="text-muted-foreground leading-relaxed flex-1">
            {cottage.description}
          </p>
          <RoomDetailsModal
            cottageName={cottage.name}
            roomingDetails={cottage.roomingDetails}
            additionalInfo={cottage.additionalInfo}
          />
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold text-primary mb-3">Features:</h3>
          <div className="grid grid-cols-2 gap-2">
            {cottage.features.map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                <span className="text-sm text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            asChild 
            className="btn-luxury"
          >
            <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
          <Button 
            asChild 
            variant="secondary"
          >
            <a href={cottage.id === 'old-stone-house' ? `/guest-Information-${cottage.id}.pdf` : `/guest-Information-${cottage.id}-cottage.pdf`} download={`Guest Information - ${cottage.name}.pdf`}>
              <Download className="w-4 h-4 mr-2" />
              Brochure
            </a>
          </Button>
          <Button 
            asChild 
            variant="outline"
            className="btn-outline-luxury"
          >
            <Link to={`/gallery/${cottage.id}`}>
              View Gallery
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CottageCard;