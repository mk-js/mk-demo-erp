# mk-demo-erp

![Image text](https://raw.githubusercontent.com/mk-js/mk-demo-erp/master/system.png)

# 使用JS(run in jvm)实现api
代码示例：src/service/js/v1/sys/org/index.js
对应api: http://127.0.0.1:8086/v1/sys/org/test;http://127.0.0.1:8086/v1/sys/org/ping
入口函数：function handler(context, payload)

```js
function handler(context, payload){ 
    var path = context.getPath()
    var method = path.split('/').pop()
    if(!handlers[method]){
        return 'not found the handler for ' + path
    }
    var args = JSON.parse(payload)
    return handlers[method](args)
}
```

# 实体服务事件处理
代码示例：src/service/js/entityJsInjector/SysOrgServiceImpl.js
对应api: http://127.0.0.1:8086/v1/sys/org/test;http://127.0.0.1:8086/v1/sys/org/ping
入口函数：function handler(context, payload)
