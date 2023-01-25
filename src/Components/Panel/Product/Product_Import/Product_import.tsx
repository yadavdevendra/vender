/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, Children } from "react";

import { DI, DIProps } from "../../../../Core";
import {
  Card,
  FlexLayout,
  Select,
  TextStyles,
  PageHeader,
  // Notification,
  Dots,
  Radio,
  Button,
  ChoiceList,
  ToastWrapper,
  Toast,
  // StepWizard
} from "@cedcommerce/ounce-ui";

function Product_import(props: any) {
  const [importLoading, setImportLoading] = useState(false);
  const [filter, setFilter] = useState("");
  const [options, setOptions] = useState<any>([]);
  const [val, setVal] = useState<any>([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [radioValue, setradiovalue] = useState("");
  const [ImportVisible, setImportVisible] = useState(false);
  const [search, setSearch] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);
  const [message, setMessage] = useState("");
  const [prodCount, setProdCount] = useState<any>({});
  const [toast, setToast] = useState(false);
  const [remainingLimit, setRemainingLimit] = useState("");
  const [toastType, setToastType] = useState("");
  const [catalogLimit, setCatalogLimit] = useState("");
  function handleSelect(select: string) {
    setFilter(select);
    if (select === "all" || select === "published") {
      setImportVisible(true);
    }
  }

  function fetchProducts() {
    setFetchDone(true);
    const dataToSend: any = {};
    if (radioValue === "product_type" || radioValue === "vendor") {
      dataToSend["type"] = radioValue;
    } else if (radioValue === "smart") {
      dataToSend["collection_type"] = radioValue;
      dataToSend["type"] = "collection";
    } else {
      dataToSend["collection_type"] = radioValue;
      dataToSend["type"] = "collection";
    }
    props.di
      .POST("shopifyhome/request/getProductAttributes", dataToSend)
      .then((res: any) => {
        if (res.success) {
          const productCountObj: any = {};
          const productOpt = Object.keys(res.data).map((key) => {
            if (radioValue === "smart" || radioValue === "custom") {
              productCountObj[key] = res.data[key].products_count;
              return {
                label: res.data[key].title,
                value: key,
              };
            } else {
              return { label: res.data[key], value: res.data[key] };
            }
          });
          setOptions(productOpt);
          setSearch(true);
          setImportVisible(true);
          setProdCount(productCountObj);
          setFetchDone(false);
          setToastType("success");
          if (res.data.length === 0) {
            setToast(true);
            setToastType("error");
            setMessage("No Products Found.");
          }
        } else {
          setFetchDone(false);
        }
      });
  }

  useEffect(() => {
    getCardLimit();
  }, []);

  function getCardLimit() {
    props.di
      .GET("connector/product/getVendorProductLimit", {
        marketplace: "shopify",
      })
      .then((res: any) => {
        setRemainingLimit(res.remaining_limit);
        setCatalogLimit(res.catalog_limit);
      });
  }

  const handleStartImport = () => {
    setImportLoading(true);
    const dataToSend: any = {};
    if (filter === "apply filter for") {
      if (radioValue === "product_type") {
        dataToSend["filterdata"] = { product_type: val };
        dataToSend["marketplace"] = "shopify";
      } else if (radioValue === "vendor") {
        dataToSend["filterdata"] = { vendor: val };
        dataToSend["marketplace"] = "shopify";
      } else if (radioValue === "smart") {
        dataToSend["filterdata"] = {
          collection: val,
          collection_type: radioValue,
          product_count: totalProduct,
        };
        dataToSend["marketplace"] = "shopify";
      } else {
        dataToSend["filterdata"] = {
          collection: val,
          collection_type: radioValue,
          product_count: totalProduct,
        };
        dataToSend["marketplace"] = "shopify";
      }
    } else {
      dataToSend["filterdata"] = filter;
      dataToSend["marketplace"] = "shopify";
    }
    // if (val.length > 0) {
    props.di.POST("connector/product/import", dataToSend).then((res: any) => {
      if (res.success) {
        setMessage(res.message);
        setToast(true);
        setToastType("success");
        setTimeout(() => {
          setImportLoading(false);
          props.history.push("/log");
        }, 1000);
      } else {
        setToast(true);
        setImportLoading(false);
        setToastType("error");
        setMessage(res.message);
      }
    });
    // } else {
    //   setToast(true);
    //   setToastType("error");
    //   setMessage("Please select one or more than one options");
    // }
  };
  return (
    <>
      {toast && (
        <ToastWrapper>
          <Toast
            timeout={3000}
            message={message}
            onDismiss={() => {
              setToast(false);
            }}
            type={toastType}
          />
        </ToastWrapper>
      )}
      <PageHeader title="Product Import" />
      <div style={{ height: "100%" }}>
        <Card>
          {props.step === 2 && (
            <div className="pt-3 pb-3">
              <FlexLayout halign="fill">
                <TextStyles type="SubHeading">
                  STEP <span className="text-muted">2</span> / 2
                </TextStyles>
                <div className="pb-3 pt-3">
                  <FlexLayout spacing="loose">
                    <Dots status="none" />
                    <Dots status="active" />
                  </FlexLayout>
                </div>
              </FlexLayout>
            </div>
          )}
          <FlexLayout
            childWidth="fullWidth"
            direction="none"
            halign="center"
            spacing="loose"
            valign="start"
            desktopWidth={"50"}
            tabWidth={"50"}
            mobileWidth={"100"}
          >
            <Card cardType="bordered">
              <TextStyles type="SubHeading">Steps to Complete</TextStyles>
              <div className="wrappers">
                <ul className="StepProgress1">
                  <li className="StepProgress-item is-done">
                    <span>
                      Choose from the dropdown for the relevant option to import
                      the products from your Shopify to the app.
                    </span>
                  </li>
                  <li className="StepProgress-item is-done">
                    <span>
                      You can import the products as per your requirement.{" "}
                    </span>
                    <span>
                      <ol>
                        <li>
                          Select All Products, if you want import all your
                          products from Shopify store to App.
                        </li>
                        <li>
                          Select Published Products, if you want to import only
                          the published products from your Shopify store to the
                          app.
                        </li>
                        <li>
                          Select Apply Filter For , if you want to import
                          products according to Vendor, Product Type, Custom or
                          Smart Collection.
                        </li>
                      </ol>
                    </span>
                  </li>
                  <li className="StepProgress-item is-done">
                    <span>
                      You can apply filters and can import specific products
                    </span>
                    <span>
                      <ol>
                        <li>
                          Choose Product type if you want to import products of
                          any specific set of product types.
                        </li>
                        <li>
                          Choose Product vendor if you want to import products
                          in app for a particular vendor.
                        </li>
                        <li>
                          Choose Smart Collection if you want to import products
                          from a Smart Collection.
                        </li>
                        <li>
                          Choose Custom Collection if you want to import
                          products from a Custom Created Collection.
                        </li>
                      </ol>
                    </span>
                  </li>
                </ul>
              </div>
            </Card>
            <Card cardType="bordered">
              <FlexLayout direction="vertical" spacing="tight">
                <>
                  <Select
                    value={filter}
                    thickness="thin"
                    onChange={(e) => handleSelect(e)}
                    placeholder="Select import options"
                    options={[
                      {
                        label: "All Products Import",
                        value: "all",
                      },
                      {
                        label: "Published Products Import",
                        value: "published",
                      },
                      { label: "Apply Filter For", value: "apply filter for" },
                    ]}
                  ></Select>
                </>
                {filter === "apply filter for" && (
                  <>
                    <FlexLayout direction="vertical" spacing="tight">
                      <FlexLayout spacing="tight">
                        <Radio
                          onClick={() => {
                            setradiovalue("product_type");
                            setVal([]);
                            setOptions([]);
                            setSearch(false);
                          }}
                          name="file"
                          labelVal="Product type"
                        />
                        <Radio
                          onClick={() => {
                            setradiovalue("vendor");
                            setVal([]);
                            setOptions([]);
                            setSearch(false);
                          }}
                          name="file"
                          labelVal="Product vendor"
                        />
                        <Radio
                          onClick={() => {
                            setradiovalue("smart");
                            setVal([]);
                            setOptions([]);
                            setSearch(false);
                          }}
                          name="file"
                          labelVal="Smart Collection"
                        />
                        <Radio
                          onClick={() => {
                            setradiovalue("custom");
                            setVal([]);
                            setOptions([]);
                            setSearch(false);
                          }}
                          name="file"
                          labelVal="Custom Collection"
                        />
                      </FlexLayout>
                      {radioValue && (
                        <FlexLayout direction="vertical" spacing="tight">
                          <Button
                            loading={fetchDone}
                            thickness={"thin"}
                            type={"Outlined"}
                            onClick={() => {
                              fetchProducts();
                            }}
                          >
                            Fetch Products from Shopify
                          </Button>

                          <>
                            <ChoiceList
                              showHelp={true}
                              showBadges={true}
                              disabled={options.length === 0}
                              //   selectHelp='Add this product to a collection so it’s easy to find in your store.'
                              //   name='Collections'
                              searchEable={search}
                              thickness="thin"
                              placeholder="Search for Products"
                              options={options}
                              value={val}
                              onChange={(t: any) => {
                                if (val.includes(t)) {
                                  const index = val.indexOf(t);
                                  val.splice(index, 1);
                                  const c = [...val];
                                  setVal(c);
                                  setTotalProduct(
                                    (prev) => prev - prodCount[t]
                                  );
                                } else {
                                  setVal((prev: any) => [...prev, t]);

                                  setTotalProduct(
                                    (prev) => prev + prodCount[t]
                                  );
                                }
                              }}
                            />
                          </>
                        </FlexLayout>
                      )}
                    </FlexLayout>
                  </>
                )}

                {ImportVisible && (
                  <>
                    <Button
                      thickness="thin"
                      disable={
                        filter === "apply filter for" && val.length === 0
                          ? true
                          : false
                      }
                      type="Primary"
                      loading={importLoading}
                      onClick={() => handleStartImport()}
                    >
                      Start Import
                    </Button>
                  </>
                )}
              </FlexLayout>
            </Card>
          </FlexLayout>
        </Card>
      </div>
    </>
  );
}

export default DI(Product_import);
