import React from 'react';
import ReactDOM from 'react-dom';

import '../App.css'
import { camelize } from '../helperFunctions/functions';


class Map extends React.Component {
  state = {
    currentLocation: {
      lat: this.props.initialCenter.lat,
      lng: this.props.initialCenter.lng
    }
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
    this.loadMap();
  }

  componentDidUpdate(prevProps, prevState) {
    // When the google api is loaded and passed down as a prop, load the map
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    // If the state's location changes, recenter the map
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      // google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let { zoom } = this.props;
      let { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
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
    const curr = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(curr.lat, curr.lng);
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
  zoom: 13,
  // San Francisco
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  centerAroundCurrenLocation: false,
  onMove: function() { console.log('Moved the Google Map!') },
  onReady: function() { console.log('Google Map API is loaded') }
};

export default Map;
