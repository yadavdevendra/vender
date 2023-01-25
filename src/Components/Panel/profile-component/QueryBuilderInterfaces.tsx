/* eslint-disable @typescript-eslint/no-explicit-any */
export interface selectObject {
    label: string,
    value: string,
    disabled?: boolean,
}


export interface QueryToTakeFromProps {
    id1: string,
    data: Array<data>,
    deleteQuery: (key: string)=> void,
    dataArray: Array<queryDataInterface>,
    recieveDataFromQuery: (arr: Array<queryDataInterface>) => void,
    initialValue: queryDataInterface
}

export interface Iprops {
    no: number
}
export interface data {
    [name: string]: any
}

export interface Istate {
    updateRuleNumberGroup: number,
    data: Array<data>,
}

export interface CreateSelectInterface{
    label: string,
    select: Array<selectObject>
    id1: string,
    onChangeNote ?: (element: string)=>void,
    dataFromSelect:(selectData: string, valueData?: string)=> void,
    initialValue: string | undefined ,
}


export interface AddRuleGroupProps{
    data:  Array<data>,
    id: string,
    MajorArray:Array<Array<queryDataInterface>>,
    deleteGroup:(id: string)=> void,
    UpdateMajorArray: (MArray:Array<Array<queryDataInterface>>)=> void
}


export interface queryDataInterface{
    Attribute?: string,
    Operator?: string,
    Value?: string
}