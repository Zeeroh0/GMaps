import React from 'react';
import ReactDOM from 'react-dom';

import '../App.css'
import { camelize } from '../helperFunctions/functions';


class Map extends React.Component {
  state = {
    currentLocation: {
      lat: null,
      lng: null
    },
    zoom: this.props.zoom,
  }

  componentDidMount() {
    // If we turn it on, we can center the map off the user's browser location
    if (this.props.centerAroundCurrenLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          });
        });
      }
    }
    this.calcMapCenter(this.props.initialCenter);
  }

  componentDidUpdate(prevProps, prevState) {
    // When the google api is loaded and passed down as a prop, load the map
    if (prevProps.google !== this.props.google) {
      this.calcMapCenter(this.props.initialCenter);
    }
    // If the state's location changes, recenter the map
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  calcMapCenter(location) {
    const { google } = this.props;
    const { currentLocation } = this.state;
    const geocoder = new google.maps.Geocoder();

    const showGeoLocation = (results) => {
      results.length > 5 && showDefaultMap();
      const coords = results[0].geometry.location;
      const loc = { lat: coords.lat(), lng: coords.lng() };
      const zoom = 18;
      this.setState({ 
        currentLocation: loc,
        zoom,
      }, this.loadMap(loc, zoom));
    };

    const showCoordLocation = () => {
      const zoom = 18;
      this.setState({
        currentLocation: location,
        zoom,
      }, this.loadMap(location, zoom));
    };

    const showDefaultMap = () => {
      const middleOfUSA = { lat: 39.8283, lng: -98.5795 };
      const zoom = 4;
      this.setState(
        { currentLocation: middleOfUSA, zoom },
        this.loadMap(middleOfUSA, zoom)
      );
    };

    if (typeof location === 'string') {
      geocoder.geocode({ 'address': location }, (results, status) => {
        (status === 'OK') ? showGeoLocation(results) :
        (!currentLocation.lat || currentLocation.lng) ? showDefaultMap() :
        (currentLocation.lat && currentLocation.lng) && null;
      });
    } else if (typeof location === 'object') {
      showCoordLocation();
    } else {
      alert('where even are we??');
    }
  }

  loadMap(location, zoomLevel) {
    if (this.props && this.props.google) {
      // google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let loc, zoom;
      location ? loc = location : loc = this.state.currentLocation;
      zoomLevel ? zoom = zoomLevel : zoom = this.state.zoom;

      const center = new maps.LatLng(loc.lat, loc.lng);
      const mapConfig = Object.assign({}, {
        center,
        zoom
      });
      this.map = new maps.Map(node, mapConfig);
      this.setState(this.state);

      // Set up event handlers
      const evtNames = ['click', 'move', 'ready', 'dragend'];
      evtNames.forEach(e => {
        this.map.addListener(e, this.handleEvent(e));
      });

      // force the trigger of the onReady prop (if passed down)
      maps.event.trigger(this.map, 'ready');

    }
  }

  handleEvent(evtName) {
    let timeout;
    const handlerName = `on${camelize(evtName)}`;

    return (e) => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      timeout = setTimeout(() => {
        if (this.props[handlerName]) {
          this.props[handlerName](this.props, this.map, e);
        }
      }, 0);
    }
  }

  recenterMap() {
    const map = this.map;
    const current = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(current.lat, current.lng);
      map.panTo(center);
    }
  }

  renderChildren() {
    let { children } = this.props;
    
    if (!children) return;

    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation,
      });
    });
  }

  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    };

    return(
      <div ref='map' style={style}>
        Loading map...
        { this.renderChildren() }
      </div>
    );
  }
};

Map.defaultProps = {
  zoom: 1,
  initialCenter: 
  // 'adsfadsfasdf',
  // '100 W Washington Ave, Phoenix, AZ',
  // {
  //   lat: 37.774929,
  //   lng: -122.419416
  // },
  // USA
  { lat: 39.8283, lng: -98.5795 },
  centerAroundCurrenLocation: false,
  onMove: function() { console.log('Moved the Google Map!') },
  onReady: function() { console.log('Google Map API is loaded') }
};

export default Map;
