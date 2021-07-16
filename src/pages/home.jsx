import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './header'
import Peta from './peta/peta'



class Home extends Component {
    state = {  }
    render() { 
        return ( 
            <div style={{"background-color":"grey","height":"100%"}}>
                <Header></Header>
                <Peta />
            </div>

            );
    }
}
 
export default Home;