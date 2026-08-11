import React from 'react';
import { Marker, useMapEvents } from 'react-leaflet';

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click: (e) => setPosition([e.latlng.lat, e.latlng.lng])
  });

  return position ? <Marker position={position} /> : null;
};

export default LocationPicker;
