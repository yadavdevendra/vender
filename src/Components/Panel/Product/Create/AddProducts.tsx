/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, Component } from "react";
import Shipping from "./Shipping";
import Pricing from "./Pricing";
import Inventory from "./Inventory";
import Variants from "./Variants";
import TextEditor from "./TextEditor";
import {
  Toast,
  Button,
  TextField,
  Card,
  FlexLayout,
  FormChild,
  ToastWrapper,
  TextStyles,
  Badge,
} from "@cedcommerce/ounce-ui";
import { DI } from "../../../../Core";
import ImageDrop from "./ImageDrop";
import CategorySelection from "./CategorySelection";
import { compose } from "redux";
// import { title } from "process";
// import ToastWrapper from "@cedcommerce/ounce-ui/dist/components/Toast/ToastWrapper";
interface Objtext {
  [name: string]: string | number | undefined;
}
function AddProducts(Props: any): JSX.Element {
  const [imageUrl, setimageUrl] = useState([]);
  const [Type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  // const [SellProduct, setSellProduct] = useState(false);
  const [varImgArr, setVarImgArr] = useState([]);
  const [allMediaImg, setAllMediaImg] = useState([]);
  const [rowLength, setRowLength] = useState(0);
  const [changeUrlInImg, setChangeUrlInImg] = useState(true);
  const [isMediaEdit, SetIsIMediaEdit] = useState(false);
  const [isVarImageEdit, SetIsVarImageEdit] = useState(false);
  const [tagReceived, setTagReceived] = useState<any>([]);
  const [imageChangeVerify, setImageChangeVerify] = useState<number>();
  const [tag, setTag] = useState<any>([{}]);
  const [EditedSave, setEditedSave] = useState<any>({});
  const [ContainerID, setContainerID] = useState("");
  const [imgUpdate, setImgUpdate] = useState(false);
  const [DisbaleButton, setDisbaleButton] = useState(false);
  const [productType, setProductType] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [imagearr, setImagearr] = useState([]);
  const [videoUrl, setVideoUrl] = useState([]);
  const [ErrToast, setErrToast] = useState(false);
  const [GetDescription, setGetDescription] = useState("");
  const [variants_attr, setVariants_attr] = useState([]);
  const [dataIDValue, setdataIDValue] = useState<any>([]);
  const [newlenarray, setnewlenarr] = useState([0]);
  const [dataTitle, setdataTitle] = useState("");
  const [tempunit, setTempunit] = useState("kg");
  const [VariantAtt, setVariantAtt] = useState([]);
  const [attrfeild0, setattrfeild0] = useState<Array<string>>([]);
  const [attrfeild1, setattrfeild1] = useState<Array<string>>([]);
  const [attrfeild2, setattrfeild2] = useState<Array<string>>([]);
  const [ShowImages, setShowImages] = useState<any>([]);
  const [collection, setCollection] = useState<any>({});
  const [SaveEditDisable, setSaveEditDisable] = useState(true);
  const [CompareAtPrice, setCompareAtPrice] = useState<any>("");
  const [tags, setTags] = useState<Array<string>>([]);
  const [texttag, settexttags] = useState("");
  const [SourceProductId, setSourceProductId] = useState("");
  const [Quantity, setquantity] = useState("");
  const [Check, setCheck] = useState(false);
  const [EditToast, setEditToast] = useState(false);
  const [EditMsg, setEditMsg] = useState("");
  const [DataReceived, setDataReceived] = useState<any>({});
  const [TrackQuantity, setTrackQuantity] = useState(true);
  const [continueSales, setcontinueSales] = useState(false);
  const [sourceMarketPlace, setsourceMarketPlace] = useState("");
  const [variantCheck, setVariantCheck] = useState(false);
  function getdata() {
    // if (constructor == 1) {
    if (Props.match.params.id != undefined) {
      Props.di
        .GET(
          "connector/product/getProductById?id=" +
            Props.match.params.id +
            "&source_marketplace=" +
            Props.location.state.source_marketplace +
            "&user_id=" +
            Props.location.state.user_id
        )
        .then((dataByID: any) => {
          if (dataByID.success) {
            setDataReceived(dataByID.data);
            setImgUpdate(false);
            SetIsVarImageEdit(false);
            if (
              dataByID.data[0] == undefined &&
              dataByID.data.variant_attributes == undefined
            ) {
              if (dataByID.data.inventory_tracked) {
                setTrackQuantity(true);
              } else {
                setTrackQuantity(false);
              }

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.inventory_tracked != undefined
                  ? setTrackQuantity(
                      dataByID.data.edited_fields.inventory_tracked
                    )
                  : setTrackQuantity(dataByID.data.inventory_tracked)
                : setTrackQuantity(dataByID.data.inventory_tracked);

              // if (dataByID.data.inventory_policy == "continue") {
              //   setcontinueSales(true);
              // } else {
              //   setcontinueSales(false);
              // }

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.inventory_policy != undefined
                  ? setcontinueSales(
                      dataByID.data.edited_fields.inventory_policy == "continue"
                        ? true
                        : false
                    )
                  : setcontinueSales(
                      dataByID.data.inventory_policy == "continue"
                        ? true
                        : false
                    )
                : setcontinueSales(
                    dataByID.data.inventory_policy == "continue" ? true : false
                  );

              if (dataByID.data.source_marketplace === "shopify_vendor") {
                setSaveEditDisable(false);
              }

              setSourceProductId(dataByID.data.source_product_id);
              setTagReceived(dataByID.data.tags);

              setContainerID(dataByID.data.container_id);
              if (Array.isArray(dataByID.data.additional_images)) {
                const allImg =
                  dataByID.data.additional_images !== undefined &&
                  dataByID.data.main_image
                    ? [
                        ...dataByID.data.additional_images,
                        ...[dataByID.data.main_image],
                      ]
                    : dataByID.data.main_image &&
                      dataByID.data.main_image !== null
                    ? [dataByID.data.main_image]
                    : [];
                setShowImages(Array.from(new Set(allImg)));
                setImageChangeVerify(Array.from(new Set(allImg)).length);
              } else {
                const allImg =
                  dataByID.data.additional_images && dataByID.data.main_image
                    ? Object.values(dataByID.data.additional_images).includes(
                        dataByID.data.main_image
                      )
                      ? { ...dataByID.data.additional_images }
                      : {
                          ...dataByID.data.additional_images,
                          ...{
                            [Object.keys(dataByID.data.additional_images)
                              .length + 1]: dataByID.data.main_image
                              ? dataByID.data.main_image
                              : {},
                          },
                        }
                    : dataByID.data.main_image && dataByID.data.main_image
                    ? {
                        0: dataByID.data.main_image,
                      }
                    : [];

                setShowImages(Object.values(allImg));

                setImageChangeVerify(Object.values(allImg).length);
              }
              setType("simple");
              setGetDescription(dataByID.data.description);
              setdataIDValue(dataByID.data);
              // setCheck(dataByID.data.requires_shipping);
              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.description != undefined
                  ? setGetDescription(dataByID.data.edited_fields.description)
                  : setGetDescription(dataByID.data.description)
                : setGetDescription(dataByID.data.description);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.title != undefined
                  ? setdataTitle(dataByID.data.edited_fields.title)
                  : setdataTitle(dataByID.data.title)
                : setdataTitle(dataByID.data.title);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.requires_shipping != undefined
                  ? setCheck(dataByID.data.edited_fields.requires_shipping)
                  : setCheck(dataByID.data.requires_shipping)
                : setCheck(dataByID.data.requires_shipping);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.weight != undefined
                  ? Setweight(dataByID.data.edited_fields.weight)
                  : Setweight(dataByID.data.weight)
                : Setweight(dataByID.data.weight);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.weight_unit != undefined
                  ? setTempunit(
                      dataByID.data.edited_fields.weight_unit == "KILOGRAMS"
                        ? "kg"
                        : dataByID.data.edited_fields.weight_unit == "GRAMS"
                        ? "g"
                        : dataByID.data.edited_fields.weight_unit == "POUNDS"
                        ? "lb"
                        : dataByID.data.edited_fields.weight_unit == "OUNCE"
                        ? "oz"
                        : dataByID.data.edited_fields.weight_unit
                    )
                  : setTempunit(
                      dataByID.data.weight_unit == "KILOGRAMS"
                        ? "kg"
                        : dataByID.data.weight_unit == "GRAMS"
                        ? "g"
                        : dataByID.data.weight_unit == "POUNDS"
                        ? "lb"
                        : dataByID.data.weight_unit == "OUNCE"
                        ? "oz"
                        : dataByID.data.weight_unit
                    )
                : setTempunit(
                    dataByID.data.weight_unit == "KILOGRAMS"
                      ? "kg"
                      : dataByID.data.weight_unit == "GRAMS"
                      ? "g"
                      : dataByID.data.weight_unit == "POUNDS"
                      ? "lb"
                      : dataByID.data.weight_unit == "OUNCE"
                      ? "oz"
                      : dataByID.data.weight_unit
                  );

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.title != undefined
                  ? Props.setTitle(dataByID.data.edited_fields.title)
                  : Props.setTitle(dataByID.data.title)
                : Props.setTitle(dataByID.data.title);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.product_type != undefined
                  ? setProductType(dataByID.data.edited_fields.product_type)
                  : setProductType(dataByID.data.product_type)
                : setProductType(dataByID.data.product_type);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.compare_at_price != undefined
                  ? setCompareAtPrice(
                      dataByID.data.edited_fields.compare_at_price
                    )
                  : setCompareAtPrice(dataByID.data.compare_at_price)
                : setCompareAtPrice(dataByID.data.compare_at_price);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.price != undefined
                  ? SetPrice(dataByID.data.edited_fields.price)
                  : SetPrice(dataByID.data.price)
                : SetPrice(dataByID.data.price);
              // setCompareAtPrice(dataByID.data.compare_at_price);
              // dataByID.data.edited_fields != undefined
              //   ? dataByID.data.edited_fields.compare_at_price != undefined
              //     ? setCompareAtPrice(
              //       dataByID.data.edited_fields.compare_at_price
              //     )
              //     : setCompareAtPrice(dataByID.data.compare_at_price)
              //   : setCompareAtPrice(dataByID.data.compare_at_price);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.quantity != undefined
                  ? setquantity(dataByID.data.edited_fields.quantity)
                  : setquantity(dataByID.data.quantity)
                : setquantity(dataByID.data.quantity);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.custom_sku != undefined
                  ? setSku(dataByID.data.edited_fields.custom_sku)
                  : setSku(dataByID.data.custom_sku)
                : setSku(dataByID.data.custom_sku);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.vendor != undefined
                  ? setVendorName(dataByID.data.edited_fields.vendor)
                  : setVendorName(dataByID.data.vendor)
                : setVendorName(dataByID.data.vendor);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.barcode != undefined
                  ? setBarcode(dataByID.data.edited_fields.barcode)
                  : setBarcode(dataByID.data.barcode)
                : setBarcode(dataByID.data.barcode);

              const temp: any = [];

              dataByID.data.edited_fields && dataByID.data.edited_fields.tags
                ? Object.keys(dataByID.data.edited_fields.tags).map((ele) => {
                    temp.push(dataByID.data.tags[ele]);
                  })
                : Object.keys(dataByID.data.tags).map((ele) => {
                    temp.push(dataByID.data.tags[ele]);
                  });
              setTags(temp);

              dataByID.data.edited_fields &&
              dataByID.data.edited_fields.collection
                ? setCollection(dataByID.data.edited_fields.collection)
                : setCollection(dataByID.data.collection);

              // Setweight(dataByID.data.weight);

              // dataByID.data.weight_unit == "kg" && setTempunit("kg");
              // dataByID.data.weight_unit == "KILOGRAMS" && setTempunit("kg");
              // dataByID.data.weight_unit == "g" && setTempunit("g");
              // dataByID.data.weight_unit == "GRAMS" && setTempunit("g");
              // dataByID.data.weight_unit == "POUNDS" && setTempunit("lb");
              // dataByID.data.weight_unit == "lb" && setTempunit("lb");
              // dataByID.data.weight_unit == "oz" && setTempunit("oz");
              // dataByID.data.weight_unit == "OUNCE" && setTempunit("oz");
              // }
            } else if (
              dataByID.data[0] == undefined &&
              dataByID.data.variant_attributes != undefined
            ) {
              if (dataByID.data.inventory_tracked) {
                setTrackQuantity(true);
              } else {
                setTrackQuantity(false);
              }

              if (dataByID.data.inventory_policy == "continue") {
                setcontinueSales(true);
              } else {
                setcontinueSales(false);
              }
              if (dataByID.data.source_marketplace === "shopify_vendor") {
                setSaveEditDisable(false);
              }
              setsourceMarketPlace(dataByID.data.source_marketplace);

              setVariantCheck(true);
              setType("simpleVariant");
              setCheck(dataByID.data.requires_shipping);

              setCompareAtPrice(dataByID.data.compare_at_price);

              setGetDescription(dataByID.data.description);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.description != undefined
                  ? setGetDescription(dataByID.data.edited_fields.description)
                  : setGetDescription(dataByID.data.description)
                : setGetDescription(dataByID.data.description);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.title != undefined
                  ? setdataTitle(dataByID.data.edited_fields.title)
                  : setdataTitle(dataByID.data.title)
                : setdataTitle(dataByID.data.title);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.title != undefined
                  ? Props.setTitle(dataByID.data.edited_fields.title)
                  : Props.setTitle(dataByID.data.title)
                : Props.setTitle(dataByID.data.title);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.product_type != undefined
                  ? setProductType(dataByID.data.edited_fields.product_type)
                  : setProductType(dataByID.data.product_type)
                : setProductType(dataByID.data.product_type);

              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.vendor != undefined
                  ? setVendorName(dataByID.data.edited_fields.vendor)
                  : setVendorName(dataByID.data.vendor)
                : setVendorName(dataByID.data.vendor);
              const temp: any = [];
              dataByID.data.edited_fields && dataByID.data.edited_fields.tags
                ? Object.keys(dataByID.data.edited_fields.tags).map((ele) => {
                    temp.push(dataByID.data.tags[ele]);
                  })
                : Object.keys(dataByID.data.tags).map((ele) => {
                    temp.push(dataByID.data.tags[ele]);
                  });
              setTags(temp);

              dataByID.data.edited_fields &&
              dataByID.data.edited_fields.collection
                ? setCollection(dataByID.data.edited_fields.collection)
                : setCollection(dataByID.data.collection);

              // Props.setTitle(dataByID.data[0].title);
              setdataIDValue(dataByID.data);
              if (Array.isArray(dataByID.data.additional_images)) {
                const allImg =
                  dataByID.data.additional_images !== undefined &&
                  dataByID.data.main_image
                    ? [
                        ...dataByID.data.additional_images,
                        ...[dataByID.data.main_image],
                      ]
                    : dataByID.data.main_image &&
                      dataByID.data.main_image !== null
                    ? [dataByID.data.main_image]
                    : [];
                setShowImages(Array.from(new Set(allImg)));
                setImageChangeVerify(Array.from(new Set(allImg)).length);
              } else {
                const allImg =
                  dataByID.data.additional_images && dataByID.data.main_image
                    ? Object.values(dataByID.data.additional_images).includes(
                        dataByID.data.main_image
                      )
                      ? { ...dataByID.data.additional_images }
                      : {
                          ...dataByID.data.additional_images,
                          ...{
                            [Object.keys(dataByID.data.additional_images)
                              .length + 1]: dataByID.data.main_image
                              ? dataByID.data.main_image
                              : {},
                          },
                        }
                    : dataByID.data.main_image && dataByID.data.main_image
                    ? {
                        0: dataByID.data.main_image,
                      }
                    : [];
                setShowImages(Object.values(allImg));
                setImageChangeVerify(Object.values(allImg).length);
              }

              SetPrice(dataByID.data.price);
              // setSku(dataByID.data.custom_sku);
              dataByID.data.edited_fields != undefined
                ? dataByID.data.edited_fields.custom_sku != undefined
                  ? setSku(dataByID.data.edited_fields.custom_sku)
                  : setSku(dataByID.data.custom_sku)
                : setSku(dataByID.data.custom_sku);

              setContainerID(dataByID.data.container_id);

              setquantity(dataByID.data.quantity);
              // Setweight(dataByID.data.weight);

              if (Object.keys(dataByID.data.tags).length > 0) {
                const a: Array<any> = Object.values(dataByID.data.tags).map(
                  (i) => {
                    return i;
                  }
                );
                setTags(a);
              }
              setBarcode(dataByID.data.barcode);
              // setProductType(dataByID.data.product_type);
              // setVendorName(dataByID.data.vendor_name);
              Object.values(dataByID.data.variant_attributes).length == 3 &&
                setnewlenarr([0, 1, 2]);
              Object.values(dataByID.data.variant_attributes).length == 2 &&
                setnewlenarr([0, 1]);
              setVariantAtt(Object.values(dataByID.data.variant_attributes));
            } else if (
              dataByID.data[0] != undefined &&
              dataByID.data[0].variant_attributes != undefined
            ) {
              setdataIDValue(dataByID.data);
              setType("variant");
              dataByID.data[1] &&
                setVariantAtt(
                  Object.values(dataByID.data[1].variant_attributes)
                );

              setVariantCheck(true);

              if (dataByID.data[0].source_marketplace === "shopify_vendor") {
                setSaveEditDisable(false);
              }
              if (dataByID.data[0].inventory_tracked) {
                setTrackQuantity(true);
              } else {
                setTrackQuantity(false);
              }

              if (dataByID.data[0].inventory_policy == "continue") {
                setcontinueSales(true);
              } else {
                setcontinueSales(false);
              }

              setdataIDValue(dataByID.data);
              setsourceMarketPlace(dataByID.data[0].source_marketplace);

              setGetDescription(dataByID.data[0].description);
              setCheck(dataByID.data[0].requires_shipping);

              dataByID.data[0].edited_fields != undefined
                ? dataByID.data[0].edited_fields.description != undefined
                  ? setGetDescription(
                      dataByID.data[0].edited_fields.description
                    )
                  : setGetDescription(dataByID.data[0].description)
                : setGetDescription(dataByID.data[0].description);

              dataByID.data[0].edited_fields != undefined
                ? dataByID.data[0].edited_fields.title != undefined
                  ? setdataTitle(dataByID.data[0].edited_fields.title)
                  : setdataTitle(dataByID.data[0].title)
                : setdataTitle(dataByID.data[0].title);

              dataByID.data[0].edited_fields != undefined
                ? dataByID.data[0].edited_fields.title != undefined
                  ? Props.setTitle(dataByID.data[0].edited_fields.title)
                  : Props.setTitle(dataByID.data[0].title)
                : Props.setTitle(dataByID.data[0].title);

              dataByID.data[0].edited_fields != undefined
                ? dataByID.data[0].edited_fields.product_type != undefined
                  ? setProductType(dataByID.data[0].edited_fields.product_type)
                  : setProductType(dataByID.data[0].product_type)
                : setProductType(dataByID.data[0].product_type);

              dataByID.data[0].edited_fields != undefined
                ? dataByID.data[0].edited_fields.vendor != undefined
                  ? setVendorName(dataByID.data[0].edited_fields.vendor)
                  : setVendorName(dataByID.data[0].vendor)
                : setVendorName(dataByID.data[0].vendor);

              const temp: any = [];
              // if (
              //   dataByID.data[1] &&
              //   dataByID.data[1].edited_fields != undefined
              // ) {
              //   dataByID.data[1].edited_fields.tags &&
              //     Object.keys(dataByID.data[1].edited_fields.tags).length > 0 &&
              //     Object.keys(dataByID.data[1].edited_fields.tags).map(
              //       (ele) => {
              //         temp.push(dataByID.data[1].edited_fields.tags[ele]);
              //       }
              //     );
              //   setTags(temp);
              //   dataByID.data[1].edited_fields.collection &&
              //     dataByID.data[1].edited_fields.collection &&
              //     setCollection(dataByID.data[1].edited_fields.collection);
              // } else {
              //   dataByID.data[1].tags != undefined &&
              //     dataByID.data[1].tags != null &&
              //     Object.keys(dataByID.data[1].tags).length > 0 &&
              //     Object.keys(dataByID.data[1].tags).map((ele) => {
              //       temp.push(dataByID.data[1].tags[ele]);
              //     });
              //   setTags(temp);
              //   dataByID.data[1] && setCollection(dataByID.data[1].collection);
              // }
              dataByID.data[1].edited_fields &&
              dataByID.data[1].edited_fields.tags
                ? Object.keys(dataByID.data[1].edited_fields.tags).map(
                    (ele) => {
                      temp.push(dataByID.data[1].tags[ele]);
                    }
                  )
                : Object.keys(dataByID.data[1].tags).map((ele) => {
                    temp.push(dataByID.data[1].tags[ele]);
                  });
              setTags(temp);

              dataByID.data[1].edited_fields &&
              dataByID.data[1].edited_fields.collection
                ? setCollection(dataByID.data[1].edited_fields.collection)
                : setCollection(dataByID.data[1].collection);

              if (
                dataByID.data[1] &&
                Array.isArray(dataByID.data[1].additional_images)
              ) {
                const allImg =
                  dataByID.data[1].additional_images !== undefined &&
                  dataByID[1].data.main_image
                    ? [
                        ...dataByID.data[1].additional_images,
                        ...[dataByID.data[1].main_image],
                      ]
                    : dataByID.data[1].main_image &&
                      dataByID.data[1].main_image !== null
                    ? [dataByID.data[1].main_image]
                    : [];
                setShowImages(Array.from(new Set(allImg)));
                setImageChangeVerify(Array.from(new Set(allImg)).length);
              } else {
                const allImg =
                  dataByID.data[1].additional_images &&
                  dataByID.data[1].main_image
                    ? Object.values(
                        dataByID.data[1].additional_images
                      ).includes(dataByID.data[1].main_image)
                      ? { ...dataByID.data[1].additional_images }
                      : {
                          ...dataByID.data[1].additional_images,
                          ...{
                            [Object.keys(dataByID.data[1].additional_images)
                              .length + 1]: dataByID.data[1].main_image
                              ? dataByID.data[1].main_image
                              : {},
                          },
                        }
                    : dataByID.data[1].main_image && dataByID.data[1].main_image
                    ? {
                        0: dataByID.data[1].main_image,
                      }
                    : [];

                setShowImages(Object.values(allImg));
                setImageChangeVerify(Object.values(allImg).length);

                // dataByID.data[1].additional_images;
              }

              dataByID.data[1] && SetPrice(dataByID.data[1].price);

              dataByID.data.edited_fields != undefined
                ? dataByID.data[1].edited_fields.custom_sku != undefined
                  ? setSku(dataByID.data[1].edited_fields.custom_sku)
                  : setSku(dataByID.data[1].custom_sku)
                : setSku(dataByID.data[1].custom_sku);

              setContainerID(dataByID.data[0].container_id);

              setquantity(dataByID.data[0].quantity);
              dataByID.data[1] && Setweight(dataByID.data[1].weight);

              if (Object.keys(dataByID.data[1].tags).length > 0) {
                const a: Array<any> = Object.values(dataByID.data[1].tags).map(
                  (i) => {
                    return i;
                  }
                );
                setTags(a);
              }
              dataByID.data[1] && setBarcode(dataByID.data[1].barcode);
              // setProductType(dataByID.data.product_type);
              // setVendorName(dataByID.data.vendor_name);

              dataByID.data[1] &&
                Object.values(dataByID.data[1].variant_attributes).length ==
                  3 &&
                setnewlenarr([0, 1, 2]);
              dataByID.data[1] &&
                Object.values(dataByID.data[1].variant_attributes).length ==
                  2 &&
                setnewlenarr([0, 1]);

              // dataByID.data[1] &&
              //   setVariantAtt(
              //     Object.values(dataByID.data[1].variant_attributes)
              //   );
            }
          } else {
            if (dataByID.message === "Product not found") {
              Props.history.push("/products");
            }
          }
        });

      // }
      // SetConst(constructor + 1);
    }
  }
  useEffect(() => {
    getdata();
    getDetails();
  }, []);

  const getDetails = () => {
    Props.di.GET("/frontend/app/getUserDetails").then((e: any) => {
      if (e.success) {
        setCurrency(e.currency);
      }
    });
  };

  useEffect(() => {
    const arr1: Array<string> = [];
    const arr2: Array<string> = [];
    const arr3: Array<string> = [];

    switch (Type) {
      case "variant":
        dataIDValue.map((m1: any) => {
          if (
            (m1["type"] === "variation" &&
              m1["visibility"] === "Catalog and Search") == false
          ) {
            arr1.includes(m1[VariantAtt[0]])
              ? null
              : arr1.push(m1[VariantAtt[0]]);
            m1[VariantAtt[1]] != undefined && arr2.includes(m1[VariantAtt[1]])
              ? null
              : arr2.push(m1[VariantAtt[1]]);
            m1[VariantAtt[2]] != undefined && arr3.includes(m1[VariantAtt[2]])
              ? null
              : arr3.push(m1[VariantAtt[2]]);
          }
        });
        break;

      case "simpleVariant":
        arr1.includes(dataIDValue[VariantAtt[0]])
          ? null
          : arr1.push(dataIDValue[VariantAtt[0]]);
        dataIDValue[VariantAtt[1]] != undefined &&
        arr2.includes(dataIDValue[VariantAtt[1]])
          ? null
          : arr2.push(dataIDValue[VariantAtt[1]]);
        dataIDValue[VariantAtt[2]] != undefined &&
          arr3.push(dataIDValue[VariantAtt[2]]);

        break;
    }

    setattrfeild0(arr1);
    setattrfeild1(arr2);
    setattrfeild2(arr3);
  }, [VariantAtt]);

  const [Price, SetPrice] = useState<any>("");
  const [Details, setdetails] = useState<any>({
    details: {
      title: "",
      long_description: <p></p>,
      type: "",
    },
  });
  const [obj, setobj] = useState({
    data: Details,
    source_marketplace: "cedcommerce",
  });
  const [EditedFields, setEditedFields] = useState<any>();
  const [sellVariant, setSellVariant] = useState<any>();
  const [editVariant, setEditVariant] = useState<any>();
  const [editArr, setEditArr] = useState<any>({});
  const [text, settext] = useState<JSX.Element>();
  const [arr, setarr] = useState<Objtext[]>();
  const [Barcode, setBarcode] = useState("");
  const [pregetImg, setPreGetImg] = useState<Array<any>>([]);
  const [Sku, setSku] = useState("");
  const [unit, SetUnit] = useState("");
  const [weight, Setweight] = useState("");
  useEffect(() => {
    setobj((prev: any) => ({
      ...prev,
      data: Details,
      source_marketplace: "cedcommerce",
    }));
  }, [Details]);
  /**
   * Recieving Props From Varient page.
   */
  function recieveFromVarient(value: any) {
    // value.map((ArrAdd: any) => {
    //   ArrAdd.title = dataTitle;
    //   ArrAdd.type = "variation";
    //   ArrAdd.collection = tag;
    //   // ArrAdd.tags = tags.toString();
    //   ArrAdd.tags = tags;
    //   ArrAdd.description = text;
    //   ArrAdd.product_type = productType;
    // });
    setarr(value);
  }

  const VariantCheck = (value: boolean) => {
    setVariantCheck(value);
  };
  function editedVarient(value: any) {
    setEditVariant(value);
  }

  function tableLength(value: number) {
    setRowLength(value);
  }

  function editedSell(value: any) {
    delete value.undefined;
    setSellVariant(value);
  }

  useEffect(() => {
    arr?.map((m1: any) => {
      m1["tags"] = tags;
      m1["tags"] = tags;
      m1["collection"] = tag;
      m1["description"] = text;
      m1["vendor_name"] = vendorName;
      m1["product_type"] = productType;
    });
  }, [tag, tags, text, productType, vendorName]);

  const toDataURL = (url: any) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  function dataURLtoFile(dataurl: any, filename: string) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  useEffect(() => {
    if (changeUrlInImg) {
      const img: any = [];
      Object.keys(ShowImages).length > 0 &&
        Object.values(ShowImages).map(async (image: any) => {
          await toDataURL(image).then(async (dataUrl: any) => {
            const fileData = dataURLtoFile(dataUrl, image);
            await img.push(fileData);
          });
        });
      setImagearr(img);
    }
  }, [ShowImages]);

  const recieveFromimage = (value: any) => {
    const allImages: any = [...value];
    value.length > 0 ? SetIsIMediaEdit(true) : SetIsIMediaEdit(false);

    setAllMediaImg(allImages);
    // setImagearr(allImages);
  };
  function receiveMedia(value: any) {
    setVideoUrl(value);
  }

  function receiveMediaImage(value: any) {
    setimageUrl(value);
  }
  function varientsAttributes(value: any) {
    setVariants_attr(value);
  }
  /**
   * Recieving Props From Pricing page.
   */
  function recieveFromPricing(Price: number, cop: number) {
    SetPrice(isNaN(Price) ? "" : Price);
    setCompareAtPrice(cop);
  }
  /**
   * Recieving Props From Shipping page.
   */
  function recieveFromShipping(phyPro: boolean, Weight: string, unit: string) {
    setCheck(phyPro);
    setTempunit(unit);
    SetUnit(unit);
    Setweight(Weight);
  }
  /**
   * Recieving Props From Inventory page.
   */
  function recieveFromInventory(
    Quantity: string,
    SKU: string,
    barcodeData: string,
    trackQuantity: boolean,
    continueSales: boolean
  ) { 
    setBarcode(barcodeData);
    setSku(SKU);
    setquantity(Quantity);
    setTrackQuantity(trackQuantity);
    setcontinueSales(continueSales);
  }
  /**
   * Recieving Props From TextEditor page.
   */
  function recieveFromText(text: JSX.Element) {
    settext(text);
  }

  useEffect(() => {
    if (arr?.length == 0) {
      setdetails((prev: any) => ({
        ...prev,
        details: {
          ...prev.details,
          type: "simple",
          price: Price,
          quantity: Quantity,
          custom_sku: Sku,
          sku: Sku,
          barcode: Barcode,
          tags: tags,
          compare_at_price: CompareAtPrice,
          long_description: text,
          product_type: productType,
          inventory_policy: continueSales ? "continue" : "deny",
          requires_shipping: Check,
          inventory_tracked: TrackQuantity,
          brand: vendorName,
          weight_unit: unit,
          weight: weight,
        },
        variants: [
          {
            name: dataTitle.trim(),
            type: "simple",
            price: Price,
            description: text,
            weight_unit: unit,
            weight: weight,
            compare_at_price: CompareAtPrice,
            inventory_policy: continueSales ? "continue" : "deny",
            requires_shipping: Check,
            inventory_tracked: TrackQuantity,
            quantity: Quantity,
            sku: Sku,
            tags: tags,
            barcode: Barcode,
            product_type: productType,
            brand: vendorName,
            collection: tag,
          },
        ],
        imgae: imagearr,
        media: { imageUrl, videoUrl },
        variant_attributes: variants_attr,
      }));
    } else {
      setdetails((prev: any) => ({
        ...prev,
        details: {
          ...prev.details,
          type: arr?.length === 1 ? "simple" : "variation",
          price: Price,
          weight_unit: unit,
          weight: weight,
          quantity: Quantity,
          sku: Sku,
          compare_at_price: CompareAtPrice,
          inventory_policy: continueSales ? "continue" : "deny",
          requires_shipping: Check,
          inventory_tracked: TrackQuantity,
          barcode: Barcode,
          product_type: productType,
          vendor: vendorName,
          collection: tag,
          tags: tags,
        },
        variants: arr,
        image: imagearr,
        media: { imageUrl, videoUrl },
        variant_attributes: variants_attr,
      }));
    }

    // setData(Details);
  }, [
    dataTitle,
    Price,
    Quantity,
    Barcode,
    weight,
    productType,
    vendorName,
    unit,
    Sku,
    arr,
    tags,
    tag,
    CompareAtPrice,
    imagearr,
    text,
  ]);

  //for update in TextEditor
  useEffect(() => {
    setdetails((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        long_description: text,
      },
    }));
    setEditArr((prev: any) => ({
      ...prev,
      description: text,
    }));
  }, [text]);

  //FIRST TIME UPDATE
  useEffect(() => {
    setdetails((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        long_description: GetDescription,
      },
    }));
  }, [GetDescription]);
  //For Setting Title in Objects
  useEffect(() => {
    setdetails((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        title: dataTitle.trim(),
      },
    }));
  }, [dataTitle]);
  useEffect(() => {
    setEditedFields((prev: any) => ({
      ...prev,
      details: editArr,
      variants: editVariant,
    }));
    const sellSimple: any = {};
    sellSimple[SourceProductId] = { sell: true };
    setEditedSave((prev: any) => ({
      ...prev,
      container_id: ContainerID,
      user_id: Props.location.state.user_id,
      source_marketplace: Props.location.state.source_marketplace,
      upload_product: false,
      edited_fields: EditedFields,
      sell: Type === "simple" ? sellSimple : sellVariant,
    }));
  }, [editVariant, editArr, sellVariant, ContainerID]);

  function EditedFieldsSetting() {
    const edited_fields: any = {
      details: {
        collection: tag,
        tags: tags,
      },
      variants: editVariant,
    };
    if (DataReceived.edited_fields != undefined) {
      DataReceived.edited_fields["title"] === undefined
        ? DataReceived.title != dataTitle.trim() &&
          (edited_fields["details"]["title"] = dataTitle.trim())
        : DataReceived.edited_fields["title"] != dataTitle.trim() &&
          (edited_fields["details"]["title"] = dataTitle.trim());

      DataReceived.edited_fields["requires_shipping"] == undefined
        ? DataReceived.requires_shipping != Check &&
          (edited_fields["details"]["requires_shipping"] = Check)
        : DataReceived.edited_fields["requires_shipping"] != Check &&
          (edited_fields["details"]["requires_shipping"] = Check);

      DataReceived.edited_fields["weight_unit"] == undefined
        ? DataReceived.weight_unit != tempunit &&
          (edited_fields["details"]["weight_unit"] = tempunit)
        : DataReceived.edited_fields["weight_unit"] != tempunit &&
          (edited_fields["details"]["weight_unit"] = tempunit);

      DataReceived.edited_fields["inventory_tracked"] == undefined
        ? DataReceived.inventory_tracked != TrackQuantity &&
          (edited_fields["details"]["inventory_tracked"] = TrackQuantity)
        : DataReceived.edited_fields["inventory_tracked"] != TrackQuantity &&
          (edited_fields["details"]["inventory_tracked"] = TrackQuantity);

      DataReceived.edited_fields["weight"] == undefined
        ? DataReceived.weight != weight &&
          (edited_fields["details"]["weight"] = weight)
        : DataReceived.edited_fields["weight"] != weight &&
          (edited_fields["details"]["weight"] = weight);

      DataReceived.edited_fields["compare_at_price"] == undefined
        ? DataReceived.compare_at_price != CompareAtPrice &&
          (edited_fields["details"]["compare_at_price"] = CompareAtPrice)
        : DataReceived.edited_fields["compare_at_price"] != CompareAtPrice &&
          (edited_fields["details"]["compare_at_price"] = CompareAtPrice);

      DataReceived.edited_fields["description"] == undefined
        ? DataReceived.description != text &&
          (edited_fields["details"]["description"] = text)
        : DataReceived.edited_fields["description"] != text &&
          (edited_fields["details"]["description"] = text);

      DataReceived.edited_fields["product_type"] == undefined
        ? DataReceived.product_type != productType &&
          (edited_fields["details"]["product_type"] = productType)
        : DataReceived.edited_fields["product_type"] != productType &&
          (edited_fields["details"]["product_type"] = productType);

      DataReceived.edited_fields["price"] == undefined
        ? DataReceived.price != Price &&
          (edited_fields["details"]["price"] = Price)
        : DataReceived.edited_fields["price"] != Price &&
          (edited_fields["details"]["price"] = Price);

      DataReceived.edited_fields["quantity"] == undefined
        ? DataReceived.quantity != Quantity &&
          (edited_fields["details"]["quantity"] = Quantity)
        : DataReceived.edited_fields["quantity"] != Quantity &&
          (edited_fields["details"]["quantity"] = Quantity);

      // DataReceived.edited_fields["inventory_policy"] == undefined
      //   ? DataReceived.inventory_policy != continueSales &&
      //     Type == "simple" &&
      //     (edited_fields["details"]["inventory_policy"] = continueSales
      //       ? "continue"
      //       : "deny")
      //   : DataReceived.edited_fields["inventory_policy"] != continueSales &&
      //     Type == "simple" &&
      //     (edited_fields["details"]["inventory_policy"] = continueSales
      //       ? "continue"
      //       : "deny");

      DataReceived.edited_fields["inventory_policy"] == undefined
        ? DataReceived.inventory_tracked != continueSales
          ? "continue"
          : "deny" &&
            (edited_fields["details"]["inventory_policy"] = continueSales
              ? "continue"
              : "deny")
        : DataReceived.edited_fields["inventory_policy"] != continueSales
        ? "continue"
        : "deny" &&
          (edited_fields["details"]["inventory_policy"] = continueSales
            ? "continue"
            : "deny");

      DataReceived.edited_fields["custom_sku"] == undefined
        ? DataReceived.custom_sku != Sku &&
          (edited_fields["details"]["custom_sku"] = Sku)
        : DataReceived.edited_fields["custom_sku"] != Sku &&
          (edited_fields["details"]["custom_sku"] = Sku);

      DataReceived.edited_fields["vendor"] == undefined
        ? DataReceived.vendor != vendorName &&
          (edited_fields["details"]["vendor"] = vendorName)
        : DataReceived.edited_fields["vendor"] != vendorName &&
          (edited_fields["details"]["vendor"] = vendorName);

      DataReceived.edited_fields["barcode"] == undefined
        ? DataReceived.barcode != Barcode &&
          (edited_fields["details"]["barcode"] = Barcode)
        : DataReceived.edited_fields["barcode"] != Barcode &&
          (edited_fields["details"]["barcode"] = Barcode);
    } else {
      DataReceived.title != dataTitle.trim() &&
        (edited_fields["details"]["title"] = dataTitle.trim());
      DataReceived.description != text &&
        (edited_fields["details"]["description"] = text);

      DataReceived.compare_at_price != CompareAtPrice &&
        Type == "simple" &&
        (edited_fields["details"]["compare_at_price"] = CompareAtPrice);

      DataReceived.inventory_policy != continueSales &&
        Type == "simple" &&
        (edited_fields["details"]["inventory_policy"] = continueSales
          ? "continue"
          : "deny");

      DataReceived.inventory_tracked != TrackQuantity &&
        Type == "simple" &&
        (edited_fields["details"]["inventory_tracked"] = TrackQuantity);

      DataReceived.weight_unit != tempunit &&
        Type == "simple" &&
        (edited_fields["details"]["weight_unit"] = tempunit);

      DataReceived.requires_shipping != Check &&
        Type == "simple" &&
        (edited_fields["details"]["requires_shipping"] = Check);

      DataReceived.weight != weight &&
        Type == "simple" &&
        (edited_fields["details"]["weight"] = weight);

      DataReceived.product_type != productType &&
        (edited_fields["details"]["product_type"] = productType);
      DataReceived.price != Price &&
        Type == "simple" &&
        (edited_fields["details"]["price"] = Price);
      DataReceived.quantity != Quantity &&
        Type == "simple" &&
        (edited_fields["details"]["quantity"] = Quantity);
      DataReceived.custom_sku != Sku &&
        Type == "simple" &&
        (edited_fields["details"]["custom_sku"] = Sku);
      DataReceived.vendor != vendorName &&
        (edited_fields["details"]["vendor"] = vendorName);
      DataReceived.barcode != Barcode &&
        Type == "simple" &&
        (edited_fields["details"]["barcode"] = Barcode);
    }
    return edited_fields;
  }
  async function EditSave() {
    setLoading(true);
    EditedSave["edited_fields"] = await EditedFieldsSetting();
    const isImageEdit =
      imageChangeVerify !== imagearr.length || isMediaEdit ? true : false;

    (isImageEdit || isVarImageEdit) &&
      (EditedSave["edited_fields"]["details"]["additional_images"] = []);

    const formdata = new FormData();
    formdata.append("data", JSON.stringify(EditedSave));

    (isVarImageEdit || isImageEdit) &&
      [...imagearr, ...allMediaImg].map((e) => {
        formdata.append("images[]", e);
      });

    isVarImageEdit &&
      Details.variants &&
      Object.keys(Details.variants).map(async (ele) => {
        await formdata.append(
          Details.variants[ele].source_product_id,
          typeof Details.variants[ele].variant_image === "string" &&
            Details.variants[ele].variant_image !== ""
            ? await toDataURL(Details.variants[ele].variant_image).then(
                async (dataUrl: any) => {
                  const fileData = await dataURLtoFile(dataUrl, dataUrl);

                  return fileData;
                }
              )
            : Details.variants[ele].variant_image
        );
      });

    setTimeout(() => {
      Props.di
        .POST("/connector/product/editedSave", formdata, false, true)
        .then((e: any) => {
          if (e.success) {
            getdata();
            setEditToast(true);
            setImgUpdate(true);
            setEditMsg(e.message);
            setEditArr({});
            SetIsIMediaEdit(false);
            setChangeUrlInImg(true);
            setEditVariant([]);
            setEditedFields({});
            setEditedSave({});
            setVarImgArr([]);
          }
          setLoading(false);
        });
    }, 1000);
  }
  // const [Count, setCount] = useState(0);
  const [msg, setMessage] = useState("");
  const [toast, setToast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastPrice, setToastPrice] = useState(false);
  /**
   * @function AddPro is for saving the new products.
   */

  function AddPro() {
    arr?.map((ArrAdd: any) => {
      ArrAdd.title = dataTitle.trim();
      ArrAdd.type = arr?.length > 1 ? "variation" : "simple";
      ArrAdd.collection = tag;
      // ArrAdd.tags = tags.toString();
      ArrAdd.tags = tags;
      ArrAdd.description = text;
      ArrAdd.product_type = productType;
    });
    const formData: any = new FormData();
    [...allMediaImg, ...imagearr].map((e) => {
      formData.append("images[]", e);
    });
    // mediaUrl.map((e) => {
    //   formData.append("media[]", e);
    // });
    Object.keys(Details.variants).map((ele) => {
      formData.append(
        Details.variants[ele].variant_title,
        Details.variants[ele].variant_image
      );
    });

    formData.append("data", JSON.stringify(Details));
    formData.append("source_marketplace", "cedcommerce");
    // let c = 0;
    setLoading(true);
    Props.di
      .POST("connector/product/create", formData, false, true)
      .then((e: any) => {
        if (e.success) {
          setToast(true);
          setMessage(e.message);
          setDisbaleButton(true);
          setTimeout(() => Props.history.push("/products"), 500);
        } else {
          setErrToast(true);
          setMessage(e.message);
        }
        setLoading(false);
      });
  }

  function setTag1(obj: any) {
    const temp: any = obj.map((e: any) => {
      return {
        collection_id: e.value,
        title: e.label,
        __parentId: 0,
        gid: "gid://shopify/Collection/" + e.value,
      };
    });
    setTag(temp);
  }
  useEffect(() => {
    setEditArr((prev: any) => ({
      ...prev,
      collection: tag,
    }));
  }, [tag]);
  useEffect(() => {
    setEditArr((prev: any) => ({
      ...prev,
      tags: tags,
    }));
  }, [tags]);

  /**
   * @function SetIsVarImageEditFun is to determine that variants image has chnaged
   */

  const SetIsVarImageEditFun = (arr: any) => {
    SetIsVarImageEdit(true);
    setVarImgArr(arr);
  };
  return (
    <div>
      <ToastWrapper>
        {EditToast && (
          <Toast
            message={EditMsg}
            type="success"
            timeout={3000}
            onDismiss={() => {
              setEditToast(!EditToast);
            }}
          ></Toast>
        )}
      </ToastWrapper>

      <>
        <Card>
          <FormChild>
            <FlexLayout spacing="none">
              <TextStyles type="SubHeading">Title</TextStyles>
              <TextStyles>
                {" "}
                <span style={{ color: "red", fontSize: "20px" }}>*</span>
              </TextStyles>
            </FlexLayout>
            <TextField
              // name="Title"
              thickness="thin"
              placeHolder="Enter product name"
              value={dataTitle}
              readOnly={!SaveEditDisable}
              onChange={(e) => {
                e.length < 256 && dataTitle.length < 256 && setdataTitle(e);
                e.length < 256 &&
                  dataTitle.length < 256 &&
                  setEditArr((prev: any) => ({
                    ...prev,
                    title: e,
                    product_type: productType,
                    vendor: vendorName,
                    // collection: tag,
                    // tags: tagReceived
                  }));
              }}
            />
          </FormChild>

          {Props.match.params.id != undefined && dataTitle != "" && (
            <FormChild>
              <TextEditor
                TextToAddProduct={recieveFromText}
                TextById={"<div>" + GetDescription + "</div>"}
                saveEdit={SaveEditDisable}
              />
            </FormChild>
          )}
          {Props.match.params.id == undefined && (
            <FormChild>
              <TextEditor
                TextToAddProduct={recieveFromText}
                TextById={"<div>" + GetDescription + "</div>"}
                saveEdit={SaveEditDisable}
              />
            </FormChild>
          )}
        </Card>
        {Props.match.params.id != undefined &&
          Object.keys(ShowImages).length > 0 && (
            <Card title="Image(s)">
              <FlexLayout spacing="loose" halign="start">
                {Object.values(ShowImages).map((e: any, i) => {
                  if (
                    e.includes("png") ||
                    e.includes("jpg") ||
                    e.includes("jpeg") ||
                    e.includes("gif")
                  ) {
                    return (
                      <FlexLayout spacing="extraTight" halign="start">
                        <div className="Btn-overImage button">
                          <img
                            title={e}
                            key={i}
                            src={e}
                            width="100"
                            height="100"
                          />

                          {SaveEditDisable && (
                            <Button
                              iconRound={false}
                              thickness="thin"
                              type="Plain"
                              onClick={() => {
                                setChangeUrlInImg(false);
                                // ShowImages.splice(i, 1);
                                // pregetImg.splice(i, 1);

                                // const a: any = pregetImg.slice(0);

                                // setPreGetImg(a);
                                // setShowImages(ShowImages.slice(0));
                                const imgArr = imagearr.filter(
                                  (i: any) => i.name != e
                                );
                                const showImgArr = ShowImages.filter(
                                  (j: any) => j != e
                                );
                                // const preGetImgArr = pregetImg.filter(
                                //   (k: any) => k.name != e
                                // );

                                setImagearr(imgArr.slice(0));
                                setShowImages(showImgArr.slice(0));
                                // setPreGetImg(preGetImgArr);

                                // setImagearr(a);
                              }}
                            >
                              {
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  height="18"
                                >
                                  <path
                                    d="M11.414 10l6.293-6.293a1 1 0 10-1.414-1.414L10 8.586 3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293A.998.998 0 0018 17a.999.999 0 00-.293-.707L11.414 10z"
                                    fill="#413bbc"
                                  />
                                </svg>
                              }
                            </Button>
                          )}
                        </div>
                      </FlexLayout>
                    );
                  } else if (e.includes("mp4") || e.includes("mov")) {
                    return (
                      <video width="300" autoPlay controls height="150">
                        <source src={e} type="video/mp4"></source>
                      </video>
                    );
                  } else if (e.includes("https://www.youtube.com")) {
                    return (
                      <iframe
                        width="300"
                        src={`https://www.youtube.com/embed/${e.slice(32)}`}
                        allowFullScreen
                      ></iframe>
                    );
                  } else {
                    return (
                      <img key={i} src={e} width="100" height="100" title={e} />
                    );
                  }
                })}
              </FlexLayout>
            </Card>
          )}
        {/* {Props.match.params.id != undefined &&
            dataIDValue.main_image != undefined &&
            Type === "simpleVariant" && (
              <Card cardType='linkwater' title='Image(s)'>
                <FlexLayout spacing='loose' halign='start'>
                  <img src={dataIDValue.main_image} width='150px' />
                </FlexLayout>
              </Card>
            )} */}
        {/* {Props.match.params.id != undefined && Type === "simple" &&
            <Card cardType="linkwater" title="Image(s)">
              <FlexLayout spacing="loose" halign='start'>
                <img src={dataIDValue.main_image} width="150px" />
              </FlexLayout>
            </Card>
           } */}

        {/* Only for App live we have commented @akash-pandey-CEDCOSS  */}

        {SaveEditDisable && (
          <Card>
            <ImageDrop
              imagetoAddProduct={recieveFromimage}
              imgUpdateReset={setImgUpdate}
              mediaFileAddProduct={receiveMedia}
              imgUpdate={imgUpdate}
              SaveEditDisable={SaveEditDisable}
              mediaImageAddProduct={receiveMediaImage}
            />
          </Card>
        )}

        {Type === "simple" && (
          <Card>
            <Shipping
              shippingToAddProduct={recieveFromShipping}
              Check={Check}
              weight1={weight}
              saveEditDisable={SaveEditDisable}
              unit1={tempunit}
            />
          </Card>
        )}

        {Props.match.params.id == undefined && !variantCheck && (
          <Card>
            <Shipping
              shippingToAddProduct={recieveFromShipping}
              Check={Check}
              saveEditDisable={SaveEditDisable}
              weight1={weight}
              unit1={tempunit}
            />
          </Card>
        )}

        <Card title="Organization">
          <FlexLayout direction="vertical" spacing="loose">
            <TextField
              placeHolder="e.g. Shirts"
              name="Product Type"
              thickness="thin"
              value={productType}
              readOnly={!SaveEditDisable}
              onChange={(e) => {
                setProductType(e);
                setEditArr((prev: any) => ({
                  ...prev,
                  product_type: e,
                }));
              }}
            ></TextField>
            {/* <TextField
                placeHolder='e.g. Nike '
                name='Vendor'
                thickness='thin'
                value={vendorName}
                onChange={(e) => {
                  setVendorName(e);
                  setEditArr((prev: any) => ({
                    ...prev,
                    vendor_name: e
                  }));
                }}
              ></TextField> */}

            {/* Only for APP live */}

            <CategorySelection setTag1={setTag1} Collection={collection} />

            <TextField
              placeHolder="Press Enter to Add Tag"
              name="Tags"
              readOnly={Props.match.params.id !== undefined}
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
                    {Props.match.params.id == undefined && m !== "" ? (
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
                    ) : (
                      m !== "" && (
                        <Badge
                          backgroundColor="rgba(206,206,206,1)"
                          size="small"
                          type="Success"
                        >
                          {m}
                        </Badge>
                      )
                    )}
                  </>
                );
              })}
            </FlexLayout>

            {/* <FlexLayout spacing="loose" wrap="wrap">
              {tagReceived.length != 0 &&
                tagReceived.map((m: any) => {
                  const x = tagReceived.indexOf(m);
                  return (
                    <>
                      <Badge
                        backgroundColor="rgba(206,206,206,1)"
                        destroy={() => {
                          tagReceived.splice(x, 1);
                          const c: Array<string> = [...tagReceived];
                          setTag(c);
                        }}
                        size="small"
                        type="Success"
                      >
                        {m}
                      </Badge>
                    </>
                  );
                })}
            </FlexLayout> */}
          </FlexLayout>
        </Card>

        {Props.match.params.id != undefined && Type == "simple" && (
          <Card>
            <Inventory
              trackQuantity={TrackQuantity}
              continueSales={continueSales}
              saveEditDisable={SaveEditDisable}
              InventoryToAddProduct={recieveFromInventory}
              quantity1={Quantity}
              barcode1={Barcode}
              Sku1={Sku}
            />
          </Card>
        )}

        {Props.match.params.id == undefined && !variantCheck && (
          <Card>
            <Inventory
              trackQuantity={TrackQuantity}
              continueSales={continueSales}
              saveEditDisable={SaveEditDisable}
              InventoryToAddProduct={recieveFromInventory}
              quantity1={Quantity}
              barcode1={Barcode}
              Sku1={Sku}
            />
          </Card>
        )}
        {Props.match.params.id != undefined && Type == "simple" && (
          <Card>
            <Pricing
              PricingToAddProduct={recieveFromPricing}
              Price1={Price}
              saveEditDisable={SaveEditDisable}
              compareAtPrice={CompareAtPrice}
            />
          </Card>
        )}
        {Props.match.params.id == undefined && !variantCheck && (
          <Card>
            <Pricing
              PricingToAddProduct={recieveFromPricing}
              Price1={Price}
              compareAtPrice={CompareAtPrice}
              saveEditDisable={SaveEditDisable}
            />
          </Card>
        )}

        {Props.match.params.id == undefined && (
          <Card>
            <Variants
              currency={currency}
              type={Type}
              variant_check={VariantCheck}
              varientToAddProduct={recieveFromVarient}
              editedVarient={editedVarient}
              editedSell={editedSell}
              arr1={dataIDValue}
              tableLength={tableLength}
              variantArrReset={imgUpdate}
              SetIsVarImageEditFun={SetIsVarImageEditFun}
              saveEditDisable={SaveEditDisable}
              variantsAttributes={varientsAttributes}
              lenarr1={newlenarray}
              variant1={VariantAtt}
              attr1={attrfeild0}
              attr2={attrfeild1}
              attr3={attrfeild2}
              variantData={Details}
            />
          </Card>
        )}

        {Props.match.params.id != undefined &&
          (Type == "variant" ||
            Type == "simpleVariant" ||
            Type === "variant") && (
            <Card>
              <Variants
                currency={currency}
                variant_check={VariantCheck}
                source_marketplace={sourceMarketPlace}
                type={Type}
                varientToAddProduct={recieveFromVarient}
                editedVarient={editedVarient}
                tableLength={tableLength}
                editedSell={editedSell}
                SetIsVarImageEditFun={SetIsVarImageEditFun}
                saveEditDisable={SaveEditDisable}
                arr1={dataIDValue}
                variantsAttributes={varientsAttributes}
                lenarr1={newlenarray}
                variantArrReset={imgUpdate}
                variant1={VariantAtt}
                attr1={attrfeild0}
                attr2={attrfeild1}
                attr3={attrfeild2}
                variantData={Details}
              />
            </Card>
          )}
      </>

      <div className="mt-10">
        <Button
          thickness="thin"
          loading={loading}
          disable={DisbaleButton}
          onClick={() => {
            if (
              variantCheck ||
              Type === "simpleVariant" ||
              Type === "variant"
            ) {
              if (arr && arr?.length > 0) {
                if (Props.match.params.id == undefined) {
                  if (dataTitle.trim() != "") {
                    if (
                      Details.variants.some(
                        (element: any) =>
                          element.quantity === undefined ||
                          element.quantity === "" ||
                          element.price === ""
                      )
                    ) {
                      let errMsg = "";
                      let isOrAre = 0;
                      const msgObj: any = {
                        Price: Details.variants.some(
                          (element: any) => element.price === ""
                        )
                          ? ""
                          : "Price Data",
                        Quantity: Details.variants.some(
                          (element: any) => element.quantity === ""
                        )
                          ? ""
                          : "Quantity Data",
                      };

                      Object.keys(msgObj).forEach((val: any) => {
                        if (msgObj[val] === "") {
                          isOrAre++;
                          errMsg = `${errMsg} ${
                            isOrAre === 1 ? "" : ","
                          } ${val}`;
                        }
                      });
                      setErrToast(true), setMessage(`${errMsg} is required`);
                    } else {
                      //Save Data
                      AddPro();
                    }
                  } else {
                    if (
                      Details.variants.some(
                        (element: any) =>
                          element.quantity === undefined ||
                          element.quantity === "" ||
                          element.price === ""
                      )
                    ) {
                      let errMsg = "";
                      let isOrAre = 0;
                      const msgObj: any = {
                        Title: "",
                        Price: Details.variants.some(
                          (element: any) => element.price === ""
                        )
                          ? ""
                          : "Price Data",
                        Quantity: Details.variants.some(
                          (element: any) => element.quantity === ""
                        )
                          ? ""
                          : "Quantity Data",
                      };

                      Object.keys(msgObj).forEach((val: any) => {
                        if (msgObj[val] === "") {
                          isOrAre++;
                          errMsg = `${errMsg} ${
                            isOrAre === 1 ? "" : ","
                          } ${val}`;
                        }
                      });
                      setErrToast(true), setMessage(`${errMsg} is required`);
                    } else {
                      setErrToast(true), setMessage(`Title is required`);
                    }
                  }
                } else {
                  if (dataTitle.trim() != "") {
                    if (
                      editVariant.some(
                        (element: any) =>
                          element.quantity === "" || element.price === ""
                      )
                    ) {
                      let errMsg = "";
                      let isOrAre = 0;
                      const msgObj: any = {
                        Price: editVariant.some(
                          (element: any) => element.price === ""
                        )
                          ? ""
                          : "Price Data",
                        Quantity: editVariant.some(
                          (element: any) => element.quantity === ""
                        )
                          ? ""
                          : "Quantity Data",
                      };

                      Object.keys(msgObj).forEach((val: any) => {
                        if (msgObj[val] === "") {
                          isOrAre++;
                          errMsg = `${errMsg} ${
                            isOrAre === 1 ? "" : ","
                          } ${val}`;
                        }
                      });
                      setErrToast(true), setMessage(`${errMsg} is required`);
                    } else {
                      //Save Edit  Data
                      EditSave();
                    }
                  } else {
                    if (
                      editVariant.some(
                        (element: any) =>
                          element.quantity === "" || element.price === ""
                      )
                    ) {
                      let errMsg = "";
                      let isOrAre = 0;
                      const msgObj: any = {
                        Title: "",
                        Price: editVariant.some(
                          (element: any) => element.price === ""
                        )
                          ? ""
                          : "Price Data",
                        Quantity: editVariant.some(
                          (element: any) => element.quantity === ""
                        )
                          ? ""
                          : "Quantity Data",
                      };

                      Object.keys(msgObj).forEach((val: any) => {
                        if (msgObj[val] === "") {
                          isOrAre++;
                          errMsg = `${errMsg} ${
                            isOrAre === 1 ? "" : ","
                          } ${val}`;
                        }
                      });
                      setErrToast(true), setMessage(`${errMsg} is required`);
                    } else {
                      setErrToast(true), setMessage(`Title  is required`);
                    }
                  }
                }
              } else {
                if (dataTitle.trim() === "") {
                  setMessage("Title and  variants fields required ");
                  setErrToast(true);
                  return;
                }
                setMessage("Please create variants first");
                setErrToast(true);
              }
            } else {
              Props.match.params.id == undefined
                ? dataTitle.trim() != "" &&
                  Price !== 0 &&
                  Price !== "" &&
                  Quantity !== ""
                  ? AddPro()
                  : setToastPrice(true)
                : dataTitle.trim() != "" &&
                  Price !== 0 &&
                  Price !== "" &&
                  Quantity !== ""
                ? EditSave()
                : setToastPrice(true);
            }
          }}
        >
          Save
        </Button>
      </div>

      <ToastWrapper>
        {toastPrice && (
          <Toast
            type="error"
            message={
              dataTitle.trim() === "" &&
              Quantity === "" &&
              (Price === 0 || Price == "")
                ? "Title , Price and Quantity are required."
                : dataTitle.trim() === "" && Quantity === ""
                ? "Title and Quantity are required."
                : (Price === 0 || Price == "") && Quantity === ""
                ? "Price and Quantity are required."
                : dataTitle.trim() === "" && (Price === 0 || Price == "")
                ? "Title and Price are required."
                : Quantity === ""
                ? "Quantity is required."
                : Price === 0 || Price == ""
                ? "Price is required."
                : dataTitle.trim() === ""
                ? "Title is required."
                : null
            }
            timeout={10000}
            onDismiss={() => {
              setToastPrice(!toastPrice);
            }}
          />
        )}
        {toast && (
          <Toast
            message={msg}
            type="success"
            timeout={3000}
            onDismiss={() => setToast(!toast)}
          />
        )}
        {ErrToast && (
          <Toast
            message={msg}
            type="error"
            timeout={3000}
            onDismiss={() => setErrToast(!ErrToast)}
          />
        )}
      </ToastWrapper>
    </div>
  );
}

export default DI(AddProducts);
