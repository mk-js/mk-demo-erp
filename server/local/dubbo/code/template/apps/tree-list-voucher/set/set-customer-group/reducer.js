import { Map, List, fromJS } from 'immutable'
import { reducer as MetaReducer } from 'mk-meta-engine'
import config from './config'
import { getInitState } from './data'

class reducer {
    constructor(option) {
        this.metaReducer = option.metaReducer
        this.config = config.current
    }

    init = (state, option) => {
        const initState = getInitState()
        if(option && option.customerGroup)
            initState.data.form.customerGroup = option.customerGroup
        
        return this.metaReducer.init(state, initState)
    }

    load = (state, resp) => {
        state = this.metaReducer.sf(state, 'data.form', fromJS(resp))
        return state
    }

    setForm = (state, form) => {
        state = this.metaReducer.sf(state, 'data.form', fromJS(form))
        return this.metaReducer.sf(state, 'data.other.checkFields', List())
    }
}

export default function creator(option) {
    const metaReducer = new MetaReducer(option),
        o = new reducer({ ...option, metaReducer })

    return { ...metaReducer, ...o }
}