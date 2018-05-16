import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();


// This is built following this tutorial 
// https://www.fullstackreact.com/articles/how-to-write-a-google-maps-react-component/