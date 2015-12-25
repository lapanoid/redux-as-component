import React, { Component } from 'react';

// we create redux here and store it within this component
// call onRedux on redux creation
export default (createReduxFunc, ReduxComponent)=>
	class extends Component {
		constructor(props, context) {
			super(props, context);
			this.state = {};
		}

	    componentDidMount() {
			const reduxOptions = this.props.reduxOptions ? this.props.reduxOptions : {};
			const store = createReduxFunc(reduxOptions);

			this.setState({store})

			if(this.props.onRedux) {
				this.props.onRedux(store)
			}
		}

		render() {
			if(!this.state.store){
				return <div/>;
			}

			return <ReduxComponent store={this.state.store}/>
		}
	}	
