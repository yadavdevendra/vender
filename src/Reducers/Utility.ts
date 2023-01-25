/* eslint-disable @typescript-eslint/no-explicit-any */
interface UtilityActionI {
    type : 'showToast' | 'hideToast',
    state : any
}

interface StateI {
    showToast : ObjectI,
    showID : number
}

interface ObjectI {
    [name : string] : any
}

export const utility = (state : StateI = {showToast: {}, showID : 1 }, action : UtilityActionI) : StateI => {
    switch ( action.type ) {
        case 'showToast' :
            state['showToast'][state['showID']] = action.state;
            state['showID']++;
            return {...state};
        case 'hideToast' :
            delete state['showToast'][action.state.id];
            return {...state};
        default : return state;
    }
};