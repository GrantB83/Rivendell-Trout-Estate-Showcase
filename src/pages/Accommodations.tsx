import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import BookingWidget from '@/components/BookingWidget';
import AmenitiesSection from '@/components/accommodations/AmenitiesSection';
import CottageCard from '@/components/accommodations/CottageCard';
import { getCottageImages } from '@/hooks/useCottageImages';

const Accommodations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const cottages = [
    {
      id: 'hobbiton',
      name: 'Hobbiton',
      bedrooms: 4,
      bathrooms: 4,
      maxGuests: 8,
      features: ['Fishing Pool & Weir', 'Large Patio', 'Mountain Views', 'Self-Catering Kitchen'],
      description: 'Our premier flagship cottage featuring a private fishing pool and weir for exclusive angling experiences. With expansive outdoor living spaces and stunning mountain vistas, this luxury retreat is perfectly designed for larger family groups seeking the ultimate fishing adventure.',
      images: getCottageImages('hobbiton'),
      highlights: ['Most Popular', 'Family Groups'],
      roomingDetails: [
        { room: 'Bedroom 1', bed: 'Queen bed only', bathroom: 'Full ensuite bathroom' },
        { room: 'Bedroom 2', bed: 'Two three quarter beds', bathroom: 'Full ensuite bathroom' },
        { room: 'Bedroom 3', bed: 'Queen bed only', bathroom: 'Shower only ensuite bathroom' },
        { room: 'Bedroom 4', bed: 'Two three quarter beds', bathroom: 'Shower only ensuite bathroom' }
      ]
    },
    {
      id: 'bag-end',
      name: 'Bag End',
      bedrooms: 4,
      bathrooms: 4,
      maxGuests: 8,
      features: ['Large Lawn', 'River Access', 'Large Patio', 'Lapa & BBQ Area', 'Family Friendly'],
      description: 'A premier family cottage with prime riverfront location and a spectacular separate lapa with braai facilities. The expansive lawn offers ideal space for family activities, while the dedicated outdoor entertainment area ensures memorable riverside dining experiences.',
      images: getCottageImages('bag-end'),
      highlights: ['Family Friendly', 'Family Groups', 'Large Garden'],
      roomingDetails: [
        { room: 'Bedroom 1', bed: 'King bed (or two singles)', bathroom: 'Toilet and basin ensuite' },
        { room: 'Bedroom 2', bed: 'Two singles (or one king bed)', bathroom: 'Toilet and basin ensuite' },
        { room: 'Bedroom 3', bed: 'King bed (or two singles)', bathroom: 'Toilet and basin ensuite' },
        { room: 'Bedroom 4', bed: 'Two singles (or one king bed)', bathroom: 'Toilet and basin ensuite' }
      ],
      additionalInfo: 'Rooms 1&2 and 3&4 each share a full bathroom in addition to their ensuite toilet & basin.'
    },
    {
      id: 'mirkwood',
      name: 'Mirkwood',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      features: ['Historic Gold Rush Ruins', 'Secluded Location', 'Forest Views', 'Wildlife Spotting'],
      description: 'A distinctive cottage nestled near historic gold rush ruins, offering a secluded forest retreat with exceptional wildlife viewing opportunities. This unique location provides an authentic wilderness experience while maintaining modern comforts for nature enthusiasts.',
      images: getCottageImages('mirkwood'),
      highlights: ['Historic Site', 'Wildlife Haven'],
      roomingDetails: [
        { room: 'Bedroom 1', bed: 'Two single beds (or one king)', bathroom: 'Full ensuite bathroom' },
        { room: 'Bedroom 2', bed: 'Two single beds (or one king)', bathroom: 'Shower only bathroom' },
        { room: 'Bedroom 3', bed: 'Bunk bed (two singles)', bathroom: 'Shares bathroom with Bedroom 2' }
      ]
    },
    {
      id: 'old-stone-house',
      name: 'Old Stone House',
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      features: ['Cliff Views', 'Stone Architecture', 'Sunset Views', 'Private Deck'],
      description: 'A beautifully constructed stone cottage with panoramic valley views and spectacular sunset vistas. The traditional stone architecture combined with modern amenities creates the perfect setting for families to enjoy the natural beauty of the estate.',
      images: getCottageImages('old-stone-house'),
      highlights: ['Cliff Views', 'Sunset Spot'],
      roomingDetails: [
        { room: 'Bedroom 1', bed: 'King bed', bathroom: 'Shower only ensuite bathroom' },
        { room: 'Bedroom 2', bed: 'Two single beds (or one king)', bathroom: 'Full shared bathroom' },
        { room: 'Bedroom 3', bed: 'King bed (or two singles)', bathroom: 'Shared bathroom downstairs with room 2' }
      ]
    },
    {
      id: 'bucklebury',
      name: 'Bucklebury',
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      features: ['Modern Furnishings', 'River Views', 'Couples Retreat', 'Luxury Finishes'],
      description: 'Elegant and intimate, this two-bedroom retreat combines contemporary style with natural beauty. Ideal for small families who want luxury amenities while staying close to the river\'s edge for memorable fishing experiences.',
      images: getCottageImages('bucklebury'),
      highlights: ['Modern Luxury', 'Couples Perfect'],
      roomingDetails: [
        { room: 'Bedroom 1', bed: 'King bed only', bathroom: 'Full ensuite bathroom' },
        { room: 'Bedroom 2', bed: 'Two singles (or one king bed)', bathroom: 'Ensuite bathroom shower only' }
      ]
    },
    {
      id: 'elvinbrook',
      name: 'Elvinbrook',
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      features: ['Intimate Setting', 'Riverside Location', 'Romantic', 'Private'],
      description: 'Our most intimate cottage, perfectly designed for couples seeking a romantic riverside escape. With its private atmosphere and direct river access, this charming retreat offers the ultimate setting for romantic getaways and peaceful solitude.',
      images: getCottageImages('elvinbrook'),
      highlights: ['Most Romantic', 'Riverside'],
      roomingDetails: [
        { room: 'Bedroom 1', bed: 'King bed (or two singles)', bathroom: 'Shower only bathroom' }
      ]
    }
  ];

  return (
    <Layout
      seo={{
        title: "Luxury Cottages at Rivendell Trout Estate | Mpumalanga Accommodation",
        description: "Book our exclusive self-catering cottages for a luxury flyfishing retreat in Lydenburg. Six unique cottages with river access and modern amenities.",
        keywords: "Mpumalanga luxury cottages, flyfishing accommodation South Africa, Lydenburg self-catering, luxury fishing retreat, Rivendell cottages"
      }}
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-forest-light text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-montserrat font-bold mb-6">
              Luxury Cottages
            </h1>
            <p className="text-xl mb-8 text-gold-soft">
              Six exclusive self-catering cottages, each offering unique character and pristine river access
            </p>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <AmenitiesSection />

      {/* Cottages Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
              Choose Your Perfect Retreat
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Each cottage offers a unique perspective on luxury and comfort
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {cottages.map((cottage) => (
              <CottageCard key={cottage.id} cottage={cottage} />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Widget */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-earth-warm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
            Ready to Experience the Thrill of River Fishing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Each cottage offers a unique perspective on the beauty of Rivendell. 
            Book directly for the best rates and exclusive benefits.
          </p>
          <Button 
            asChild 
            size="lg"
            className="btn-luxury"
          >
            <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
              Book Your Stay Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Accommodations;