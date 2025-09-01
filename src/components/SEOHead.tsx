import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
  type?: string;
  isBlogPost?: boolean;
  blogPostData?: {
    title: string;
    description: string;
    author: string;
    date: string;
    image: string;
    url: string;
  };
}

const SEOHead = ({ 
  title = "Rivendell Trout Estate – Luxury Flyfishing Retreat in Lydenburg",
  description = "Book direct for the lowest rates at Rivendell Trout Estate, a premier flyfishing destination in Mpumalanga, South Africa. Luxury cottages and pristine river fishing.",
  keywords = "flyfishing South Africa, Mpumalanga trout fishing, luxury fishing retreat, Lydenburg accommodation, Rivendell Trout Estate, flyfishing cottages, rainbow trout fishing, South Africa fishing holidays",
  ogImage = "https://rivendelltroutestate.co.za/og-image.jpg",
  url,
  type = 'website',
  isBlogPost,
  blogPostData
}: SEOHeadProps) => {
  
  useEffect(() => {
    // Update page title
    document.title = title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
    
    // Update Open Graph tags
    const updateOrCreateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };
    
    const siteUrl = url || 'https://yourdomain.com';
    const imageUrl = ogImage ? `${siteUrl}/${ogImage}` : `${siteUrl}/favicon.ico`;
    
    updateOrCreateOGTag('og:title', title);
    updateOrCreateOGTag('og:description', description);
    updateOrCreateOGTag('og:type', type);
    updateOrCreateOGTag('og:url', siteUrl);
    updateOrCreateOGTag('og:image', imageUrl);
    
    // Update Twitter Card tags
    const updateOrCreateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', content);
    };
    
    updateOrCreateTwitterTag('twitter:card', 'summary_large_image');
    updateOrCreateTwitterTag('twitter:title', title);
    updateOrCreateTwitterTag('twitter:description', description);
    updateOrCreateTwitterTag('twitter:image', imageUrl);
    
    // Structured Data for Local Business
    const orgSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Rivendell Trout Estate",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.ico`,
      "sameAs": [
        "https://www.facebook.com/rivendelltroutestate/",
        "https://www.instagram.com/rivendelltrout_estate/"
      ]
    };
    
    // Add or update structured data
    let structuredDataScript = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    structuredDataScript.textContent = JSON.stringify(orgSchema);
    
    if (isBlogPost && blogPostData) {
      const blogSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": blogPostData.title,
        "description": blogPostData.description,
        "author": {
          "@type": "Person",
          "name": blogPostData.author
        },
        "datePublished": blogPostData.date,
        "image": `${siteUrl}/${blogPostData.image}`,
        "url": blogPostData.url,
        "publisher": {
          "@type": "Organization",
          "name": "Rivendell Trout Estate",
          "logo": {
            "@type": "ImageObject",
            "url": `${siteUrl}/favicon.ico`
          }
        }
      };
      
      let blogSchemaScript = document.querySelector('#blog-schema') as HTMLScriptElement;
      if (!blogSchemaScript) {
        blogSchemaScript = document.createElement('script');
        blogSchemaScript.id = 'blog-schema';
        blogSchemaScript.type = 'application/ld+json';
        document.head.appendChild(blogSchemaScript);
      }
      blogSchemaScript.textContent = JSON.stringify(blogSchema);
    }
  }, [title, description, keywords, ogImage, url, type, isBlogPost, blogPostData]);

  return null;
};

export default SEOHead;