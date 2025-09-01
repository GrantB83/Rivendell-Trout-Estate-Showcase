import React, { useEffect } from 'react';
import { Shield, Award, Calendar, CreditCard, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import BookingWidget from '@/components/BookingWidget';

const Booking = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const benefits = [
    {
      icon: Award,
      title: 'Guaranteed Lowest Rates',
      description: 'Book direct and save up to 15% compared to third-party booking sites'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'PayBridge secure payment processing with SSL encryption and fraud protection'
    },
    {
      icon: Calendar,
      title: 'Flexible Cancellation',
      description: 'Free cancellation up to 48 hours before arrival for most bookings'
    },
    {
      icon: CreditCard,
      title: 'Instant Confirmation',
      description: 'Immediate booking confirmation and digital receipts sent to your email'
    }
  ];

  const whyBookDirect = [
    'Guaranteed lowest rates - we match any lower price',
    'Free WiFi and parking included',
    'Priority room selection and upgrades when available',
    'Direct communication with our hospitality team',
    'Flexible check-in/check-out times when possible',
    'Exclusive access to special offers and packages'
  ];

  return (
    <Layout
      seo={{
        title: "Book Direct at Rivendell Trout Estate | Lowest Rate Guarantee",
        description: "Secure the lowest rates for your luxury flyfishing retreat in Lydenburg with direct bookings. Instant confirmation, secure payments, and exclusive benefits.",
        keywords: "book flyfishing retreat, Mpumalanga direct bookings, Rivendell Trout Estate reservations, luxury fishing accommodation booking"
      }}
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-forest-light text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold mb-6">
              Book Direct & Save
            </h1>
            <p className="text-xl mb-8 text-gold-soft">
              Guaranteed lowest rates and exclusive benefits when you book directly with us
            </p>
          </div>
        </div>
      </section>

      {/* Guaranteed Lowest Rates Banner */}
      <section className="py-8 bg-gradient-to-r from-accent to-earth-warm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold text-primary mb-2">
            🏆 Guaranteed Lowest Rates
          </h2>
          <p className="text-lg text-muted-foreground">
            Book direct for the lowest rates and an exclusive flyfishing experience
          </p>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Booking Widget */}
            <div className="lg:col-span-2">
              <BookingWidget 
                title="Book Your Luxury Retreat"
                className="h-full"
              />
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="text-xl font-playfair text-primary">
                    Why Book Direct?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {whyBookDirect.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="card-luxury">
                <CardHeader>
                  <CardTitle className="text-lg font-playfair text-primary">
                    Need Assistance?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <a 
                          href="https://wa.me/27836458313" 
                          className="text-sm text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          +27 83 645 8313
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a 
                          href="mailto:stay@hospitality.partners" 
                          className="text-sm text-primary hover:underline"
                        >
                          stay@hospitality.partners
                        </a>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4 btn-outline-luxury" asChild>
                    <a href="https://wa.me/27836458313" target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-4">
              Direct Booking Benefits
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the advantages of booking directly with Rivendell Trout Estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-luxury text-center p-6">
                <div className="mb-4">
                  <div className="bg-accent text-accent-foreground p-3 rounded-full w-fit mx-auto">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                </div>
                <CardTitle className="text-lg font-playfair text-primary mb-3">
                  {benefit.title}
                </CardTitle>
                <CardContent className="p-0">
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card-hero p-8 text-center">
              <div className="mb-6">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-playfair font-bold text-primary mb-2">
                  Secure Payments via PayBridge
                </h3>
                <p className="text-muted-foreground">
                  Your payment information is protected with bank-level security
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>SSL Encrypted</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Award className="w-4 h-4 text-yellow-600" />
                  <span>Fraud Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Bookings Section */}
      <section className="py-20 bg-forest-deep text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-4">
            Group Bookings & Special Events
          </h2>
          <p className="text-xl text-gold-soft mb-8 max-w-2xl mx-auto">
            Planning a corporate retreat, fishing tournament, or special celebration? 
            We offer customized packages for groups.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="btn-luxury"
            >
              <a href="mailto:stay@hospitality.partners?subject=Group Booking Inquiry">
                Inquire About Group Rates
              </a>
            </Button>
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-gold-luxury text-gold-text hover:bg-gold-luxury hover:text-forest-deep"
            >
              <a href="https://wa.me/27836458313" target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;