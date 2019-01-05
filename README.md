# mk-demo-erp

![Image text](https://raw.githubusercontent.com/mk-js/mk-demo-erp/master/system.png)

# 使用JS(run in jvm)实现webapi
代码示例:

src/service/js/v1/sys/org/index.js

对应api: 

http://127.0.0.1:8086/v1/sys/org/test

http://127.0.0.1:8086/v1/sys/org/ping

入口函数：

function handler(context, payload)

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
代码示例:

src/service/js/entityJsInjector/SysOrgServiceImpl.js

对应api: 

http://127.0.0.1:8086/v1/sys/org/create

http://127.0.0.1:8086/v1/sys/org/query

入口函数：

function handler(args)

事件列表：

```java

	private void runJsHandler(HashMap<String,Object> map) {
		try {
			engine.eval(new FileReader(jsPath));
			invocable = (Invocable) engine;
		} catch (FileNotFoundException e) { 
			e.printStackTrace();
		} catch (ScriptException e) { 
			e.printStackTrace();
		}
		
		if(invocable != null) {
			try { 
				map.put("mapper", mapper);
				invocable.invokeFunction("handler", map);
			} catch (NoSuchMethodException e) { 
				e.printStackTrace();
			} catch (ScriptException e) { 
				e.printStackTrace();
			}
		} 
	}
	@Override
	public void afterCreate(P createDto) { 
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterCreate");
		map.put("createDto", createDto);  
		runJsHandler(map);
	}

	@Override
	public void afterCreateBatch(List<P> createDtos, Token token) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterCreateBatch");
		map.put("createDtos", createDtos);
		map.put("token", token);
		runJsHandler(map);  
	}

	@Override
	public void afterDelete(P deleteDto) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterDelete");
		map.put("deleteDto", deleteDto); 
		runJsHandler(map);    
	}

	@Override
	public void afterDeleteBatch(List<P> deleteDtos, Token token) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterDeleteBatch");
		map.put("deleteDtos", deleteDtos); 
		map.put("token", token);
		runJsHandler(map);    
		
	}

	@Override
	public void afterQuery(List<P> resultList, InjectorConfig cfg) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterQuery");
		map.put("resultList", resultList); 
		map.put("cfg", cfg);
		runJsHandler(map);  
	}

	@Override
	public void afterQueryByPrimaryKey(P queryDto, InjectorConfig cfg) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterQueryByPrimaryKey");
		map.put("queryDto", queryDto); 
		map.put("cfg", cfg);
		runJsHandler(map);    
	}

	@Override
	public void afterUpdate(P updateDto) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterUpdate");
		map.put("updateDto", updateDto); 
		runJsHandler(map);    
	}

	@Override
	public void afterUpdateBatch(List<P> updateDto, Token token) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "afterUpdateBatch");
		map.put("updateDto", updateDto); 
		map.put("token", token);
		runJsHandler(map);     
	}

	@Override
	public void beforeCreate(P createDto) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "beforeCreate");
		map.put("createDto", createDto); 
		runJsHandler(map);     
	}

	@Override
	public void beforeCreateBatch(List<P> createDtos, Token token) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "beforeCreateBatch");
		map.put("createDtos", createDtos); 
		map.put("token", token);
		runJsHandler(map);    
	}

	@Override
	public void beforeDelete(P deleteDto) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "beforeDelete");
		map.put("deleteDto", deleteDto); 
		runJsHandler(map);   
	}

	@Override
	public void beforeDeleteBatch(List<P> deleteDto, Token token) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "beforeDeleteBatch");
		map.put("deleteDto", deleteDto); 
		map.put("token", token);
		runJsHandler(map);  
	}

	@Override
	public void beforeUpdate(P updateDto) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "beforeUpdate");
		map.put("updateDto", updateDto); 
		runJsHandler(map);    
	}

	@Override
	public void beforeUpdateBatch(List<P> updateDto, Token token) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "beforeUpdateBatch");
		map.put("updateDto", updateDto); 
		map.put("token", token);
		runJsHandler(map);    
	}

	@Override
	public void beforeQueryByPrimaryKey(P queryDto) {
		HashMap<String,Object> map = new HashMap<>();
		map.put("event", "beforeQueryByPrimaryKey");
		map.put("queryDto", queryDto); 
		runJsHandler(map);    
	} 
```
