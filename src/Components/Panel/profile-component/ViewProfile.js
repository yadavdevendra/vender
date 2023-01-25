import React from "react";
import Base from "../../../../core/base";
import {
  Button,
  Card,
  CheckBox,
  Filter,
  FlexLayout,
  FormChild,
  Popover,
  PageHeader,
  Select,
  LRLayout,
  TextField,
  TextStyles,
  Skeleton,
  FormElement,
  CardHelp,
  spread,
} from "@cedcommerce/ounce-ui";
import Grid from "../Grid";

class ViewProfile extends Base {
  constructor(props) {
    super(props);
    this.state = {
      profile_name: "",
      query: "",
      source: "",
      target: "",
      category: "",
      attributeMapped: "",
      facebookWarehouse: "",
      shopifyWarehouse: "",
      products: "",
      products_count: 0,
      searchText: "",
      more_filters: [],
      product_type: "",
      quantity_filter: "",
      source_id_filter: "",
      columns: {
        image: {
          name: "Image",
          type: "node",
          visible: true,
          filter: true,
          width: "70px",
        },
        id: {
          name: "ID",
          type: "node",
          visible: true,
          filter: true,
          width: "100px",
        },
        name: {
          name: "Name",
          type: "node",
          visible: true,
          filter: true,
          width: "150px",
        },
        items: {
          name: "Items",
          type: "node",
          visible: true,
          filter: true,
          width: "50px",
        },
        source: {
          name: "Source",
          type: "node",
          visible: true,
          filter: true,
          width: "50px",
        },
        sku: {
          name: "Sku",
          type: "node",
          visible: true,
          filter: true,
          width: "50px",
        },
        price: {
          name: "Price",
          type: "node",
          visible: true,
          filter: true,
          width: "50px",
        },
        action: { name: "", type: "node", visible: true },
      },
      rows: [
        {
          image: <Skeleton />,
          id: <Skeleton />,
          name: <Skeleton />,
          items: <Skeleton />,
          source: <Skeleton />,
          sku: <Skeleton />,
          price: <Skeleton />,
          action: "",
        },
        {
          image: <Skeleton />,
          id: <Skeleton />,
          name: <Skeleton />,
          items: <Skeleton />,
          source: <Skeleton />,
          sku: <Skeleton />,
          price: <Skeleton />,
          action: "",
        },
        {
          image: <Skeleton />,
          id: <Skeleton />,
          name: <Skeleton />,
          items: <Skeleton />,
          source: <Skeleton />,
          sku: <Skeleton />,
          price: <Skeleton />,
          action: "",
        },
        {
          image: <Skeleton />,
          id: <Skeleton />,
          name: <Skeleton />,
          items: <Skeleton />,
          source: <Skeleton />,
          sku: <Skeleton />,
          price: <Skeleton />,
          action: "",
        },
      ],
      selectedArray: [],
    };
    this.getProfileByID();
    this.getWarehouse();
  }

  getProfileByID() {
    this.requests
      .postRequest("connector/profile/getProfile", {
        activePage: 1,
        count: 20,
        id: this.props.match.params.id,
      })
      .then((e) => {
        if (e.success) {
          this.setState({
            profile_name: e.data.name,
            query: e.data.query,
            source: e.data.source,
            target: e.data.target,
            category: e.data.targetCategory,
            attributeMapped: e.data.attributeMapped,
            products: e.data.products_data,
            products_count: e.data.products_data_count,
          });
          this.getProductRows();
        }
      });
  }

  getProductRows() {
    this.state.rows = [];
    Object.keys(this.state.products).map((e) => {
      console.log(
        e,
        this.state.products[e].variants.source_variant_id,
        this.state.products[e].variants.name,
        this.state.products[e].variants.quantity,
        this.state.products[e].variants.variant_image,
        this.state.products[e].variants.sku,
        this.state.products[e].variants.source_marketplace,
        this.state.products[e].variants.price
      );
      this.state.rows.push({
        image: (
          <img
            src={
              this.state.products[e].variants.variant_image ??
              this.state.products[e].variants.main_image
            }
            width={"25px"}
          />
        ),
        id: this.state.products[e].variants.source_variant_id,
        name: this.state.products[e].variants.name,
        items: this.state.products[e].variants.quantity,
        source:
          this.state.products[e].variants.source_marketplace ??
          this.state.products[e].source_marketplace,
        sku: this.state.products[e].variants.sku,
        price: this.state.products[e].variants.price,
        action: "",
      });
    });
    this.setState({ rows: this.state.rows });
  }

  redirect(path) {
    this.props.history.push(path);
  }
  checkHandleChange(fb_value, sp_value, flag, manual = false) {
    // console.log(fb_value, sp_value, flag, manual);

    let { shopifyWarehouse } = this.state;
    // console.log(this.child.current);
    // console.log(fb_value);
    // console.log(sp_value)
    // console.log(flag)
    // console.log(shopifyWarehouse)
    Object.keys(shopifyWarehouse).forEach((e) => {
      if (shopifyWarehouse[e].value == sp_value && flag) {
        shopifyWarehouse[e]["fbLocation"][fb_value] = true;
      } else if (shopifyWarehouse[e].value == sp_value && !flag) {
        shopifyWarehouse[e]["fbLocation"] = {};
      }
    });

    if (manual) {
      this.setState({
        shopifyWarehouse: shopifyWarehouse,
        default_profile_updated: true,
        saveVisible: true,
      });
    } else {
      this.setState({ shopifyWarehouse: shopifyWarehouse, saveVisible: true });
    }
  }

  getWarehouse = () => {
    this.requests.getRequest("facebookhome/request/getWareHouses").then((e) => {
      if (e.success) {
        if (
          Object.keys(e.data.facebook).length > 0 &&
          Object.keys(e.data.shopify).length > 0
        ) {
          let FB, SP;
          FB = Object.values(e.data.facebook)
            .filter((fb) => fb.id && fb.merchant_page.name)
            .map((fb) => {
              if (
                !fb.product_catalogs ||
                !fb.product_catalogs[0] ||
                !fb.product_catalogs[0]["id"]
              ) {
                fb["product_catalogs"] = [{ id: "UNKNOWN" }];
              }
              return {
                label: fb.merchant_page.name,
                page_id: fb.merchant_page.id,
                cms_id: fb.id,
                catalog_id: fb.product_catalogs[0]["id"],
                value: fb._id.toString(),
              };
            });
          SP = Object.values(e.data.shopify)
            .filter((shopify) => shopify.id && shopify.name)
            .map((shopify) => {
              return {
                label: shopify.name,
                value: shopify._id.toString(),
                fbLocation: {},
              };
            });
          let checkOption = Object.values(e.data.shopify)
            .filter((shopify) => shopify.id && shopify.name)
            .map((shopify) => {
              return { label: shopify.name, value: shopify._id.toString() };
            });
          // SP.unshift({label: "--BLANK--", value: "blank"});
          this.setState({
            facebookWarehouse: FB,
            shopifyWarehouse: SP,
          });
        } else {
          this.setState({
            error: { status: true, message: "Failed to fetch valid locations" },
          });
        }
      } else {
        this.setState({
          error: {
            status: true,
            message: e.message
              ? e.message
              : "Failed to get response from server!!",
          },
        });
      }
    });
  };

  render() {
    let {
      shopifyWarehouse,
      facebookWarehouse,
      columns,
      rows,
      source_id_filter,
      quantity_filter,
      selectedArray,
    } = this.state;
    return (
      <>
        {super.render()}
        <PageHeader>View Profile</PageHeader>
        <Card>
          <LRLayout title="Profile Details">
            <FormChild>
              <FlexLayout
                desktopWidth={"50"}
                tabWidth={"50"}
                mobileWidth={"50"}
                halign={"fill"}
                childWidth={"fullWidth"}
              >
                <FlexLayout direction={"vertical"} spacing={"loose"}>
                  <FlexLayout direction={"vertical"} spacing={"loose"}>
                    <TextStyles children={"Profile Name"} />
                    <TextStyles
                      textcolor={"light"}
                      type={"SubHeading"}
                      children={this.state.profile_name}
                    />
                  </FlexLayout>
                  <FlexLayout direction={"vertical"} spacing={"loose"}>
                    <TextStyles children={"Target"} />
                    <TextStyles
                      textcolor={"light"}
                      type={"SubHeading"}
                      children={this.state.target}
                    />
                  </FlexLayout>
                  <FlexLayout direction={"vertical"} spacing={"loose"}>
                    <TextStyles children={"Query"} />
                    <TextStyles
                      textcolor={"light"}
                      type={"SubHeading"}
                      children={this.state.query}
                    />
                  </FlexLayout>
                </FlexLayout>
                <FlexLayout
                  direction={"vertical"}
                  spacing={"loose"}
                  halign={"end"}
                >
                  <FlexLayout direction={"vertical"} spacing={"loose"}>
                    <TextStyles children={"Source"} />
                    <TextStyles
                      textcolor={"light"}
                      type={"SubHeading"}
                      children={this.state.source}
                    />
                  </FlexLayout>
                  <FlexLayout direction={"vertical"} spacing={"loose"}>
                    <TextStyles children={"Category"} />
                    <TextStyles
                      textcolor={"light"}
                      type={"SubHeading"}
                      children={this.state.category}
                    />
                  </FlexLayout>
                </FlexLayout>
              </FlexLayout>
            </FormChild>
          </LRLayout>
          <LRLayout title="Attribute Mapped">
            {this.state.attributeMapped && (
              <FlexLayout spacing={"extraLoose"}>
                {Object.keys(this.state.attributeMapped).map((e) => {
                  return (
                    <Card cardType={"linkwater"}>
                      <TextStyles
                        type="HeadingMedium"
                        children={e}
                        utility="mb-10"
                      />
                      {this.state.attributeMapped[e].value}
                    </Card>
                  );
                })}
              </FlexLayout>
            )}
          </LRLayout>
          <LRLayout title="Warehouse Mapped">
            <FlexLayout fill="fullWidth" spacing="extraLoose" halign="start">
              <div>
                <FlexLayout halign={"fill"} spacing={"extraLoose"}>
                  <FlexLayout direction={"vertical"} spacing={"loose"}>
                    <TextStyles>Page Name</TextStyles>
                    <TextStyles type="neutralText" utility="mb-10">
                      {facebookWarehouse[0]
                        ? facebookWarehouse[0]["label"]
                        : "Please wait.."}
                    </TextStyles>
                  </FlexLayout>
                  <FormElement>
                    {Object.values(shopifyWarehouse).map((val) => {
                      return (
                        <CheckBox
                          checked={/*Object.values(val['fbLocation'])[0]*/ true}
                          labelVal={val["label"]}
                          onClick={this.checkHandleChange.bind(
                            this,
                            facebookWarehouse[0]["value"],
                            val["value"],
                            !Object.values(val["fbLocation"])[0],
                            true
                          )}
                        />
                      );
                    })}
                    {/*<Button>Update warehouse</Button>*/}
                  </FormElement>
                </FlexLayout>
              </div>
            </FlexLayout>
          </LRLayout>
          <CardHelp
            helpText={
              <Button
                halign={"End"}
                onAction={() => {
                  this.redirect(
                    "/panel/editProfile/" + this.props.match.params.id
                  );
                }}
              >
                Edit Profile
              </Button>
            }
          />
        </Card>
        <br />
        <TextStyles type={"HeadingMedium"} children={"Product Data"} />
        <Card cardType={"linkwater"}>
          <FlexLayout spacing={"loose"}>
            <TextField
              thickness={"thin"}
              value={this.state.searchText}
              onChange={(e) => {
                this.setState({ searchText: e });
              }}
            />
            <Filter
              disableReset={false}
              filters={[
                {
                  name: "Quantity",
                  children: (
                    <TextField
                      type={"Number"}
                      value={quantity_filter}
                      showHelp={
                        "Enter the quantity of products, only numeric values are accepted"
                      }
                      onChange={(e) => {
                        if (Number.isInteger(parseInt(e))) {
                          this.setState({ quantity_filter: e });
                        } else {
                          alert("Enter only numeric value");
                        }
                      }}
                      onEnter={() => {
                        console.log(quantity_filter);
                      }}
                    />
                  ),
                },
                {
                  name: " ID",
                  children: (
                    <TextField
                      type={"Number"}
                      showHelp={
                        "Enter the Source ID of products, only numeric values are accepted"
                      }
                      onChange={(e) => {
                        if (Number.isInteger(parseInt(e))) {
                          this.setState({ source_id_filter: e });
                        } else {
                          alert("Enter only numeric value");
                        }
                      }}
                      value={source_id_filter}
                      onEnter={() => {
                        console.log(source_id_filter);
                      }}
                    />
                  ),
                },
                // {
                //     name : "Checkbox Filter",
                //     children :  <FlexLayout spacing="loose">
                //         <CheckBox labelVal="Finished"/>
                //         <CheckBox labelVal="Warning"/>
                //         <CheckBox labelVal="Error"/>
                //         <CheckBox labelVal="Pending"/>
                //     </FlexLayout>
                // },
              ]}
              label={"More Filters"}
              heading={"Filters"}
              onApply={() => {
                // console.log(source_id_filter,quantity_filter,product_type);
              }}
            />
          </FlexLayout>
          <br />
          <FlexLayout spacing={"extraLoose"}>
            <CheckBox
              labelVal="Sku"
              checked={this.state.columns["sku"].visible}
              onClick={() => {
                this.state.columns["sku"].visible =
                  !this.state.columns["sku"].visible;
                this.setState({ columns: this.state.columns });
              }}
            />
            <CheckBox
              labelVal="ID"
              checked={this.state.columns["id"].visible}
              onClick={() => {
                this.state.columns["id"].visible =
                  !this.state.columns["id"].visible;
                this.setState({ columns: this.state.columns });
              }}
            />
            <CheckBox
              labelVal="Price"
              checked={this.state.columns["price"].visible}
              onClick={() => {
                this.state.columns["price"].visible =
                  !this.state.columns["price"].visible;
                this.setState({ columns: this.state.columns });
              }}
            />
          </FlexLayout>
          {/*<Filter />*/}
        </Card>
        {/*<Button onAction={()=>{*/}
        {/*this.requests.postRequest('facebookhome/request/test5').then(e=>console.log(e))*/}
        {/*}*/}
        {/*}>test</Button>*/}
        <Grid
          columns={columns}
          rows={rows}
          Accordiankey={"action"}
          enableSelect={true}
          selectedArray={selectedArray}
          onRowSelect={(row) => {
            selectedArray.includes(row)
              ? selectedArray.splice(selectedArray.indexOf(row), 1)
              : selectedArray.push(row);
            this.setState({ selectedArray: selectedArray });
            console.log(this.state.selectedArray);
          }}
          onAllRowSelect={() => {
            let tempArr = [];
            if (this.state.selectedArray.length !== this.state.rows.length) {
              this.state.rows.forEach((row) => {
                tempArr.push(row);
              });
            }
            this.setState({ selectedArray: tempArr });
          }}
        />
      </>
    );
  }
}
export default ViewProfile;
