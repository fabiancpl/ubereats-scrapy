
var data = [];
var current_city = null;

function change_city() {

  current_city = d3.select( this ).property( 'value' )
  console.log( current_city );

  var filtered_data = data.filter( d => {
    if( ( current_city === null ) || current_city === '' ){
      return true;
    } else {
      if( current_city === d[ 'city' ] ) {
        return true
      } else {
        return false;
      }
    }
  } );

  draw_category_price( filtered_data );
  draw_table( filtered_data );

}

d3.json( '../data/restaurants_clean.json' ).then( new_data => {

  data = new_data;

  d3.select( '#inputCity' )
    .selectAll( 'option' )
    .data( d3.map( data, d => d[ 'city' ] ).keys() )
    .enter()
    .append( 'option' )
      .text( d => d )
      .attr( 'value', d => d );

  d3.select( '#inputCity' )
    .on( 'change', change_city );

  draw_category_price( data );
  draw_table( data )

} );

function draw_category_price( data ) {

  var category_price = {
    $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
    data: {
      values: data
    },
    title: 'Category and Price',
    mark: {
      type: 'bar',
      tooltip: true
    },
    encoding: {
      y: {
        field: 'category',
        type: 'nominal',
        sort: '-x',
        axis: {
          title: 'Category'
        }
      },
      x: {
        aggregate: 'count',
        field: "price",
        type: 'quantitative',
        axis: {
          title: 'Cantidad'
        }
      },
      color: {
        field: 'price',
        type: 'nominal',
        axis: {
          title: 'Price'
        }
      }
    }
  };
  
  vegaEmbed( '#category_price', category_price, { actions: false } );

}

function draw_table( data ) {

  d3.select( 'tbody' ).html( '' );

  var tr = d3.select( 'tbody' )
    .selectAll( 'tr' )
    .data( data )
    .enter()
      .append( 'tr' );

  var td = tr.selectAll( 'td' )
    .data( ( d, i ) => [ d[ 'city' ], d[ 'category' ], d[ 'name' ], d[ 'price' ], d[ 'score' ], d[ 'reviews' ], d[ 'address' ] ] )
    .enter()
      .append( 'td' )
      .text( d => d );

}
