# GMaps

Google Maps built out for use inside of React.  

Allows for dynamicly generated location, markers, and info window.  

Handles any events.  Built out test case for click events including
- Dropping new marker
- Opening/closing info windows

Some of the functionality is listed below 

- Generates map
- `<Map/>` accepts a prop _centerAroundCurrenLocation_ that is a boolean to recenter the map on the browser's location (if the browser supports that)
- Can put in `<Marker/>` with a _location_ prop.  That can be either:
  - a string that'll be geocoded through the Google API (eg. '100 W Washington Ave, Phoenix, AZ)
  - an object that holds the latitude and longitude coordinates (eg.  { lat: int, lng: int })
- `<InfoWindow/>` will show the _name_ prop put on the <Marker/>
- Click event on the map drops a new marker.  Subsequent clicks move that custom marker. 


Special thanks for [Ari Lerner](https://github.com/auser) for his very helpful and well written guide that this project was largely based on.(https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/).
