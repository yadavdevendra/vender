/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from "react";
import { DI, DIProps } from "./../../../Core";

import Header from "./Header";
import Hero from "./Hero";
import Feature from "./Feature";
import FollowEasyStep from "./FollowEasyStep";
import FAQ from "./FAQ";
import Blog from "./Blog";
import Footer from "./Footer";

function HomePage(props: any) {
  const [Navbar, setNavbar] = useState("");
  const [header, setHeader] = useState({});
  const [card, setCard] = useState({});
  const [faq, setFAQ] = useState({});
  const [blog, setBlog] = useState({});
  const [EasyStep, setEasyStep] = useState({});
  const [footer, setFooter] = useState({});
  const [ShopID, setShopID] = useState("");
  const [logoRedirectTo, setLogoRedirectTo] = useState();
  const [EnableDisbale, setEnableDisbale] = useState<any>({});

  useEffect(() => {
    const endpoint = props.di.environment.API_ENDPOINT;
    fetch(
      `${endpoint}connector/vendor/getAdminId?admin_shop_id=${props.admin_shop_id}`,
      {
        method: "GET",
        headers: {
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInJvbGUiOiJhcHAiLCJpYXQiOjE1MzkwNTk5NzgsImlzcyI6Imh0dHBzOlwvXC9hcHBzLmNlZGNvbW1lcmNlLmNvbSIsImF1ZCI6ImV4YW1wbGUuY29tIiwibmJmIjoxNTM5MDU5OTc4LCJ0b2tlbl9pZCI6MTUzOTA1OTk3OH0.GRSNBwvFrYe4H7FBkDISVee27fNfd1LiocugSntzxAUq_PIioj4-fDnuKYh-WHsTdIFMHIbtyt-uNI1uStVPJQ4K2oYrR_OmVe5_zW4fetHyFmoOuoulR1htZlX8pDXHeybRMYlkk95nKZZAYQDB0Lpq8gxnTCOSITTDES0Jbs9MENwZWVLfyZk6vkMhMoIAtETDXdElIdWjP6W_Q1kdzhwqatnUyzOBTdjd_pt9ZkbHHYnv6gUWiQV1bifWpMO5BYsSGR-MW3VzLqsH4QetZ-DC_AuF4W2FvdjMRpHrsCgqlDL4I4ZgHJVp-iXGfpug3sJKx_2AJ_2aT1k5sQYOMA",
        },
      }
    )
      .then((e) => e.json())
      .then((ele) => {
        if (ele.success) {
          setShopID(ele.admin_id);
          props.di
            .GET(`/connector/config/getLandingPageData?id=${ele.admin_id}`)
            .then((e: any) => {
              if (e.success) {
                setEnableDisbale(e.data);
                setCard(e.data["Card"]);
                setNavbar(e.data.Header.Logo);
                setLogoRedirectTo(
                  e.data.Header["Header Image Redirection Link URL"]
                );
                setHeader(e.data.Header);
                setFAQ(e.data["FAQ"]);
                setBlog(e.data["Blog"]);
                setEasyStep(e.data["Carousel"]);
                setFooter(e.data["Footer"]);
              }
            });
        }
      });
  }, []);
  return (
    <>
      <main>
        <Header navbar={Navbar} admin_shop_id={props.admin_shop_id} />
        <Hero header={header} />
        {Object.keys(EnableDisbale).map((e) => {
          switch (e) {
            case "Card":
              if (EnableDisbale["Card"].Enable === "Enable")
                return <Feature card={card} />;
              break;
            case "Carousel":
              if (EnableDisbale["Carousel"].Enable === "Enable")
                return <FollowEasyStep data={EasyStep} />;
              break;
            case "FAQ":
              if (EnableDisbale["FAQ"].Enable === "Enable")
                return <FAQ faq={faq} />;
              break;
            case "Blog":
              if (EnableDisbale["Blog"].Enable === "Enable")
                return <Blog blog={blog} />;
              break;
          }
        })}
        <Footer footer={footer} />
      </main>
    </>
  );
}

export default DI(HomePage);
