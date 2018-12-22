function handler(context, payload){ 
    var path = context.getPath()
    var method = path.split('/').pop()
    if(!handlers[method]){
        return 'not found the handler for ' + path
    }
    var args = JSON.parse(payload)
    return handlers[method](args)
}

var handlers = {
    test:function(args){
        return 'test'
    },
    ping:function(args){
        return args
    }
}
