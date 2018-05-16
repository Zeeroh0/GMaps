import React from 'react';
import { GoogleApiWrapper } from 'google-maps-react';

import Map from './Map';
import Marker from './Marker';


class Container extends React.Component {

  render() {
    const pos = { lat: 37.759703, lng: -122.428093 }
    return (
      <div >
        <Map
          google={this.props.google}
          // onReady={() => console.log('This onReady func was passed in as a props')}
        >
          <Marker position={{ lat: 37, lng: -122 }}/>
          <Marker position={pos} />
          <Marker />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyAjhQU84gklJujZBSFNWTccfbX5QPkoOcg'
})(Container);
