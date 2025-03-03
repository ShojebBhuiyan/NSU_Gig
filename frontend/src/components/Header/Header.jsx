// import React from 'react'
// import './Header.css'

// const Header = () => {
//   return (
//     <div className='header'>
//         <div className="header-contents">
//             <h2>Order your favorite food here</h2>
//             <p>Meet Homely Foods</p>
//             <a href="#explore-menu"><button className='buttonwl'>View Kitchen</button></a>
//         </div>
//     </div>
//   )
// }

// export default Header

import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className='header'>
        <div className="header-contents">
            <h2>Order Your Favorite Food Here</h2>
            <p>Freshly cooked meals delivered to your doorstep</p>
            <a href="#explore-menu">
                <button className='buttonwl'>View Kitchen</button>
            </a>
        </div>
    </header>
  );
};

export default Header;
