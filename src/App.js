import React from 'react';
import { BrowserRouter as Router, Route,  Link, Routes } from 'react-router-dom';
import WebcamPage from './WebCamPage.js';
import FileUploadPage from './FileUpload';
import VideoUpload from './VedioUpload';

const App= () => {
  return(
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Upload Photos</Link>
            </li>
            {/* <li>
              <Link to="/webcam">webcam prediction</Link>
            </li> */}
            <li>
              <Link to="/vedio">vedio prediction</Link>
            </li>
          </ul>
        </nav>

        
          <Routes>
          <Route path='/' exact Component={FileUploadPage}/>
          <Route path='/webcam' exact Component={WebcamPage}/>
          <Route path='/vedio' exact Component={VideoUpload}/>
          </Routes>
        
      </div>
    </Router>
  )
}

export default App;
