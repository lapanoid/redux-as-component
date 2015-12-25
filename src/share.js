import R from 'ramda';
import Immutable from 'immutable';
import { diff } from 'deep-diff';

const deepDiffToList = R.map((item)=>item.path[0])

const check = R.curry((eqFunc, diffFunc, oldProps, newProps, onChange)=>{
	if(!oldProps) {
		onChange(oldProps, newProps, null);
	}

	if (eqFunc(oldProps, newProps)) {
		return;
	}

	const calcedDiff = diffFunc(oldProps, newProps);

	onChange(oldProps, newProps, calcedDiff);
})

const checkIm = check(Immutable.is, (a, b)=>{
	return diff(a.toJS(), b.toJS());
})

const processChange = R.curry((getArrayOfChangedProps, oldProps, newProps, calcedDiff, onNewPropValue)=>
	R.compose(
		R.forEach((changedPropKey)=>{
			const value = newProps.get(changedPropKey);
			onNewPropValue({key: changedPropKey, value});
		}),
		getArrayOfChangedProps
	)(calcedDiff)
)

const deepDiffProcessChange = processChange(deepDiffToList);

export const dispatchOnNewProps = (dispatch, changedPropKeyAcMap, oldProps, newProps)=> {
	const arrayToCall = []
	checkIm(oldProps, newProps, (oldProps, newProps, calcedDiff)=> {
		deepDiffProcessChange(oldProps, newProps, calcedDiff, ({key, value})=> {
			const defaultAc = changedPropKeyAcMap['@default'];
			const acToCall = changedPropKeyAcMap[key] ? changedPropKeyAcMap[key] : defaultAc;
			arrayToCall.push({
				acToCall, 
				value, 
				key : changedPropKeyAcMap[key] ? key : '@default'
			})
		})
	})

	R.compose(
		R.forEach(({acToCall, value, key})=>{
			dispatch(acToCall(value))
		}),
		R.uniqBy(({key})=>key)
	)(arrayToCall)
}

export const prependUpdateFunc = R.curry((updateFuncMap, acMap) => 
	R.mapObjIndexed((num, key, obj)=> {
		if(!updateFuncMap[key]) {
			return acMap[key];
		} 

		return (val)=>acMap[key](updateFuncMap[key](val))
	}, acMap));
