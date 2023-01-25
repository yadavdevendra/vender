/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  ChoiceList,
  FlexLayout,
  PageHeader,
  Select,
  TextStyles,
  Toast,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState, Component } from "react";
import { DI } from "./../../../Core";

function Mapping(props: any) {
  const [toast, setToast] = useState(false);
  const [message, setMessage] = useState("");
  const [messageCsv, setMessageCsv] = useState("");
  const [toastCsv, setToastCsv] = useState(false);
  const [csvFields, setCsvFields] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCsvMessage, setErrorCsvMessage] = useState("");
  const [ErrorToast, setErrorToast] = useState(false);
  const [ErrorToastCsv, setErrorToastCsv] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const csv_fields = props.location.state["header"].map((e: any) => {
      return {
        label: e,
        value: e,
      };
    });
    setCsvFields(csv_fields);
  }, []);
  function sendData() {
    setLoading(true);
    const newData: any = [];
    props.location.state["field"]
      .filter((e: any) => data[e["label"]] != undefined)
      .forEach((e: any) => {
        const keys = e["value"].split(".");
        if (keys[1] === undefined) {
          keys[1] = keys[0];
          keys[0] = "";
        }
        newData.push({
          key: keys[1],
          prefix: keys[0],
          value: data[e["label"]],
          original_value: e["value"],
        });
      });
    props.di
      .POST("connector/product/getMapping", {
        mappedObject: newData,
        marketplace: "shopify",
      })
      .then((e: any) => {
        if (e.success) {
          setToast(true);
          setMessage(e.message);
          sendImportData();
        } else {
          setErrorToast(true);
          setErrorMessage(e.message);
        }
      });
  }
  function sendImportData() {
    const sendData = {
      marketplace: "shopify",
    };
    props.di
      .GET("connector/product/importCsvProduct", sendData)
      .then((e: any) => {
        if (e.success) {
          setMessageCsv(e.message);
          setToastCsv(true);
        } else {
          setErrorToastCsv(true);
          setErrorCsvMessage(e.message);
        }
        setLoading(false);
      });
  }
  const [renderNotReq, setrenderNotReq] = useState<any>([]);
  function handleDelete(k: any) {
    const temp: any = [...renderNotReq];
    const temp2 = temp.filter((e: any) => e != k);
    setrenderNotReq([...temp2]);
  }
  const [value, setvalue] = useState("");
  const [data, setdata] = useState<any>({});
  function handleSelect(e: string) {
    const abc: any = [...renderNotReq];
    setvalue(e);
    abc.push(e);
    setrenderNotReq(abc);
  }
  function prepareData(value: string, label: string) {
    const temp = { ...data };
    temp[label] = value;
    setdata({ ...temp });
    // console.log("entered")
  }
  useEffect(() => {
    // console.log(data);
  }, [data]);
  // const [notreq, setnotreaq] = useState<any>([]);
  const notreq: any = [];
  // function handleSubmit() {

  // }
  // console.log(props.location.state);
  return (
    <div>
      <ToastWrapper>
        {toast && (
          <Toast
            message={message}
            onDismiss={() => {
              setToast(!toast);
            }}
            type="success"
          />
        )}
        {toastCsv && (
          <Toast
            message={messageCsv}
            onDismiss={() => {
              setToastCsv(!toastCsv);
            }}
            type="success"
          />
        )}
        {ErrorToast && (
          <Toast
            message={errorMessage}
            onDismiss={() => {
              setErrorToast(!ErrorToast);
            }}
            type="error"
          />
        )}
        {ErrorToastCsv && (
          <Toast
            message={errorCsvMessage}
            onDismiss={() => {
              setErrorToastCsv(!ErrorToastCsv);
            }}
            type="error"
          />
        )}
      </ToastWrapper>
      <PageHeader
        title="Mapping"
        action={
          <Button
            thickness="thin"
            type="Primary"
            onClick={() => {
              props.history.push("/products");
            }}
          >
            {" "}
            Back
          </Button>
        }
      />
      <Card>
        {props.location.state["field"].map((e: any, key: number) => {
          // console.log(e["required"], "e");
          if (e["required"] == true) {
            return (
              <RenderCard
                e={e}
                csvFields={csvFields}
                prepareData={prepareData}
              />
            );
          } else if (e["type"] == "multi") {
            notreq.push({ label: e["label"], value: key });
          } else {
            notreq.push({ label: e["label"], value: key });
          }
        })}
        <FlexLayout halign="start">
          <Card>
            <Select
              name="Optional"
              thickness="thin"
              options={notreq.filter((ele: any) => {
                return !renderNotReq.includes(ele.value);
              })}
              value={value}
              onChange={(e) => handleSelect(e)}
            />
          </Card>
        </FlexLayout>
        {renderNotReq.map((e: any) => (
          <RenderCard
            key={e}
            e={props.location.state["field"][e]}
            csvFields={csvFields}
            k={e}
            handleDelete={handleDelete}
            prepareData={prepareData}
          />
        ))}
        <FlexLayout halign="end" spacing="extraLoose">
          <Button
            loading={loading}
            type="Primary"
            thickness="thin"
            onClick={() => sendData()}
          >
            Submit
          </Button>
        </FlexLayout>
      </Card>
    </div>
  );
}
function RenderCard({
  e,
  csvFields,
  k = 0,
  prepareData,
  handleDelete = () => {
    return null;
  },
}: any) {
  const [value, setvalue] = useState("");
  const [val, setVal] = useState<any>([]);
  // const [data, setdata] = useState<any>({});
  // useEffect(() => {
  //     const temp={...data}
  //     temp[e['label']]=value
  //     setdata({...temp})
  //     console.log(temp);
  // }, [value])
  // console.log(val, "val");
  // console.log(value, "value");
  useEffect(() => {
    prepareData(val, e["label"]);
  }, [val]);
  return (
    <Card>
      {/* <MainLayout> */}
      <>
        <FlexLayout direction="vertical" valign="start" spacing="loose">
          <TextStyles type="smallText">
            * {e["required"] ? "Required" : "Not Required"}
            <br />
            <TextStyles type="SubHeading">{e["label"]}</TextStyles>
          </TextStyles>
          {Object.keys(e).includes("help_text") && (
            <TextStyles type="simpleText">{e["help_text"]}</TextStyles>
          )}
        </FlexLayout>
      </>
      <>
        <FlexLayout halign="end" spacing="loose">
          {Object.keys(e).includes("type") ? (
            <ChoiceList
              thickness="thin"
              placeholder="Mapped with.."
              options={csvFields}
              value={val}
              onChange={(t) => {
                if (val.includes(t)) {
                  const index = val.indexOf(t);
                  val.splice(index, 1);
                  const c = [...val];
                  setVal(c);
                } else {
                  setVal((prev: any) => [...prev, t]);
                }
              }}
            />
          ) : (
            <Select
              placeholder="Mapped With.."
              thickness="thin"
              options={csvFields}
              onChange={(val) => {
                setvalue(val);
                prepareData(val, e["label"]);
              }}
              value={value}
            />
          )}

          {!e["required"] && (
            <Button
              type="Plain"
              thickness="thin"
              onClick={() => handleDelete(k)}
            >
              {" "}
              Delete
            </Button>
          )}
        </FlexLayout>
      </>
      {/* </MainLayout> */}
    </Card>
  );
}
interface ToastWrapperI {
  children: React.ReactNode;
}
class ToastWrapper extends Component<ToastWrapperI> {
  constructor(props: ToastWrapperI) {
    super(props);

    this.state = {};
  }

  render() {
    // const children = React.Children.toArray(this.props.children);
    return <div className={"inte-toast--Wrapper"}>{this.props.children}</div>;
  }
}
export default DI(Mapping);
