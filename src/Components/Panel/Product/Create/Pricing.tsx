/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { TextField, Card, FlexLayout } from "@cedcommerce/ounce-ui";
import { DI } from "./../../../../Core";
function Pricing(props: any): JSX.Element {
  // console.log(props, "props");
  const [Price, ChangePrice] = useState(parseFloat(props.Price1));
  const [currency, setCurrency] = useState("");

  const [CPrice, ChangeCPrice] = useState(props.compareAtPrice);

  useEffect(() => {
    if (props.Price1 != 0) {
      ChangePrice(props.Price1);
    }
    if (props.compareAtPrice != 0) {
      ChangeCPrice(props.compareAtPrice);
    }
  }, [props.Price1, props.compareAtPrice]);

  // useEffect(() => {
  //   props.PricingToAddProduct(Price, CPrice);
  // }, [Price, CPrice]);

  useEffect(() => {
    props.di.GET("/frontend/app/getUserDetails").then((e: any) => {
      if (e.success) {
        setCurrency(e.currency);
      }
    });
  }, []);

  return (
    <Card cardType="plain" title="Pricing">
      <div className="mb-15">
        <FlexLayout direction="vertical" spacing="loose" halign="center">
          <FlexLayout halign="center" childWidth="fullWidth" spacing="loose">
            <TextField
              prefix={currency}
              name={
                <>
                  Price
                  <span style={{ color: "red", fontSize: "20px" }}> *</span>
                </>
              }
              placeHolder="0"
              type="number"
              readOnly={!props.saveEditDisable}
              value={Price}
              onChange={(e) => {
                // props.PricingToAddProduct(e);

                (parseFloat(e) > 0 || e == "") &&
                  (props.PricingToAddProduct(parseFloat(e), CPrice),
                  ChangePrice(parseFloat(e)));
              }}
              thickness="thin"
            />

            <TextField
              prefix={currency}
              name={`Compare at price `}
              placeHolder="0"
              readOnly={!props.saveEditDisable}
              value={CPrice}
              onChange={(e) => {
                (parseFloat(e) > 0 || e == "") &&
                  (props.PricingToAddProduct(Price, parseFloat(e)),
                  ChangeCPrice(parseFloat(e)));
              }}
              thickness="thin"
              type="number"
            />
          </FlexLayout>
          {/* <hr />
                    <FlexLayout spacing='loose' halign='fill' childWidth='fullWidth'>
                        <TextField
                            name={`Cost per item ${currency}`}
                            placeHolder="0.0"
                            value={Cost}
                            onChange={(e) =>
                                ChangeCost(parseFloat(e))}
                            thickness="thin"
                            type="number"
                            showHelp="Customers won’t see this" />
                        <FlexLayout direction='vertical' spacing='loose' childWidth='fullWidth'>
                            <TextStyles type='neutralText'>Margin</TextStyles>
                            <TextStyles type='neutralText'>{margin != "0" ? (margin + "%") : "-"}</TextStyles>
                        </FlexLayout>
                        <FlexLayout direction='vertical' spacing='loose' childWidth='fullWidth'>
                            <TextStyles type='neutralText'>Profit</TextStyles>
                            <TextStyles type='neutralText'>{Profit != 0 ? currency + " " + Profit : "-"}</TextStyles>
                        </FlexLayout>

                    </FlexLayout> */}
          {/* <CheckBox
                        labelVal="Charge tax on this product"
                        checked={Checked}
                        onClick={() => { ChangeChecked(!Checked); }}
                    /> */}
        </FlexLayout>
      </div>
    </Card>
  );
}

export default DI(Pricing);
