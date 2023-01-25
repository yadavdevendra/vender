import {
  Card,
  CheckBox,
  FlexLayout,
  TextField,
  Select,
  FormChild,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState } from "react";

interface PropsI {
  shippingToAddProduct: (phyPro: boolean, Weight: string, unit: string) => void;
  weight1: string;
  unit1: string;
  Check: boolean;
  saveEditDisable: boolean;
}
function Shipping(props: PropsI): JSX.Element {
  // console.log(props, "dsfsd");
  const [phyPro, changePhyPro] = useState<boolean>(props.Check);
  const [Weight, changeWeight] = useState<string>(props.weight1);
  const [unit, changeUnit] = useState<string>(props.unit1);
  const [callParentfun, setCallParentFun] = useState(false);
  useEffect(() => {
    changePhyPro(props.Check);
    changeWeight(props.weight1);
    changeUnit(props.unit1);
  }, [props.unit1, props.weight1, props.Check]);
  useEffect(() => {
    callParentfun && props.shippingToAddProduct(phyPro, Weight, unit);
  }, [phyPro, Weight, unit]);
  return (
    <Card cardType="plain" title="Shipping">
      <FormChild>
        <CheckBox
          checked={props.Check || phyPro}
          onClick={() => {
            setCallParentFun(true);
            props.saveEditDisable && changePhyPro(!phyPro);
          }}
          labelVal="This is a physical Product"
        />
      </FormChild>
      {(props.Check || phyPro) && (
        <div>
          <hr />
          <FlexLayout spacing="loose" halign="start">
            <TextField
              thickness="thin"
              name="Weight"
              value={Weight}
              readOnly={!props.saveEditDisable}
              placeHolder="0.0"
              type="number"
              onChange={(e) => {
                setCallParentFun(true);
                changeWeight(e);
              }}
              suffix={
                <Select
                  // name="Unit"
                  disabled={!props.saveEditDisable}
                  thickness={"thin"}
                  onChange={(e) => {
                    setCallParentFun(true);

                    changeUnit(e);
                  }}
                  value={unit}
                  options={[
                    {
                      label: "kg",
                      value: "kg",
                    },
                    {
                      label: "g",
                      value: "g",
                    },
                    {
                      label: "lb",
                      value: "lb",
                    },
                    {
                      label: "oz",
                      value: "oz",
                    },
                  ]}
                />
              }
            />
          </FlexLayout>
        </div>
      )}
    </Card>
  );
}

export default Shipping;
