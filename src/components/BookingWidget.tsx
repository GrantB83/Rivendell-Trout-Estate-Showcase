import React, { useEffect } from 'react';
import { Calendar, Users, MapPin } from 'lucide-react';

interface BookingWidgetProps {
  propertyId?: string;
  className?: string;
  title?: string;
}

const BookingWidget = ({ 
  propertyId = "24847", 
  className = "",
  title = "Check Availability & Book Direct"
}: BookingWidgetProps) => {
  
  useEffect(() => {
    // Load NightsBridge booking script
    const script = document.createElement('script');
    script.src = 'https://book.nightsbridge.com/js/embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className={`card-luxury p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-montserrat font-bold text-primary mb-2">
          {title}
        </h3>
        <p className="text-luxury text-lg font-semibold mb-1">
          Guaranteed Lowest Rates
        </p>
        <p className="text-muted-foreground">
          Book direct and save on your luxury flyfishing retreat
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
        <div className="flex flex-col items-center space-y-2 p-3 bg-muted rounded-lg">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Real-time Availability</span>
        </div>
        <div className="flex flex-col items-center space-y-2 p-3 bg-muted rounded-lg">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">6 Luxury Cottages</span>
        </div>
        <div className="flex flex-col items-center space-y-2 p-3 bg-muted rounded-lg">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">Lydenburg, SA</span>
        </div>
      </div>

      {/* NightsBridge Booking Frame */}
      <div className="booking-widget-container">
        <iframe
          src={`https://book.nightsbridge.com/${propertyId}?embedded=true&theme=light`}
          width="100%"
          height="400"
          frameBorder="0"
          scrolling="no"
          title="Booking Widget - Rivendell Trout Estate"
          className="rounded-lg border border-border"
          loading="lazy"
        />
      </div>

      {/* Trust indicators */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Secure payments via PayBridge • SSL encrypted
        </p>
        <div className="flex justify-center items-center space-x-4 text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Instant Confirmation</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            <span>Free Cancellation</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;