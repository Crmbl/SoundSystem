import React from 'react';

class Waves extends React.Component{

  render() {
    
    return (
      <div className="waves">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="goo">
              {/* <feColorMatrix in="SourceGraphic" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" /> */}
              <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
          </defs>
        </svg>
      </div>
    );
  }

}

export default Waves