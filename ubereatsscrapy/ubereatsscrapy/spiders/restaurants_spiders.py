import scrapy

class RestaurantsSpider( scrapy.Spider ):

    name = 'restaurants'
    start_urls = [
        'https://www.ubereats.com/co/location'
    ]

    # Parse the page where all Colombian cities are listed
    # Extract the link and name for the cities
    def parse( self, response ):
        for location in response.css( 'div.di.dj' ):
            href = location.css( 'a::attr(href)' ).get()
            city = location.css( 'a span::text' ).get()
            url = 'https://www.ubereats.com{}'.format( href )

            if 'co' in href and city != 'Colombia':    
                print( 'Extracting restaurants for {}'.format( city ) )
                yield scrapy.Request( url, callback = self.parse_rest_main, meta = { 'city': city } )

    # Parse the main page for the city
    # Locate the 'Ver todos' link
    def parse_rest_main( self, response ):
        href = response.css( 'a.bj.bk.bl.an::attr(href)' ).get()
        city = response.meta.get( 'city' )
        url = 'https://www.ubereats.com{}'.format( href )
        yield scrapy.Request( url, callback = self.parse_rest_categories, meta = { 'city': city } )

    # Parse the page where all categories for a city are listed
    # Extract the link and name for the category
    def parse_rest_categories( self, response ):
        city = response.meta.get( 'city' )
        for category in response.css( 'div.dc.dd.de.df.dg a' ):
            url = 'https://www.ubereats.com' + category.css( '::attr(href)' ).get() 
            yield scrapy.Request( url, callback = self.parse_rest_list, meta = { 'city': city } )

    # Parse the page where all restaurants by city and category are listed
    # Extract the link and name for the category
    def parse_rest_list( self, response ):
        city = response.meta.get( 'city' )
        for restaurant in response.css( 'div.eb.ec.ed' ):
            href = restaurant.css( 'div div div div:nth-child(2) div h3 a::attr(href)' ).get()
            url = 'https://www.ubereats.com{}'.format( href )
            yield scrapy.Request( url, callback = self.parse_restaurant, meta = { 'city': city, 'href': href } )

    # Parse the main page for the restaurant
    # Extract all attribute to be stored for a restaurant
    def parse_restaurant( self, response ):
        
        # Extracting the name
        name = response.css( 'h1.de.df.dg.as::text' ).get()
        if name is None:
            name = response.css( 'h1.di.dj.dk.as::text' ).get()

        # Extracting the price and category
        price_category = response.css( 'div.c6.cv.ba.as.dl::text' ).get()
        if price_category is None:
            price_category = response.css( 'div.c6.cv.ba.as.dh::text' ).get()

        price = None
        category = None
        if price_category is not None and len( price_category.split( ' • ' ) ) > 1:
            price = price_category.split( ' • ' )[ 0 ]
            category = price_category.split( ' • ' )[ 1 ]

        # Extracting the score
        score = response.css( 'div.c6.cv.ba.as.dh.au.aw div:nth-child(1)::text' ).get()
        if score is None:
            score = response.css( 'div.c6.cv.ba.as.dl.au.aw div:nth-child(1)::text' ).get()

        if score == '\u00a0\u00a0\u2022\u00a0\u00a0':
            score = None

        try:
            score = float( score )
        except:
            print( 'Restaurant does not parsed: {}'.format( name ) )
            score = None

        # Extracting the reviews
        reviews = response.css( 'div.c6.cv.ba.as.dh.au.aw div:nth-child(3)' ).get()
        if reviews is None:
            reviews = response.css( 'div.c6.cv.ba.as.dl.au.aw div:nth-child(3)' ).get()

        if reviews is not None:
            reviews = reviews.replace( '<div class=\"dj\">(<!-- -->', '' )\
                .replace( '<div class=\"dn\">(<!-- -->', '' )\
                .replace( '<!-- -->)</div>', '' )\
                .replace( '+', '' )

        try:
            reviews = int( reviews )
        except:
            print( 'Restaurant does not parsed: {}'.format( name ) )
            reviews = None

        # Extracting the address
        address = response.css( 'p.c6.cv.ba.as.dq ::text' ).get()
        if address is None:
            address = response.css('p.c3.cv.cm.as.dg ::text').get()
        if address is None:
            address = response.css('p.c6.cv.ba.as.dp ::text').get()
        if address is None:
            address = response.css('p.c6.cv.ba.as.dm ::text').get()
        if address is None:
            address = response.css('p.c6.cv.ba.as.dl ::text').get()

        yield {
            'name': name,
            'price': price,
            'category': category,
            'score': score,
            'reviews': reviews,
            'address': address,
            'city': response.meta.get( 'city' ),
            'href': response.meta.get( 'href' )
        }