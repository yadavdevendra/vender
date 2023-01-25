/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { DI, DIProps } from "./../../../Core";
import { Select, BodyHeader } from "@cedcommerce/ounce-ui";

function Cedcategory(Props: DIProps) {
  const [previousGoogle, SetPreviosGoogle] = useState([{}]);
  const [preState, SetPreState] = useState({});
  const [value, SetValue] = useState<{ [name: string]: string }>({});

  const [loadingPage, Setloadingpage] = useState(true);
  const [lastKeyGoogle, SetlastKeyGoogle] = useState("");
  const [next_levelGoogle, setNext_levelGoogle] = useState("");
  const [google, SetGoogle] = useState<any>({});
  //   const [next_level, SetNext_level] = useState("");

  function handleChange(e: any) {
    Setloadingpage(true);
    let delLevel = 0;
    SetlastKeyGoogle(e);
    Object.keys(google).map((a, b) => {
      google[a].forEach((m: any) => {
        if (m.next_level.$oid == undefined) {
          if (e == m.next_level) {
            delLevel = m.level;
          }
        } else {
          if (e == m.next_level.$oid) {
            delLevel = m.level;
          }
        }
      });
    });

    const obj1 = Object.keys(google);
    const abc1: any = { ...google };
    const xyz1: any = { ...value };

    for (let i = delLevel + 1; i <= obj1.length; i++) {
      delete abc1[i];
      delete xyz1[i];
    }
    SetValue(xyz1);
    SetGoogle(abc1);

    Props.di
      .GET(`/connector/profile/getCatrgoryNextLevel?next_level=${e}`)
      .then((data1) => {
        const a: any = {};
        data1.data.forEach((item: any) => {
          a[item.level] = [...data1.data];
        });

        SetPreState((p: any) => {
          p.loadingPage = true;
          p.previousGoogle = google;
          p.google = { ...p, previousGoogle, ...a };
          return p;
        });
      });
  }
  function options() {
    /**this function creates options for the select tag */
    if (google[0] != undefined) {
      const options1: any = [];

      const a: any[] = google[0];
      for (let i = 0; i < a.length; i++) {
        options1.push({
          label: a[i].custom_category_path,
          value: a[i].next_level,
        });
      }
      return options1;
    }
  }

  function getData() {
    Props.di
      .GET(`/connector/profile/getRootCategory?marketplace=${"shopify"}`)
      .then((e) => {
        if (e.success) {
          const a: any = {};
          e.data.forEach((item: any) => {
            a[item.level] = e.data;
          });
          // Setloadingpage(false);
          SetPreviosGoogle(a);
          setNext_levelGoogle(e.data[0].next_level);
          SetGoogle(a);
        }
      });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <BodyHeader title={"CedCommerce category"} />
      <Select
        onChange={(e) => {
          handleChange(e);
          setNext_levelGoogle(e);

          // this.setState({ next_levelGoogle: e });
        }}
        placeholder="Choose"
        options={options()}
        value={next_levelGoogle}
      />
      {Object.keys(google).map((a: any, i) => {
        const options1 = [];

        if (a != 0) {
          for (let i = 0; i < google[a].length; i++) {
            options1.push({
              label: google[a][i].name,
              value: google[a][i].next_level.$oid,
            });
          }
          return (
            <Select
              key={i}
              value={value[a]}
              placeholder="Choose"
              options={options1}
              onChange={(e) => {
                const val: any = { ...value };
                val[a] = e;

                SetValue(a);
                handleChange(e);
              }}
            />
          );
        }
      })}
    </div>
  );
}

export default DI(Cedcategory);
