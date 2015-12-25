import React, { Component } from 'react';
import R from 'ramda';
import _ReduxOptions from './ReduxOptions';
import _ReduxHolder from './ReduxHolder';

export default R.curry((callbacksSelectorsMap, changedPropKeyAcMap, methodsMap, createReduxFunc, reduxOptions, _Component)=>{
	const ReduxHolder = _ReduxHolder(createReduxFunc, _Component);
	const ReduxOptions = _ReduxOptions(callbacksSelectorsMap, changedPropKeyAcMap, methodsMap, reduxOptions, ReduxHolder);

	return ReduxOptions;
})
