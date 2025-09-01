import React, { useEffect } from 'react';
import { ArrowRight, Fish, Camera, Mountain, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const Activities = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const activities = [
    {
      id: 'flyfishing',
      title: 'Premium Flyfishing',
      icon: Fish,
      duration: 'Full Day',
      difficulty: 'All Levels',
      description: 'Flyfish for rainbow trout on the pristine Spekboom River, regularly stocked for an exclusive fishing experience. Our guides provide expert instruction for beginners and advanced techniques for experienced anglers.',
      features: [
        'Regularly stocked rainbow trout',
        'Private river access',
        'Equipment rental available',
        'Professional guide service',
        'Catch and release encouraged'
      ],
      image: '/fishing-image-1.jpg',
      season: 'Year-round'
    },
    {
      id: 'nature-walks',
      title: 'Guided Nature Walks',
      icon: Mountain,
      duration: '2-4 Hours',
      difficulty: 'Easy to Moderate',
      description: 'Explore the diverse ecosystems of Mt. Anderson Nature Reserve with experienced guides who share insights into local flora, fauna, and conservation efforts.',
      features: [
        'Experienced nature guides',
        'Flora and fauna identification',
        'Photography opportunities',
        'Conservation education',
        'Small group sizes'
      ],
      image: '/nature-image-1.jpg',
      season: 'Year-round'
    },
    {
      id: 'wildlife-spotting',
      title: 'Wildlife Spotting',
      icon: Camera,
      duration: 'Dawn/Dusk',
      difficulty: 'Easy',
      description: 'Discover the abundant wildlife of the reserve including kudu, bushbuck, Fish Eagles, and over 200 bird species in their natural habitat.',
      features: [
        'Kudu and bushbuck sightings',
        'Fish Eagle observations',
        '200+ bird species',
        'Early morning game drives',
        'Photography guidance'
      ],
      image: '/wildlife-image-1.jpg',
      season: 'Year-round'
    }
  ];

  const dayTrips = [
    {
      name: 'Kruger National Park',
      distance: '2.5 hours',
      description: 'Experience the Big Five in one of Africa\'s most famous game reserves.',
      highlights: ['Big Five game viewing', 'Professional guides available', 'Full day safari options'],
      image: '/kruger-trip.jpg'
    },
    {
      name: 'Dullstroom',
      distance: '1 hour',
      description: 'Charming highland town famous for its trout fishing and country atmosphere.',
      highlights: ['Trout fishing', 'Antique shopping', 'Country cuisine'],
      image: '/dullstroom-trip.jpg'
    },
    {
      name: 'Sabie',
      distance: '1.5 hours',
      description: 'Gateway to the Panorama Route with stunning waterfalls and scenic drives.',
      highlights: ['Panorama Route', 'Waterfalls', 'Scenic drives'],
      image: '/sabie-trip.jpg'
    },
    {
      name: 'Graskop',
      distance: '1.5 hours',
      description: 'Adventure activities and breathtaking views of the Blyde River Canyon.',
      highlights: ['Blyde River Canyon', 'Adventure activities', 'God\'s Window'],
      image: '/graskop-trip.jpg'
    },
    {
      name: 'Hazyview',
      distance: '2 hours',
      description: 'Elephant sanctuaries and adventure activities near Kruger\'s gates.',
      highlights: ['Elephant interactions', 'Adventure sports', 'Kruger access'],
      image: '/hazyview-trip.jpg'
    }
  ];

  return (
    <Layout
      seo={{
        title: "Luxury Activities at Rivendell Trout Estate | Mpumalanga Adventures",
        description: "Enjoy premier flyfishing, wildlife spotting, and day trips from our Lydenburg retreat. Explore Kruger National Park, Dullstroom, and the Panorama Route.",
        keywords: "Mpumalanga flyfishing, Kruger National Park day trips, luxury nature retreats, Lydenburg activities, South Africa fishing, wildlife spotting"
      }}
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-forest-light text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-montserrat font-bold mb-6">
              Premium Activities
            </h1>
            <p className="text-xl mb-8 text-gold-soft">
              From world-class flyfishing to spectacular wildlife encounters and scenic day trips
            </p>
          </div>
        </div>
      </section>

      {/* Main Activities */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
              Estate Activities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Immerse yourself in the natural beauty and recreational opportunities at Rivendell
            </p>
          </div>

          <div className="space-y-16">
            {activities.map((activity, index) => (
              <div key={activity.id} className="card-luxury overflow-hidden">
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Activity Image */}
                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img 
                      src={activity.image}
                      alt={`${activity.title} at Rivendell Trout Estate`}
                      className="w-full h-80 lg:h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=800&h=600&fit=crop&crop=center`;
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-accent text-accent-foreground p-3 rounded-full">
                        <activity.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className={`p-8 ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className="mb-6">
                      <h3 className="text-3xl font-montserrat font-bold text-primary mb-4">
                        {activity.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{activity.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{activity.difficulty}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{activity.season}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {activity.description}
                    </p>

                    {/* Features */}
                    <div className="mb-8">
                      <h4 className="font-semibold text-primary mb-3">What's Included:</h4>
                      <div className="space-y-2">
                        {activity.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-accent rounded-full"></div>
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day Trips */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
              Scenic Day Trips
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore the wonders of Mpumalanga from your luxury base at Rivendell
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dayTrips.map((trip, index) => (
              <Card key={index} className="card-luxury overflow-hidden">
                <div className="relative">
                  <img 
                    src={trip.image}
                    alt={`Day trip to ${trip.name} from Rivendell Trout Estate`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop&crop=center`;
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {trip.distance}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-montserrat text-primary">
                    {trip.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {trip.description}
                  </p>
                  <div className="space-y-2">
                    {trip.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent to-earth-warm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
            Book Your Adventure
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From sunrise fishing sessions to sunset wildlife viewing, 
            your perfect South African adventure awaits at Rivendell.
          </p>
          <Button 
            asChild 
            size="lg"
            className="btn-luxury"
          >
            <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
              Book Your Stay
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Activities;