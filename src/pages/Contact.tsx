import React, { useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const contactMethods = [
    {
      icon: Phone,
      title: 'WhatsApp',
      value: '+27 83 645 8313',
      action: 'https://wa.me/27836458313',
      description: 'Quick responses for bookings and inquiries'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'stay@hospitality.partners',
      action: 'mailto:stay@hospitality.partners',
      description: 'Detailed inquiries and booking confirmations'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Natalshoop Farm, Mt. Anderson Nature Reserve, Lydenburg, 1110, RSA',
      action: 'https://maps.google.com/?q=Natalshoop+Farm+Mt+Anderson+Nature+Reserve+Lydenburg',
      description: 'Get directions to our estate'
    }
  ];

  const arrivalInfo = [
    { item: 'Check-in Time', detail: '2:00 PM (14:00)' },
    { item: 'Check-out Time', detail: '10:00 AM' },
    { item: 'Self Check-in', detail: 'Access details sent prior' },
    { item: 'Parking', detail: 'Free on-site parking' },
    { item: 'Pets', detail: 'Pet-friendly accommodation' }
  ];

  return (
    <Layout
      seo={{
        title: "Contact Rivendell Trout Estate | Luxury Flyfishing Retreat Lydenburg",
        description: "Get in touch for bookings at our luxury flyfishing retreat in Lydenburg. WhatsApp, email, and location details for Rivendell Trout Estate.",
        keywords: "Mpumalanga accommodation contact, Rivendell Trout Estate directions, Lydenburg fishing retreat contact, South Africa luxury accommodation"
      }}
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-forest-light text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl mb-8 text-gold-soft">
              We're here to help plan your perfect flyfishing retreat in the heart of Mpumalanga
            </p>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="card-luxury text-center hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="bg-accent text-accent-foreground p-3 rounded-full w-fit mx-auto mb-4">
                    <method.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-playfair text-primary">
                    {method.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-foreground break-words">{method.value}</p>
                    <Button 
                      asChild 
                      className="btn-luxury w-full"
                    >
                      <a 
                        href={method.action} 
                        target={method.title === 'Location' ? '_blank' : undefined}
                        rel={method.title === 'Location' ? 'noopener noreferrer' : undefined}
                      >
                        {method.title === 'WhatsApp' ? 'Chat Now' : 
                         method.title === 'Email' ? 'Send Email' : 'Get Directions'}
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map and Details */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Map */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-playfair font-bold text-primary mb-4">
                  Find Us
                </h2>
                <p className="text-muted-foreground mb-6">
                  Located in the pristine Mt. Anderson Nature Reserve, our estate offers 
                  easy access while maintaining complete privacy and tranquility.
                </p>
              </div>
              
              {/* Google Maps Embed */}
              <div className="rounded-lg overflow-hidden shadow-[var(--shadow-elegant)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.123456789!2d30.457!3d-25.095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sMt.%20Anderson%20Nature%20Reserve!5e0!3m2!1sen!2sza!4v1234567890123"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rivendell Trout Estate Location"
                />
              </div>
            </div>

            {/* Arrival Information and Info */}
            <div className="space-y-8">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-primary flex items-center">
                    <Clock className="w-6 h-6 mr-3" />
                    Arrival Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {arrivalInfo.map((info, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                        <span className="font-medium text-foreground">{info.item}</span>
                        <span className="text-muted-foreground">{info.detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="text-2xl font-playfair text-primary">
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Stay updated with the latest from Rivendell Trout Estate
                  </p>
                  <div className="flex space-x-4">
                    <Button
                      asChild
                      variant="outline"
                      className="btn-outline-luxury flex-1"
                    >
                      <a 
                        href="https://www.facebook.com/rivendelltroutestate/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Facebook className="w-5 h-5 mr-2" />
                        Facebook
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="btn-outline-luxury flex-1"
                    >
                      <a 
                        href="https://www.instagram.com/rivendelltrout_estate/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <Instagram className="w-5 h-5 mr-2" />
                        Instagram
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Booking CTA */}
              <Card className="card-hero text-center p-8">
                <h3 className="text-2xl font-playfair font-bold text-primary mb-4">
                  Ready to Book?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Secure your luxury flyfishing retreat with our easy online booking system
                </p>
                <Button 
                  asChild 
                  size="lg"
                  className="btn-luxury w-full"
                >
                  <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
                    Book Direct & Save
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Directions Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair font-bold text-primary mb-8 text-center">
              Getting to Rivendell
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-primary">
                    From Johannesburg
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-muted-foreground">
                    <p>• Take the N4 towards Nelspruit</p>
                    <p>• Exit at Belfast/Dullstroom (R540)</p>
                    <p>• Follow signs to Lydenburg</p>
                    <p>• Turn onto Natalshoop Farm road</p>
                    <p className="text-primary font-medium">Total: 3.5 hours drive</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-primary">
                    From Cape Town
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-muted-foreground">
                    <p>• Fly to OR Tambo International</p>
                    <p>• Drive via N4 to Lydenburg</p>
                    <p>• Or fly to Kruger Mpumalanga Airport</p>
                    <p>• 1.5 hour drive from KMIA</p>
                    <p className="text-primary font-medium">Flight + 3.5hr drive or 1.5hr from KMIA</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;