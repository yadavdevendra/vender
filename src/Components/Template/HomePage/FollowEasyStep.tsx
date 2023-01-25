/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { DI } from './../../../Core';
import './../../../assets/js/script';

function FollowEasyStep(props: any) {
    return (
        <div>
            <section className="steps__section section">
                <div className="container">
                    <div className="row align-items-start">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-sm-12 mb-xs-12 sticky-divs">
                            <div className="header__section mb-5 text-center">
                                <h3 className="heading--mediumUp mb-4 font-weight-bold">{props.data.Title}</h3>
                            </div>
                        </div>
                        <div className="col-xl-12 col-lg-12 col-md-12 col-12 mb-sm-12 mb-xs-12">
                            <div className="follow-easy-carousel owl-carousel owl-theme">
                                {Object.keys(props.data).map((e) => {
                                    const temp: any = typeof props.data[e];
                                    if (temp == "object") {
                                        return (
                                            <>
                                                <div className="step-right custom_flex d-flex flex-column justify-content-center align-items-center my-5">
                                                    <h3 className="heading--mediumUp mb-4 font-weight-bold">{props.data[e].Title}</h3>
                                                    <h3 className="heading--mediumLow mb-4 font-weight-bold">{props.data[e].Heading}</h3>
                                                    <p className="text-secondary"> {props.data[e].Content}</p>
                                                </div>

                                            </>

                                        );
                                    }

                                })}

                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default DI(FollowEasyStep);
