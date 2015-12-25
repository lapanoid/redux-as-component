import Immutable from 'immutable';
import { handleActions } from 'redux-actions';

export const ACTION = '@@@REDUX_COMPONENT_NEW_OPTIONS';

export default (defaultOptions)=>
	handleActions({
		[ACTION]: (state, {payload}) => Immutable.fromJS(payload)
	}, Immutable.fromJS(defaultOptions))	
