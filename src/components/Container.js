import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';


class Container extends React.Component {
  state = {
      userMarkerLocation: {},
      userMarkerVisible: false,
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
  }

  onMapClick = (props, marker, e) => {
    const { showingInfoWindow, userMarkerVisible } = this.state;

    if (showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      });
    } else {
      this.setUserMarker(e);
    }
  }

  setUserMarker(e) {
    let lat = e.latLng.lat();
    let lng = e.latLng.lng();
    console.log(`You clicked on the map at location lat: ${lat}, lng ${lng}.\nThere are no open InfoWindows right now. Let's make a new one!`);
    this.setState({
      userMarkerLocation: { lat: lat, lng: lng },
      userMarkerVisible: true,
    });
  }

  onMarkerClick = (coords, props, marker, e) => {
    this.setState({
      selectedPlace: { ...props, coords },
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {
    const { userMarkerVisible, userMarkerLocation, selectedPlace } = this.state;
    const pos = { lat: 37.759703, lng: -122.428093 };
    return (
      <div >
        <Map
          google={this.props.google}
          onClick={this.onMapClick}
        >
          {/*
          */}
          <Marker
            location={pos}
            onClick={this.onMarkerClick}
            name={'Dolores Park'}
          />
          <Marker
            location='1805 Geary Blvd San Francisco, CA 94115'
            name={'String Address'}
            onClick={this.onMarkerClick}
          />
          <Marker
            name={'Default Position'}
            onClick={this.onMarkerClick}
          />
          <Marker
            userMarkerVisible={userMarkerVisible}
            name={'Selected Location'}
            onClick={this.onMarkerClick}
            location={
              userMarkerLocation &&
              {
                lat: userMarkerLocation.lat,
                lng: userMarkerLocation.lng
              }
            }
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
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAjhQU84gklJujZBSFNWTccfbX5QPkoOcg'
})(Container);
