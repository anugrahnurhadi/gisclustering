import React, { Component } from 'react';
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import './../header.css'
//import KBK from './../../asset/geojson/KBK.geojson'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'



class Peta extends Component {
    componentDidMount(){
        this.map();
    }
    
    peta;
    map(){
        let self=this
        let map = L.map('map').setView([3.529577759895369,116.6265106388961], 13);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        var myLayer = L.geoJSON().addTo(map);
        let KBK = require('./../../asset/geojson/KBK.geojson');
        //myLayer.addData(KBK);
        console.log('kbk',KBK)
        self.peta=map
    }
    state = {  }
    render() {
        
        return ( 
        <div>
            
                     
                    <div style={{"width":"100%","height":"600px","position":"absolute"}}>
                            
                                <div className="Konten-muncul" style={{"z-index":"1","width":"100%","height":"100%","margin":"0px","position": "relative"}} id="map">
                                    
                                </div>
                                <div className="Konten-munculkanan" style={{"z-index":"2","float":"right","position": "absolute","margin":"10px","right":0,"top":0,"bottom":0}}>
                                    <div className="card" style={{"width":"300px","height":"100%","background-color":"black","opacity":"70%","padding":"7px"}}>
                                        <div classNeme="card-body">
                                            <p style={{"color":"white","font-size":"30px","text-align":"center"}}> <b>Information</b> </p>
                                        </div>    
                                    </div>
                                </div>
                                
                                
                                
                            
                    </div>
                    
        </div>    
        );
        
    }
}
 
export default Peta;