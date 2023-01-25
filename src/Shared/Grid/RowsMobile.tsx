import * as React from 'react';
import { CheckBox, TextStyles, Skeleton } from '@cedcommerce/ounce-ui';
import { PropsInterface, ObjectInterface } from './Interfaces';

function Rows({
    rows = [{}],
    columns,
    onRowSelect = () => {
        return '';
    },
    selectedArray = [],
    uniqueKey = '',
    handleToggle = false,
    rowOnClick = () => {
        return null;
    },
    enableSelect = false,
    Accordiankey = '',
    loading,
}: PropsInterface): JSX.Element | null {
    //Render All Rows
    return (
        <>
            {/* <div className="mt-20">
                <div className="inte__tableWrap"> */}
                    {rows.map((row: ObjectInterface, i) => (
                        <RenderRow
                            handleToggle={handleToggle}
                            rows={rows}
                            row={row}
                            columns={columns}
                            enableSelect={enableSelect}
                            onRowSelect={onRowSelect}
                            key={i}
                            selectedArray={selectedArray}
                            uniqueKey={uniqueKey}
                            rowOnClick={rowOnClick}
                            index={i}
                            loading={loading}
                            Accordiankey={Accordiankey}
                        />
                    ))}
                {/* </div>
            </div> */}
        </>
    );
}
//Render Particular row
function RenderRow({
    row = {},
    columns,
    onRowSelect = () => {
        return '';
    },
    selectedArray = [],
    uniqueKey = '',
    rowOnClick = () => {
        return '';
    },
    index,
    enableSelect,
    loading,
}: PropsInterface): JSX.Element {
    //Flag to Handle Row onClick
    const z = 0;

    if (loading) {
        return (
            <div>
                <table className="inte__table inte-table--cardedRow inte--layoutFixed inte__table--alignLeft">
                    <colgroup>
                        <col style={{ width: '150px' }} />
                        <col style={{ width: '200px' }} />
                    </colgroup>
                    <tbody>
                        <tr>
                            <td>
                                <Skeleton line={5} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div
            className="inte-card"
            key={index}
            onClick={() => z == 0 && rowOnClick(row)}>
            <table className="inte__table inte-table--cardedRow inte--layoutFixed inte__table--alignLeft">
                {/* <colgroup>
                    <col style={{ width: '150px' }} />
                    <col style={{ width: '200px' }} />
                </colgroup> */}
                <tbody>
                    {enableSelect && (
                        <tr>
                            <td>
                                <CheckBox
                                    labelVal=""
                                    checked={selectedArray.includes(
                                        row[uniqueKey]
                                    )}
                                    onClick={() => {
                                        onRowSelect(row);
                                    }}
                                />
                            </td>
                            {/* <td>
                            <div className="inte__Popover-Wrapper--parent">
                                {Object.keys(row).includes(Accordiankey) && (
                                    <Button
                                        type={'Plain'}
                                        onClick={() => {
                                            //Flag increased so row onClick dont work on button onClick
                                            z++;

                                            handleShow(!show);
                                        }}>
                                        {spread}
                                    </Button>
                                )}
                            </div>
                        </td> */}
                        </tr>
                    )}

                    {/* <div>{show && row[Accordiankey]}</div> */}
                    {Object.keys(columns)
                        // .filter(
                        //     (key) =>
                        //         columns[key].visible &&
                        //         (columns[key].type != 'image' ||
                        //             columns[key].enableMobileImage)
                        // )
                        .map((key) => (
                            <tr key={key}>
                                <td>
                                    <TextStyles type="SubHeading">
                                        {columns[key].name}
                                    </TextStyles>
                                    {row[key]}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
export default Rows;
