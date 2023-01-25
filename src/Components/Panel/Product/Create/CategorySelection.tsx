/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChoiceList, TextStyles } from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "./../../../../Core";
interface Tags extends DIProps {
  setTag1: (obj: any) => void;
  Collection: any;
}

function CategorySelection(props: Tags): JSX.Element {
  const [val, setVal] = useState<any>([]);
  const [options1, setOptions] = useState<any>([{}]);
  // const [CollectionProp, setCollectionProp] = useState(props.Collection);
  function getData() {
    props.di.GET("shopifyhome/request/getCollectionForProduct").then((e) => {
      if (e.success) {
        let temp: any = {};
        const tempArr: any = [];
        Object.keys(e.data).map((m) => {
          temp = {
            label: e.data[m],
            value: m,
          };
          tempArr.push(temp);
        });
        setOptions(tempArr);
      }
    });
  }

  // if (props.Collection != [{}]) {
  //     const temp: any = [];
  //     Object.keys(props.Collection).map
  //         ((e) => {

  //             temp.push(props.Collection[e].collection_id);

  //         });
  //     setVal(temp);
  // }

  useEffect(() => {
    if (
      props.Collection != undefined &&
      Object.keys(props.Collection).length > 0
    ) {
      const temp: any = [];

      Object.keys(props.Collection).map((e) => {
        temp.push(props.Collection[e].collection_id);
      });
      setVal(temp);
    }
  }, [props.Collection, options1]);

  useEffect(() => {
    // delete val[0];
    const temp: any = options1.filter((e: any) => val.includes(e["value"]));
    props.setTag1(temp);
  }, [val]);
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {/* <FlexLayout wrap='wrap' spacing='loose'>
                {options1.filter((e: any) => val.includes(e["value"])).map((e: any, i: number) => <Badge key={i} destroy={() => {
                    const temp = [...val];
                    temp.splice(temp.indexOf(e['value']), 1);
                    setVal([...temp]);
                }}>{e["label"]}</Badge>

                )}
            </FlexLayout> */}

      <ChoiceList
        showHelp={true}
        showBadges={true}
        selectHelp={
          <TextStyles type="simpleText" textcolor="light">
            Add this product to a collection so it’s easy to find in your store.
          </TextStyles>
        }
        name="Collections"
        searchEable={true}
        thickness="thin"
        // disabled={options1.length === 0}
        placeholder="Search for collections"
        options={options1}
        value={val}
        onChange={(t) => {
          if (val.includes(t)) {
            const index = val.indexOf(t);
            val.splice(index, 1);
            const c = [...val];
            setVal(c);
          } else {
            setVal((prev: any) => [...prev, t]);
            // prepareData(val)
          }
        }}
      />
    </>
  );
}

export default DI(CategorySelection);
