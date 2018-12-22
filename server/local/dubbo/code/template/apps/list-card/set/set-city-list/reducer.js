import { Map, fromJS } from 'immutable'
import { reducer as MetaReducer } from 'mk-meta-engine'
import config from './config'
import { getInitState } from './data'

class reducer {
    constructor(option) {
        this.metaReducer = option.metaReducer
    }

    init = (state, option) => {
        const initState = getInitState()
        return this.metaReducer.init(state, initState)
    }

    load = (state, response) => {
        state = this.metaReducer.sf(state, 'data.list', fromJS(response.list))
        state = this.metaReducer.sf(state, 'data.pagination', fromJS(response.pagination))
        response.filter.search = this.metaReducer.gf(state, 'data.filter.search')
        state = this.metaReducer.sf(state, 'data.filter', fromJS(response.filter))
        return state
    }
}

export default function creator(option) {
    const metaReducer = new MetaReducer(option),
        o = new reducer({ ...option, metaReducer })

    return { ...metaReducer, ...o }
}