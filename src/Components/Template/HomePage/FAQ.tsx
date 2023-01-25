/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { DI } from "./../../../Core";
function FAQ(props: any) {
  const [KeyClicked, setKeyClicked] = useState("");

  useEffect(() => {
    let flag = true;
    Object.keys(props.faq).forEach((key) => {
      if (typeof props.faq[key] === "object" && flag) {
        setKeyClicked(key);
        flag = false;
      }
    });
  }, [props.faq]);

  return (
    <div>
      <section className="faq__section section">
        <div className="container">
          <div className="header__section mb-5 text-center">
            <h2 className="heading--mediumUp mb-20">{props.faq["Title"]}</h2>
          </div>
          {/* "nav-link active show" */}
          {/* <!-- Nav tabs --> */}
          <ul className="nav nav-tabs mb-5">
            {Object.keys(props.faq).map((e: any) => {
              {
                const temp: any = typeof props.faq[e];
                if (temp == "object") {
                  return (
                    <li className="nav-item" key={e}>
                      {/* {Active == true ? */}
                      <span
                        onClick={() => {
                          setKeyClicked(e);
                        }}
                        key={e}
                      >
                        <a
                          key={e}
                          className={
                            KeyClicked === e ? "nav-link active" : "nav-link"
                          }
                          data-toggle="tab"
                          href={`#${e}`}
                        >
                          {e}
                        </a>
                      </span>
                      {/* : */}
                      {/* <a key={e} className="nav-link" data-toggle="tab" href={`#${e}`}>{e}</a>} */}
                    </li>
                  );
                }
              }
            })}
          </ul>

          {/* <!-- Tab panes --> */}
          <div className="tab-content">
            {Object.keys(props.faq).map((e) => {
              {
                const temp: any = typeof props.faq[e];
                if (temp == "object") {
                  return (
                    <RenderGenral
                      data={props.faq[e]}
                      title={e}
                      keyclicked={KeyClicked}
                    />
                  );
                }
              }
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
function RenderGenral({ data, title, keyclicked }: any) {
  const [Clicked, setClicked] = useState("");
  return (
    <>
      <div
        className={
          keyclicked === title
            ? "tab-pane container active"
            : "tab-pane container"
        }
        id={title}
      >
        <div className="row" id={`${title.split(" ").join("_")}accordion`}>
          {Object.keys(data).map((m) => {
            return (
              <>
                <div className="col-xl-12" key={m}>
                  <div className="collapsible-data">
                    <div className="collapsible-title">
                      <span
                        onClick={() => {
                          setClicked(m);
                        }}
                        key={m}
                      >
                        <a
                          key={m}
                          className={
                            Clicked == m ? "card-link" : "card-link collapsed"
                          }
                          data-toggle="collapse"
                          href={`#collapse${title.split(" ").join("_")}${m}`}
                        >
                          {data[m].Question}
                        </a>
                      </span>
                    </div>
                    <div
                      id={`collapse${title.split(" ").join("_")}${m}`}
                      className={Clicked == m ? "collapse-show" : "collapse"}
                      data-parent={`${title.split(" ").join("_")}accordion`}
                    >
                      <div className="card-body">{data[m].Answer}</div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default DI(FAQ);
