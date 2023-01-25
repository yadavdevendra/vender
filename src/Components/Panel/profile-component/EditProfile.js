import React from 'react';
import Base from "../../../../core/base";
import {
    Button,
    Card, CheckBox,
    Dots,
    FlexLayout,
    FormChild,
    LRLayout,
    PageHeader,
    Select,
    TextField,
    TextStyles,
    Skeleton,
    FormElement,
    CardHelp
} from "@cedcommerce/ounce-ui";
import QueryBuilder from "./QueryBuilder";
import {Attribute} from "../../../../shared/Facebook/Attribute";

class EditProfile extends Base{
    constructor(props){
        super(props);
        this.state={
            profile_name:'',
            query:'',
            source:'',
            target:'',
            category:'',
            facebookWarehouse:'',
            shopifyWarehouse:'',
            attributeMapped:'',
            saveVisible:false,
            profileWarehouse:''
        };
        this.getProductCategories();
        this.getProfileByID();
        this.getWarehouse();
        this.child=React.createRef();
    }
    getProfileByID(){
        this.requests.postRequest('connector/profile/getProfile',{activePage:1,count:5,id:this.props.match.params.id}).then(e=>{
           
            if(e.success){
                this.setState({
                    profile_name:e.data.name,
                    // query:e.data.query,
                    source:e.data.source,
                    target:e.data.target,
                    category:e.data.targetCategory,
                    attributeMapped:e.data.attributeMapped,
                    profileWarehouse:e.data.warehouse
                })
            }
        })
    }

    getProductCategories() {
        this.requests
            .getRequest("shopifyhome/playground/test", {
                marketplace: "google"
            })
            .then(data => {
                if (data.success) {
                    this.categoryLists = [
                        {
                            parent_catg_id: false,
                            selected_category: "",
                            categories: this.addLabelInCategories(data.data)
                        }
                    ];
                    /*this.setState({check2:true},()=>{
                     this.renderAutoComplete(this.state.current,auto)
                     })*/
                    let ar=[]
                    Object.values(this.categoryLists[0]['categories']).forEach(val=>{
                        let obj={label:val['title'],value:val['path']}
                        ar.push(obj)
                    })
                    // console.log(ar);
                    this.setState({
                        categoryList:ar
                    })
                }

            })
    }



    handleProductsSelectChange(categoryIndex, value) {
        this.categoryList[categoryIndex].selected_category = value;
        this.state.products_select.targetCategory = value;
        this.categoryList =this.categoryList.splice(0, categoryIndex + 1);
        console.log(this.categoryList[categoryIndex].categories,value);
        const parentCatgId = this.checkHasChildCategories(
            this.categoryList[categoryIndex].categories,
            value
        );
        console.log(parentCatgId);

        this.updateState();

    }

    addLabelInCategories(categories) {
        for (let i = 0; i < categories.length; i++) {
            categories[i]["label"] = categories[i]["code"];
            categories[i]["value"] = categories[i]["code"];
        }
        return categories;
    }
    checkHandleChange(fb_value,sp_value,flag,manual=false){
        // console.log(fb_value, sp_value, flag, manual);
        let {shopifyWarehouse,profileWarehouse} = this.state;
        // console.log(this.child.current);
        // console.log(fb_value);
        // console.log(sp_value)
        // console.log(flag)
        console.log(profileWarehouse);
        Object.keys(shopifyWarehouse).forEach(e => {
            if (shopifyWarehouse[e].value == sp_value && flag) {
                shopifyWarehouse[e]['fbLocation'][fb_value]  = true;
            }else if(shopifyWarehouse[e].value == sp_value && !flag){
                delete shopifyWarehouse[e]['fbLocation'][fb_value];
            }
        });

        if(manual){
            this.setState({shopifyWarehouse:shopifyWarehouse,default_profile_updated:true,saveVisible:true});
        }else{
            this.setState({shopifyWarehouse:shopifyWarehouse,saveVisible:true});
        }

    }

    QueryFormat=(a)=>{
        // console.log(a);
        this.setState({query:a});
    };

    saveProfileData(){
        let data = Object.assign(
            {},
            this.state.basicDetails,
            this.state.products_select,
        );
        let warehouseData = {} ;
        let ar=this.child.current.callBackDataToParent2();
        Object.values(this.state.shopifyWarehouse).forEach(values => {
            let tmp =[];

            if (Object.keys(values['fbLocation']).length) {
                tmp = Object.keys(values['fbLocation']);
                warehouseData[values['value']] = tmp;
            }
        });
        data['name']=this.state.profile_name;
        data['warehouse']=warehouseData;
        data['attributeMapped'] = ar[0];
        data['fb_cat'] = ar[1];
        data['query']=this.state.query;
        data['profile_id']=parseInt(this.props.match.params.id);
        data['source']=this.state.source;
        data['target']=this.state.target;
        data['targetCategory']=this.state.category;
        console.log(data);
        // this.updateState();
        this.requests.postRequest("connector/profile/set", {
            data: data,
        })
            .then(data => {
                if (data.success) {
                    this.notify("Profile Updated succesfully");
                    this.redirect("/panel/profiling");
                } else {
                    this.notify(data.message, true);
                }
                this.setState({saveVisible:false});
            });

    }

    redirect(path){
        this.props.history.push(path);
    }




    updateState() {
        const state = this.state;
        this.setState(state);
    }

    getAttributeMappingState(attribute, fb_cat) {
        // console.log(attribute,fb_cat);
        this.setState({attribute:attribute, fb_cat:fb_cat});
        let sendData = {
            'source': 'shopify',
            'target' : 'facebook',
            'attributeMapped' : attribute,
            'fb_cat' : fb_cat,
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


    getWarehouse = () => {
        this.requests.getRequest('facebookhome/request/getWareHouses').then(e => {
            if (e.success) {
                if (Object.keys(e.data.facebook).length > 0 && Object.keys(e.data.shopify).length > 0) {
                    let FB, SP;
                    FB = Object.values(e.data.facebook)
                        .filter(fb => fb.id && fb.merchant_page.name)
                        .map(fb => {
                            if ( !fb.product_catalogs || !fb.product_catalogs[0] || !fb.product_catalogs[0]['id'] ) {
                                fb['product_catalogs'] = [ {id : "UNKNOWN"} ];
                            }
                            return {
                                label: fb.merchant_page.name,
                                page_id: fb.merchant_page.id,
                                cms_id: fb.id,
                                catalog_id : fb.product_catalogs[0]['id'],
                                value: fb._id.toString(),
                            }
                        });
                    SP = Object.values(e.data.shopify)
                        .filter(shopify => shopify.id && shopify.name)
                        .map(shopify => {
                            return {label: shopify.name, value: shopify._id.toString(),fbLocation:{}}
                        });
                    let checkOption = Object.values(e.data.shopify)
                        .filter(shopify => shopify.id && shopify.name)
                        .map(shopify => {
                            return {label: shopify.name, value: shopify._id.toString()}
                        });
                    // SP.unshift({label: "--BLANK--", value: "blank"});



                    this.setState({
                        facebookWarehouse: FB,
                        shopifyWarehouse: SP,

                    });
                } else {
                    this.setState({error: {status: true, message: 'Failed to fetch valid locations'}});
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


    render(){
        let {facebookWarehouse,shopifyWarehouse,query}=this.state;
        console.log(query);
        let data=<>
        <PageHeader>Edit Profile</PageHeader>
        <Card>
            {this.state.saveVisible||query!==''?<Button halign={'End'} thickness={'thin'} onAction={()=>this.saveProfileData()}>Save Profile</Button>:null}
            <LRLayout title="Profile Details">
                <FormElement>
                    <TextStyles type="SubHeading">Profile Name</TextStyles>
                    <TextField thickness={'thin'} type="text"
                               value={this.state.profile_name}
                               onChange={(e)=>{this.setState({
                                   profile_name:e,saveVisible:true,
                               })}}
                               placeHolder={"Enter Profile's name"}
                    />
                </FormElement>
            </LRLayout>
            <LRLayout title="Category Mapping">
                <FormChild>
                    <TextStyles type="SubHeading">Current facebook Category</TextStyles>
                    <TextStyles type="neutralText" textcolor="light" utility="mt-5">{this.state.category}</TextStyles>
                    {this.state.categoryList ?
                        <Select thickness={'thin'} value={this.state.category.split('/')[0]} options={this.state.categoryList} onChange={(val) => {

                            this.setState({
                                category: val, saveVisible: true,
                            })
                        }}/> : <Skeleton/>}

                    <QueryBuilder fun={this.QueryFormat}/>

                </FormChild>
            </LRLayout>
            <LRLayout title="Attribute Mapped">


                {this.state.attributeMapped && <FlexLayout spacing={'extraLoose'}>{Object.keys(this.state.attributeMapped).map(e=>{
                    return <Card cardType={'linkwater'}>
                        <TextStyles type={'HeadingMedium'} children={e} utility="mb-10"/>
                            {this.state.attributeMapped[e].value}
                    </Card>
                })}</FlexLayout>}
                <Attribute ref={this.child} category={this.state.category} getAttributeMappingState={this.getAttributeMappingState.bind(this)}/>
            </LRLayout>
            <LRLayout title="Warehouse Mapping">
                <FlexLayout fill="fullWidth" spacing="extraLoose" halign="start">
                    <div>
                        <TextStyles type="SubheadingWithIcon">Selected Facebook Page</TextStyles>
                        <TextStyles type="neutralText" utility="mb-10">{facebookWarehouse[0] ? facebookWarehouse[0]['label'] : "Please wait.."}</TextStyles>
                        <FormElement>
                            {Object.values(shopifyWarehouse).map(val => {

                                    return <CheckBox checked={Object.values(val['fbLocation'])[0]} labelVal={val['label']}
                                                     onClick={()=>{

                                                         this.checkHandleChange(
                                                         facebookWarehouse[0]['value'],
                                                         val['value'],
                                                         !Object.values(val['fbLocation'])[0],
                                                         true)}}/>
                                }
                            )}
                        </FormElement>
                    </div>
                </FlexLayout>
            </LRLayout>
        </Card>
        </>

        return <>{super.render()}{data}</>;
    }

}

export default EditProfile;