import React, { Component } from 'react';
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import markerIconPng from "leaflet/dist/images/marker-icon.png"

import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/leaflet.markercluster-src.js'
//import 'leaflet/dist/leaflet.css';
import './../header.css'
//import KBK from './../../asset/geoj
import outlet from './../../asset/outletsample.json'
import marker_icon_2x from './../../asset/images/marker_icon_2x.png'
import marker_icon from './../../asset/images/marker_icon.png'
import marker_shadow from './../../asset/images/marker_shadow.png'
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: marker_icon_2x,
    iconUrl: marker_icon,
    shadowUrl: marker_shadow
});


class Peta extends Component {
    componentDidMount(){
        this.map();
    }
    
    peta;
    markerClusterGroups;
    datamarkers=[];
    map(){
        let self=this
        let map = L.map('map').setView([-6.3867823,107.1149245], 11);
        
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        this.markerClusterGroups = L.markerClusterGroup({animate: true,
            animateAddingMarkers: true}).addTo(map);
        for(let i=0;i<outlet.length;i++){
            
            let marker = L.marker([outlet[i].LATITUDE, outlet[i].LONGITUDE], JSON.parse(JSON.stringify(outlet[i])) );
            marker.on('click', function(e) { 
                let html='<div style="display: flex;"> <div style="flex: auto;">'+
                '</div>'
                +'<div style="flex: auto; margin-left:5px;"> <p> <b>' 
                + marker.options.NAME+ 
                '</b> <br />'+ marker.options.ADDRESS+' </p></div></div>' 
                marker.bindPopup(html).openPopup(); 
              });
              this.markerClusterGroups.addLayer(marker)
              
            this.datamarkers.push(marker)
        }
        
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
                                            <p style={{"color":"white","font-size":"30px","text-align":"center"}}> <b>Clustering</b> </p>
                                        </div>    
                                    </div>
                                </div>
                                
                                
                                
                            
                    </div>
                    
        </div>    
        );
        
    }
}
 
export default Peta;