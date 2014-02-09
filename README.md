# jquery-eventsource-callback
A jQuery plugin that implements EventSource with $.callbacks!

## Example
Let's say we want to listen for messages. We can do so quickly by creating our $.eventsource and then subscribing to a set of particular topics:

```javascript
var myBrokerEcho = $.eventsource({ 
                        url: "sse.php"
                    });

myBrokerEcho.topic( "eventsource.onOpen" ).subscribe( onOpen );

myBrokerEcho.topic( "eventsource.onMessage" ).subscribe( onMessage );

function onOpen( value ) {
  console.log("Connection Open!", value);
}

function onMessage( value ) {
  console.log("Incoming Message!", value);
}
```
## Why a EventSource with a $.callback is cool
In short, the power of a pub/sub model with support for $.Deferreds. Let's rewrite our basic connect example and use a $.Deferred to send a message once we know we're connected:

```javascript
var myBrokerEcho = $.eventsource({ 
    url: "sse.php"
});

myBrokerEcho.topic( "eventsource.onOpen" ).subscribe( onOpen );

myBrokerEcho.topic( "eventsource.onMessage" ).subscribe( onMessage );

var dfd = $.Deferred();
var topic = myBrokerEcho.topic( "somethingElse" );
dfd.done( topic.publish );

function onOpen( value ) {
  console.log("Connection Open!", value);
  dfd.resolve( "I'm resolved do that somethingElse" );
}

function onMessage( value ) {
  console.log("Incoming Message!", value);
}
```
Oh so sweet.

## Settings
The avaliable options are sparse at the moment.

```javascript
var instance = $.eventsource({ 
                        url: "somewhere"
                    });
```
## Topics
Default topics you can subscribe/publish/unsubscribe to are as follow:

```
instance.topic( "eventsource.onOpen" )...
instance.topic( "eventsource.onMessage" )...
instance.topic( "eventsource.onError" )...
```

## A work in progress
This is a barebones implemenation; you can't for instance subscribe to named event yet (which would require a EventListener system in the plugin, which is not yet present). It's all a work in progress. :-)
