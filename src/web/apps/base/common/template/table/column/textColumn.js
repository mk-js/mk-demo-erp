import helper from '../../helper'

const {fixPath} = helper

export default function textColumn(option) {
    var {
        bindPath, bindField, title, width = 130, flexGrow = 0,
        align = 'left', component, required, fixed, fixedRight,  _visible, footer, ...ext
    } = option

    var value = `{{{
        var _rowIndex = row.rowIndex
        return ${fixPath(`${bindPath}[_rowIndex].${bindField}`)}
    }}}`

    return {
        component: 'FDT.Column',
        columnKey: bindField,
        flexGrow: flexGrow,
        width: width,
        header: {
            component: 'FDT.Cell',
            children: [{
                component: 'label',
                className: required ? 'ant-form-item-required' : '',
                children: title
            }]
        },
        cell: {
            _function: '(row)',
            component: "FDT.TextCell",
            className: `fdt-cell fdt-cell-${align}`,
            value,
            ...ext
        },
        footer,
        fixed,
        fixedRight,
        _visible
    }
}

