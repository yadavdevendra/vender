/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { DI } from "../../../Core";
import {
  PageHeader,
  Button,
  FlexLayout,
  Modal,
  TextStyles,
  Toast,
  ToastWrapper,
  ToolTip,
  Notification,
  Card,
  ButtonDropdown,
} from "@cedcommerce/ounce-ui";
import StatusGrid from "./StatusGrid/StatusGrid";

function Product(Props: any): any {
  const [ToastSync, setToastSync] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [MessageSync, setMessageSync] = useState("");
  const [toast, setToast] = useState(false);

  const [ToastImport, setToastImport] = useState(false);
  const [MessageImport, setMessageImport] = useState("");
  const [ErrorToastImport, setErrorToastImport] = useState(false);
  const [MessageCsv, setMessageCsv] = useState("");
  const [ErrorToastCsv, setErrorToastCsv] = useState(false);
  const [ToastCsv, setToastCsv] = useState(false);
  const [ToastImportErrAck, setToastImportErrAck] = useState(false);
  const [ToastImportAck, setToastImportAck] = useState(false);
  const [LoadingCSVImport, setLoadingCSVImport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>({});
  const [LoadingSync, setLoadingSync] = useState(false);
  const [limit, setLimit] = useState("");
  const [leftLimit, setLeftLimit] = useState(0);
  const [ImportModal, setImportModal] = useState(false);
  const [TotalProductCount, setTotalProductCount] = useState(0);
  const [importCount, setImportCount] = useState("");
  const [hasSubs, setHasSubs] = useState(false);
  const [TostExport,setTostExport]=useState(false);
  const [MessageTostExport,setMessageTostExport]=useState("")
  function openModalImport() {
    setImportModal(!ImportModal);
  }
  const changeHandler = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };
  function handleImport() {
    setLoadingCSVImport(true);
    Props.di
      .POST("connector/product/getMapping", {
        mappedObject: [
          {
            key: "title",
            original_value: "details.title",
            prefix: "details",
            value: "Title",
          },
          {
            key: "long_description",
            original_value: "details.long_description",
            prefix: "details",
            value: "Body (HTML)",
          },
          {
            key: "source_product_id",
            original_value: "details.source_product_id",
            prefix: "details",
            value: "Handle",
          },
          {
            key: "source_variant_id",
            original_value: "variants.source_variant_id",
            prefix: "variants",
            value: "Variant SKU",
          },
          {
            key: "vendor",
            original_value: "details.vendor",
            prefix: "details",
            value: "Vendor",
          },
          {
            key: "product_type",
            original_value: "details.product_type",
            prefix: "details",
            value: "Type",
          },
          {
            key: "additional_images",
            original_value: "details.additional_images",
            prefix: "details",
            value: {
              0: "Image Src",
              1: "Variant Image",
            },
          },
          {
            key: "tags",
            original_value: "details.tags",
            prefix: "details",
            value: "Tags",
          },
          {
            key: "meta_title",
            original_value: "details.meta_title",
            prefix: "details",
            value: "SEO Title",
          },
          {
            key: "meta_description",
            original_value: "details.meta_description",
            prefix: "details",
            value: "SEO Description",
          },
          {
            key: "image_alt",
            original_value: "details.image_alt",
            prefix: "details",
            value: {
              0: "Image Alt Text",
            },
          },
          {
            key: "sku",
            original_value: "variants.sku",
            prefix: "variants",
            value: "Variant SKU",
          },
          {
            key: "price",
            original_value: "variants.price",
            prefix: "variants",
            value: "Variant Price",
          },
          {
            key: "barcode",
            original_value: "variants.barcode",
            prefix: "variants",
            value: "Variant Barcode",
          },
          {
            key: "quantity",
            original_value: "variants.quantity",
            prefix: "variants",
            value: "Variant Inventory Qty",
          },
          {
            key: "variant_attribute",
            original_value: "variant_attribute",
            prefix: "",
            value: {
              0: "Option1 Name",
              1: "Option2 Name",
              2: "Option3 Value",
            },
          },
          {
            key: "main_image",
            original_value: "variants.main_image",
            prefix: "variants",
            value: "Variant Image",
          },
          {
            key: "weight",
            original_value: "variants.weight",
            prefix: "variants",
            value: "Variant Grams",
          },
          {
            key: "weight_unit",
            original_value: "variants.weight_unit",
            prefix: "variants",
            value: "Variant Weight Unit",
          },
          {
            key: "group_id",
            original_value: "add_ons.group_id",
            prefix: "add_ons",
            value: "Handle",
          },
          {
            key: "variant_value",
            original_value: "add_ons.variant_value",
            prefix: "add_ons",
            value: {
              0: "Option1 Value",
              1: "Option2 Value",
              2: "Option3 Value",
            },
          },
          {
            key: "virtual_parent_id",
            original_value: "add_ons.virtual_parent_id",
            prefix: "add_ons",
            value: "yes",
          },
        ],
        marketplace: "shopify",
      })
      .then((e: any) => {
        if (e.success) {
          setToastImport(true);
          setMessageImport(e.message);
          sendImportData();
        } else {
          setErrorToastImport(true);
          setMessageImport(e.message);
        }
      });
  }
  function openModal2() {
    setModalOpen(!modalOpen);
  }
  function sendImportData() {
    const sendData = {
      marketplace: "shopify",
    };
    Props.di
      .GET("connector/product/importCsvProduct", sendData)
      .then((e: any) => {
        if (e.success) {
          setMessageCsv(e.message);
          setToastCsv(true);
          setImportModal(false);
          Props.history.push("/log");
        } else {
          setErrorToastCsv(true);
          setMessageCsv(e.message);
        }
        setLoadingCSVImport(false);
      });
  }

  /**
   * @function handleSubmission Onclick of import icon in pageheader.
   */
  function handleSubmission() {
    setLoading(true);
    const temp =
      "connector/product/fileupload?bearer=" + Props.di.environment.Bearer;

    const formData: any = new FormData();
    formData.append("file", selectedFile);
    Props.di.POST(temp, formData, false, true).then((e: any) => {
      if (e.success == true) {
        // props.history.push("/panel/mapping", {
        //   field: e["data"]["fields"],
        //   header: e["data"]["header"],
        //   mapped: e["data"]["mapped"],
        // });
        setTotalProductCount(e.data.product_count);
        setLimit(e.data.catalog_limit.catalog_limit);
        setImportCount(e.data.catalog_limit.imported_count);
        setLeftLimit(e.data.catalog_limit.remaining_limit);
        setHasSubs(e.data.catalog_limit.upgrade_subscription);
        setImportModal(true);
        setToastImportAck(true);
        setModalOpen(false);
        setMessage(e.message);
      } else {
        setToastImportErrAck(true);
        // setToast(true);
        setMessage(e.message);
      }
      setLoading(false);
    });
  }

  /**
   * Export Function @function Exportfunction on key press of export button on pageheader.
   */
  function Exportfunction() {
    const endpoint = Props.di.environment.API_ENDPOINT.replace("/public/", "/");

    Props.di
      .GET(
        "/connector/product/exportProductCSV?marketplace=shopify&export_type=csv"
      )
      .then((e: any) => {
        if (e.success) {
          setMessageTostExport(e.message);
          setTostExport(true);
          // const d = e.path;
          // window.open(endpoint + d);
          window.location.href = endpoint + e.path;
        }
        else{

          setMessageTostExport(e.message);
          setTostExport(true);
        }
      });
  }

  /**
   * Connect with Shopify onClick of Sync with Sync wiht shopify button @function ConnectWith
   */

  function ConnectWith() {
    setLoadingSync(true);
    Props.di
      .GET(`/connector/product/import?marketplace=shopify`)
      .then((e: any) => {
        if (e.errorFlag == true) {
          setToastSync(true);
          setMessageSync(e.msg);
        }
        setLoadingSync(false);
      });
  }

  return (
    <React.Fragment>
      <PageHeader
        title="Products"
        sticky={"sticky"}
        action={
          <FlexLayout spacing="loose">
            <Button
              type="Outlined"
              icon={
                <svg
                  style={{ display: "flex" }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  height="20"
                >
                  <path
                    fillRule="evenodd"
                    d="M0 10C0 4.478 4.478 0 10 0c5.523 0 10 4.478 10 10 0 5.523-4.477 10-10 10-5.522 0-10-4.477-10-10zm11.125 2.002H8.989v-.141c.01-1.966.492-2.254 1.374-2.782.093-.056.19-.114.293-.178.73-.459 1.292-1.038 1.292-1.883 0-.948-.743-1.564-1.666-1.564-.851 0-1.657.398-1.712 1.533H6.304C6.364 4.693 8.18 3.5 10.294 3.5c2.306 0 3.894 1.447 3.894 3.488 0 1.382-.695 2.288-1.805 2.952l-.238.144c-.79.475-1.009.607-1.02 1.777V12zm.17 3.012a1.344 1.344 0 01-1.327 1.328 1.32 1.32 0 01-1.328-1.328 1.318 1.318 0 011.328-1.316c.712 0 1.322.592 1.328 1.316z"
                    fill="#000000"
                  />
                </svg>
              }
              iconRound={false}
              thickness="thin"
              onClick={() =>
                window.open(
                  "https://docs.cedcommerce.com/shopify/multivendor-marketplace-solution-vendors/?section=products-section-of-the-vendor-app"
                )
              }
            >
              Need Help
            </Button>

            <ToolTip helpText="Create Product" position="bottom">
              <Button
                type="none"
                thickness="thin"
                onClick={() => {
                  Props.history.push("/products/create", {
                    activePage: 1,
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  height="22"
                >
                  <path
                    d="M11 1h7a1 1 0 011 1v7a.999.999 0 01-.29.71l-.29.29H16a6 6 0 00-6 6v2.42l-.29.29a1 1 0 01-1.42 0l-7-7a.999.999 0 010-1.42l9-9A1.001 1.001 0 0111 1zm3.667 4.747a1.5 1.5 0 101.666-2.494 1.5 1.5 0 00-1.666 2.494zm5.04 9.546A1 1 0 0019 15h-2v-2a1 1 0 00-2 0v2h-2a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 00.707-1.707z"
                    fill="#ffffff"
                  />
                </svg>
              </Button>
            </ToolTip>

            <ButtonDropdown
              title={"More Action"}
              type={"Outlined"}
              thickness={"thin"}
              list={
                Props.connected === "yes"
                  ? [
                      {
                        label: "Import Images",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            height="22"
                          >
                            <path
                              d="M19 2.5A1.5 1.5 0 0017.5 1h-15A1.5 1.5 0 001 2.5v15A1.5 1.5 0 002.5 19H10v-2H3.497c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01L9 14l3.06-4.781a.5.5 0 01.84.02l.72 1.251A5.98 5.98 0 0116 10h3V2.5zm-11.5 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm12.207 10.793A1 1 0 0019 15h-2v-2a1 1 0 00-2 0v2h-2a1 1 0 000 2h2v2a1 1 0 102 0v-2h2a1 1 0 00.707-1.707z"
                              fill="#413bbc"
                            />
                          </svg>
                        ),
                        onClick: () => {
                          Props.history.push("/products/image_grid");
                        },
                      },
                      {
                        label: "Import Product Csv",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            height="22"
                          >
                            <path
                              d="M13.707 10.707a.999.999 0 10-1.414-1.414L11 10.586V3a1 1 0 10-2 0v7.586L7.707 9.293a.999.999 0 10-1.414 1.414l3 3a.999.999 0 001.414 0l3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
                              fill="#413bbc"
                            />
                          </svg>
                        ),
                        onClick: () => {
                          openModal2();
                        },
                      },

                      {
                        label: "Export Product Csv",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            height="22"
                          >
                            <path
                              d="M10.707 2.293a.999.999 0 00-1.414 0l-3 3a.999.999 0 101.414 1.414L9 5.414V13a1 1 0 102 0V5.414l1.293 1.293a.999.999 0 101.414-1.414l-3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
                              fill="#413bbc"
                            />
                          </svg>
                        ),
                        onClick: () => {
                          Exportfunction();
                        },
                      },
                      {
                        label: "Import Products From Shopify",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            height="22"
                          >
                            <path
                              d="M19.707 3.293a1 1 0 010 1.414l-3 3a.997.997 0 01-1.631-.324 1 1 0 01.217-1.09L16.586 5H7C4.794 5 3 6.794 3 9a1 1 0 01-2 0c0-3.309 2.691-6 6-6h9.586l-1.293-1.293A1 1 0 1116.707.293l3 3zM17 10a1 1 0 011 1c0 3.31-2.69 6-6 6H3.414l1.293 1.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 111.414 1.414L3.414 15H12c2.206 0 4-1.794 4-4a1 1 0 011-1z"
                              fill="#413bbc"
                            />
                          </svg>
                        ),
                        onClick: () => {
                          // ConnectWith();
                          Props.history.push("/product_import");
                        },
                      },
                    ]
                  : [
                      {
                        label: "Import Images",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            height="22"
                          >
                            <path
                              d="M19 2.5A1.5 1.5 0 0017.5 1h-15A1.5 1.5 0 001 2.5v15A1.5 1.5 0 002.5 19H10v-2H3.497c-.41 0-.64-.46-.4-.79l3.553-4.051c.19-.21.52-.21.72-.01L9 14l3.06-4.781a.5.5 0 01.84.02l.72 1.251A5.98 5.98 0 0116 10h3V2.5zm-11.5 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm12.207 10.793A1 1 0 0019 15h-2v-2a1 1 0 00-2 0v2h-2a1 1 0 000 2h2v2a1 1 0 102 0v-2h2a1 1 0 00.707-1.707z"
                              fill="#413bbc"
                            />
                          </svg>
                        ),
                        onClick: () => {
                          Props.history.push("/products/image_grid");
                        },
                      },
                      {
                        label: "Import Product Csv",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            height="22"
                          >
                            <path
                              d="M13.707 10.707a.999.999 0 10-1.414-1.414L11 10.586V3a1 1 0 10-2 0v7.586L7.707 9.293a.999.999 0 10-1.414 1.414l3 3a.999.999 0 001.414 0l3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
                              fill="#413bbc"
                            />
                          </svg>
                        ),
                        onClick: () => {
                          openModal2();
                        },
                      },

                      {
                        label: "Export Product Csv",
                        icon: (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            height="22"
                          >
                            <path
                              d="M10.707 2.293a.999.999 0 00-1.414 0l-3 3a.999.999 0 101.414 1.414L9 5.414V13a1 1 0 102 0V5.414l1.293 1.293a.999.999 0 101.414-1.414l-3-3zM3 16a1 1 0 100 2h14a1 1 0 100-2H3z"
                              fill="#413bbc"
                            />
                          </svg>
                        ),
                        onClick: () => {
                          Exportfunction();
                        },
                      },
                    ]
              }
            ></ButtonDropdown>
          </FlexLayout>
        }
      ></PageHeader>

      <StatusGrid curency={Props.currency} />
      <Modal
        modalSize="small"
        close={openModalImport}
        heading="Import Products"
        open={ImportModal}
      >
        <FlexLayout
          childWidth="fullWidth"
          direction="vertical"
          spacing="extraLoose"
        >
          {!hasSubs ? (
            leftLimit >= 0 ? (
              TotalProductCount > leftLimit ? (
                <TextStyles type="neutralText" utility="mb-20 mt-20">
                  You will be importing approximately {leftLimit} product(s){" "}
                </TextStyles>
              ) : (
                <TextStyles type="neutralText" utility="mb-20 mt-20">
                  You will be importing approximately {TotalProductCount}{" "}
                  product(s){" "}
                </TextStyles>
              )
            ) : (
              <TextStyles type="neutralText" utility="mb-20 mt-20">
                You Can not import more products because you have reached your
                products limits.
              </TextStyles>
            )
          ) : (
            <TextStyles type="neutralText" utility="mb-20 mt-20">
              You Can not import more products because your subscription has
              expired. You need to upgrade it to import products.
            </TextStyles>
          )}

          {leftLimit >= 0 && (
            <FlexLayout spacing="extraLoose">
              <Button
                loading={LoadingCSVImport}
                thickness="thin"
                type="Primary"
                onClick={() => handleImport()}
              >
                Import products
              </Button>
            </FlexLayout>
          )}
        </FlexLayout>
      </Modal>

      <Modal
        modalSize="small"
        close={openModal2}
        heading="Import"
        open={modalOpen}
        // primaryAction={{
        //   content: "Save an continue",
        //   loading: loading,
        //   onClick: () => {
        //     handleSubmission();
        //   },
        // }}
      >
        <Card>
          <FlexLayout halign="fill" spacing="loose">
            <>
              <FlexLayout direction="vertical" spacing="tight">
                <TextStyles type="SubHeading">Choose the CSV file</TextStyles>
                <Card cardType="selego">
                  <TextStyles>
                    Download a{" "}
                    <a
                      href={`${Props.di.environment.API_ENDPOINT.replace(
                        "/public/",
                        "/"
                      )}/var/csv_import/product_template.csv`}
                    >
                      sample template CSV
                    </a>{" "}
                    to see an example of fomat required.{" "}
                  </TextStyles>
                  <TextStyles>
                    Importing will not <b>overwrite any existing products</b>{" "}
                    that have the same product handle.
                  </TextStyles>
                  <TextStyles>
                    You can
                    {/* <Button
                type="Plain"
                thickness="thin"
                onClick={() => {
                  Props.history.push("/products/image_grid");
                }} */}
                    <span
                      onClick={() => {
                        Props.history.push("/products/image_grid");
                      }}
                    >
                      {" "}
                      <a href="#">import images</a>{" "}
                    </span>
                    {/* </Button> */}
                    as zip first also So you can <br />
                    copy/paste image urls in csv before importing
                  </TextStyles>
                </Card>
              </FlexLayout>
            </>
            <>
              <FlexLayout
                direction="vertical"
                spacing="loose"
                valign="start"
                halign="start"
              >
                <input type="file" accept=".csv" onChange={changeHandler} />
                {/* {isSelected ? (
                <FlexLayout direction="vertical">
                  <TextStyles type="simpleText">
                    Filename: {selectedFile.name}
                  </TextStyles>
                </FlexLayout>
              ) : (
                  <TextStyles type="simpleText">
                    Select File to show details
                  </TextStyles>
                )} */}
                <Button
                  loading={loading}
                  disable={selectedFile.name === undefined ? true : false}
                  thickness="thin"
                  onClick={() => {
                    handleSubmission();
                  }}
                  type="Primary"
                >
                  {" "}
                  Upload and continue
                </Button>
              </FlexLayout>
            </>
          </FlexLayout>
        </Card>
      </Modal>

      <ToastWrapper>

        {
          TostExport&&(
            <Toast
            type="success"
            message={MessageTostExport}
            timeout={3000}
            onDismiss={() => setTostExport(!TostExport)}
          />
          )
        }
        {ToastImport && (
          <Toast
            type="success"
            message={MessageImport}
            timeout={3000}
            onDismiss={() => setToastImport(!ToastImport)}
          />
        )}
        {ErrorToastImport && (
          <Toast
            type="error"
            message={MessageImport}
            timeout={3000}
            onDismiss={() => setErrorToastImport(!ErrorToastImport)}
          />
        )}
        {ToastImportAck && (
          <Toast
            type="success"
            message={message}
            timeout={3000}
            onDismiss={() => setToastImportAck(!ToastImportAck)}
          />
        )}
        {ToastImportErrAck && (
          <Toast
            type="error"
            message={message}
            timeout={3000}
            onDismiss={() => setToastImportErrAck(!ToastImportErrAck)}
          />
        )}
        {ToastCsv && (
          <Toast
            type="success"
            message={MessageCsv}
            timeout={3000}
            onDismiss={() => setToastCsv(!ToastCsv)}
          />
        )}
        {ErrorToastCsv && (
          <Toast
            type="error"
            message={MessageCsv}
            timeout={3000}
            onDismiss={() => setErrorToastCsv(!ErrorToastCsv)}
          />
        )}

        {toast && (
          <Toast
            type="success"
            message={message}
            timeout={3000}
            onDismiss={() => setToast(!toast)}
          />
        )}

        {ToastSync && (
          <Toast
            type="error"
            message={MessageSync}
            timeout={3000}
            onDismiss={() => setToastSync(!ToastSync)}
          />
        )}
      </ToastWrapper>
    </React.Fragment>
  );
}

export default DI(Product);
