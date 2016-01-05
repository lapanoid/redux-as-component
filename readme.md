# Rationale and some lyrics..

This idea was born when I was making [redux-cropper](https://github.com/lapanoid/redux-cropper). Originally it is a port from jQuery cropper, but found some issues to use it as is, and decided to rewrite to react. I needed some model to keep things understandable as cropper is not just some usual react app, it has **complex internall state** - so I used redux. 
But I made app in the end not component which is much easier to use in other apps. It is not obvious how to use app inside other app in general. 

To sum app this:

# Benefits of React Component:
- Composable
- Simple and Common Api (passing props, calling refs, ...)

Benefits of Redux App:
- Sane approach to handle state (reducers, pure components, Action Creators)
- Flexible and Powerfull (middlewares)
- Devtools, and easy debug

You can have best from both worlds, developing your component with redux and them wrapping it as react component with this lib.

#[Example](https://github.com/lapanoid/redux-cropper/blob/master/src/containers/reactComponent.js)
Lets examine the example of such approach:

```
import React, { Component } from 'react';
import create from '../redux/create';
import ConnectedReduxComponent from './ConnectedAll';
import { reduxToReact } from 'redux-as-component';
import { init } from '../actions/init';
import { rotate } from '../actions/rotate';
import { getBlob } from '../actions/handlers';

const callbackSelectorMap = {
	onCropperReduxUpdate: ({
		image, 
		cropBox, 
		myState, 
		canvas
	})=>({
		image, 
		cropBox, 
		myState, 
		canvas
	})
}

const propsToAcMap = {
	rotate : rotate,
	'@default' : init
}
	
const refMethods = {
	getBlob,
}

const reduxCreateParams = {
	isDebug: true
}

export default (reduxToReact(
	callbackSelectorMap,
	propsToAcMap,
	refMethods,
	create,
	reduxCreateParams,
	ConnectedAll
))
```


### reduxToReact
- callbackSelectorMap: {callbackName:selector} 
- propsToAcMap: {propName:AC} 
- refMethods: {refName:AC} 
- create
- reduxCreateParams
- ConnectedReduxComponent

this creates component which could be used as like this:
https://github.com/lapanoid/redux-cropper/blob/master/example/src/reactSimpleUsageApp.js#L75-L79

# How this works

React component has *unidirectional props flow api* and redux has *dispatch actions api* we just need to mary them basically.
to do that you need to define propsToAcMap which will map some react component property update to some Action Creator call.

we also can propagate callbacks to react components, and this it tricky one - currently implementation is simple
pass callbackSelectorMap to map - so every redux state update will trigger passed callback passing result of selector.
Something like this:
```
// outside YourReduxComponent
<YourReduxComponent callback={..}/>

// deep inside YourReduxComponent on redux update
callback(selector(reduxState))
```

last one thing that React component have is refs api. We can call some methods from react component using them.
Here we just map names of such methods to some Action Creators, current implementation has some limitations and you should provide callback, so when AC will complete it will use it to pass result.
