/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DI } from "./../../../Core";
import "./../../../assets/js/script";

function Blog(props: any) {
  // const endpoint = props.di.enviroment.API_ENDPOINT.replace('/public/', '/');

  return (
    <div>
      <section className="blog__section section">
        <div className="container">
          <div className="header__section mb-5 text-center">
            <h2 className="heading--mediumUp  mb-20">{props.blog["Title"]}</h2>
          </div>
          <div className="blog--item blog-owl-carousel owl-carousel owl-theme mt-5">
            {Object.keys(props.blog).map((e) => {
              const temp: any = typeof props.blog[e];
              if (temp == "object") {
                return (
                  <>
                    <div className="blog-card custom_blogcard">
                      {props.blog[e].Image != "" &&
                        props.blog[e].Image != undefined && (
                          <img
                            src={`https://devbackend.cedcommerce.com/home${props.blog[e].Image}`}
                            alt="Blog"
                          />
                        )}
                      <div className="blog--item--content">
                        <h3 className="heading--mediumLow">
                          {props.blog[e].Heading}
                        </h3>
                        <p className="fs-14">{props.blog[e].Content}</p>

                        <a
                          onClick={() =>
                            window.open(
                              props.blog[e].Link.includes("http")
                                ? props.blog[e].Link
                                : "http://" + props.blog[e].Link,
                              "_blank"
                            )
                          }
                        >
                          <span
                            style={{
                              color: "rgb(180 180 193)",
                              cursor: "pointer",
                              fontSize: "15px",
                              marginTop: "0px",
                              fontWeight: 700,
                            }}
                          >
                            Read More
                          </span>
                        </a>
                      </div>
                    </div>
                  </>
                );
              }
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DI(Blog);
