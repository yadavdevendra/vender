/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DI } from "./../../../Core";
function Feature(props: any) {
  // const endpoint = props.di.enviroment.API_ENDPOINT.replace('/public/', '/');

  return (
    <>
      <section className="feature__section section">
        <div className="container">
          <div className="header__section mb-5 text-center">
            <h2 className="heading--mediumUp mb-20">{props.card["Title"]}</h2>
          </div>
          <div className="row pt-5">
            {Object.keys(props.card).map((e) => {
              {
                const temp: any = typeof props.card[e];
                if (temp == "object") {
                  return (
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-xl-4 mb-lg-4 mb-md-4 mb-sm-4 mb-4">
                      {/* <div className="card--wrapper">
                                            <div className="d-flex flex-column">
                                                {props.card[e].Icon != "" && props.card[e].Icon != undefined && <img className="rounded" src={`https://devbackend.cedcommerce.com/home/${props.card[e].Icon}`} alt="" width="80" />}
                                                <h3 className="my-4 heading--mediumLow">{props.card[e].Heading}</h3>
                                                <p className="fs-14">{props.card[e].Content} </p>
                                            </div>
                                        </div> */}
                      <div className="card">
                        <div className="card_img">
                          {props.card[e].Icon != "" &&
                            props.card[e].Icon != undefined && (
                              <img
                                className="card-img-top rounded"
                                src={`https://devbackend.cedcommerce.com/home/${props.card[e].Icon}`}
                                alt=""
                                width="80"
                              />
                            )}
                        </div>
                        <div className="card-body">
                          <h3 className="card-title my-4 heading--mediumLow">
                            {props.card[e].Heading}
                          </h3>
                          <p className="fs-14 card-text">
                            {props.card[e].Content}{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default DI(Feature);
