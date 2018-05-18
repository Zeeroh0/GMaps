//
//// This is meant to be a generic example of the parent Component.  
//
import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';


class Container extends React.Component {
  // The Container's state is used expressly for InfoWindows and for the user's click-to-add Marker.
  state = {
      userMarkerLocation: {},
      userMarkerVisible: false,
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  }

  // This handles dropping/moving the user's new marker and closing the open InfoWindow
  onMapClick = (props, marker, e) => {
    const { showingInfoWindow } = this.state;
    if (showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    } else {
      this.setUserMarker(e);
    }
  }
  
  // Drops/moves the user's Marker
  setUserMarker(e) {
    let lat = e.latLng.lat();
    let lng = e.latLng.lng();
    console.log(`You clicked on the map at location lat: ${lat}, lng ${lng}.\nThere are no open InfoWindows right now. Let's make a new one!`);
    this.setState({
      userMarkerLocation: { lat: lat, lng: lng },
      userMarkerVisible: true,
    });
  }

  // Handles opening a Marker's info window
  onMarkerClick = (coords, props, marker, e) => {
    this.setState({
      selectedPlace: { ...props, coords },
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {
    const { userMarkerVisible, userMarkerLocation, selectedPlace } = this.state;
    // A hard coded coordinates object to be passed into a Marker 
    const coordPosition = { lat: 37.759703, lng: -122.428093 };
    // A string location to be passed into a Marker; will be geolocated to derive a coordinates object
    const stringPosition = '1805 Geary Blvd San Francisco, CA 94115';

    return (
      <Map
        google={this.props.google}
        onClick={this.onMapClick}
        // --- Additional props, though all are predefined ---- 
        // zoom = int betweeen 1 (far) to 20 (close)
        // initialCenter = coords obj or string address
        // centerAroundCurrentLocation = true/false - true will move the map after load to the user's browser's location
        // any event functions (eg onMove, onReady, onMouseover, etc)
      >

        {/* This Marker is at the center of the map */}
        <Marker
          name={'Default Position'}
          onClick={this.onMarkerClick}
        />
        {/* This is the Marker generated at user click on the map */}
        <Marker
          userMarkerVisible={userMarkerVisible}
          name={'Selected Location'}
          onClick={this.onMarkerClick}
          location={
            userMarkerLocation &&
            { lat: userMarkerLocation.lat, lng: userMarkerLocation.lng }
          }
        />
        
        {/* Additional examples */}
        {/* Marker passing in a coordinate object */}
        <Marker
          location={coordPosition}
          onClick={this.onMarkerClick}
          name={'Dolores Park'}
        />
        {/* Marker passing in a string position */}
        <Marker
          location={stringPosition}
          name={'String Address'}
          onClick={this.onMarkerClick}
        />

        <InfoWindow 
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
        >
          <div className='InfoWindow'>
            <h3>{selectedPlace.name}</h3>
            {
              typeof selectedPlace.location === 'string' &&
              <p>{selectedPlace.location}</p> 
            }
          </div>
        </InfoWindow>
      
      </Map>
    );
  }
}


{/*
  HOC that connects the Container component to the Google API.
  When the API is loaded, this passes down a 'loaded' prop into the Container.
*/}
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAjhQU84gklJujZBSFNWTccfbX5QPkoOcg'
})(Container);
