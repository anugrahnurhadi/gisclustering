import React, { Component } from 'react';
import './header.css'
import earth from './../asset/earth.png'
import 'bootstrap/dist/css/bootstrap.min.css'
class Header extends Component {
    state = {  }
    render() { 
        return ( 
            <div style={{"background-image":"linear-gradient(30deg, blue, purple)", "width":"100%", "height":"110px"}}>
                
                
                    <h1 style={{"padding-left":"20px","padding-top":"20px","color":"white"}} className="Konten-muncul"> <img src={earth} className="Tulisan-keren" style={{"width":"70px","height":"70px"}} /> Mapping Application </h1>
                
            </div>
         );
    }
}
 
export default Header;