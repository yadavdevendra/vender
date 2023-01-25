import React, { Component } from "react";
import {
  Badge,
  BodyLayout,
  Button,
  Card,
  FlexLayout,
  Select,
  TextField,
  BodyHeader,
  PageLoader
} from "@cedcommerce/ounce-ui";
import "@cedcommerce/ounce-ui/dist/index.css";
import DataTable from "./DataTable";
import update from "./function";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      searchGoogle: "",
      loadingPage: true,
      searchOther: "",
      next_level: "",
      google: [],
      next_levelGoogle: "",
      levelgoogle: {},
      next: {},
      lastKeyGoogle: "",
      lastKeyOther: "",
      value: {},
      valueOther: {},
      selectedMarketplace: "Ebay_US"
    };
  }

  get = (url) => {
    this.setState({ loadingPage: true });
    return fetch(`http://192.168.0.222/ebay/home/public/connector/` + url, {
      method: "get",
      headers: {
        Authorization:
          "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMiIsInJvbGUiOiJhZG1pbiIsImV4cCI6MTY0MzU0MDg4OCwiaXNzIjoiaHR0cHM6XC9cL2FwcHMuY2VkY29tbWVyY2UuY29tIiwiYXVkIjoiMTI3LjAuMC4xIiwidG9rZW5faWQiOjE2MTIwMDQ4ODh9.ZXKtyIxaT9eliUpKmluIenZnNI1A8dishJ5pLavOROhwJAfGKODuFN81-xVJBBO46HljmsHc1fmWp7wt6IKlBikKPigQrfOswZ245QlURYK20iJQvyrGJJ0tv2x8n0YSxEBfFiSfhtry21JyueInJ_SipiXfUjXdm0g21DA5gtv7Z9KkTP4eDqY4vX1fmn3BXZvs0efQuUWK5swVP2wEsxPJU9LoOshwkqP7qd7HgbF3WWxSySnUyTqgdwPdHeId2A-gk86rbZNt-Z9V4hakDBnTmTmjcJqIS2J45U2tj0Fpd9ik5i6b0FPA591DsYZalAZIuRuWEZCL01ta1Mi_Wg"
      }
    }).then((res) => {
      this.setState({ loadingPage: false });
      return res.json();
    });
  };

  searchcategory(e) {
    if (Object.keys(this.state.data).length > 1) {
      this.setState({ loadingPage: true });
      this.get(
        `profile/searchCategory?filters[marketplace]=cedcommerce&filters[name]=${e}`
      ).then((data) => {
        this.setState({ searchGoogleData: data.data, loadingPage: false });
      });
    } else {
      alert("please choose one marketplace category");
    }
  }
  componentDidMount() {
    /**
     * this api fetch root category
     */
    this.fetch();
  }
  async fetch() {
    await this.get(
      "profile/getRootCategory?marketplace=" + this.state.selectedMarketplace
    ).then((e) => {
      if (e.success) {
        let a = {};
        e.data.forEach((item) => {
          a[item.level] = e.data;
        });

        this.setState({
          previousOther: a,
          next_level: e.data[0].next_level,
          data: a
        });
        this.setState({ loadingPage: false });
      } else {
        console.error(e);
      }
    });
    this.get("profile/getRootCategory?marketplace=cedcommerce").then((e) => {
      let a = {};
      e.data.forEach((item) => {
        a[item.level] = e.data;
      });

      this.setState({
        previousGoogle: a,
        next_levelGoogle: e.data[0].next_level,

        google: a
      });
    });
  }
  options(marketplace) {
    /**this function creates options for the select tag */
    if (this.state.google[0] != undefined && this.state.data[0] != undefined) {
      let options1 = [];
      if (marketplace == "google") {
        let a = this.state.google[0];
        for (let i = 0; i < a.length; i++) {
          options1.push({
            label: a[i].custom_category_path,
            value: a[i].next_level
          });
        }
        return options1;
      } else {
        let a = this.state.data[0];
        for (let i = 0; i < a.length; i++) {
          options1.push({
            label: a[i].custom_category_path,
            value: a[i].next_level
          });
        }
        return options1;
      }
    }
  }

  onSubmit() {
    let mapping = {};
    let finalData = {};
    let a = Object.keys(this.state.google)[
      Object.keys(this.state.google).length - 2
    ];
    let b = Object.keys(this.state.google)[
      Object.keys(this.state.google).length - 1
    ];
    let aOther = Object.keys(this.state.data)[
      Object.keys(this.state.data).length - 2
    ];
    let bOther = Object.keys(this.state.data)[
      Object.keys(this.state.data).length - 1
    ];
    if (Object.keys(this.state.google).length > 1) {
      this.state.google[a].forEach((temp) => {
        if (temp.next_level["$oid"] == this.state.lastKeyGoogle) {
          finalData = temp;
        } else if (temp.next_level == this.state.lastKeyGoogle) {
          finalData = temp;
        }
        this.state.google[b].forEach((temp) => {
          if (temp.next_level["$oid"] == this.state.lastKeyGoogle) {
            finalData = temp;
          }
        });
      });

      if (Object.keys(this.state.data).length > 1) {
        this.state.data[aOther].forEach((temp) => {
          if (temp.next_level["$oid"] == this.state.lastKeyOther) {
            mapping["Ebay_US"] = temp.marketplace_id;
          } else if (temp.next_level == this.state.lastKeyOther) {
            mapping["Ebay_US"] = temp.marketplace_id;
          }
          this.state.data[bOther].forEach((temp) => {
            if (temp.next_level["$oid"] == this.state.lastKeyOther) {
              mapping["Ebay_US"] = temp.marketplace_id;
            }
          });
        });
        finalData["mapping"] = mapping;
        delete finalData["custom_category_path"];
        delete finalData["parent_id"];
        delete finalData["is_child"];
        delete finalData["next_level"];
        finalData = [finalData];
        update(finalData);
        this.setState(
          {
            data: [],
            searchGoogle: "",
            searchOther: "",
            next_level: "",
            google: [],
            next_levelGoogle: "",
            levelgoogle: {},
            next: {},
            lastKeyGoogle: "",
            lastKeyOther: "",
            value: {},
            valueOther: {}
          },
          () => {
            this.fetch();
          }
        );
      } else alert("plese select one category");
    } else alert("plese select atleast one cedcommerce category");
  }

  handleChange(e, marketplace) {
    this.setState({ loadingPage: true });
    let delLevel = 0;
    let delLevelOther = 0;
    if (marketplace == "google") {
      this.setState({ lastKeyGoogle: e });
    } else {
      this.setState({ lastKeyOther: e });
    }
    if (marketplace == "google") {
      Object.keys(this.state.google).map((a) => {
        this.state.google[a].forEach((m) => {
          if (m.next_level.$oid == undefined) {
            if (e == m.next_level) {
              delLevel = m.level;
            }
          } else {
            if (e == m.next_level.$oid) {
              delLevel = m.level;
            }
          }
        });
      });

      let obj1 = Object.keys(this.state.google);
      let abc1 = { ...this.state.google };
      let xyz1 = { ...this.state.value };

      for (let i = delLevel + 1; i <= obj1.length; i++) {
        delete abc1[i];
        delete xyz1[i];
      }
      this.setState({
        google: abc1,
        value: xyz1
      });
    } else {
      Object.keys(this.state.data).map((a) => {
        this.state.data[a].forEach((m) => {
          if (m.next_level.$oid == undefined) {
            if (e == m.next_level) {
              delLevelOther = m.level;
            }
          } else {
            if (e == m.next_level.$oid) {
              delLevelOther = m.level;
            }
          }
        });
      });

      let obj2 = Object.keys(this.state.data);
      let abc2 = { ...this.state.data };
      let xyz2 = { ...this.state.valueOther };

      for (let i = delLevelOther + 1; i <= obj2.length; i++) {
        delete abc2[i];
        delete xyz2[i];
      }
      this.setState({
        data: abc2,
        valueOther: xyz2
      });
    }

    this.get(`profile/getCatrgoryNextLevel?next_level=${e}`).then((data1) => {
      let a = {};
      data1.data.forEach((item) => {
        a[item.level] = [...data1.data];
      });
      if (marketplace === "google") {
        this.setState((preState) => {
          preState.loadingPage = false;
          preState.previousGoogle = this.state.google;
          preState.google = { ...preState.previousGoogle, ...a };
          return preState;
        });
      } else {
        this.setState({
          previousOther: this.state.data,
          loadingPage: false,

          data: { ...this.state.data, ...a }
        });
      }
    });
  }

  renderMarketplaceCategory = () => {
    return (
      <Card>
        <BodyHeader title={"Marketplace category"} />{" "}
        <Select
          onChange={(e) => {
            this.setState({ next_level: e }, () =>
              this.handleChange(e, "other")
            );
          }}
          placeholder='Choose'
          options={this.options("other")}
          value={this.state.next_level}
        />{" "}
        {Object.keys(this.state.data).map((a, p) => {
          var options1 = [];
          if (a != 0) {
            for (var i = 0; i < this.state.data[a].length; i++) {
              options1.push({
                label: this.state.data[a][i].name,
                value: this.state.data[a][i].next_level.$oid
              });
            }

            return (
              <Select
                key={p}
                placeholder='Choose'
                value={this.state.valueOther[a]}
                options={options1}
                onChange={(e) => {
                  let val = { ...this.state.valueOther };
                  val[a] = e;
                  this.setState(
                    {
                      valueOther: val
                    },
                    () => this.handleChange(e, "other")
                  );
                }}
              />
            );
          }
        })}{" "}
      </Card>
    );
  };

  renderCedcommerceCategory = () => {
    return (
      <Card>
        <BodyHeader title={"CedCommerce category"} />{" "}
        <Select
          onChange={(e) => {
            this.handleChange(e, "google");
            this.setState({ next_levelGoogle: e });
          }}
          placeholder='Choose'
          options={this.options("google")}
          value={this.state.next_levelGoogle}
        />{" "}
        {Object.keys(this.state.google).map((a, i) => {
          var options1 = [];

          if (a != 0) {
            for (var i = 0; i < this.state.google[a].length; i++) {
              options1.push({
                label: this.state.google[a][i].name,
                value: this.state.google[a][i].next_level.$oid
              });
            }
            return (
              <Select
                key={i}
                value={this.state.value[a]}
                placeholder='Choose'
                options={options1}
                onChange={(e) => {
                  let val = { ...this.state.value };
                  val[a] = e;
                  this.setState(
                    {
                      value: val
                    },
                    () => this.handleChange(e, "google")
                  );
                }}
              />
            );
          }
        })}{" "}
      </Card>
    );
  };

  renderSearch = () => {
    return (
      <>
        <span
          onKeyPress={(a) => {
            if (a.key === "Enter") {
              if (this.state.searchGoogle.length > 3) {
                this.searchcategory(this.state.searchGoogle);
              } else {
                alert("please enter more appropriate value");
              }
            }
          }}
        >
          <TextField
            value={this.state.searchGoogle}
            onChange={(a) => this.setState({ searchGoogle: a })}
            placeHolder='Search Your category Here'
          />
        </span>{" "}
        {this.state.searchGoogleData && this.state.previousOther && (
          <DataTable
            lastKey={this.state.lastKeyOther}
            previous={this.state.previousOther}
            dataGoogle={this.state.searchGoogleData}
            fetch={this.fetch.bind(this)}
          />
        )}{" "}
      </>
    );
  };

  render() {
    return (
      <>
        {" "}
        {this.state.loadingPage && <PageLoader />}{" "}
        <Card
          primaryAction={{
            content: "Submit",
            onClick: () => {
              this.onSubmit();
            }
          }}
        >
          <FlexLayout childWidth='fullWidth'>
            {" "}
            {this.renderMarketplaceCategory()}{" "}
            {this.renderCedcommerceCategory()}
          </FlexLayout>{" "}
        </Card>{" "}
        <Card>
          <BodyHeader title={"Search"} /> {this.renderSearch()}{" "}
        </Card>
      </>
    );
  }
}
