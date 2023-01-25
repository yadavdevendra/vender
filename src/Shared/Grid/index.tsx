/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import RenderColumns from "./Columns";
import RenderRows from "./Rows";
import RenderMobileRows from "./RowsMobile";
import { setDefaultRowsValue, setDefaultValue } from "./function";
import { ObjectInterface, PropsInterface } from "./Interfaces";
import { useState } from "react";
import { FlexLayout, CheckBox, Card } from "@cedcommerce/ounce-ui";
function Grid(props: PropsInterface): JSX.Element {
  const {
    columns = {},
    enableColumnsFilter = false,
    handleFilterFinal = () => {
      return null;
    },
    enableSelect = false,
    onRowSelect = () => {
      return null;
    },
    onAllRowSelect = () => {
      return null;
    },
    selectedArray = [],
    uniqueKey = "",
    rowOnClick = () => {
      return null;
    },
    Accordiankey = "",
    onSortClick = () => {
      return null;
    },
    sort = true,
    handleSort = () => {
      return null;
    },
    massAction = (
      <div>
        <p>Demo</p>
      </div>
    ),
    filterOptions,
    viewColumnToggle,
    popOverData = <p>abc</p>,
  } = props;
  let rows = props.rows;
  /**
   *
   * @param currentView
   * @param Width
   */

  function checkWidth(Width: number): boolean {
    if (Width < 768) return true;
    return false;
  }

  const [modileView, togleView] = useState(() => {
    return checkWidth(window.outerWidth);
  });
  useEffect(() => {
    window.addEventListener("resize", () => {
      togleView(checkWidth(window.outerWidth));
    });
    return () => {
      window.removeEventListener("resize", () => {
        //
      });
    };
  }, []);

  const [rowsNews, setrowsNew] = useState([...rows]);
  function sortRows(rowsNew: ObjectInterface[]) {
    setrowsNew([...rowsNew]);
  }
  useEffect(() => {
    setrowsNew(rows);
  }, [rows]);

  //To insert the basic columns attributes if not present in it
  const [columnsNew, updateColumns] = useState(props.columns);
  //to insert default values to rows
  rows = setDefaultRowsValue(rows);
  const dispMassAction = selectedArray.length == 0 ? "none" : "block";

  if (modileView) {
    return (
      <>
        {enableSelect && (
          <div className="inte-grid--Action">
            <Card cardType="plain">
              <FlexLayout spacing="loose" valign="center">
                <CheckBox
                  labelVal={"Select All"}
                  onClick={() => {
                    onAllRowSelect();
                  }}
                  checked={
                    rows.filter((row: any) =>
                      selectedArray.includes(row[uniqueKey])
                    ).length ==
                    rows.filter((row: any) => row.enableCheck).length
                  }
                />
                {dispMassAction !== "none" && (
                  <Card cardType="plain">
                    <FlexLayout
                      valign="center"
                      spacing="loose"
                      childWidth="fullWidth"
                    >
                      {massAction}
                    </FlexLayout>
                  </Card>
                )}
              </FlexLayout>
            </Card>
          </div>
        )}

        <RenderMobileRows
          {...props}
          uniqueKey={uniqueKey}
          selectedArray={selectedArray}
          enableSelect={enableSelect}
          onAllRowSelect={onAllRowSelect}
          onRowSelect={onRowSelect}
          rows={rows}
          Accordiankey={Accordiankey}
          columns={columnsNew}
          rowOnClick={rowOnClick}
        />
      </>
    );
  }

  function viewColumn(): JSX.Element | undefined {
    if (!viewColumnToggle) return;
    return (
      <div className="mb-10 mt-10">
        <Card cardType="linkwater">
          <FlexLayout spacing="loose" wrap="wrap" halign="fill">
            {Object.keys(columnsNew).map((element, index) => (
              <CheckBox
                key={index}
                labelVal={columnsNew[element].name}
                checked={columnsNew[element].visible ?? false}
                onClick={() => {
                  element != "title" &&
                    element != "sku" &&
                    updateColumns({
                      ...columnsNew,
                      [element]: {
                        ...columnsNew[element],
                        visible: !columnsNew[element].visible,
                      },
                    });
                }}
              />
            ))}
          </FlexLayout>
        </Card>
      </div>
    );
  }
  let according = false;
  rows.forEach((row) => {
    if (row["according"] != undefined) according = true;
  });
  return (
    <div >
      {viewColumn()}
      {dispMassAction !== "none" ? (
        <div className="inte-grid--Action">
          <FlexLayout valign="center" spacing="loose">
            <CheckBox
              labelVal={""}
              onClick={() => {
                onAllRowSelect();
              }}
              checked={
                rows.filter((row: any) =>
                  selectedArray.includes(row[uniqueKey])
                ).length == rows.filter((row: any) => row.enableCheck).length
              }
            />
            {massAction}
          </FlexLayout>
        </div>
      ) : null}
      <table className="DataGrid inte__table inte-table--cardedRow inte--layoutFixed inte__table--alignCenter">
        <colgroup>
          {enableSelect ? <col style={{ width: "60px" }} /> : null}
          {according && <col style={{ width: "30px" }} />}
          {Object.keys(columnsNew)
            .filter((e) => columnsNew[e].visible)
            .map((e, ii) => {
              return (
                <col
                  key={ii}
                  style={{
                    width: columnsNew[e].width + "px",
                  }}
                />
              );
            })}
        </colgroup>
        <RenderColumns
          {...props}
          rows={rowsNews}
          selectedArray={selectedArray}
          columns={columnsNew}
          handleFilterFinal={handleFilterFinal}
          enableSelect={enableSelect}
          onAllRowSelect={onAllRowSelect}
          massAction={massAction}
          enableColumnsFilter={enableColumnsFilter}
          filterOptions={filterOptions}
          sort={sort}
          onSortClick={onSortClick}
          handleSort={handleSort}
        />
        <RenderRows
          {...props}
          popOverData={popOverData}
          enableSelect={enableSelect}
          uniqueKey={uniqueKey}
          selectedArray={selectedArray}
          onRowSelect={onRowSelect}
          rows={rowsNews}
          Accordiankey={Accordiankey}
          columns={columnsNew}
          rowOnClick={rowOnClick}
        />
      </table>
    </div>
  );
}

export default Grid;
