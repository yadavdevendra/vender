import { ColumnObjectInterface, ObjectInterface } from './Interfaces';
const defaultColumns = {
    name: '',
    filter: false,
    sort: false,
    visible: true,
};
const defaultFilter = {
    filterText: '',
    filterOption: '0',
};

export function setDefaultValue(
    columns: ColumnObjectInterface
): ColumnObjectInterface {
    const newColumn = <ColumnObjectInterface>{};

    Object.keys(columns).forEach((key) => {
        newColumn[key] = { ...defaultColumns, ...columns[key] };
    });
    Object.keys(columns)
        .filter((e) => columns[e].filter)
        .forEach((e) => {
            newColumn[e] = { ...defaultFilter, ...columns[e] };
        });

    return newColumn;
}
export function setDefaultRowsValue(rows:Array<ObjectInterface>):Array<ObjectInterface> {
const newRows=rows.map((row) =>{return {enableCheck:true,...row};});
return newRows;
}