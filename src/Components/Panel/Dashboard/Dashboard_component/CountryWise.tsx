/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { VectorMap } from "react-jvectormap";
import { DIProps, DI } from "../../../../Core";

function CountryWise(props: DIProps) {
  const [mapVal1, setMapVal] = useState<any>({});
  const [mapSale1, setMapSale] = useState<any>({});

  function getData() {
    const mapVal: any = {};
    const mapSale: any = {};

    props.di.GET("frontend/migrator/getMigrationAnalytics").then((e) => {
      const map: any = e.data.order.country_wise_order.map((m: any) => {
        return m;
      });
      Object.values(map).map((e: any) => {
        mapVal[e._id] = e.count;
        mapSale[e._id] = Math.round(e.Total_Sales);
      });
      setMapVal(mapVal);
      setMapSale(mapSale);
    });
  }

  function TipValue(e: any, el: any, code: any) {
    return el.html(
      el.html() +
      "<br/> Count : " +
      mapVal1[code] +
      "<br/>" +
      " Sale : " +
      mapSale1[code]
    );
  }
  useEffect(() => {
    getData();
  }, []);

  const regionStyle = {
    initial: {
      fill: "#e4e4e4",
      "fill-opacity": 0.9,
      stroke: "none",
      "stroke-width": 0,
      "stroke-opacity": 0,
    },
  };
  const series = {
    regions: [
      {
        values: mapVal1,
        scale: ["#AAAAAA", "#444444"],
        normalizeFunction: "polynomial",
      },
    ],
  };
  return (
    <div style={{ width: 600, height: 300, marginLeft: 80 }}>
      <VectorMap
        map={"world_mill"}
        backgroundColor="transparent"
        zoomOnScroll={false}
        // backgroundColor="#3b96ce"
        // ref="map"
        containerStyle={{
          width: "100%",
          height: "100%",
        }}
        containerClassName="map"
        regionStyle={regionStyle}
        series={series}
        onRegionTipShow={TipValue}
      />
    </div>
  );
}

export default DI(CountryWise);
