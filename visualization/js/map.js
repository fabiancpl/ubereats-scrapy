var init_center = [ -80.063644, -0.624335 ];
var init_zoom = 4;

mapboxgl.accessToken = 'pk.eyJ1IjoiZmFiaWFuY3BsOTEiLCJhIjoiY2thenhwdmQ4MDBuejJybXJzZDJmcDV2ZSJ9.0hU16VzqsGUpWKNPkuWqFA';
var map = new mapboxgl.Map( {
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: init_center,
  zoom: init_zoom
} );

map.addControl( new mapboxgl.NavigationControl() );

map.on( 'load', function() {

  map.addSource( 'restaurants', { 
    type: 'geojson', 
    data: '../data/restaurants_clean.geojson',
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50
  } );
  
  map.addLayer( {
    id: 'clusters',
    type: 'circle',
    source: 'restaurants',
    filter: [ 'has', 'point_count' ],
    paint: {
      'circle-color': [
        'step',
        [ 'get', 'point_count' ],
        '#51bbd6',
        100,
        '#f1f075',
        750,
        '#f28cb1'
      ],
      'circle-radius': [
        'step',
        [ 'get', 'point_count' ],
        20,
        100,
        30,
        750,
        40
      ]
    }
  } );
 
  map.addLayer( {
    id: 'cluster-count',
    type: 'symbol',
    source: 'restaurants',
    filter: [ 'has', 'point_count' ],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': [ 'DIN Offc Pro Medium', 'Arial Unicode MS Bold' ],
      'text-size': 12
    }
  } );
 
  map.addLayer( {
    id: 'unclustered-point',
    type: 'circle',
    source: 'restaurants',
    filter: [ '!', [ 'has', 'point_count' ] ],
    paint: {
      'circle-color': '#11b4da',
      'circle-radius': 4,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#fff'
    }
  } );

  map.on( 'click', 'clusters', function( e ) {
    var features = map.queryRenderedFeatures( e.point, {
      layers: [ 'clusters' ]
    } );
    var clusterId = features[ 0 ].properties.cluster_id;
    map.getSource( 'restaurants' ).getClusterExpansionZoom(
      clusterId,
      function( err, zoom ) {
      if ( err ) return;
      map.easeTo( {
        center: features[ 0 ].geometry.coordinates,
        zoom: zoom
      } );
      }
    );
  } );

  map.on( 'click', 'unclustered-point', function( e ) {
    var coordinates = e.features[ 0 ].geometry.coordinates.slice();

    var name = e.features[ 0 ].properties[ 'name' ];
    var price = e.features[ 0 ].properties[ 'price' ];
    var category = e.features[ 0 ].properties[ 'category' ];
    var score = e.features[ 0 ].properties[ 'score' ];
    var reviews = e.features[ 0 ].properties[ 'reviews' ];
    var city = e.features[ 0 ].properties[ 'city' ];
    var formatted_address = e.features[ 0 ].properties[ 'formatted_address' ];

    while ( Math.abs( e.lngLat.lng - coordinates[ 0 ] ) > 180 ) {
      coordinates[ 0 ] += e.lngLat.lng > coordinates[ 0 ] ? 360 : -360;
    }

    new mapboxgl.Popup()
      .setLngLat( coordinates )
      .setHTML(
        'Name: ' + name + '<br>Price: ' + price + '<br>Category: ' + category + '<br>Score: ' + score + '<br>Reviews: ' + reviews + '<br>City: ' + city + '<br>Address: ' + formatted_address
      )
      .addTo( map );
  } );

  map.on( 'mouseenter', 'clusters', function() {
    map.getCanvas().style.cursor = 'pointer';
  } );

  map.on( 'mouseleave', 'clusters', function() {
    map.getCanvas().style.cursor = '';
  } );

  map.on( 'mouseenter', 'unclustered-point', function() {
    map.getCanvas().style.cursor = 'pointer';
  } );

  map.on( 'mouseleave', 'unclustered-point', function() {
    map.getCanvas().style.cursor = '';
  } );

} );

function home() {
  map.flyTo( {
    center: init_center,
    zoom: init_zoom
  } );
}