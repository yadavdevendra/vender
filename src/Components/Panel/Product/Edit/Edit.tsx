/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Badge,
  BodyHeader,
  Button,
  Card,
  FlexLayout,
  MainLayout,
  TextField,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { useState } from "react";
import { DI, DIProps } from "../../../../Core";
import Pricing from "../Create/Pricing";
import Inventory from "../Create/Inventory";
import Shipping from "../Create/Shipping";
import TextEditor from "../Create/TextEditor";
import ImageDrop from "../Create/ImageDrop";

function App(Props: DIProps): JSX.Element {
  const [Price, SetPrice] = useState(20);

  const [tags, setTags] = useState<Array<string>>([]);
  const [texttag, settexttags] = useState("");
  const [Quantity, setquantity] = useState("");
  const [Barcode, setBarcode] = useState("");
  const [Sku, setSku] = useState("");
  const [tempUnit, setTemUnit] = useState("1");
  const [unit, SetUnit] = useState("");
  const [weight, Setweight] = useState("");
  const [constructor, setconstructor] = useState(1);
  const [dataByID, setDataByID] = useState([]);
  const [text, settext] = useState<JSX.Element>();
  const [GetDescription, setGetDescription] = useState("");
  const [currentVar, setCurrentVar] = useState("");
  const [title, setTitle] = useState("");

  if (constructor == 1) {
    Props.di
      .GET(
        "connector/product/getProductById?id=" +
          Props.match.params.id +
          "&source_marketplace=" +
          Props.match.params.source_marketplace
      )
      .then((e) => {
        setDataByID(e.data);
        e.data.map((dataMap: any) => {
          if (dataMap.source_product_id == Props.match.params.id) {
            SetPrice(dataMap.price);
            setBarcode(dataMap.barcode);
            setSku(dataMap.sku);
            setquantity(dataMap.quantity);
            setTags(dataMap.tags.split(","));
            Setweight(dataMap.weight);
            dataMap.weight_unit == "POUNDS" && setTemUnit("3");
            dataMap.weight_unit == "GRAMS" && setTemUnit("2");
            setCurrentVar(dataMap.title + " - " + dataMap.variant_title);
            setTitle(dataMap.title);
            setGetDescription(dataMap.description);
          }
        });
      });

    setconstructor(constructor + 1);
  }
  function recieveFromPricing(Price: number) {
    SetPrice(Price);
  }
  /**
   * Recieving Props From Shipping page.
   */
  function recieveFromShipping(phyPro: boolean, Weight: string, unit: string) {
    unit == "1" && SetUnit("KiloGrams");
    unit == "2" && SetUnit("Grams");
    unit == "3" && SetUnit("POUNDS");
    Setweight(Weight);
  }
  /**
   * Recieving Props From Inventory page.
   */
  function recieveFromInventory(
    Quantity: string,
    SKU: string,
    Barcode: string
  ) {
    setBarcode(Barcode);
    // setSku(SKU);
    // setquantity(Quantity);
  }

  function EditFunc(id1: string, source_marketplace: string) {
    setconstructor(1);
    Props.history.push("/products/" + source_marketplace + "/variants/" + id1);
  }
  function recieveFromText(text: JSX.Element) {
    settext(text);
  }

  return (
    <>
      <BodyHeader title={currentVar}></BodyHeader>
      <MainLayout>
        <div>
          <Card>
            <TextStyles>Title:</TextStyles>
            <TextField
              thickness="thin"
              placeHolder="Enter the Product Title   dsad"
              value={title}
              readOnly={true}
            />
            {GetDescription != "" && (
              <TextEditor
                TextToAddProduct={recieveFromText}
                TextById={GetDescription}
                saveEdit
              />
            )}
          </Card>
          <ImageDrop />
          <Pricing PricingToAddProduct={recieveFromPricing} Price1={Price} />
          {/* <Shipping shippingToAddProduct={recieveFromShipping} weight1={weight} unit1={tempUnit} /> */}
        </div>
        <div>
          <Card>
            <TextStyles>Tags</TextStyles>
            <TextField
              thickness="thin"
              value={texttag}
              onChange={(e) => settexttags(e)}
              onEnter={() => {
                !tags.includes(texttag) &&
                  setTags((prev) => [...prev, texttag]);
                settexttags("");
              }}
            />

            <FlexLayout spacing="loose" wrap="wrap">
              {tags.map((m: string) => {
                const x = tags.indexOf(m);
                return (
                  <>
                    <Badge
                      backgroundColor="rgba(206,206,206,1)"
                      destroy={() => {
                        tags.splice(x, 1);
                        const c: Array<string> = [...tags];
                        setTags(c);
                      }}
                      size="small"
                      type="Success"
                    >
                      {m}
                    </Badge>
                  </>
                );
              })}
            </FlexLayout>
          </Card>
          <div className="mt-20">
            <BodyHeader title="Variants"></BodyHeader>
            <Card cardType="plain">
              {dataByID.map((m1) => {
                if (
                  m1["source_product_id"] == Props.match.params.id &&
                  m1["visibility"] != "Catalog and Search"
                ) {
                  return (
                    <div>
                      <Button>{m1["title"] + "-" + m1["variant_title"]}</Button>
                    </div>
                  );
                }
                if (
                  m1["source_product_id"] != Props.match.params.id &&
                  m1["visibility"] != "Catalog and Search"
                ) {
                  return (
                    <div className="mt-10">
                      <Button
                        onClick={() =>
                          EditFunc(
                            m1["source_product_id"],
                            m1["source_marketplace"]
                          )
                        }
                        type="Plain"
                      >
                        {m1["title"] + "-" + m1["variant_title"]}
                      </Button>
                    </div>
                  );
                }
              })}
            </Card>
          </div>
        </div>
      </MainLayout>
      {/* <Button onClick={() => updatedata()}>UPDATE</Button> */}
    </>
  );
}

export default DI(App);
