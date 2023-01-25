/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Card,
  FlexLayout,
  PageHeader,
  Pagination,
  Select,
  Toast,
  ToolTip,
  ToastWrapper,
  TextStyles,
} from "@cedcommerce/ounce-ui";
import React, { useEffect, useState, useRef } from "react";
import EmptyDataFound from "../../../../Core/EmptyStates/EmptyDataFound";
import Grid from "../../../../Shared/Grid";
import { DI, DIProps } from "./../../../../Core";
const columns = {
  image: {
    name: "Image",
    visible: true,
  },
  filename: {
    name: "File Name",
    visible: true,
  },
  filesize: {
    name: "File Size(KB)",
    visible: true,
  },

  datetime: {
    name: "Date-Time",
    visible: true,
  },
  link: {
    name: "Link",
    visible: true,
  },
};

function ImageZip(props: DIProps) {
  const [loading, setloading] = useState(false);
  const [params, setParams] = useState({
    activePage: 1,
    count: 10,
  });
  const [TotalCount, setTotalCount] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [PageCount, setPageCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [rows, setRows] = useState<any>([]);
  function conversion(data: number) {
    const temp = (data * 0.000977).toFixed(2);
    return temp;
  }
  function getData() {
    setloading(true);
    props.di.GET("/connector/vendor/getVendorFiles", params).then((e) => {
      if (e.success) {
        setTotalCount(e.count);
        setStart(e.start);
        setEnd(e.end);
        if (params.count == 10) {
          if (Math.round(e.count / 10) < e.count / 10)
            setPageCount(Math.round(e.count / 10) + 1);
          else setPageCount(Math.round(e.count / 10));
        } else if (params.count == 20) {
          if (Math.round(e.count / 20) < e.count / 20)
            setPageCount(Math.round(e.count / 20) + 1);
          else setPageCount(Math.round(e.count / 20));
        } else if (params.count == 50) {
          if (Math.round(e.count / 50) < e.count / 50)
            setPageCount(Math.round(e.count / 50) + 1);
          else setPageCount(Math.round(e.count / 50));
        } else if (params.count == 100) {
          if (Math.round(e.count / 100) < e.count / 20)
            setPageCount(Math.round(e.count / 100) + 1);
          else setPageCount(Math.round(e.count / 100));
        }

        const temp = Object.keys(e.files).map((map) => {
          return {
            ...e.files[map],
            image: e.files[map] && <img src={e.files[map].link} width="50px" />,
            filename: e.files[map].filename,
            datetime: e.files[map].datetime,
            filesize: conversion(e.files[map].filesize),
            link: e.files[map] && (
              <ToolTip helpText="Copy" position="bottom">
                <Button
                  type="Plain"
                  thickness="thin"
                  onClick={() => {
                    navigator.clipboard.writeText(e.files[map].link);
                    setShowToast(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    height="20"
                  >
                    <path
                      d="M6.534 18a4.507 4.507 0 01-3.208-1.329 4.54 4.54 0 010-6.414l1.966-1.964a.999.999 0 111.414 1.414L4.74 11.671a2.54 2.54 0 000 3.586c.961.959 2.631.958 3.587 0l1.966-1.964a1 1 0 111.415 1.414l-1.966 1.964A4.503 4.503 0 016.534 18zm7.467-6a.999.999 0 01-.707-1.707l1.966-1.964a2.54 2.54 0 000-3.586c-.961-.959-2.631-.957-3.587 0L9.707 6.707a1 1 0 11-1.415-1.414l1.966-1.964A4.503 4.503 0 0113.466 2c1.211 0 2.351.472 3.208 1.329a4.541 4.541 0 010 6.414l-1.966 1.964a.997.997 0 01-.707.293zm-6.002 1a.999.999 0 01-.707-1.707l4.001-4a1 1 0 111.415 1.414l-4.001 4a1 1 0 01-.708.293z"
                      fill="#5C5F62"
                    />
                  </svg>
                </Button>
              </ToolTip>
            ),
          };
        });
        setRows(temp);
      }
      setloading(false);
    });
  }

  useEffect(() => {
    getData();
  }, [params]);

  return (
    <>
      <PageHeader
        title="Import Images"
        action={
          <Button
            thickness="thin"
            type="Primary"
            onClick={() => {
              props.history.push("/products");
            }}
          >
            Back
          </Button>
        }
      />
      <React.Fragment>
        <RenderCardFilter
          {...props}
          getData={getData}
          props={props}
          params={setParams}
          // totalProduct={TotalProduct}
          // fileType={fileType}
          start={start}
          end={end}
          TotalCount={TotalCount || 0}
          Pagecount={PageCount}
        />
        {rows.length > 0 ? (
          <Grid rows={rows} loading={loading} columns={columns} />
        ) : (
          <Card>
            <EmptyDataFound />
          </Card>
        )}
        {showToast && (
          <ToastWrapper>
            <Toast
              type="success"
              message="Copied to clipboard"
              onDismiss={() => setShowToast(false)}
              timeout={3000}
            />
          </ToastWrapper>
        )}
      </React.Fragment>
    </>
  );
}
interface tableActionI extends DIProps {
  params: any;
  TotalCount: number;
  Pagecount: number;
  start: number;
  end: number;
  props: any;
  getData: () => any;
}
function RenderCardFilter({
  getData,
  props,
  Pagecount,
  params,
  start,
  end,
  TotalCount,
}: tableActionI): JSX.Element {
  const [loading, setloading] = useState(false);
  const [Message, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [error, setErrorToast] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [page, setpage] = useState(1);
  const ImageRef = useRef<any>(null);

  const [selectUpdateCount, setSelectUpdateCount] = useState("10");
  const [File, setFile] = useState<any>({});
  const changeHandler = (event: any) => {
    if (event.target.files[0].name.includes(".zip")) {
      setFile(event.target.files[0]);
      setErrorToast(false);
      setIsSelected(true);
    } else {
      setErrorToast(true);
      setToast(true);
      setMessage("Please choose only .zip file");
      ImageRef.current.value = "";
    }
  };

  function handleUpload() {
    setloading(true);
    const formData: any = new FormData();
    formData.append("marketplace", "shopify");
    formData.append("images", File);
    props.di
      .POST("/connector/vendor/uploadImagesZip", formData, false, true)
      .then((e: any) => {
        if (e.success) {
          setToast(true);
          setMessage(e.message);
          getData();
          setFile({});
          ImageRef.current.value = "";
          setloading(false);
          setTimeout(() => {
            props.history.push("/log");
          }, 3000);
        } else {
          setloading(false);
          setToast(true);
          setErrorToast(true);
          setMessage(isSelected ? e.message : "Please choose any file.");
        }
      });
  }
  useEffect(() => {
    prepareFilter();
  }, [page, selectUpdateCount]);

  function prepareFilter() {
    const par: any = {
      count: selectUpdateCount,
      activePage: page,
    };

    params(par);
  }

  return (
    <Card cardType="linkwater">
      <FlexLayout spacing={"loose"} halign="fill">
        <FlexLayout halign="start" valign="center" spacing="extraTight">
          <input
            type="file"
            ref={ImageRef}
            onChange={(e) => changeHandler(e)}
            accept=".zip"
          />
          <Button
            loading={loading}
            thickness="thin"
            type="Small"
            onClick={() => handleUpload()}
          >
            Import Zip File
          </Button>
        </FlexLayout>

        <FlexLayout spacing={"loose"} valign="center">
          <TextStyles type="neutralText">
            Showing {start === 0 ? 0 : start + 1}-{end} of {TotalCount}{" "}
            Images(s)
          </TextStyles>

          <Select
            thickness="thin"
            type="secondary"
            options={[
              { label: "10", value: "10" },
              { label: "20", value: "20" },
              { label: "50", value: "50" },
              { label: "100", value: "100" },
            ]}
            value={selectUpdateCount}
            onChange={(e) => setSelectUpdateCount(e)}
          />
          <Pagination
            totalPages={Pagecount}
            currentPage={page === 0 ? 0 : page}
            onNext={() => {
              setpage(page + 1);
            }}
            onPrevious={() => {
              setpage(page - 1);
            }}
          />
        </FlexLayout>
      </FlexLayout>
      <ToastWrapper>
        {toast && (
          <Toast
            message={Message}
            onDismiss={() => setToast(!toast)}
            timeout={3000}
            type={error ? "error" : "success"}
          />
        )}
      </ToastWrapper>
    </Card>
  );
}

export default DI(ImageZip);
