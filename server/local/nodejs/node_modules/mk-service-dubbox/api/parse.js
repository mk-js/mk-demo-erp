const Long = require("long");
const moment = require("moment")

const SERIALIZER_MAP = {};

[
    'boolean',
    'bool',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'bool';
});

[
    'java.lang.Boolean',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'Bool';
});

[
    'double',
    'float',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'double';
});

[
    'java.lang.Double',
    'java.lang.Float',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'Double';
});

[
    'long',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'long';
});

[
    'java.lang.Long',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'Long';
});

[
    'short',
    'int',
    'byte',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'int';
});

[
    'java.lang.Short',
    'java.lang.Integer',
    'java.lang.Byte',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'Int';
});

[
    'String',
    'string',
    'char',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'string';
});

[
    'java.lang.String',
    'char[]',
    'java.lang.Character',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'String';
});

[
    'java.util.List',
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'Array';
});
[
    'java.util.Date',
    'java.sql.Timestamp'
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'Date';
});
[
    'java.math.BigDecimal'
].forEach(function (t) {
    SERIALIZER_MAP[t] = 'BigDecimal';
});

const SERIALIZER = {
    'bool': obj => ifNullElse(obj, false, toBoolean),
    'Bool': obj => ifNullElse(obj, null, toBoolean),
    'double': obj => ifNullElse(obj, 0, Number),
    'Double': obj => ifNullElse(obj, null, Number),
    'long': obj => ifNullElse(obj, 0, patchForHessian),
    'Long': obj => ifNullElse(obj, null, patchForHessian),
    'int': obj => ifNullElse(obj, 0, Number),
    'Int': obj => ifNullElse(obj, null, Number),
    'string': obj => ifNullElse(obj, '', toString),
    'String': obj => ifNullElse(obj, null, toString),
    'Date': obj => {
        let date = obj && new Date(obj) || null
        if (date && config.parseToUTCTime) { //toUTC date
            date.setMinutes(date.getTimezoneOffset() + date.getMinutes())
        }
        return date
    },
    'Array': obj => obj && Array.from(obj) || null,
    'BigDecimal': obj => ifNullElse(obj, null, Number),
}

function toString(v){
    if(typeof v == "object"){
        return JSON.stringify(v)
    }else{
        return String(v)
    }
}

function toBoolean(v) {
    if (typeof v == 'string') {
        return v.toLowerCase() == 'true'
    }
    return v
}

function ifNullElse(val, def, fun) {
    if (val === null || val === undefined) {
        return def
    } else {
        return fun(val)
    }
}

const UNSERIALIZER = {
    'bool': obj => obj,
    'Bool': obj => obj,
    'double': obj => obj,
    'Double': obj => obj,
    'long': obj => obj,
    'Long': obj => obj,
    'int': obj => obj,
    'Int': obj => obj,
    'BigDecimal': obj => obj && obj.value || null,
    'string': obj => obj,
    'String': obj => obj,
    'Array': obj => obj,
    'Date': jsonifyDate,
}

function jsonifyDate(obj, pattern) {
    if (!obj) return obj
    if (obj instanceof Date) {
        if (pattern) {
            obj = moment(obj).format(pattern)
        } else if (obj.getHours() == 0 && obj.getMinutes() == 0 && obj.getSeconds() == 0 && obj.getMilliseconds() == 0) {
            obj = moment(obj).format("YYYY-MM-DD")
        } else {
            obj = moment(obj).format('YYYY-MM-DD HH:mm:ss')
        }
    }
    // console.log(`${pattern}:${obj}`)
    return obj
}
let config = { parseToUTCTime: false }
const toHessian = (obj, typeName, cfg) => {

    if (cfg) config = cfg
    let serializerName = SERIALIZER_MAP[typeName]
    if (SERIALIZER[serializerName]) {
        return SERIALIZER[serializerName](obj)
    } else {
        return obj
    }

}

const toJS = (obj) => {
    return remove$(obj)
}
const regist = (typeName, fields, instance,returnNullValue) => {
    if (SERIALIZER_MAP[typeName]) return;
    SERIALIZER_MAP.__registed = true
    let fun = fields
    fields = fields || []
    let realFields = {};
    Object.keys(fields).forEach(key => {
        let fieldType = fields[key]
        if (fieldType.indexOf('`') != -1) {
            jsonTagHandler(realFields, { key, fieldType })
        } else {
            realFields[key] = fields[key]
        }
    })
    if (typeof fun != "function") {
        if (typeName.indexOf("List<") != -1 || typeName.indexOf("[") != -1) {
            fun = jsArray2Hessian(typeName, realFields, instance)
        } else {
            fun = jsObj2Hessian(typeName, realFields, instance)
        }
    }
    let funToJS = instance
    if (typeof funToJS != 'function') {
        if (typeName.indexOf("List<") != -1 || typeName.indexOf("[") != -1) {
            funToJS = hessianArray2JS(typeName, realFields, instance)
        } else {
            funToJS = hessianObj2JS(typeName, realFields, instance,returnNullValue)
        }
    }
    SERIALIZER_MAP[typeName] = typeName
    SERIALIZER[typeName] = fun
    UNSERIALIZER[typeName] = funToJS
}


const patchForHessian = (obj) => {
    if (!obj && obj != 0) return obj
    obj = Long.fromValue(obj)
    if (obj.high == 0 && obj.low < 20) {
        obj.length = obj.low.toString().length
    } else if (obj.high === -1 & obj.low ===-1) {
        obj = -1
    }
    return obj
}

const remove$ = (obj) => {
    if (obj && obj.$ !== undefined && obj.$class) {
        let mapKey = SERIALIZER_MAP[obj.$class]
        if (mapKey && UNSERIALIZER[mapKey]) {
            //console.log('have '+obj.$class) 
            return UNSERIALIZER[mapKey](obj.$)
        } else if (SERIALIZER_MAP.__registed) {
            console.log('not found: ' + obj.$class)
        }
    }
    if (obj && obj.$) return remove$(obj.$)
    if (!obj || typeof obj != "object") return obj
    if (obj instanceof Date) return jsonifyDate(obj)
    Object.keys(obj).forEach(key => obj[key] = remove$(obj[key]))
    return obj
}

const jsonTagHandler = (realFields, { key, fieldType }) => {
    let type = fieldType.split('`')[0]
    let jsonTag = fieldType.substr(type.length)
    jsonTag = jsonTag.split('`').join(';')

    let handler = {
        JsonIgnore: () => {
            //"nullUpdate": "boolean`JsonIgnore('true')",
            realFields[key] = null
        },
        JsonProperty: (alias) => {
            //"newName": "java.lang.String`JsonProperty('name')",
            realFields[key] = { alias, key, type }
            realFields[alias] = { alias, key, type }
        },
        JsonFormat: (pattern) => {
            if (pattern) {
                pattern = pattern.replace('yyyy', 'YYYY')
                pattern = pattern.replace('dd', 'DD')
            }
            realFields[key] = { pattern, key, type }
            // console.log(`${key}:${fieldType}:${pattern}`)
        }
    }
    Function('handler', 'with(handler){' + jsonTag + '}')(handler)
}

const hessianArray2JS = (typeName, fields, instance) => (obj) => {
    if (!obj || obj.length == 0) return obj

    return obj.map(toJS)
}

const hessianObj2JS = (typeName, fields, instance,returnNullValue) => (obj) => {
    if (!obj) return obj
    let result = {}
    Object.keys(obj).forEach(key => {
        let fieldType = fields[key] || fields["*"]
        if (!fieldType) return;
        let value = obj[key]
        if (value && value.hasOwnProperty && value.hasOwnProperty('$')) {
            value = value.$
        }
        if (returnNullValue === false && value === null) return;

        let pattern = null
        if (typeof fieldType == 'object') {
            let meta = fieldType
            if (meta.alias) {
                key = meta.alias
            }
            pattern = meta.pattern
            fieldType = meta.type
        }

        let serializerName = SERIALIZER_MAP[fieldType]
        if (UNSERIALIZER[serializerName]) {
            result[key] = UNSERIALIZER[serializerName](value, pattern)
        } else {
            console.warn("parse.js,hessianObj2JS,δ�ҵ����Ͷ�Ӧ�����л�����,���ͣ�" + fieldType)
            result[key] = value
        }
    })

    return result
}

const jsArray2Hessian = (typeName, fields, instance) => (obj) => {
    if (!obj) return null;
    let realTypeName = typeName
    if (typeName.indexOf("List<") != -1) {
        realTypeName = typeName.replace(">", "").split("<")[1]
    } else if (typeName.indexOf("[") == 0) {
        realTypeName = typeName.substr(1)
    } else if (typeName == 'byte[]') {
        if (obj instanceof Buffer) {
            return obj
        } else {
            return new Buffer(obj)
        }
    } else if (typeName.indexOf("[") != -1) {
        realTypeName = typeName.split("[")[0]
    }
    let result = [];
    if (typeof obj == "string") obj = obj.split(',')
    obj.forEach((data, index) => {
        result.push(toHessian(data, realTypeName))
    })
    return result
}

const jsObj2Hessian = (typeName, fields, instance) => (obj) => {
    if (!obj) return obj;
    let result = {}
    Object.keys(obj).forEach(k => {
        let fieldType = fields[k] || fields["*"]
        if (!fieldType) return;
        let value = obj[k]
        if (typeof fieldType == 'object') {
            let meta = fieldType
            if (k == meta.alias) {
                k = meta.key
            }
            fieldType = fieldType.type
        }
        let serializerName = SERIALIZER_MAP[fieldType]
        if (SERIALIZER[serializerName]) {
            result[k] = SERIALIZER[serializerName](value)
        } else {
            console.warn("parse.js,δ�ҵ����Ͷ�Ӧ�����л�����,���ͣ�" + fieldType)
            result[k] = toJS(value)
        }
    })

    if (instance) {
        result = Object.assign({}, instance, result)
    }

    if (typeName.indexOf("java.util.Map<") != -1) {
        typeName = "java.util.Map"
    }
    return { $class: typeName, $: result }
}

module.exports = {
    regist,
    toHessian,
    toJS,
}