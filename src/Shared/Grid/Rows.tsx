/* eslint-disable @typescript-eslint/no-explicit-any */
// @flow
import * as React from "react";
import {
  CheckBox,
  PlusIcon,
  MinusIcon,
  Skeleton,
  // FlexLayout,
} from "@cedcommerce/ounce-ui";
import { useState } from "react";
import { PropsInterface, ObjectInterface } from "./Interfaces";
function Rows({
  rows = [{}],
  columns,
  onRowSelect = () => {
    return null;
  },
  selectedArray = [],
  enableSelect = false,
  uniqueKey = "",
  rowOnClick = () => {
    return "";
  },
  Accordiankey = "",
  loading = false,
  popOverData = <p>abc</p>,
}: PropsInterface): JSX.Element | null {
  let accordingCheck = false;
  rows.forEach((row) => {
    if (row["according"] != undefined) accordingCheck = true;
  });
  //Render All Rows
  return (
    <tbody>
      {loading && (
        <RenderRowSkelton
          columns={columns}
          rows={rows}
          Accordiankey={Accordiankey}
        />
      )}
      {rows.map((row: ObjectInterface, i) => (
        <RenderRow
          accordingCheck={accordingCheck}
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
          Accordiankey={Accordiankey}
          popOverData={popOverData}
        />
      ))}
    </tbody>
  );
}

function RenderRowSkelton({
  columns,
  Accordiankey,
}: PropsInterface): JSX.Element {
  return (
    <>
      {Object.keys([0, 1, 2, 3]).map((ee, eeIn) => {
        return (
          <tr key={eeIn}>
            {Object.keys(columns).map((e, index) => {
              return (
                <td key={index}>
                  <Skeleton line={2} height="10px" />
                </td>
              );
            })}
            <td>
              <Skeleton line={2} height="10px" />
            </td>
            {Accordiankey !== "" ? (
              <td>
                <Skeleton line={2} height="10px" />
              </td>
            ) : null}
          </tr>
        );
      })}
    </>
  );
}
//Render Particular row
function RenderRow({
  row = {},
  uniqueKey = "",
  columns,
  enableSelect = false,
  onRowSelect = () => {
    return null;
  },
  selectedArray = [],
  rowOnClick = () => {
    return "";
  },
  index = 0,
  // Accordiankey = '',
  accordingCheck,
}: PropsInterface): JSX.Element {
  //To Toggle the Accordian
  const [show, handleShow] = useState(false);
  //Flag to Handle Row onClick
  let z = 0;
  const according: any = row["according"];
  let enablecheck: any = true;
  if (row["enableCheck"] != undefined) {
    enablecheck = row["enableCheck"];
  }

  return (
    <>
      <tr key={index} onClick={() => z == 0 && rowOnClick(row)}>
        {enableSelect && (
          <td key={index}>
            {/* <FlexLayout
                            direction="vertical"
                            valign="center"
                            spacing="loose"
                            halign="center"> */}
            {enablecheck && (
              <CheckBox
                labelVal={""}
                checked={selectedArray.includes(row[uniqueKey])}
                onClick={() => {
                  onRowSelect(row);
                }}
              />
            )}
            {/* {Accordiankey !== '' &&
                                (according ? (
                                    <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            //Flag increased so row onClick dont work on button onClick
                                            z++;
                                            handleShow(!show);
                                        }}>
                                        {!show ? PlusIcon : MinusIcon}{' '}
                                    </span>
                                ) : null)} */}
            {/* </FlexLayout> */}
          </td>
        )}
        {accordingCheck && (
          <td>
            {according ? (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => {
                  //Flag increased so row onClick dont work on button onClick
                  z++;
                  handleShow(!show);
                }}
              >
                {!show ? PlusIcon : MinusIcon}{" "}
              </span>
            ) : null}
          </td>
        )}
        {Object.keys(columns)
          .filter((key) => columns[key].visible)
          .filter((e) => columns[e].name !== "")
          .map((key, CI) => (
            <td key={CI} style={{ whiteSpace: "pre-wrap" }}>
              {row[key]}
            </td>
          ))}
      </tr>
      {/* Display Accordian data only when Accordian toggle is true */}
      {show && according && (
        <tr>
          <td
            colSpan={
              Object.keys(columns)
                .filter((key) => columns[key].visible)
                .filter((e) => columns[e].name !== "").length +
              1 +
              (enableSelect ? 1 : 0)
            }
          >
            {React.createElement(according, {
              row: row,
              id: row[uniqueKey],
            })}
          </td>
        </tr>
      )}
    </>
  );
}
export default Rows;
