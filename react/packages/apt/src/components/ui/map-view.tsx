'use client';

import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

interface MapTypes {
  address: string;
  mapContainerClassName?: string;
  onSelectLocation?: (e: google.maps.MapMouseEvent) => void;
}

const options: google.maps.MapOptions = {
  draggable: true,
  mapTypeControl: true,
  fullscreenControl: false,
  streetViewControl: false,
  clickableIcons: true,
};

export default function MapView({ address, mapContainerClassName, onSelectLocation = (_) => {} }: MapTypes) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
  });

  const [latLng, setLatLng] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    if (isLoaded && address) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          setLatLng({ lat: location.lat(), lng: location.lng() });
        }
      });
    }
  }, [isLoaded, address]);

  if (!isLoaded || !latLng) {
    return <span>Loading...</span>;
  }

  return (
    <GoogleMap
      mapContainerClassName={mapContainerClassName}
      center={latLng}
      zoom={18}
      options={options}
      onClick={(e) => {onSelectLocation(e)}}
    >
      <Marker position={latLng} />
    </GoogleMap>
  );
}