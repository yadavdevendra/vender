import {
  Card,
  CheckBox,
  FlexLayout,
  FormChild,
  TextField,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { useState, useEffect } from "react";

interface PropsI {
  InventoryToAddProduct: (
    available: string,
    sku: string,
    barcodeData: string,
    trackQuantity: boolean,
    continueSales: boolean
  ) => void;
  barcode1: string;
  quantity1: string;
  Sku1: string;
  trackQuantity: boolean;
  continueSales: boolean;
  saveEditDisable: boolean;
}

function Inventory(props: PropsI): JSX.Element {
  const [barcodeData, changebarcode] = useState<string>(props.barcode1);
  const [sku, changesku] = useState<string>(props.Sku1);
  const [available, changeAval] = useState(props.quantity1);
  const [trackchk, changeTrk] = useState(props.trackQuantity);
  const [Continuechk, changeContinue] = useState(props.continueSales);

  useEffect(() => {
    changebarcode(props.barcode1);
    changesku(props.Sku1);
    changeAval(props.quantity1);
  }, [
    props.Sku1,
    props.barcode1,
    props.quantity1,
    props.trackQuantity,
    props.continueSales,
  ]);
  useEffect(() => {
    props.InventoryToAddProduct(available, sku, barcodeData, trackchk, Continuechk);
  }, [available, sku, barcodeData, trackchk, Continuechk]);
  return (
    <Card cardType="plain" title="Inventory">
      <FlexLayout childWidth="fullWidth" spacing="loose">
        <FormChild>
          <TextField
            name="SKU (Stock Keeping Unit)"
            value={sku}
            readOnly={!props.saveEditDisable}
            thickness="thin"
            onChange={(e) => changesku(e)}
          />
        </FormChild>

        <FormChild>
          <TextField
            name="Barcode (ISBN, UPC, GTIN, etc.)"
            value={barcodeData}
            readOnly={!props.saveEditDisable}
            thickness="thin"
            onChange={(e) => changebarcode(e)}
          />
        </FormChild>
      </FlexLayout>

      {trackchk == true && (
        <div className="mt-10">
          <FlexLayout>
            <FormChild>
              <TextStyles type="neutralText">
                Quantity
                <span style={{ color: "red", fontSize: "20px" }}>*</span>
              </TextStyles>
              <TextField
                // name="Quantity"
                placeHolder="0"
                value={available}
                readOnly={!props.saveEditDisable}
                thickness="thin"
                onChange={(e) => (/^\d*$/.test(e)) && changeAval(e)}
                type="number"
              />
            </FormChild>
          </FlexLayout>
        </div>
      )}
      <div className="mt-10">
        <CheckBox
          labelVal="Track Quantity"
          checked={trackchk}
          onClick={() => {
            props.saveEditDisable && changeTrk(!trackchk)
            if (!trackchk == false) changeAval("NA")
          }}
        />

      </div>
      <div className="mt-10">
        <CheckBox
          labelVal="Continue selling when out of stock"
          checked={Continuechk}
          onClick={() =>
            props.saveEditDisable && changeContinue(!Continuechk)
          }
        />
      </div>

    </Card>
  );
}

export default Inventory;
