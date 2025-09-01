import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Award, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import BookingWidget from '@/components/BookingWidget';
import heroCottageRiver from '@/assets/hero-cottage-river.jpg';
import fishingAction from '@/assets/fishing-action.jpg';
import luxuryCottageInterior from '@/assets/luxury-cottage-interior.jpg';
import aerialEstateView from '@/assets/aerial-estate-view.jpg';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const testimonials = [
    {
      quote: "The cottage (Bag End) was perfect and had everything we needed. The boys loved the fishing and I loved the walking. Thank you Angus and Jenny for your hospitality, we will be definitely be back.",
      author: "Nikki Eagar",
      source: "Guest Review"
    },
    {
      quote: "With the cottage nestled into the valley, the cliffs behind and the bubbling stream in front of the house, time stands still and the world fades quickly away! The cottage is very well equipped and comfortable.",
      author: "Nicola van As",
      source: "Guest Review"
    },
    {
      quote: "We had a peaceful long weekend at Rivendell Trout Estate. Stayed in the quaint Bucklebury Cottage overlooking the river. Excellent trout fishing and our dog loved the long walks. We will surely be back!",
      author: "Janita Erwee",
      source: "Guest Review"
    }
  ];

  const features = [
    {
      icon: Award,
      title: "Luxury Accommodations",
      description: "6 exclusive self-catering cottages with premium amenities"
    },
    {
      icon: Shield,
      title: "Pristine River Access",
      description: "Private access to the Spekboom River with regular trout stocking"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Local knowledge and support for the ultimate fishing experience"
    }
  ];

  return (
    <Layout
      seo={{
        title: "Rivendell Trout Estate – Luxury Flyfishing Retreat in Lydenburg",
        description: "Book direct for the lowest rates at Rivendell Trout Estate, a premier flyfishing destination in Mpumalanga, South Africa. Luxury cottages and pristine river fishing.",
        keywords: "flyfishing South Africa, Mpumalanga trout fishing, luxury fishing retreat, Lydenburg accommodation, Rivendell Trout Estate, flyfishing cottages, rainbow trout fishing, South Africa fishing holidays"
      }}
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video Placeholder */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={heroCottageRiver}
          >
            <source src="/spekboom-river-video.mp4" type="video/mp4" />
            {/* Fallback image if video fails to load */}
          </video>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <img 
              src="/lovable-uploads/6e1fcc1c-8d4a-4293-b907-e0fe41c138ff.png" 
              alt="Rivendell Trout Estate" 
              className="h-48 md:h-60 lg:h-72 w-auto mx-auto mb-6"
            />
            <p className="text-subtitle text-primary-foreground mb-8 max-w-2xl mx-auto">
              Discover an exclusive flyfishing retreat in Lydenburg, South Africa, 
              offering luxury self-catering cottages and pristine river fishing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="btn-hero"
              >
                <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
                  Book Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button 
                asChild 
                size="lg"
                className="btn-luxury"
              >
                <Link to="/accommodations">
                  View Cottages
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary-foreground rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary-foreground rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Guaranteed Lowest Rates Section */}
      <section className="py-16 bg-gradient-to-r from-accent to-earth-warm">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
              Guaranteed Lowest Rates – Book Direct
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Save money and enjoy exclusive benefits when you book directly with us. 
              Skip the middleman and get the best rates guaranteed.
            </p>
            <Button 
              asChild 
              size="lg"
              className="btn-luxury"
            >
              <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
                Book Direct & Save
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-primary">
                A Premier Flyfishing Destination
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nestled in the heart of Mpumalanga's Mt. Anderson Nature Reserve, 
                Rivendell Trout Estate offers an unparalleled flyfishing experience. 
                Our exclusive retreat features six luxury self-catering cottages, 
                each providing direct access to the pristine Spekboom River.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're an experienced angler or new to the sport, our 
                regularly stocked river and expert local guidance ensure an 
                unforgettable fishing adventure in one of South Africa's most 
                beautiful natural settings.
              </p>
              <Button 
                asChild 
                className="btn-luxury"
              >
                <Link to="/activities">
                  Explore Activities
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src={fishingAction} 
                alt="Professional fly fishing on Spekboom River at Rivendell Trout Estate"
                className="rounded-lg shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-luxury)] transition-shadow"
                loading="lazy"
              />
              <img 
                src={luxuryCottageInterior} 
                alt="Luxury cottage interior at Rivendell Trout Estate"
                className="rounded-lg shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-luxury)] transition-shadow"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
              Why Choose Rivendell
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of luxury accommodation and world-class fishing
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-luxury p-8 text-center animate-scale-in">
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-montserrat font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Widget Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <BookingWidget />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-forest-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-montserrat font-bold text-primary-foreground mb-4">
              What Our Guests Say
            </h2>
            <p className="text-xl text-gold-soft">
              Hear from fellow anglers about their Rivendell experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-primary-foreground rounded-xl p-8 shadow-[var(--shadow-luxury)] animate-fade-in">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-muted-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="text-sm">
                  <div className="font-semibold text-primary">{testimonial.author}</div>
                  <div className="text-muted-foreground">{testimonial.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Aerial View Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-primary mb-4">
              Your Luxury Retreat Awaits
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Six exclusive cottages nestled along the pristine Spekboom River
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-luxury)]">
            <img 
              src={aerialEstateView} 
              alt="Aerial view of Rivendell Trout Estate showing six luxury cottages along the Spekboom River"
              className="w-full h-96 md:h-[600px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-8 text-primary-foreground">
                <h3 className="text-2xl font-playfair font-bold mb-2">
                  Mt. Anderson Nature Reserve
                </h3>
                <p className="text-lg">
                  35,000 hectares of pristine South African wilderness
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-forest-deep text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-4">
            Ready for Your Luxury Fishing Adventure?
          </h2>
          <p className="text-xl text-gold-soft mb-8 max-w-2xl mx-auto">
            Book direct for guaranteed lowest rates and an exclusive flyfishing experience 
            in the heart of South Africa's most beautiful landscape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <Button 
              asChild 
              size="lg"
              variant="outline"
              className="border-gold-luxury text-gold-text hover:bg-gold-luxury hover:text-forest-deep"
            >
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;