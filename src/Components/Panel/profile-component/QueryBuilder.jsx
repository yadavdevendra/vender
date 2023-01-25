// // import { Card, Label, Page, Banner, Select, Button, TextField } from "@shopify/polaris";
// import React, { useState, useEffect } from "react";
// import {Base} from "../../../../core";
// import './style.css'
// import { selectObject, QueryToTakeFromProps, Istate, CreateSelectInterface, AddRuleGroupProps, queryDataInterface } from './QueryBuilderInterfaces'
// import { Card ,Button ,TextField , Select} from "@cedcommerce/ounce-ui";
//
//
// const QueryBuilder: (state: Istate) => JSX.Element | null = () => {
//
//     const [data, setData] = useState<Array<{ [name: string]: any }>>([])
//     const [updateRuleNumberGroup, setUpdateRuleNumberGroup] = useState<number>(1)
//     const [MajorArray, setMajorArray] = useState<Array<Array<queryDataInterface>>>([]);
//     const [Query, setQuery] = useState<string>('');
//     const [disabled, setDisabled] = useState<boolean>(true);
//     const [prodCount, setProdCount] = useState<number>();
//     const [displayPC, setDisplayPC] = useState<boolean>(false);
//
//     const fetc: () => void = () => {
//
//         Base.requests.get("connector/get/getAttributes?marketplace=shopify")
//             .then((e) => {
//                 console.log(e);
//                 setData(e.data);
//             });
//     }
//     useEffect(() => {
//         fetc();
//     }, [])
//
//     const resetDisplayPC: () => void = () => {
//         setDisplayPC(false)
//         setProdCount(undefined)
//     }
//
//     const AddRuleGroupBy1: () => void = () => {
//         resetDisplayPC();
//         setUpdateRuleNumberGroup(updateRuleNumberGroup + 1)
//     }
//
//     const deleteGroup: (id: string) => void = (id) => {
//         resetDisplayPC();
//         MajorArray.splice(Number(id), 1);
//         UpdateMajorArray(MajorArray)
//         setUpdateRuleNumberGroup(updateRuleNumberGroup - 1)
//     }
//
//     const UpdateMajorArray: (MArray: Array<Array<queryDataInterface>>) => void = (MArray) => {
//         resetDisplayPC();
//         let set = [...MArray];
//         let toQuery: string = '';
//         for (let i = 0; i < set.length; i++) {
//             let andQueryMade = ''
//             for (let j = 0; j < set[i].length; j++) {
//                 let str = ''; let andQuery = set[i][j];
//                 if ((andQuery.Attribute !== '0') && (andQuery.Operator !== '0') && (andQuery.Value !== '')) {
//                     str = `${andQuery.Attribute} ${andQuery.Operator} ${andQuery.Value}`
//                     andQueryMade = `${andQueryMade} ${str} && `
//                 }
//             }
//             if (andQueryMade !== '')
//                 toQuery = `${toQuery} (${andQueryMade.substring(0, andQueryMade.length - 3)}) ||`
//         }
//         setQuery(toQuery.substring(0, toQuery.length - 2))
//         if (toQuery !== '')
//             setDisabled(false)
//         else {
//             setDisabled(true)
//         }
//         setMajorArray(set)
//     }
//
//     const runQuery: () => void = () => {
//         base.get('/connector/product/getProductsByQuery', { marketplace: 'shopify', query: Query, sendcount: true })
//             .then((e) => {
//                 console.log(e)
//                 console.log(e.data.length)
//                 setProdCount(e.data.length);
//             })
//         setDisplayPC(true)
//     }
//
//     if (data[0] != null) {
//         let updateRuleGroup: Array<JSX.Element> = []
//         for (let j = 0; j < updateRuleNumberGroup; j++) {
//             updateRuleGroup[j] = <div><AddRuleGroup data={data} id={String(j)} MajorArray={MajorArray} deleteGroup={deleteGroup} UpdateMajorArray={UpdateMajorArray} /></div>
//         }
//         console.log(MajorArray)
//         return (
//             <div>
//                 {/* <Page title="Query Builder"> */}
//                 <Card >
//                     <Card >
//                         {/* <Page> */}
//                         {/* <Banner status="info"> */}
//                         {/* <Label id="Label">Prepared Query</Label> */}
//                         <h4>
//                             {Query}
//                         </h4>
//                         {/* </Banner> */}
//                         {updateRuleGroup}
//                         <div style={{ float: 'right' }}>
//                             <Button  onClick={AddRuleGroupBy1}>Add RuleGroup</Button>
//                         </div>
//                         {/* </Page> */}
//                     </Card>
//                     <div style={{ justifyContent: 'center', display: 'flex', margin: '30px 0' }}>
//                         {/* <Button disabled={disabled} onClick={runQuery}>Run Query</Button>
//                          */}
//                         <Button onClick={runQuery}>Run Query</Button>
//                     </div>
//                     {(displayPC && prodCount !== undefined) &&
//                     // <Banner title="Selected Products Count" status='success'>
//                     <div>
//                     {prodCount === 0 ?
//                         <h4>No products are selected under this query : {Query}</h4> :
//                         <h4>Total {prodCount} Product are selected under this query: {Query}</h4>
//                     }
//                     </div>
//                     }
//                 </Card>
//                 {/* </Page> */}
//             </div>
//         );
//     } else {
//         return null
//     }
//
//
// }
//
// export default QueryBuilder;
//
//
//
//
// const AddRuleGroup: (props: AddRuleGroupProps) => JSX.Element = ({ data, id, MajorArray, deleteGroup, UpdateMajorArray }) => {
//
//
//
//     const [dataArray, setDataArray] = useState<Array<queryDataInterface>>([])
//     const [updateRuleNumber, setUpdateRuleNumber] = useState<number>(1)
//
//     useEffect(() => {
//         setDataArray(MajorArray[Number(id)])
//         setUpdateRuleNumber(MajorArray[Number(id)].length)
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [MajorArray[Number(id)]])
//
//     const AddRule: () => void = () => {
//         setUpdateRuleNumber(updateRuleNumber + 1)
//         MajorArray[Number(id)] = dataArray
//         UpdateMajorArray(MajorArray)
//     }
//     useEffect(() => {
//
//     }, [dataArray])
//
//     const deleteQuery: (id: string) => void = (id) => {
//         var idTodelete = Number(id.split(',')[1]);
//         dataArray.splice(idTodelete, 1);
//         setUpdateRuleNumber(updateRuleNumber - 1)
//         UpdateMajorArray(MajorArray)
//         // console.log(MajorArray)
//     }
//
//     const recieveDataFromQuery: (arr: Array<queryDataInterface>) => void = (arr) => {
//         MajorArray[Number(id)] = arr
//         setDataArray(arr);
//         UpdateMajorArray(MajorArray)
//     }
//
//     let updateRule: Array<JSX.Element> = [];
//
//     for (let j = 0; j < updateRuleNumber; j++) {
//         if (!dataArray[j]) {
//             dataArray[j] = {
//                 Attribute: '0',
//                 Value: '',
//                 Operator: '0'
//             }
//         }
//         if (!MajorArray[Number(id)]) {
//             MajorArray[Number(id)] = []
//             MajorArray[Number(id)][j] = {...dataArray[j]}
//         }
//         updateRule[j] = <><QueryToTakeFrom id1={`${id},${String(j)}`} data={data} deleteQuery={deleteQuery} dataArray={dataArray} recieveDataFromQuery={recieveDataFromQuery} initialValue={dataArray[j]} /><br /><br /></>
//     }
//
//     return (
//         <div>
//             <Card >
//                 {/* <Banner status="info"> */}
//                 {/* <Label id="Label">New Group</Label> */}
//                 <p>New Group</p>
//                 {id}
//                 {/* </Banner> */}
//                 {/* <Page> */}
//                 {updateRule}
//                 <div style={{ float: 'right' }}>
//                     <Button  onClick={AddRule}>AddRule</Button>
//                 </div>
//                 {/* </Page> */}
//
//             </Card>
//             {id !== String(0) ? <><br /><div style={{ float: 'right' }}>
//                 <Button onClick={() => deleteGroup(id)}>Delete Group</Button>
//             </div><br /></> : null}
//         </div>
//     )
// }
//
//
//
//
//
// const select2: Array<string> = ["Equals", "Not Equals", "Contains", "Does Not Contain", "Greater Than", "Less Than", "Greater Than Equal To", "Less Than Equal To"]
// const value2: Array<string> = ["==", "!=", "%LIKE%", "!%LIKE%", ">", "<", ">=", "<="]
//
//
// const QueryToTakeFrom: (props: QueryToTakeFromProps) => JSX.Element = ({ id1, data, deleteQuery, dataArray, recieveDataFromQuery, initialValue }) => {
//
//
//     const [value, setValue] = useState<string | undefined>(initialValue.Value);
//     const [options3, setOptions3] = useState<Array<selectObject>>([])
//
//     useEffect(() => {
//         setValue(initialValue.Value)
//         if (initialValue.Attribute !== undefined) {
//             onChangeNote(initialValue.Attribute, 'initialSet')
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [initialValue])
//
//     const createSelectObject: (select: Array<string>, value: Array<string>, disable: string) => Array<selectObject> = (select, value, disable) => {
//         let options: Array<selectObject> = []
//         options[0] = { label: disable, value: '0', disabled: true }
//         for (let i = 0; i < select.length; i++) {
//             let obj: selectObject = { label: '', value: '' };
//             obj = {
//                 label: select[i],
//                 value: value[i]
//             }
//             options[i + 1] = obj
//         }
//         return options
//     }
//
//     const select1: Array<string> = data.map((element) => element.title)
//     const value1: Array<string> = data.map((e) => e.code)
//     const options1: Array<selectObject> = createSelectObject(select1, value1, 'Select Attribute');
//
//     const options2: Array<selectObject> = createSelectObject(select2, value2, 'Select Operator');
//
//
//     const dataFromSelect: (selectData: string, valueData?: string) => void = (selectData, valueData) => {
//         let splitData: Array<string> = selectData.split(',');
//         dataArray[Number(splitData[2])] = {
//             ...dataArray[Number(splitData[2])],
//             [splitData[0]]: valueData
//         }
//         recieveDataFromQuery(dataArray);
//     }
//
//     useEffect(() => {
//         console.log('value')
//     }, [value])
//
//
//     const onChangeNote: (element: string, from?: string) => void = (element, from) => {
//         var elementData: { [name: string]: Array<any> } = {}
//         if (!from) {
//             setValue('')
//             let splitData: Array<string> = id1.split(',');
//             dataArray[Number(splitData[1])] = {
//                 ...dataArray[Number(splitData[1])],
//                 Value: ''
//             }
//             recieveDataFromQuery(dataArray)
//         }
//         data.forEach((e) => { if (e.code === element) { elementData = e } })
//         if (elementData.options) {
//             let arr: Array<any> = [];
//             arr[0] = { label: 'Filter Value', value: '', disabled: true }
//             elementData.options.forEach((e) => { arr.push(e) })
//             setOptions3(arr);
//         }
//         else {
//             setOptions3([]);
//         }
//     }
//
//
//     return (
//         <div>
//             <div className="row">
//                 <br />
//                 <CreateSelect label="Attribute" id1={id1} select={options1} onChangeNote={onChangeNote} dataFromSelect={dataFromSelect} initialValue={initialValue.Attribute} />
//                 <CreateSelect label="Operator" id1={id1} select={options2} dataFromSelect={dataFromSelect} initialValue={initialValue.Operator} />
//                 {options3[0] != null ? <CreateSelect label="Value" id1={id1} select={options3} dataFromSelect={dataFromSelect} initialValue={initialValue.Value} /> :
//                     <div className="col-md" id={id1}>
//                         <TextField value={value} placeHolder='Filter Value' onChange={(e) => { setValue(e); let id=`Value,${id1}`; dataFromSelect(id, e) }} />
//                     </div>}
//             </div>
//             {id1.split(',')[1] !== String(0) ? <><br /><div style={{ float: 'right' }}>
//                 <Button onClick={() => deleteQuery(id1)}>Delete</Button>
//             </div><br /></> : null}
//         </div>
//     )
// }
//
//
//
//
//
// const CreateSelect: (props: CreateSelectInterface) => JSX.Element = ({ label, id1, select, onChangeNote, dataFromSelect, initialValue }) => {
//     const [selected, setSelected] = useState<string | undefined>(initialValue);
//     useEffect(() => {
//         setSelected(initialValue)
//     }, [initialValue])
//     const handleSelectChange: (e: string) => void = (e) => {
//         let id=`${label},${id1}`
//         setSelected(e);
//         dataFromSelect(id, e)
//         if (onChangeNote) {
//             onChangeNote(e);
//         }
//     };
//     return (
//         <div className="col-md" id={id1} key={id1}>
//             {/* <Label id={label}></Label> */}
//             <Select
//              options={select}
//              onChange={handleSelectChange}
//              value={selected}
//         />
//     </div>
//     )
// }
//
//
