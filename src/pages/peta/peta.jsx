import React, { Component } from 'react';
import L from 'leaflet'
import * as turf from '@turf/turf'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-editable'

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
    datapilih=[];
    jumoutlet=0;
    distance=5000;
    circle;

    prosesResizeCircle(radius, latlong){
        
        let self = this;
        self.distance = parseFloat(radius);
    
        self.jumoutlet = 0;
        self.datapilih = [];

        this.markerClusterGroups.eachLayer(function(layer){
            console.log('latlong',latlong)
            console.log('layer',layer._latlng.lng,layer._latlng.lat)
            let from = turf.point([ latlong.lng, latlong.lat]);
            let to = turf.point([layer._latlng.lng, layer._latlng.lat]);
            let options = {units: 'kilometers'};
    
            let d = turf.distance(from, to, options);
            layer.options.distance = d;
            
            if(layer.options.distance <= (self.distance/1000))
            {
                self.datapilih.push(JSON.parse(JSON.stringify(layer.options)));
                
            }
        });
        self.jumoutlet = self.datapilih.length;
        this.setState({jumoutlet:self.jumoutlet,
            distance:self.distance
        })

      }

      numberWithCommas = (x) => {
        if(x == undefined)
            return x;
        if (typeof x === 'string' || x instanceof String)
            return x;
        x = Math.round(x);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    map(){
        let self=this
        let map = L.map('map',{editable: true}).setView([-6.3867823,107.1149245], 12);
        
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
              self.markerClusterGroups.addLayer(marker)
              
            this.datamarkers.push(marker)
        }
        
        self.peta=map;
        
        self.circle = L.circle([-6.3867823,107.1149245], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.0,
            radius: self.distance
        }); 
        self.circle.addTo(map);
        //this.MovingCircle()
        map.on('dragend', function(event) {
            
        });
    
        map.on('editable:enable', function(e, d) { 
          //if(self.DataLocal.circleedit)
            self.prosesResizeCircle(e.layer._mRadius, e.layer._latlng);
          //console.log('editable:created');
          
        });
        
        map.on('editable:vertex:dragend', function(e, d) { 
          //if(self.DataLocal.circleedit)
            self.prosesResizeCircle(e.layer._mRadius, e.layer._latlng);
            
        });
        
        map.on('editable:dragend', function(e, d) { 
          //if(self.DataLocal.circleedit)
            self.prosesResizeCircle(e.layer._mRadius, e.layer._latlng);
            
        });
        
        this.circle.enableEdit();
    
        //map.fitBounds(self.circle.getBounds());
      
    
    }

    state = { jumoutlet:0,
        distance:5000
    }
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
                                            <table style={{"color":"white","font-size":"18px"}}>
                                                <tr>
                                                    <td><b> Selected Points </b></td>
                                                    <td> : {this.numberWithCommas(this.state.jumoutlet)}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Circle Radius </b></td>
                                                    <td> : {this.numberWithCommas(this.state.distance)} meters</td>
                                                </tr>
                                            </table>
                                        </div>    
                                    </div>
                                </div>
                                
                                
                                
                            
                    </div>
                    
        </div>    
        );
        
    }
}
 
export default Peta;