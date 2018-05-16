import React from 'react';
import ReactDOM from 'react-dom';
import '../App.css'
import { camelize } from '../helperFunctions/functions';



class Map extends React.Component {
  // constructor(props) {
  //   super(props);

  //   const { lat, lng } = this.props.initialCenter;
  //   this.state = {
  //     currentLocation: {
  //       lat: lat,
  //       lng: lng
  //     }
  //   }
  // }

  state = {
    currentLocation: {
      lat: this.props.initialCenter.lat,
      lng: this.props.initialCenter.lng
    }
  }

  componentDidMount() {
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
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  loadMap() {
    debugger;
    if (this.props && this.props.google) {
      // google is available
      const { google } = this.props;
      const maps = google.maps;

      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      let { initialCenter, zoom } = this.props;
      let { lat, lng } = this.state.currentLocation;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center,
        zoom: zoom
      });
      this.map = new maps.Map(node, mapConfig);

      // Set up event handlers
      const evtNames = ['click', 'move', 'ready', 'dragend'];
      evtNames.forEach(e => {
        this.map.addListener(e, this.handleEvent(e));
      });

      // force the trigger of the onReady prop (if passed down)
      maps.event.trigger(this.map, 'ready');
      this.renderChildren();
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
    debugger;
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

  // renderChildren() {
  //   const {children} = this.props;

  //   if (!children) return;

  //   return React.Children.map(children, c => {
  //     return React.cloneElement(c, {
  //       map: this.map,
  //       google: this.props.google,
  //       mapCenter: this.state.currentLocation
  //     });
  //   })
  // }

  render() {
    const style = {
      width: '100vw',
      height: '100vh'
    }
    return(
      <div ref='map' style={style}>
        Loading map...
        { this.renderChildren() }
      </div>
    );
  }
}

// Map.propTypes = {
//   google: React.PropTypes.object,
//   zoom: React.PropTypes.number,
//   initialCenter: React.PropTypes.object,
//   centerAroundCurrenLocation: React.PropTypes.bool,
//   onMove: React.PropTypes.func,
//   evtNames.forEact(e => Map.propTypes[camelize(e)] = T.func)
// }

Map.defaultProps = {
  zoom: 13,
  // San Francisco
  initialCenter: {
    lat: 37.774929,
    lng: -122.419416
  },
  centerAroundCurrenLocation: false,
  onMove: function() { console.log('Default onMove func was called!') },
  onReady: function() { console.log('Default onReady func was called!') }
}

export default Map;
