/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Button, CheckBox, FlexLayout } from "@cedcommerce/ounce-ui";

import { PropsInterface } from "./Interfaces";

function Columns({
  rows,
  selectedArray = [],
  columns,
  handleFilterFinal = () => {
    return null;
  },
  uniqueKey = "",
  enableSelect = false,

  onAllRowSelect = () => {
    return null;
  },

  enableColumnsFilter = false,
  filterOptions = [{ value: 0, label: "" }],
  onSortClick = () => {
    return null;
  },
  sort = true,
  handleSort = () => {
    return null;
  },
}: // Accordiankey = '',
PropsInterface): JSX.Element {
  //To create the filter Object
  const [temp, settemp] = useState(" ");
  function filterUpdate() {
    let filterFinal = {};
    Object.keys(columns)
      .filter(
        (e) => columns[e].filterText != "" && columns[e].filterText != undefined
      )
      .forEach((e) => {
        filterFinal = {
          ...filterFinal,
          [e]: {
            key: columns[e].filterOption,
            value: columns[e].filterText,
            rawData: columns[e],
          },
        };
      });
    // To Transfer the filter Object to App.js
    handleFilterFinal(filterFinal);
  }
  //To display filter text area and dropdown
  const renderFilters = (key: string): JSX.Element | React.ReactNode => {
    if (columns[key].preFilter) {
      return columns[key].preFilter;
    }
    return (
      <>
        <span onKeyPress={(e) => e.key === "Enter" && filterUpdate()}>
          <input
            type="text"
            onChange={(e) => (columns[key]["filterText"] = e.target.value)}
          />
        </span>
        <select
          onChange={(value) => {
            columns[key].filterOption = value.target.value;
            columns[key].filterText != "" &&
              columns[key].filterText != undefined &&
              filterUpdate();
          }}
          defaultValue="3"
        >
          {filterOptions.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </>
    );
  };
  const disp = selectedArray.length == 0 ? "table-header-group" : "none";
  let according = false;
  rows.forEach((row) => {
    if (row["according"] != undefined) according = true;
  });
  const handleSorting = (index: string) => {
    settemp(index);
  };
  return (
    <>
      <thead key={123} style={{ display: disp }}>
        <tr key="abc">
          {enableSelect && (
            <th>
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
            </th>
          )}
          {according && <th></th>}
          {Object.keys(columns)
            .filter((e) => columns[e].visible)
            .filter((e) => columns[e].name !== "")
            .map((key) => {
              if (key != "" && columns[key].sort) {
                return (
                  <RenderButton
                    handleSorting={handleSorting}
                    temp={temp}
                    rows={rows}
                    key={key}
                    index={key}
                    handleSort={handleSort}
                    name={columns[key]["name"]}
                    onSortClick={onSortClick}
                    sort1={sort}
                  />
                );
              } else {
                if (columns[key].filter && enableColumnsFilter)
                  return (
                    <th key={key}>
                      {columns[key]["name"]}
                      {renderFilters(key)}
                    </th>
                  );
                else return <th key={key}>{columns[key]["name"]}</th>;
              }
            })}
          {/* {Accordiankey !== '' && <th>Actions</th>} */}
        </tr>
      </thead>
    </>
  );
}
function RenderButton({
  index,
  name,
  handleSort,
  rows,
  onSortClick,
  temp,
  handleSorting,
}: any) {
  const [first, setfirst] = useState(true);
  const [sort, setsort] = useState(false);
  const [Field, setField] = useState("");
  const [FirstClick, setFirstClick] = useState("");
  useEffect(() => {
    !first && handleSort(index, sort);
    setfirst(false);
  }, [sort]);

  return (
    <th key={index}>
      <FlexLayout valign={"center"} halign={"center"} spacing={"tight"}>
        <span style={{ fontSize: "16px" }}>{name}</span>
        <Button
          type="Plain"
          iconAlign="left"
          iconRound={false}
          icon={
            Field != temp ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                height="16"
              >
                <path
                  d="M5.293 2.293a.997.997 0 011.414 0l3 3a1 1 0 01-1.414 1.414L7 5.414V13a1 1 0 11-2 0V5.414L3.707 6.707a1 1 0 01-1.414-1.414l3-3zM13 7a1 1 0 012 0v7.585l1.293-1.292a.999.999 0 111.414 1.414l-3 3a.997.997 0 01-1.414 0l-3-3a.997.997 0 010-1.414.999.999 0 011.414 0L13 14.585V7z"
                  fill="#5C5F62"
                />
              </svg>
            ) : sort ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                height="13"
              >
                <path
                  d="M10.707 17.707l5-5a.999.999 0 10-1.414-1.414L11 14.586V3a1 1 0 10-2 0v11.586l-3.293-3.293a.999.999 0 10-1.414 1.414l5 5a.999.999 0 001.414 0z"
                  fill="#5C5F62"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                height="13"
              >
                <path
                  d="M11 17V5.414l3.293 3.293a.999.999 0 101.414-1.414l-5-5a.999.999 0 00-1.414 0l-5 5a.997.997 0 000 1.414.999.999 0 001.414 0L9 5.414V17a1 1 0 102 0z"
                  fill="#5C5F62"
                />
              </svg>
            )
          }
          onClick={() => {
            setsort(!sort);
            setField(index);
            handleSorting(index);
          }}
        ></Button>
      </FlexLayout>
    </th>
  );
}

export default Columns;
