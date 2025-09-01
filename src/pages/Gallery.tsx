import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useCottageImages } from '@/hooks/useCottageImages';

const Gallery = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { cottageId } = useParams<{ cottageId: string }>();

  const cottageNames: { [key: string]: string } = {
    'hobbiton': 'Hobbiton',
    'bag-end': 'Bag End',
    'mirkwood': 'Mirkwood',
    'old-stone-house': 'Old Stone House',
    'bucklebury': 'Bucklebury',
    'elvinbrook': 'Elvinbrook'
  };

  const cottageName = cottageNames[cottageId || ''] || 'Cottage';
  const { images, loading, imageCount } = useCottageImages(cottageId || '');

  if (!cottageId || !cottageNames[cottageId]) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-montserrat font-bold text-primary mb-4">
            Gallery Not Found
          </h1>
          <Button asChild>
            <Link to="/accommodations">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Accommodations
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      seo={{
        title: `${cottageName} Gallery - Rivendell Trout Estate`,
        description: `View stunning photos of ${cottageName} cottage at Rivendell Trout Estate, featuring luxury amenities and beautiful river views.`,
        keywords: `${cottageName} cottage photos, Rivendell gallery, luxury accommodation images`
      }}
    >
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary to-forest-light text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-2">
                {cottageName} Gallery
              </h1>
              <p className="text-xl text-gold-soft">
                Explore every detail of this luxury cottage
              </p>
            </div>
            <Button asChild variant="outline" className="border-gold-luxury text-gold-text hover:bg-gold-luxury hover:text-forest-deep">
              <Link to="/accommodations">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading gallery images...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-muted-foreground">
                  {imageCount} image{imageCount !== 1 ? 's' : ''} found
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <div key={index} className="card-luxury overflow-hidden group">
                    <img 
                      src={image}
                      alt={`${cottageName} cottage view ${index + 1}`}
                      className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&h=600&fit=crop&crop=center`;
                      }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-montserrat font-bold text-primary mb-4">
            Ready to Book {cottageName}?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience this luxury cottage for yourself with direct booking for the best rates.
          </p>
          <Button 
            asChild 
            size="lg"
            className="btn-luxury"
          >
            <a href="https://book.nightsbridge.com/24847?promocode=WEBDIRECT" target="_blank" rel="noopener noreferrer">
              Book {cottageName} Now
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Gallery;