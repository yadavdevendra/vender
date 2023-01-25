import React from 'react';
import Base from "../../../../core/base";
import {
    Button,
    Card,
    CheckBox,
    Dots,
    FlexLayout,
    FormChild,
    LRLayout,
    PageHeader,
    Select,
    TextField,
    TextStyles,
    Skeleton,
    CardHelp
} from "@cedcommerce/ounce-ui";
import { isUndefined } from "util";
import { Attribute } from "../../../../shared/Facebook/Attribute";
import { validateImporter } from "../static-functions";
import QueryBuilder from "./QueryBuilder";

class CreateProfile extends Base {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            profile_name: '',
            queryTypes: [],
            querySelected: [],
            queryConditions: [],
            queryConditionsSelected: 'string',
            queryConditionsValue: '==',
            queryValue: '',
            queryCount: 1,
            basicDetails: {
                source: "",
                target: ""
            },
            collectionSelected: 0,
            collectionOption: [{ label: "Empty", value: 0 }],
            products_select: {
                query: "",
                targetCategory: "",
                warehouse: [],
            },
            shopifyWarehouse: '',
            selectedFacebookCategory: ''
        };
        this.getProfile();
        this.getWarehouse();
        this.getImportServices();
        this.getProductCategories();
        this.getDefaultProfile();
        this.child = React.createRef();
        // this.getQueryTypes();

    }
    getProfile() {
        this.requests.getRequest("connector/profile/get").then(data => {
            if (data.success) {
                if (!isUndefined(data.data.state)) {

                    this.state.profile_name = data.data.name;
                    this.state.basicDetails.source = data.data.source;
                    this.state.basicDetails.target = data.data.target;
                    this.state.basicDetails.sourceShop = data.data.sourceShop;
                    this.state.basicDetails.targetShop = data.data.targetShop;
                    this.state.products_select.targetCategory = data.data.targetCategory;
                    console.log(this.state.basicDetails);
                }
                // console.log(data.data);
            }
        })
    }

    redirect(path) {
        this.props.history.push(path);
    }

    validate(step) {
        switch (step) {
            case 2:
                return this.state.profile_name !== '' && this.state.basicDetails.source !== '';
                break;
            case 3:
                let f = 0;
                Object.values(this.state.shopifyWarehouse).map(val => {
                    if (Object.values(val['fbLocation'])[0]) {
                        f = 1;
                    }
                });
                if (this.state.query === '') {
                    f = 0;
                }
                return f;
                break;
            case 4:
                return true;
                break;
        }
    }

    setStep1Profile() {
        this.requests.postRequest("connector/profile/set/", { data: { name: this.state.profile_name, source: this.state.basicDetails.source, target: "facebook", sourceShop: "", targetShop: "" }, step: 1 }).then(e => {
            if (e.success) {
                this.notify(e.message);
            } else {
                this.notify(e.message, true);
            }
        });
    }

    saveProfileData() {
        let data = Object.assign({},
            this.state.basicDetails,
            this.state.products_select,
        );
        let warehouseData = {};
        let ar = this.child.current.callBackDataToParent2();
        Object.values(this.state.shopifyWarehouse).forEach(values => {
            let tmp = [];

            if (Object.keys(values['fbLocation']).length) {
                tmp = Object.keys(values['fbLocation']);
                warehouseData[values['value']] = tmp;
            }
        });
        data['name'] = this.state.profile_name;
        data['warehouse'] = warehouseData;
        data['attributeMapped'] = ar[0];
        data['fb_cat'] = ar[1];
        data['query'] = this.state.query;
        data['targetCategory'] = this.state.selectedFacebookCategory;
        this.state.buttonLoading = true;

        console.log(data);
        // this.updateState();
        this.requests.postRequest("connector/profile/set", {
                data: data,
                step: 3,
                saveInTable: true
            })
            .then(data => {
                if (data.success) {
                    this.notify("Profile created succesfully");
                    this.redirect("/panel/profiling");
                    this.notify('Step ' + this.state.activeStep + ' completed succesfully.');
                } else {
                    this.notify(data.message, true);
                }
                this.state.buttonLoading = false;
                this.updateState();
            });

    }

    changeStep(step, back = false) {
        if (back) {
            if (step === 2) {
                this.setState({
                    step: step,
                    query: '',
                });
            } else {
                this.setState({
                    step: step
                });
            }
        } else {
            if (this.validate(step)) {
                switch (step) {
                    case 2:
                        this.setStep1Profile();
                        break;
                    case 4:
                        this.saveProfileData()
                }
                if (step !== 4) {
                    this.setState({
                        step: step
                    })
                };
            } else {
                this.notify("Please fill all fields", true);
            }
        }

    }

    getPaymentProvider() {
        let ar = this.props.necessaryInfo.warehouse;
        let pay = "";
        // console.log(ar);
        if (ar) {
            ar.forEach(e => {
                // console.log(e.warehouse.payment_provider);
                pay = e.warehouse.payment_provider;
            });
        }
        return pay
    }

    checkInstagramPlaceStatus(e) {
        let a = false;
        if (!e['instagram_channel'] && e['setup_status'] &&
            e['order_management_apps'] &&
            e['order_management_apps'][0]['name'] === 'CedCommerce' &&
            e['setup_status'][0]['payment_setup'] === 'SETUP' &&
            e['setup_status'][0]['shop_setup'] === 'SETUP') {
            a = true;
        }
        this.getPaymentProvider();
        return a;
    }


    checkFacebookMarketPlaceStatus(data) {
        let status = 'NOT_APPLIED';
        if (data['setup_status'] && data['setup_status'][0] && data['setup_status'][0]['marketplace_approval_status']) {
            status = data['setup_status'][0]['marketplace_approval_status'];
        }
        this.getPaymentProvider();
        return status;
    }

    getWarehouse() {
        this.requests.getRequest('facebookhome/request/getWareHouses').then(e => {
            if (e.success) {
                if (Object.keys(e.data.facebook).length > 0 && Object.keys(e.data.shopify).length > 0) {
                    let FB, SP;
                    FB = Object.values(e.data.facebook)
                        .filter(fb => fb.id && fb.merchant_page.name)
                        .map(fb => {
                            if (!fb.product_catalogs || !fb.product_catalogs[0] || !fb.product_catalogs[0]['id']) {
                                fb['product_catalogs'] = [{ id: "UNKNOWN" }];
                            }
                            return {
                                label: fb.merchant_page.name,
                                page_id: fb.merchant_page.id,
                                cms_id: fb.id,
                                catalog_id: fb.product_catalogs[0]['id'],
                                value: fb._id.toString(),
                                marketPlaceStatus: this.checkFacebookMarketPlaceStatus(fb),
                                instaStatus: this.checkInstagramPlaceStatus(fb),
                            }
                        });
                    SP = Object.values(e.data.shopify)
                        .filter(shopify => shopify.id && shopify.name)
                        .map(shopify => {
                            return { label: shopify.name, value: shopify._id.toString(), fbLocation: {} }
                        });
                    let checkOption = Object.values(e.data.shopify)
                        .filter(shopify => shopify.id && shopify.name)
                        .map(shopify => {
                            return { label: shopify.name, value: shopify._id.toString() }
                        });
                    // SP.unshift({label: "--BLANK--", value: "blank"});
                    this.setState({
                        facebookWarehouse: FB,
                        shopifyWarehouse: SP,

                    }, () => {
                        this.getDefaultProfile();
                    });
                } else {
                    this.setState({ error: { status: true, message: 'Failed to fetch valid locations' } });
                }
            } else {
                this.setState({
                    error: {
                        status: true,
                        message: e.message ? e.message : 'Failed to get response from server!!'
                    }
                });
            }
        })
    };


    checkHandleChange(fb_value, sp_value, flag, manual = false) {
        console.log(fb_value, sp_value, flag, manual);
        let { shopifyWarehouse } = this.state;

        Object.keys(shopifyWarehouse).forEach(e => {
            if (shopifyWarehouse[e].value == sp_value) {
                shopifyWarehouse[e]['fbLocation'][sp_value] = flag;
            }
        });
        console.log(shopifyWarehouse);
        if (manual) {
            this.setState({ shopifyWarehouse: shopifyWarehouse, default_profile_updated: true });
        } else {
            this.setState({ shopifyWarehouse: shopifyWarehouse });
        }

    }

    getDefaultProfile() {
        let profile_default_category;
        this.requests
            .getRequest("shopifyhome/playground/index")
            .then(data => {
                if (data.success) {
                    data.data.forEach(e => {
                        if ('targetCategory' in e) {
                            profile_default_category = e.targetCategory
                        } else if ('source_warehouse_id' in e) {
                            Object.values(e.target_warehouse_ids).forEach(fb => {
                                this.checkHandleChange(fb, e['source_warehouse_id'], true);
                            })
                        }
                    });
                    this.setState({ selectedFacebookCategory: profile_default_category });
                }
            });
    }


    handleProductsSelectChange(categoryIndex, value) {
        this.categoryList[categoryIndex].selected_category = value;
        this.state.products_select.targetCategory = value;
        this.categoryList = this.categoryList.splice(0, categoryIndex + 1);
        console.log(this.categoryList[categoryIndex].categories, value);
        const parentCatgId = this.checkHasChildCategories(
            this.categoryList[categoryIndex].categories,
            value
        );
        console.log(parentCatgId);
        if (parentCatgId) {
            this.getChildCategories(value, parentCatgId);
            this.updateState();
        } else {
            this.updateState();
        }
    }

    updateState() {
        const state = this.state;
        this.setState(state);
    }


    getProductCategories(auto = false) {
        this.requests
            .getRequest("shopifyhome/playground/test", {
                marketplace: "google"
            })
            .then(data => {
                if (data.success) {

                    this.categoryList = [{
                        parent_catg_id: false,
                        selected_category: "",
                        categories: this.addLabelInCategories(data.data)
                    }];

                    let ar = [];
                    Object.values(this.categoryList[0]['categories']).forEach(val => {
                        let obj = { label: val['title'], value: val['path'] };
                        ar.push(obj)
                    });
                } else {
                    this.notify(data.message, false);
                }
            });
    }

    checkHasChildCategories(catgList, parentCatg) {
        for (let i = 0; i < catgList.length; i++) {
            if (catgList[i].value === parentCatg) {
                if (catgList[i].child_exist) {
                    return catgList[i].category_id;
                } else {
                    return false;
                }
            }
        }
        return false;
    }

    getChildCategories(parentCatg, parentCatgId, auto) {
        this.requests
            .getRequest("shopifyhome/playground/test", {
                marketplace: "google",
                category: parentCatg
            })
            .then(data => {
                if (data.success) {
                    this.categoryList.push({
                        parent_catg_id: parentCatgId,
                        selected_category: "",
                        categories: this.addLabelInCategories(data.data)
                    });
                } else {
                    alert(data.message);
                }
                this.updateState();
            });
    }

    addLabelInCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            categories[i]["label"] = categories[i]["code"];
            categories[i]["value"] = categories[i]["code"];
        }
        return categories;
    }

    renderCategoryTree() {
        return ( <
            div > {
                this.categoryList.map(category => {
                    let opt = [];
                    opt = category.categories.map((e) => { return { label: e.label, value: e.value } });
                    console.log(category.selected_category);

                    return ( <
                        div >
                        <
                        Select thickness = { 'thin' }
                        options = { opt }
                        placeholder = "Product Category"
                        onChange = {
                            (e) => {
                                console.log(e, this.categoryList.indexOf(category));

                                this.handleProductsSelectChange(this.categoryList.indexOf(category), e);
                                this.setState({ selectedFacebookCategory: e });
                            }
                        }
                        value = { category.selected_category !== "" ? category.selected_category : opt[0]['value'] }
                        /> <
                        p style = {
                            { color: "green" } } > { category.required ? "*Required" : null } <
                        /p> <
                        /div>
                    );
                })
            } <
            /div>
        );
    }

    importServices = [];

    getImportServices() {

        this.requests.getRequest("connector/get/services", { "filters[type]": "importer" })
            .then(data => {
                if (data.success === true) {

                    let hasService = false;
                    for (let i = 0; i < Object.keys(data.data).length; i++) {
                        let key = Object.keys(data.data)[i];
                        if (data.data[key].usable || !this.environment.isLive) {
                            hasService = true;
                            if (validateImporter(data.data[key].code)) {
                                this.importServices.push({
                                    label: data.data[key].title,
                                    value: data.data[key].marketplace,
                                    // shops: data.data[key].shops
                                });
                            }
                        }
                    }
                }
            })
    }

    getAttributeMappingState(attribute, fb_cat) {
        // console.log(attribute,fb_cat);
        this.setState({ attribute: attribute, fb_cat: fb_cat });
        let sendData = {
            'source': 'shopify',
            'target': 'facebook',
            'attributeMapped': attribute,
            'fb_cat': fb_cat,
        };
        // this.requests.postRequest('facebookhome/request/setWarehousesProfiling', sendData).then(res => {
        //     if (res.success) {
        //         this.notify('Default profile updated successfully');
        //     } else {
        //         this.notify(res.message ? res.message : 'Error : 404 response from server!');
        //     }
        //     this.setState({buttonLoading: false});
        // });


    };

    QueryFormat = (a) => {
        this.setState({ query: a });
    }

    render() {
        var data = '';
        let { step, profile_name, basicDetails, selectedFacebookCategory, shopifyWarehouse, facebookWarehouse } = this.state;
        console.log(selectedFacebookCategory);

        if (step < 4) {
            switch (step) {
                case 1:
                    data = < div >
                        <
                        PageHeader > Create Profile < /PageHeader> <
                        Card cardType = "plain" >
                        <
                        FlexLayout halign = "fill"
                    valign = "center" >
                        <
                        TextStyles type = "mediumText" > STEP 1 / 3 < /TextStyles> <
                        FlexLayout spacing = "loose" >
                        <
                        Dots status = "active" / >
                        <
                        Dots / >
                        <
                        Dots / >
                        <
                        /FlexLayout> <
                        /FlexLayout> <
                        /Card>

                    <
                    Card >
                        <
                        LRLayout title = "Select Product Source" >
                        <
                        FormChild >
                        <
                        TextStyles type = "SubHeading" > Profile Name < /TextStyles> <
                        TextField thickness = { 'thin' }
                    type = "text"
                    value = { profile_name }
                    onChange = {
                        (e) => {
                            this.setState({
                                profile_name: e
                            })
                        }
                    }
                    placeHolder = { "Enter Profile's name" }


                    /> <
                    /FormChild> <
                    FormChild >
                        <
                        TextStyles type = "SubheadingWithIcon"
                    extraClass = "mb-10" > Products Imported From < /TextStyles> <
                        Select
                    thickness = { 'thin' }
                    options = { this.importServices }
                    value = { basicDetails.source }
                    onChange = {
                        (e) => {
                            this.state.basicDetails.source = e;
                            this.setState({
                                basicDetails: this.state.basicDetails
                            })
                        }
                    }

                    /> <
                    /FormChild> <
                    FormChild >
                        <
                        FlexLayout halign = "end" >
                        <
                        Button thickness = { 'thin' }
                    type = "Primary"
                    onAction = {
                            () => { this.changeStep(2) } } > Next < /Button> <
                        /FlexLayout> <
                        /FormChild> <
                        /LRLayout> <
                        /Card> <
                        /div>; break;

                case 2:
                    data = < div >
                        <
                        PageHeader > Create Profile < /PageHeader> <
                        Card cardType = "plain" >
                        <
                        FlexLayout halign = "fill"
                    valign = "center" >
                        <
                        TextStyles type = "mediumText" > STEP 2 / 3 < /TextStyles> <
                        FlexLayout spacing = "loose" >
                        <
                        Dots status = "completed" / >
                        <
                        Dots status = "active" / >
                        <
                        Dots / >
                        <
                        /FlexLayout> <
                        /FlexLayout> <
                        /Card> <
                        Card >
                        <
                        LRLayout title = "Category Mapping" >
                        <
                        FormChild >
                        <
                        TextStyles type = "SubHeading" > Current facebook Category < /TextStyles> <
                        TextStyles type = "neutralText"
                    textcolor = "light"
                    utility = "mt-5" > { selectedFacebookCategory } < /TextStyles> { this.renderCategoryTree() } <
                        /FormChild> <
                        FormChild >
                        <
                        TextStyles type = "mediumHeading" > Prepare Query < /TextStyles> <
                        TextStyles type = { "smallText" }
                    textcolor = { "light" }
                    children = { "Create conditions, by which you can select particular type of products" }
                    /> <
                    br / >
                        <
                        TextStyles type = "neutralText"
                    textcolor = "dark"
                    utility = "mt-5" > Use < b > OR < /b> button, for <i>"Any One"</i > condition to be true < /TextStyles> <
                        TextStyles type = "neutralText"
                    textcolor = "dark"
                    utility = "mb-15" > Use < b > AND < /b> button for <i>"All"</i > conditions to be true < /TextStyles><br / >

                        <
                        QueryBuilder fun = { this.QueryFormat }
                    />

                    <
                    /FormChild> <
                    /LRLayout> <
                    LRLayout title = "Warehouse Mapping" >
                        <
                        FlexLayout halign = "fill"
                    childWidth = "fullWidth"
                    spacing = "loose" >
                        <
                        div >
                        <
                        TextStyles type = "SubHeading" > Name < /TextStyles> <
                        TextStyles type = "neutralText"
                    textcolor = "light"
                    utility = "mt-10" > Cedcommerce Sandbox page < /TextStyles> <
                        /div> <
                        FormChild >
                        <
                        FlexLayout halign = "fill"
                    childWidth = "fullWidth"
                    spacing = "loose"
                    direction = "vertical" >
                        <
                        br / > {
                            Object.values(shopifyWarehouse).map(val => {
                                // console.log(Object.values(val['fbLocation'])[0],val['value'],facebookWarehouse[0]['value']);
                                return <CheckBox checked = { Object.values(val['fbLocation'])[0] }
                                labelVal = { val['label'] }
                                onClick = {
                                    this.checkHandleChange.bind(this,
                                        facebookWarehouse[0]['value'],
                                        val['value'], !Object.values(val['fbLocation'])[0],
                                        true)
                                }
                                />
                            })
                        } <
                        /FlexLayout> <
                        /FormChild> <
                        /FlexLayout>

                    <
                    /LRLayout> <
                    FormChild >
                        <
                        FlexLayout halign = "end"
                    spacing = { 'loose' } >
                        <
                        Button thickness = { 'thin' }
                    type = "Secondary"
                    onAction = {
                            () => { this.changeStep(1, true) } } > Back < /Button> <
                        Button thickness = { 'thin' }
                    type = "Primary"
                    onAction = {
                            () => { this.changeStep(3) } } > Next < /Button> <
                        /FlexLayout> <
                        /FormChild> <
                        /Card> <
                        /div>; break;

                case 3:
                    data = < div >
                        <
                        PageHeader > Create Profile < /PageHeader> <
                        Card cardType = "plain" >
                        <
                        FlexLayout halign = "fill"
                    valign = "center" >
                        <
                        TextStyles type = "mediumText" > STEP 3 / 3 < /TextStyles> <
                        FlexLayout spacing = "loose" >
                        <
                        Dots status = "completed" / >
                        <
                        Dots status = "completed" / >
                        <
                        Dots status = "active" / >
                        <
                        /FlexLayout> <
                        /FlexLayout> <
                        /Card> <
                        FormChild >
                        <
                        FlexLayout halign = "end"
                    spacing = { 'loose' } >
                        <
                        Button thickness = { 'thin' }
                    type = "Secondary"
                    onAction = {
                            () => { this.changeStep(2, true) } } > Back < /Button> <
                        Button thickness = { 'thin' }
                    type = "Primary"
                    onAction = {
                            () => { this.changeStep(4) } } > Next < /Button> <
                        /FlexLayout> <
                        /FormChild> <
                        Card >
                        <
                        Attribute ref = { this.child }
                    category = { selectedFacebookCategory }
                    getAttributeMappingState = { this.getAttributeMappingState.bind(this) }
                    /> <
                    /Card> <
                    /div>; break;

            }
        } else {
            this.redirect('/panel/profiling');
        }

        // let data2 = <div className="inte__Main">
        //         <PageHeader>Create Profile</PageHeader>
        //         <Card cardType="plain">
        //             <FlexLayout halign="fill" valign="center">
        //                 <TextStyles type="mediumText">STEP 1/4</TextStyles>
        //                 <FlexLayout spacing="loose">
        //                     <Dots status="active"></Dots>
        //                     <Dots></Dots>
        //                     <Dots></Dots>
        //                 </FlexLayout>
        //             </FlexLayout>
        //         </Card>
        //
        //         <Card>
        //             <LRLayout title="Select Product Source">
        //                 <FormChild>
        //                     <TextStyles type="SubHeading">Profile Name</TextStyles>
        //                     <TextField type="text"></TextField>
        //                 </FormChild>
        //                 <FormChild>
        //                     <TextStyles type="SubheadingWithIcon" extraClass="mb-10">Products Imported From</TextStyles>
        //                     <Select></Select>
        //                 </FormChild>
        //                 <FormChild>
        //                     <FlexLayout halign="end">
        //                         <Button type="Primary">Next</Button>
        //                     </FlexLayout>
        //                 </FormChild>
        //             </LRLayout>
        //         </Card>
        //         <Card cardType="plain">
        //             <FlexLayout halign="end" valign="center" spacing="loose">
        //                 <Button  type="Danger">Cancel</Button>
        //                 <Button type="Outlined">Update Profile</Button>
        //                 <Button>Save Profile</Button>
        //             </FlexLayout>
        //         </Card>
        //         <Card>
        //             <LRLayout title="Buyer Detail">
        //                 <FormChild>
        //                     <TextStyles type="SubHeading">Name</TextStyles>
        //                     <TextField type="text"></TextField>
        //                 </FormChild>
        //             </LRLayout>
        //             <LRLayout title="Category Mapping">
        //                 <FormChild>
        //                     <TextStyles type="SubHeading">Current facebook Category</TextStyles>
        //                     <TextStyles type="neutralText" textcolor="light" utility="mt-5">Apparel and Accessories</TextStyles>
        //                     <TextField type="text"></TextField>
        //                 </FormChild>
        //                 <FormChild>
        //                     <TextStyles type="SubHeading">Prepared Query</TextStyles>
        //                     <TextStyles type="neutralText" textcolor="light" utility="mt-5">Add rule corresponds to && (AND) condition</TextStyles>
        //                     <TextStyles type="neutralText" textcolor="light" utility="mb-15"> Add rule group corresponds to || (OR) condition</TextStyles>
        //                     <FlexLayout halign="fill" childWidth="fullWidth" spacing="extraLoose">
        //                         <div>
        //                             <TextStyles type="neutralText" utility="mb-10">Attribute</TextStyles>
        //                             <Select></Select>
        //                         </div>
        //                         <div>
        //                             <TextStyles type="neutralText" utility="mb-10">Attribute</TextStyles>
        //                             <Select></Select>
        //                         </div>
        //                         <div>
        //                             <TextStyles type="neutralText" utility="mb-10">Attribute</TextStyles>
        //                             <Select></Select>
        //                         </div>
        //                     </FlexLayout>
        //                 </FormChild>
        //                 <FormChild>
        //                     <FlexLayout spacing="loose">
        //                         <Button type="Outlined">Add Rule</Button>
        //                         <Button>Add Rule Group</Button>
        //                     </FlexLayout>
        //                 </FormChild>
        //             </LRLayout>
        //
        //             <LRLayout title="Buyer Details">
        //                 <FlexLayout halign="fill" childWidth="fullWidth" spacing="loose">
        //                     <div className="mb-20">
        //                         <TextStyles type="SubHeading">Name</TextStyles>
        //                         <TextStyles type="neutralText" textcolor="light" utility="mt-10">Akshay</TextStyles>
        //                     </div>
        //                     <div className="mb-20">
        //                         <TextStyles type="SubHeading">Source</TextStyles>
        //                         <TextStyles type="neutralText" textcolor="light" utility="mt-10">Shopify</TextStyles>
        //                     </div>
        //                 </FlexLayout>
        //                 <FlexLayout halign="fill" childWidth="fullWidth" spacing="loose">
        //                     <div className="mb-20">
        //                         <TextStyles type="SubHeading">Name</TextStyles>
        //                         <TextStyles type="neutralText" textcolor="light" utility="mt-10">Akshay</TextStyles>
        //                     </div>
        //                     <div className="mb-20">
        //                         <TextStyles type="SubHeading">Source</TextStyles>
        //                         <TextStyles type="neutralText" textcolor="light" utility="mt-10">Shopify</TextStyles>
        //                     </div>
        //                 </FlexLayout>
        //                 <FlexLayout halign="fill" childWidth="fullWidth" spacing="loose">
        //                     <div className="mb-20">
        //                         <TextStyles type="SubHeading">Name</TextStyles>
        //                         <TextStyles type="neutralText" textcolor="light" utility="mt-10">Akshay</TextStyles>
        //                     </div>
        //                 </FlexLayout>
        //             </LRLayout>
        //
        //             <LRLayout title="Attribute Mapping">
        //                 <FormChild>
        //                     <FlexLayout halign="fill" childWidth="fullWidth" spacing="loose">
        //                         <Card cardType="linkwater">
        //                             <TextStyles type="mediumText">Agegroup</TextStyles>
        //                             <TextStyles type="neutralText" textcolor="light" utility="mt-10">Kids</TextStyles>
        //                         </Card>
        //                         <Card cardType="linkwater">
        //                             <TextStyles type="mediumText">Brand</TextStyles>
        //                             <TextStyles type="neutralText" textcolor="light" utility="mt-10">Custom</TextStyles>
        //                         </Card>
        //                         <Card cardType="linkwater">
        //                             <TextStyles type="mediumText">Color</TextStyles>
        //                             <TextStyles type="neutralText" textcolor="light" utility="mt-10">Color</TextStyles>
        //                         </Card>
        //                         <Card cardType="linkwater">
        //                             <TextStyles type="mediumText">Gender</TextStyles>
        //                             <TextStyles type="neutralText" textcolor="light" utility="mt-10">Unisex</TextStyles>
        //                         </Card>
        //                     </FlexLayout>
        //                 </FormChild>
        //                 <FormChild>
        //                     <FlexLayout spacing="loose">
        //                         <Button>Attribute Mapping</Button>
        //                     </FlexLayout>
        //                 </FormChild>
        //             </LRLayout>
        //
        //
        //
        //             <LRLayout title="Warehouse Mapping">
        //                 <FlexLayout halign="fill" childWidth="fullWidth" spacing="loose">
        //                     <div>
        //                         <TextStyles type="SubHeading">Name</TextStyles>
        //                         <TextStyles type="neutralText" textcolor="light" utility="mt-10">Cedcommerce Sandbox page</TextStyles>
        //                     </div>
        //                     <FormChild>
        //                         <FlexLayout halign="fill" childWidth="fullWidth" spacing="loose" direction="vertical">
        //                             <CheckBox labelVal="15/215, Indiranagar, Lucknow"></CheckBox>
        //                             <CheckBox labelVal="newFulfillmentService"></CheckBox>
        //                             <CheckBox labelVal="newlocation"></CheckBox>
        //                         </FlexLayout>
        //                     </FormChild>
        //                 </FlexLayout>
        //
        //             </LRLayout>
        //         </Card>
        //     </div>;

        return < > { super.render() } { data } < />;

    }
}

export default CreateProfile;