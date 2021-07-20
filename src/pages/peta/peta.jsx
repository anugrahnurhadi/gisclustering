import React, { Component } from 'react';
import L from 'leaflet'
import * as turf from '@turf/turf'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet-editable'
import skmeans from 'skmeans'
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
    distance=10000;
    circle;
    polygon=[];
    kjumoutlet=[];
    layerPolygon;

    prosesResizeCircle(radius, latlong){
        
        let self = this;
        self.distance = parseFloat(radius);
    
        self.jumoutlet = 0;
        self.datapilih = [];

        this.markerClusterGroups.eachLayer(function(layer){
            
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
        let map = L.map('map',{editable: true}).setView([-6.3867823,107.1149245], 11.5);
        
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        this.markerClusterGroups = L.markerClusterGroup({animate: true,
            animateAddingMarkers: true}).addTo(map);
            self.layerPolygon = new L.featureGroup().addTo(map);
    
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
          //if(self.circleedit)
            self.prosesResizeCircle(e.layer._mRadius, e.layer._latlng);
          //console.log('editable:created');
          
        });
        
        map.on('editable:vertex:dragend', function(e, d) { 
          //if(self.circleedit)
            self.prosesResizeCircle(e.layer._mRadius, e.layer._latlng);
            
        });
        
        map.on('editable:dragend', function(e, d) { 
          //if(self.circleedit)
            self.prosesResizeCircle(e.layer._mRadius, e.layer._latlng);
            
        });
        
        
        this.circle.enableEdit();
        this.circle.bringToFront()
    
        //map.fitBounds(self.circle.getBounds());
      
    
    }

    onGenerateSkmeans(){
        let self = this;
       let vectors = [];
        for (let i=0;i<this.datapilih.length;i++) {
          //vectors.push(turf.point([ parseFloat(self.datapilih[i].LONGITUDE) , parseFloat(self.datapilih[i].LATITUDE)]));
            vectors.push([ parseFloat(self.datapilih[i].LONGITUDE) , parseFloat(self.datapilih[i].LATITUDE)]);
            
        }
        var res = skmeans(vectors, this.state.k,"kmpp");
        
        for (let i=0;i<self.datapilih.length;i++){
            self.datapilih[i].kelas = res.idxs[i];
        //    //self.datapilih[i].kelas = res.features[i].properties.cluster
        }
        
        self.DrawHull();
        
        
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    DrawHull(){
        let self = this;
        self.tooltipopen=true;
        self.layerPolygon.clearLayers();
        let kname=[]
        for(let i=0;i<this.state.k;i++){
            kname.push('Cluster '+parseInt(i+1))
        }

        this.setState({knames:kname})
        
        let listclusters=[];
        //console.log("++++ self.state.kname ", self.state.kname);
        //console.log("++++ self.datapilih ", self.datapilih);
        let jd=[];
        for (let j=0;j<self.state.knames.length;j++){
            jd[j]=[];
            let dataoutlet = [];
            for(let i=0; i<self.datapilih.length;i++){
                if(self.datapilih[i].kelas==j){
                  self.datapilih[i].checked = true;
                  self.datapilih[i].selected = false;
                  dataoutlet.push(self.datapilih[i]);
                    jd[j].push(turf.point([
                        parseFloat(self.datapilih[i].LATITUDE),
                        parseFloat(self.datapilih[i].LONGITUDE)
                    ]));
                }
            }
        }

        var points = [];
        for (let j=0;j<self.state.knames.length;j++){
            points[j] = turf.featureCollection(jd[j]);
        }

        let pointsmarker = [];
        for(let i=0;i<self.datamarkers.length;i++)
        {
            let pt = [self.datamarkers[i].getLatLng().lat, self.datamarkers[i].getLatLng().lng];
            pointsmarker.push(pt);
        }
        let turfpointsmarker = turf.points(pointsmarker);

        var hull = []; 
        for (let j=0;j<self.state.knames.length;j++){
            
            hull[j] = turf.convex(points[j]);
            if(hull[j])
            {
              //console.log('hull[j] ', hull[j]);
              let arr_polygon;
      
              let color = self.getRandomColor();
  
              if(self.polygon[j])
              {
                  //self.layerPolygon.removeLayer(self.state.kname[j].polygon._leaflet_id);
                  self.polygon[j].remove();
                  self.polygon[j] = undefined;
              }
  
              self.kjumoutlet[j] = jd[j].length;
              self.polygon[j] = L.polygon(hull[j].geometry.coordinates, {color: color});
              listclusters.push({id:j, k:self.state.knames[j],n:self.kjumoutlet[j]})
              arr_polygon = self.polygon[j];
              arr_polygon.bindTooltip(self.state.knames[j], {permanent: true, interactive:true, direction:"center", opacity: 0.7});
              this.layerPolygon.addLayer(arr_polygon);

              let turfpp = turf.polygon(hull[j].geometry.coordinates);
                
              
              arr_polygon.openTooltip();
            }
            
        }
        //callback()
        this.setState({listclusters:listclusters})
        
    }

    myChangeHandler = (event) => {
        if(event.target.value=='' || event.target.value=='0' || event.target.value==0){
            this.setState({k: 0,
                disablebutton:true,
                errorcluster:true,
                errormessege:'* Number of cluster cannot be zero.'
            });
        }
        else if(event.target.value>this.state.jumoutlet){
            this.setState({k: event.target.value,
                disablebutton:true,
                errorcluster:true,
                errormessege:'* Number of cluster cannot be greater than the number of points.'
            });
        }
        else{
            this.setState({k: parseInt(event.target.value),
                disablebutton:false, errorcluster:false});
            
        }
    }
    
    state = { jumoutlet:0,
        distance:5000,
        k:3,
        knames:[],
        disablebutton:false,
        listclusters:[],
        errormessege:'',
        errorcluster:false,


    }

   


    render() {
        
        return ( 
        <div>
            
                     
                    <div style={{"width":"100%","height":"600px","position":"absolute"}}>
                            
                                <div className="Konten-muncul" style={{"z-index":"1","width":"100%","height":"100%","margin":"0px","position": "relative"}} id="map">
                                    
                                </div>
                                <div className="Konten-munculkanan" style={{"z-index":"2","float":"right","position": "absolute","margin":"10px","right":0,"top":0,"bottom":0}}>
                                    <div className="rounded" style={{"width":"300px","height":"100%","background-color":"black","opacity":"70%","padding":"7px"}}>
                                        <div classNeme="card-body">
                                            <p style={{"color":"white","font-size":"30px","text-align":"center"}}> <b>Clustering</b> </p>
                                            <table style={{"color":"white","font-size":"18px","margin":"auto"}}>
                                                <tr>
                                                    <td><b> Selected Points </b></td>
                                                    <td> : {this.numberWithCommas(this.state.jumoutlet)}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Circle Radius </b></td>
                                                    <td> : {this.numberWithCommas(this.state.distance)} meters</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Clusters </b></td>
                                                    <td> : <input
                                                        style={{"width":"60px"}}
                                                        type='text'
                                                        onChange={this.myChangeHandler}
                                                        value={this.state.k}
                                                    /></td>
                                                </tr>
                                            </table>
                                            
                                            {  this.state.errorcluster
                                                ?<p style={{"color":"yellow","font-size":"13px","text-align":"center"}}> <b>{this.state.errormessege}</b> </p>
                                                :<p></p>
                                            }
                                            <br/>
                                            <center>
                                                <button disabled={this.state.disablebutton} style={{"margin-top":"20px","opacity":"100%"}} onClick={()=>{this.onGenerateSkmeans()}} className='btn btn-primary'> Create Cluster</button>
                                            </center>
                                            <br />
                                            <br />
                                            {(this.state.listclusters.length>0)
                                                ? <p style={{"color":"white","font-size":"30px","text-align":"center"}}> <b>Result</b> </p>
                                                : <div></div>
                                            }
                                            <div style={{"height":"150px"}} className="overflow-auto">
                                            <table style={{"border-top":"1px solid white","border-bottom":"1px solid white","color":"white","font-size":"18px","margin":"auto"}}>
                                            {this.state.listclusters.map(
                                                    (cluster)=>{
                                                        return(
                                                        <tr key={cluster.id.toString()} style={{"color":"white"}}>
                                                            <td><b> {cluster.k} </b></td>
                                                            <td> : {cluster.n} </td>
                                                            <td> Points </td>
                                                        </tr>
                                                        )
                                                    }
                                                )
                                            }
                                            
                                            </table>
                                            </div>
                                        </div>    
                                    </div>
                                </div>
                                
                                
                                
                            
                    </div>
                    
        </div>    
        );
        
    }
}
 
export default Peta;