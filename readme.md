# Redux App vs React Component

Benefits of React Component:
- Composable
- Simple and Common Api (passing props, calling refs, ...)

Benefits of Redux App:
- Sane approach to handle state (reducers, pure components, Action Creators)
- Flexible and Powerfull (middlewares)
- Devtools, and easy debug

You can have best from both worlds, developing your component with redux and them wrapping it as react component with this lib.

#[Example](https://github.com/lapanoid/redux-cropper/blob/master/src/containers/reactComponent.js)
Lets examine this example of such approach:

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
