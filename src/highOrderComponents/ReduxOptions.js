import React, {Component} from 'react';
import R from 'ramda';
import Immutable from 'immutable';
import { diff } from 'deep-diff';
import { dispatchOnNewProps, check } from '../share';
import { createAction } from 'redux-actions';

const newOptions = R.curry((changedPropKeyAcMap, obj)=> {
	return (dispatch, getState)=> {
		const newOptions = Immutable.fromJS(obj);
		const { options } = getState();
		dispatch(createAction('@@@REDUX_COMPONENT_NEW_OPTIONS')(obj));
		dispatchOnNewProps(dispatch, changedPropKeyAcMap, options, newOptions);	
	}
})

const notFunction = (item)=>typeof item != "function"
const getNoFunctionsObject = R.pickBy(notFunction);

const subscribeWithState = (redux, cb) => redux.subscribe(()=>cb(redux.getState()))

const onReduxSubscribe = R.curry((options, callbacksSelectorsMap, reduxState)=>{
	R.compose(
		R.forEach(([callbackName, selector])=>{
			if(!options || !callbackName || !options[callbackName] || !selector) {
				return;
			}
			options[callbackName](selector(reduxState));
		}),	
		R.toPairs
	)(callbacksSelectorsMap);
})

// decorator to provide react component api for redux component 
export default (
	callbacksSelectorsMap, 
	changedPropKeyAcMap, 
	methodsMap, 
	reduxOptions, 
	ReduxComponent
)=>
	class extends Component {
		constructor(props, context) {
			super(props, context);
			this.state = {
				pendingProps: null,
				redux: null,
				unSubscribe: null,
			};
		}

		componentDidMount() {
			this.newOptions(this.props);
		}

		componentWillReceiveProps(nextProps) {
			this.newOptions(nextProps);
		}

		componentWillUnmount() {
			if(this.state.unSubscribe){
				this.state.unSubscribe();
			}
		}

		dispatchPendingProps(){
			if(this.state.redux && this.state.pendingProps) {
				this.newOptions(this.state.pendingProps)
				this.setState({
					pendingProps: null
				})
			}
		}

		onRedux(redux) {
			const unSubscribe = subscribeWithState(redux, onReduxSubscribe(this.props, callbacksSelectorsMap));

			this.setState({
				redux, 
				unSubscribe
			}, ()=>this.dispatchPendingProps());

			R.compose(
				R.forEach(([name, method])=>{
					this[name] = (...params)=>{
						redux.dispatch(method.apply(null, params));
					}
				}),
				R.toPairs
			)(methodsMap)

			if(this.props.onRedux) {
				this.props.onRedux(redux)
			}
		}

		newOptions(options) {
			const nextPropsNoFunctions = getNoFunctionsObject(options)

			if(!this.state.redux) {
				this.setState({
					pendingProps: nextPropsNoFunctions
				}, ()=>this.dispatchPendingProps());
				return;
			}

			this.state.redux.dispatch(newOptions(changedPropKeyAcMap)(nextPropsNoFunctions));
		}

		render() {
			return <ReduxComponent 
						reduxOptions={reduxOptions} 
						onRedux={this.onRedux.bind(this)}/>
		}
	}
