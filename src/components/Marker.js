import React from 'react';
import { camelize } from '../helperFunctions/functions';


class Marker extends React.Component {

  componentDidUpdate(prevProps, prevState) {
    if ((
        (this.props.userMarkerVisible) ||
        (this.props.userMarkerVisible !== prevProps.userMarkerVisible)
      ) && (
        (this.props.map !== prevProps.map) ||
        (this.props.location !== prevProps.location) ||
        (this.props.mapCenter !== prevProps.mapCenter)
      )) {
      (this.marker) && (this.marker.setMap(null));
      this.calcAddressCoords();
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.marker.setMap(null);
    }
  }

  calcAddressCoords() {
    const { google, mapCenter, location } = this.props;
    const geocoder = new google.maps.Geocoder();
    const pos = location ? location : mapCenter;

    if (typeof pos === 'string') {
      geocoder.geocode({'address': pos}, (results, status) => {
        if (status === 'OK') {
          const newCoords = results[0].geometry.location;
          let locationCoords = { lat: newCoords.lat(), lng: newCoords.lng() };          
          this.renderMarker(locationCoords);
        } else {
          console.log('Geocoding errored out with status: ', status);
        }
      });
    } else {
      let locationCoords = new google.maps.LatLng(pos.lat, pos.lng);
      this.renderMarker(locationCoords);
    }
  }

  renderMarker(position) {
    const { map, google } = this.props;

    const pref = { map, position };
    this.marker = new google.maps.Marker(pref);

    const evtNames = ['click', 'mouseover'];
    evtNames.forEach(eventName => this.marker.addListener(eventName, this.handleEvent(eventName, position)));
  }

  handleEvent(eventName, coords) {
    return e => {
      const event = `on${camelize(eventName)}`;
      if (this.props[event]) {
        this.props[event](coords, this.props, this.marker, e);
      }
    }
  }

  render() { return null }
}

Marker.defaultProps = {
  userMarkerVisible: true,
  onMouseover: function() { console.log(`Moused over the marker`) },
  onClick: function() { console.log(`Clicked on a marker`) }
};

export default Marker;
