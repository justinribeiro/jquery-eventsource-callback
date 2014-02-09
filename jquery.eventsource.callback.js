/*
 * jQuery.EventSource Plugin v0.0.1
 *
 * Copyright (c) 2014 Justin Ribeiro.
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 */
(function( jQuery, global ) {

    jQuery.eventsource = function( options ) {

        var es = {
            defaults: {
                url: null
            },

            // Holds the raw EventSource connection
            connection: null,
            
            close: function( label ) {               
                // close the socket
                es.connection.close();
            },
            
            // From the API documentation
            // http://api.jquery.com/jQuery.Callbacks/
            // Basic pub/sub implementation
            topic: function( id ) {
              var callbacks, method, topic = id && es.topics[ id ];
             
              if ( !topic ) {
                callbacks = jQuery.Callbacks();
                topic = {
                  publish: callbacks.fire,
                  subscribe: callbacks.add,
                  unsubscribe: callbacks.remove
                };
                if ( id ) {
                  es.topics[ id ] = topic;
                }
              }
              return topic;
            },
            topics: {},
            options: null
        },
        _private = {

            connect: function( options ) {

                es.connection = new EventSource(options.url);
                
                es.connection.onopen = function () {
                    es.topic( "eventsource.onOpen" ).publish( event.data );
                };
                
                es.connection.onmessage = function(event){
                    es.topic( "eventsource.onMessage" ).publish( event.data );
                };

                es.connection.onerror = function (event) {
                    es.topic( "eventsource.onError" ).publish( event.data );
                };

            }
        };

        // If params were passed in as an object, normalize to a query string
        options.data = options.data && jQuery.isPlainObject( options.data ) ?
                                        jQuery.param( options.data ) :
                                        options.data;

        // If we don't have a URL, then we stop
        if ( !options.url || typeof options.url !== "string" ) {
            throw new SyntaxError("EventSource Connection Error: Must provide a url.");
        }

        // Create new options object
        options = jQuery.extend({}, es.defaults, options);

        // run the connect
        _private.connect(options);

        // return our instance
        return es;

    };

})(jQuery, window);