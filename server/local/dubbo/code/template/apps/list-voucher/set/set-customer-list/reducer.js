import { Map,fromJS } from 'immutable'
import { reducer as MetaReducer } from 'mk-meta-engine'
import config from './config'
import { getInitState } from './data'
import extend from './extend'

class reducer {
    constructor(option) {
        this.metaReducer = option.metaReducer
        this.config = config.current
    }

    init = (state, option) => {
        const initState = getInitState()
        return this.metaReducer.init(state, initState)
    }

    load = (state, response) => {
        if(response.tableDs){
            state = this.metaReducer.sf(state, 'data.list', fromJS(response.tableDs.list))
            state = this.metaReducer.sf(state, 'data.pagination', fromJS(response.tableDs.pagination))
        }
        if(response.filter){
            response.filter.search = this.metaReducer.gf(state, 'data.filter.search')
            state = this.metaReducer.sf(state, 'data.filter', fromJS(response.filter))
        }  
        if (response.treeDs) {
            state = this.metaReducer.sf(state, 'data.treeDs', fromJS(response.treeDs))
        }
        return state
    }

    
}

export default function creator(option) {
    const metaReducer = new MetaReducer(option),
        extendReducer = extend.reducerCreator({ ...option, metaReducer }),
        o = new reducer({ ...option, metaReducer, extendReducer })

    return { ...metaReducer, ...extendReducer.gridReducer, ...o }
}