import React from 'react';
import bqFetch from 'root/utils/bqFetch';
import {BQ_SELF} from 'root/config/constant';
import './less/main.less';
import Background from './images/getPicture.jpg';
import ResultBlock from './pages/ResultBlock';
import OperBlock from './pages/OperBlock';
import { Select,Button,message,Spin,Input } from 'antd';
const Option = Select.Option;
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return '';
}
var sectionStyle = {
  backgroundImage: `url(${Background})`,
  backgroundSize:'100% 100%'
};

var allTeem = [];

var exampleDate=[
    ["测试组织1","2016-01","实际数据","100","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
    ["测试组织1","2016-01","预算数据","98","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"],
    ["测试组织1","2016-02","实际数据","100","20","30","40","50","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
    ["测试组织1","2016-02","预算数据","98","100","200","300","400","5","6","7","8","9","10","11","12","13","14","15","16","17","18"],
    ["测试组织2","2016-01","同期数据","100","2000","3000","4000","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
    ["测试组织2","2016-01","本期数据","98","10000","20000","30000","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"],
];

var resultEntry=[{
    oagName:'测试组织',
    smonth:'2016-01',
    recordType:'实际数据',
    val01:-1,//主营业务收入
    val02:-1,//其他业务利润
    val03:-1,//所得税
    val04:-1,//流动负债
    val05:-1,//非流动负债
    val06:-1,//营业成本
    val07:-1,//销售费用
    val08:-1,//管理费用
    val09:-1,//财务费用
    val10:-1,//营业税金及附加
    val11:-1,//货币资金
    val12:-1,//预付款项
    val13:-1,//应收账款
    val14:-1,//存货
    val15:-1,//其他流动资产
    val16:-1,//长期股权投资
    val17:-1,//固定资产
    val18:-1,//无形资产
    val19:-1,//其他非流动资产
},{
    oagName:'测试组织',
    smonth:'2016-01',
    recordType:'预算数据',
    val01:-1,//主营业务收入
    val02:-1,//其他业务利润
    val03:-1,//所得税
    val04:-1,//流动负债
    val05:-1,//非流动负债
    val06:-1,//营业成本
    val07:-1,//销售费用
    val08:-1,//管理费用
    val09:-1,//财务费用
    val10:-1,//营业税金及附加
    val11:-1,//货币资金
    val12:-1,//预付款项
    val13:-1,//应收账款
    val14:-1,//存货
    val15:-1,//其他流动资产
    val16:-1,//长期股权投资
    val17:-1,//固定资产
    val18:-1,//无形资产
    val19:-1,//其他非流动资产
}];

//获取流动资产
var getCapital = function(entry){

    let result = parseFloat(entry.val15)+parseFloat(entry.val14)+parseFloat(entry.val13)+parseFloat(entry.val12)+parseFloat(entry.val11);
    return result.toFixed(2);
}

//获取非流动资产
var getNonCapital= function(entry){
    let result = parseFloat(entry.val19)+parseFloat(entry.val18)+parseFloat(entry.val17)+parseFloat(entry.val16);
    return result.toFixed(2);
}


//获得成本费用
var getCost= function(entry){
    let result = parseFloat(entry.val06)+parseFloat(entry.val07)+parseFloat(entry.val08)+parseFloat(entry.val09)+parseFloat(entry.val10);
    return result.toFixed(2);
}

//获得净利润
var getNetprofit = function(entry){
   let result = parseFloat(entry.val01)-parseFloat(getCost(entry))+parseFloat(entry.val02)-parseFloat(entry.val03);
   return result.toFixed(2);
}
//获得主营业务利润率
var getMainProfit = function(entry){
    let result = parseFloat(getNetprofit(entry))/parseFloat(entry.val01);
    return result.toFixed(2);
}

//获得资产总额
var getAllMoney = function(entry){
    let result = parseFloat(getCapital(entry))+parseFloat(getNonCapital(entry));
    return parseFloat(result).toFixed(2);
}
//获得负债总额
var getAllDept = function(entry){
    let result = parseFloat(entry.val04)+parseFloat(entry.val05);
    return result.toFixed(2);
}
//获得资产负债率
var getDeptProfit = function(entry){
    let result = parseFloat(getAllDept(entry))/parseFloat(getAllMoney(entry));
    return result.toFixed(2);
}
//获得权益乘数
var getEquitymultiplier = function(entry){
    let result = 1/(1-parseFloat(getDeptProfit(entry)));
    return result.toFixed(2);
}
//获得总资产周转率
var getTurnOver = function(entry){
    let result = parseFloat(entry.val01)/parseFloat(getAllMoney(entry));
    return parseFloat(result).toFixed(2);
}
//获得总资产收益率
var getEarnRate = function(entry){
    let result = parseFloat(getMainProfit(entry))*parseFloat(getTurnOver(entry));
    return parseFloat(result).toFixed(2)
}
//获得净资产收益率
var getRoe = function(entry){
    let result = parseFloat(getEarnRate(entry))*parseFloat(getEquitymultiplier(entry));
    return parseFloat(result).toFixed(2);
}

//解析构值
var getRealVal = function(row){
        [resultEntry[0].oagName,
                                resultEntry[0].smonth,
                                resultEntry[0].recordType,
                                resultEntry[0].val01,
                                resultEntry[0].val02,
                                resultEntry[0].val03,
                                resultEntry[0].val04,
                                resultEntry[0].val05,
                                resultEntry[0].val06,
                                resultEntry[0].val07,
                                resultEntry[0].val08,
                                resultEntry[0].val09,
                                resultEntry[0].val10,
                                resultEntry[0].val11,
                                resultEntry[0].val12,
                                resultEntry[0].val13,
                                resultEntry[0].val14,
                                resultEntry[0].val15,
                                resultEntry[0].val16,
                                resultEntry[0].val17,
                                resultEntry[0].val18,
                                resultEntry[0].val19] = row[0];
                                 [resultEntry[1].oagName,
                                resultEntry[1].smonth,
                                resultEntry[1].recordType,
                                resultEntry[1].val01,
                                resultEntry[1].val02,
                                resultEntry[1].val03,
                                resultEntry[1].val04,
                                resultEntry[1].val05,
                                resultEntry[1].val06,
                                resultEntry[1].val07,
                                resultEntry[1].val08,
                                resultEntry[1].val09,
                                resultEntry[1].val10,
                                resultEntry[1].val11,
                                resultEntry[1].val12,
                                resultEntry[1].val13,
                                resultEntry[1].val14,
                                resultEntry[1].val15,
                                resultEntry[1].val16,
                                resultEntry[1].val17,
                                resultEntry[1].val18,
                                resultEntry[1].val19] = row[1];
}

//获得所有结果的值,从上到下，从左到右
var getResultArr = function(entrys){
    let result = [];
    result.push({
        name:'净资产收益率',
        leftVal:getRoe(entrys[1]),//预算数据
        rightVal:getRoe(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'总资产收益率',
        leftVal:getEarnRate(entrys[1]),//预算数据
        rightVal:getEarnRate(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'权益乘数',
        leftVal:getEquitymultiplier(entrys[1]),//预算数据
        rightVal:getEquitymultiplier(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'主营业务利润率',
        leftVal:getMainProfit(entrys[1]),//预算数据
        rightVal:getMainProfit(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'总资产周转率',
        leftVal:getTurnOver(entrys[1]),//预算数据
        rightVal:getTurnOver(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'资产负债率',
        leftVal:getDeptProfit(entrys[1]),//预算数据
        rightVal:getDeptProfit(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'净利润',
        leftVal:getNetprofit(entrys[1]),//预算数据
        rightVal:getNetprofit(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'主营业务收入',
        leftVal:entrys[1].val01,//预算数据
        rightVal:entrys[0].val01,//实际数据
        isResult:false
    });
    result.push({
        name:'主营业务收入',
        leftVal:entrys[1].val01,//预算数据
        rightVal:entrys[0].val01,//实际数据
        isResult:false
    });
    result.push({
        name:'资产总额',
        leftVal:getAllMoney(entrys[1]),//预算数据
        rightVal:getAllMoney(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'负债总额',
        leftVal:getAllDept(entrys[1]),//预算数据
        rightVal:getAllDept(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'资产总额',
        leftVal:getAllMoney(entrys[1]),//预算数据
        rightVal:getAllMoney(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'主营业务收入',
        leftVal:entrys[1].val01,//预算数据
        rightVal:entrys[0].val01,//实际数据
        isResult:false
    });
    result.push({
        name:'成本费用',
        leftVal:getCost(entrys[1]),//预算数据
        rightVal:getCost(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'其他业务利润',
        leftVal:entrys[1].val02,//预算数据
        rightVal:entrys[0].val02,//实际数据
        isResult:false
    });
    result.push({
        name:'所得税',
        leftVal:entrys[1].val03,//预算数据
        rightVal:entrys[0].val03,//实际数据
        isResult:false
    });
    result.push({
        name:'流动负债',
        leftVal:entrys[1].val04,//预算数据
        rightVal:entrys[0].val04,//实际数据
        isResult:false
    });
    result.push({
        name:'非流动负债',
        leftVal:entrys[1].val05,//预算数据
        rightVal:entrys[0].val05,//实际数据
        isResult:false
    });
    result.push({
        name:'流动资产',
        leftVal:getCapital(entrys[1]),//预算数据
        rightVal:getCapital(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'非流动资产',
        leftVal:getNonCapital(entrys[1]),//预算数据
        rightVal:getNonCapital(entrys[0]),//实际数据
        isResult:true
    });
    result.push({
        name:'营业成本',
        leftVal:entrys[1].val06,//预算数据
        rightVal:entrys[0].val06,//实际数据
        isResult:false
    });
    result.push({
        name:'销售费用',
        leftVal:entrys[1].val07,//预算数据
        rightVal:entrys[0].val07,//实际数据
        isResult:false
    });
    result.push({
        name:'管理费用',
        leftVal:entrys[1].val08,//预算数据
        rightVal:entrys[0].val08,//实际数据
        isResult:false
    });
    result.push({
        name:'财务费用',
        leftVal:entrys[1].val09,//预算数据
        rightVal:entrys[0].val09,//实际数据
        isResult:false
    });
    result.push({
        name:'营业税金及附加',
        leftVal:entrys[1].val10,//预算数据
        rightVal:entrys[0].val10,//实际数据
        isResult:false
    });
    result.push({
        name:'货币资金',
        leftVal:entrys[1].val11,//预算数据
        rightVal:entrys[0].val11,//实际数据
        isResult:false
    });
    result.push({
        name:'长期股权投资',
        leftVal:entrys[1].val16,//预算数据
        rightVal:entrys[0].val16,//实际数据
        isResult:false
    });
    result.push({
        name:'其他',//其他流动资产
        leftVal:entrys[1].val15,//预算数据
        rightVal:entrys[0].val15,//实际数据
        isResult:false
    });
    result.push({
        name:'存货',
        leftVal:entrys[1].val14,//预算数据
        rightVal:entrys[0].val14,//实际数据
        isResult:false
    });
    result.push({
        name:'应收账款',
        leftVal:entrys[1].val13,//预算数据
        rightVal:entrys[0].val13,//实际数据
        isResult:false
    });
    result.push({
        name:'预付款项',
        leftVal:entrys[1].val12,//预算数据
        rightVal:entrys[0].val12,//实际数据
        isResult:false
    });
    result.push({
        name:'固定资产',
        leftVal:entrys[1].val17,//预算数据
        rightVal:entrys[0].val17,//实际数据
        isResult:false
    });
    result.push({
        name:'无形资产',
        leftVal:entrys[1].val18,//预算数据
        rightVal:entrys[0].val18,//实际数据
        isResult:false
    });
    result.push({
        name:'其他',//其他非流动资产
        leftVal:entrys[1].val19,//预算数据
        rightVal:entrys[0].val19,//实际数据
        isResult:false
    });
    return result;
}
//所有结果的位置
var positionArr=[{
    left:'34.375%',
    top:'2.34%'
},{
    left:'16.04%',
    top:'16.38%'
},{
    left:'52.78%',
    top:'16.38%'
},{
    left:'6.25%',
    top:'30.43%'
},{
    left:'25.83%',
    top:'30.43%'
},{
    left:'55.21%',
    top:'30.43%'
},{
    left:'1.39%',//净利润
    top:'44.48%'
},{
    left:'11.18%',
    top:'44.48%'
},{
    left:'20.98%',
    top:'44.48%'
},{
    left:'30.76%',
    top:'44.48%'
},{
    left:'45.42%',
    top:'44.48%'
},{
    left:'65%',
    top:'44.48%'//资产总额
},{
    left:'1.39%',
    top:'58.52%'
},{
    left:'11.18%',
    top:'58.52%'
},{
    left:'20.98%',
    top:'58.52%'
},{
    left:'30.76%',
    top:'58.52%'
},{
    left:'40.56%',
    top:'58.52%'
},{
    left:'50.35%',
    top:'58.52%'
},{
    left:'60.14%',
    top:'58.52%'
},{
    left:'69.93%',//非流动资产
    top:'58.52%'
},{
    left:'1.39%',//营业成本
    top:'72.56%'
},{
    left:'11.18%',
    top:'72.56%'
},{
    left:'20.98%',
    top:'72.56%'
},{
    left:'30.76%',
    top:'72.56%'
},{
    left:'40.56%',
    top:'72.56%'
},{
    left:'60.14%',
    top:'72.56%'
},{
    left:'69.93%',//长期股权投资
    top:'72.56%'
},{
    left:'30.76%',
    top:'86.61%'
},{
    left:'40.56%',
    top:'86.61%'
},{
    left:'50.35%',
    top:'86.61%'
},{
    left:'60.14%',
    top:'86.61%'
},{
    left:'69.93%',
    top:'86.61%'
},{
    left:'79.72%',
    top:'86.61%'
},{
    left:'89.51%',
    top:'86.61%'
},];

// 配置整体组件
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        let width = document.body.offsetWidth*0.078;
        let height = document.body.offsetHeight*0.071;
        let dsId = GetQueryString('dsId');
        let BQDataTokenID = '';
        BQDataTokenID = GetQueryString('BQDataTokenID');
        BQDataTokenID = BQDataTokenID.replace('{','').replace('}','');
        
        if(dsId!==''&&dsId!==null){
            this.state=({
                dsId:dsId,
                BQDataTokenID:BQDataTokenID,
                result:{},
                blockWidth:width,
                blockHeight:height,
                selectOagName:'',
                selectMonth:'',
                loading:true,
                reset:false,
                range:50
            })
            this.getDsData(BQDataTokenID,dsId).then(response => {
                    if (response.ok) {
                        response.json().then(json => {
                            if(json.result === 0){
                                /**
                                 * 此处获得的数据是包含多组的数据，其中机构对应多个月份，一个月份对应两个类型，将获得的数据首先构造成该结构的模型
                                 * @type {[type]}
                                 */
                                exampleDate = json.data.dsDatas;
                                allTeem = this.getAllTeemAndMonth();
                                let canShowData = this.getShowData(allTeem[0].oagName,allTeem[0].smonths[0]);
                                getRealVal(canShowData);//此处的数组要求是同一机构，同一月份的不同记录类型的数据
                                let resultArr = getResultArr(resultEntry);
                                this.setState({
                                    result:resultArr,
                                    selectOagName:allTeem[0].oagName,
                                    selectMonth:allTeem[0].smonths[0],
                                    loading:false
                                })
                            }else{
                                this.setState({
                                    loading:false
                                })
                                message.error(json.detail);
                            }
                            
                        })
                    } else {
                            this.setState({
                                loading:false,
                                reset:false
                            })
                            message.error('未知错误');    
                    }
                }).catch(error => console.log(error))
        }else{
            allTeem = this.getAllTeemAndMonth();
            let canShowData = this.getShowData(allTeem[0].oagName,allTeem[0].smonths[0]);
            getRealVal(canShowData);
            let resultArr = getResultArr(resultEntry);
            
            this.state=({
                dsId:dsId,
                BQDataTokenID:BQDataTokenID,
                blockWidth:width,
                blockHeight:height,
                result:resultArr,
                selectOagName:allTeem[0].oagName,
                selectMonth:allTeem[0].smonths[0],
                loading:false,
                reset:false,
                range:50
            })
        }
        
    } 

    getDsData=(BQDataTokenID,dsId)=>{
        let url=BQ_SELF+'/ds/web/data/export4out/'+BQDataTokenID+'/'+dsId;
            return bqFetch(url, {
                 method: "GET",
                 async:false,
                 headers: {
                        'Content-Type': 'application/json'
                 }
        })
    }

    getAllDom=()=>{
        let result = [];
        let resultArr = this.state.result;
        for(let index=0;index<resultArr.length;index++){
            if(resultArr[index].isResult){//当该块结果块
                let dom = <ResultBlock left={positionArr[index].left} top={positionArr[index].top} name={resultArr[index].name} leftVal={resultArr[index].leftVal} rightVal={resultArr[index].rightVal} key={index} keyNum={index} width={this.state.blockWidth} height={this.state.blockHeight} />
                result.push(dom);                 
            }else{//该块为滑动块
                let dom1 = <OperBlock clearReset={this.clearReset.bind(this)} reset={this.state.reset} changeValue={this.changeValue.bind(this)} left={positionArr[index].left} top={positionArr[index].top} name={resultArr[index].name} leftVal={resultArr[index].leftVal} rightVal={resultArr[index].rightVal} key={index} keyNum={index} width={this.state.blockWidth} height={this.state.blockHeight} range={parseFloat(this.state.range)} />
                result.push(dom1);   
            }
        }
        return result;
    }

    //根据exampleDate获得所有的机构，机构所包含的月份
    getAllTeemAndMonth=()=>{
        let result = [];
        for(let i=0;i<exampleDate.length;i++){
            let exit = false;
            for(let j=0;j<result.length;j++){
                if(result[j].oagName === exampleDate[i][0]){
                    exit = true;
                    break;
                }
            }
            if(!exit){
                let nowEntry = {
                    oagName:exampleDate[i][0],
                    smonths:[]
                }
                for(let n=0;n<exampleDate.length;n++){//获取该机构下所有月份数据
                    if(nowEntry.oagName === exampleDate[n][0]){
                        let smonthExit = false;
                        for(let m=0;m<nowEntry.smonths.length;m++){
                            if(nowEntry.smonths[m] === exampleDate[n][1]){
                                smonthExit = true;
                                break;
                            }
                        }
                        if(!smonthExit){
                            nowEntry.smonths.push(exampleDate[n][1]);
                        }
                    }
                }
                result.push(nowEntry);
            }
        }
        return result;
    }

    //从exampleDate获取机构相同，月份相同但类型不同的包含两组数组的数组
    getShowData=(oagName,smonth)=>{
        let result = [];
        for(let i=0;i<exampleDate.length;i++){
            if(exampleDate[i][0] === oagName&&exampleDate[i][1] === smonth){
                result.push(exampleDate[i]);
            }
            if(result.length === 2){
                break;
            }
        }
        return result;
    }

    changeValue=(value,keyNum)=>{
        if(keyNum === 7||keyNum === 8||keyNum === 12){
            resultEntry[1].val01 = value;
        }
        if(keyNum === 14){
            resultEntry[1].val02 = value;
        }
        if(keyNum === 15){
            resultEntry[1].val03 = value;
        }
        if(keyNum === 16){
            resultEntry[1].val04 = value;
        }
        if(keyNum === 17){
            resultEntry[1].val05 = value;
        }
        if(keyNum === 20){
            resultEntry[1].val06 = value;
        }
        if(keyNum === 21){
            resultEntry[1].val07 = value;
        }
        if(keyNum === 22){
            resultEntry[1].val08 = value;
        }
        if(keyNum === 23){
            resultEntry[1].val09 = value;
        }
        if(keyNum === 24){
            resultEntry[1].val10 = value;
        }
        if(keyNum === 25){
            resultEntry[1].val11 = value;
        }
        if(keyNum === 26){
            resultEntry[1].val16 = value;
        }
        if(keyNum === 27){
            resultEntry[1].val15 = value;
        }
        if(keyNum === 28){
            resultEntry[1].val14 = value;
        }
        if(keyNum === 29){
            resultEntry[1].val13 = value;
        }
        if(keyNum === 30){
            resultEntry[1].val12 = value;
        }
        if(keyNum === 31){
            resultEntry[1].val17 = value;
        }
        if(keyNum === 32){
            resultEntry[1].val18 = value;
        }
        if(keyNum === 33){
            resultEntry[1].val19 = value;
        }
        let resultArr = getResultArr(resultEntry);
        this.setState({
            result:resultArr,
            reset:false
        })

    }

    handleChange1=(value)=>{
        let month = this.state.selectMonth;
        for(let i=0;i<allTeem.length;i++){
            if(value === allTeem[i].oagName){
                month = allTeem[i].smonths[0];
            }
        }
        this.setState({
            selectOagName:value,
            selectMonth:month,
            reset:false
        })
    }
    handleChange2=(value)=>{
        this.setState({
            selectMonth:value,
            reset:false
        })
    }

    changeRange=(e)=>{
        let reg  = new RegExp("^[0-9]*$");
        if(e.target.value!==''&&e.target.value!==null){
            if(!reg.test(e.target.value)){
                message.error('请输入正确数值');
            }else{
                this.setState({
                    range:e.target.value
                })
            }
            
        }else{
            this.setState({
                range:0
            })
        }
        
    }

    getSelectOagName=()=>{
        let result = [];
        for(let i=0;i<allTeem.length;i++){
            let dom=<Option key={i} value={allTeem[i].oagName}>{allTeem[i].oagName}</Option>
            result.push(dom);
        }
        return result;
    }

    getSelectMonth=()=>{
        let result = [];
        let nowMonths = [];
        for(let i=0;i<allTeem.length;i++){
            if(this.state.selectOagName === allTeem[i].oagName){
                nowMonths = allTeem[i].smonths;
                break;
            }
        }
        for(let j=0;j<nowMonths.length;j++){
            let dom = <Option key={j} value={nowMonths[j]}>{nowMonths[j]}</Option>
            result.push(dom);
        }
        return result;
    }

    onWindowResize=()=>{
        let width = document.body.offsetWidth*0.078;
        let height = document.body.offsetHeight*0.071;
        this.setState({
            blockWidth:width,
            blockHeight:height,
            reset:false
        })
    }
    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onSearchClick=()=>{
        let selectMonth = this.state.selectMonth;
        let selectOagName = this.state.selectOagName;
        let canShowData = this.getShowData(selectOagName,selectMonth);
        getRealVal(canShowData);
        let resultArr = getResultArr(resultEntry);
        this.setState({
            loading:false,
            result:resultArr,
            selectOagName:selectOagName,
            selectMonth:selectMonth,
            reset:true
        })
        message.success('切换成功');
    }

    onResetClick=()=>{
        let selectMonth = allTeem[0].smonths[0];
        let selectOagName = allTeem[0].oagName;
        let canShowData = this.getShowData(selectOagName,selectMonth);
        getRealVal(canShowData);
        let resultArr = getResultArr(resultEntry);
        this.setState({
            loading:false,
            result:resultArr,
            selectOagName:allTeem[0].oagName,
            selectMonth:allTeem[0].smonths[0],
            reset:true,
            range:50
        })
        message.success('重置成功');
    }

    clearReset=()=>{
        this.setState({
            reset:false
        })
    }

    render() {
        return (
            <div className="mainBack" style={sectionStyle}>
                {this.getAllDom()}
                <div className='line1' style={{'left':'calc(34.375% + '+this.state.blockWidth/2+'px)','top':'calc(2.34% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line2' style={{'left':'calc(16.04% + '+this.state.blockWidth/2+'px)','top':'calc(6.5786% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line3' style={{'left':'calc(16.04% + '+this.state.blockWidth/2+'px)','top':'calc(6.5786% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line4' style={{'left':'calc(52.78% + '+this.state.blockWidth/2+'px)','top':'calc(6.5786% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line5' style={{'left':'calc(6.25% + '+this.state.blockWidth/2+'px)','top':'calc(20.5486% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line6' style={{'left':'calc(47.99% + '+this.state.blockWidth/2+'px)','top':'calc(20.5486% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line-create' style={{'left':'calc(38.11% + '+this.state.blockWidth/2+'px)','top':'calc(19% + '+this.state.blockHeight+'px)'}}>1/(1-资产负债率)</div>
                <div className='line7' style={{'left':'calc(1.39% + '+this.state.blockWidth/2+'px)','top':'calc(34.5186% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line8' style={{'left':'calc(20.98% + '+this.state.blockWidth/2+'px)','top':'calc(34.5186% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line9' style={{'left':'calc(55.21% + '+this.state.blockWidth/2+'px)','top':'calc(23.5486% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line10' style={{'left':'calc(45.42% + '+this.state.blockWidth/2+'px)','top':'calc(34.5186% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line11' style={{'left':'calc(1.39% + '+this.state.blockWidth/2+'px)','top':'calc(34.5186% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line12' style={{'left':'calc(1.39% + '+this.state.blockWidth/2+'px)','top':'calc(48.4886% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line13' style={{'left':'calc(40.56% + '+this.state.blockWidth/2+'px)','top':'calc(48.4886% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line14' style={{'left':'calc(60.14% + '+this.state.blockWidth/2+'px)','top':'calc(48.4886% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line15' style={{'left':'calc(11.18% + '+this.state.blockWidth/2+'px)','top':'calc(48.4886% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line16' style={{'left':'calc(20.98% + '+this.state.blockWidth/2+'px)','top':'calc(48.4886% + '+this.state.blockHeight+'px)'}}></div>
                <div className='line17' style={{'left':'calc(1.39% + '+this.state.blockWidth/2+'px)','top':'70.96%'}}></div>
                <div className='line18' style={{'left':'calc(20.98% + '+this.state.blockWidth/2+'px)','top':'70.96%'}}></div>
                <div className='line19' style={{'left':'calc(30.76% + '+this.state.blockWidth/2+'px)','top':'70.96%'}}></div>
                <span className='operSpan' style={{'left':'calc(34.375% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(10.34% + '+this.state.blockHeight+'px)'}}>×</span>
                <span className='operSpan' style={{'left':'calc(16.04% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(30.43% + '+(this.state.blockHeight*0.45-9)+'px)'}}>×</span>
                <span className='operSpan' style={{'left':'calc(6.25% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(44.48% + '+(this.state.blockHeight*0.45-9)+'px)'}}>÷</span>
                <span className='operSpan' style={{'left':'calc(25.83% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(44.48% + '+(this.state.blockHeight*0.45-9)+'px)'}}>÷</span>
                <span className='operSpan' style={{'left':'calc(55.21% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(44.48% + '+(this.state.blockHeight*0.45-9)+'px)'}}>÷</span>
                <span className='operSpan' style={{'left':'calc(6.285% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(58.52% + '+(this.state.blockHeight*0.45-9)+'px)'}}>-</span>
                <span className='operSpan' style={{'left':'calc(16.085% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(58.52% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(25.865% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(58.52% + '+(this.state.blockHeight*0.45-9)+'px)'}}>-</span>
                <span className='operSpan' style={{'left':'calc(45.455% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(58.52% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(65.035% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(58.52% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(6.285% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(72.56% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(16.085% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(72.56% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(25.865% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(72.56% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(35.665% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(72.56% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(35.665% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(86.61% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(45.455% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(86.61% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(55.245% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(86.61% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(60.035% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(80.21% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(74.825% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(86.61% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(84.615% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(86.61% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <span className='operSpan' style={{'left':'calc(69.93% + '+(this.state.blockWidth/2-6)+'px)','top':'calc(80.21% + '+(this.state.blockHeight*0.45-9)+'px)'}}>+</span>
                <div className="infoDiv">
                    <p>单位：万元</p>
                    <p><span>区间：</span><Input className='rangeInput' value={this.state.range} onChange={this.changeRange}/></p>
                    <p><span className='tongqi'></span><span className="nameSpan">{resultEntry[1].recordType}</span></p>
                    
                    <p><span className='benqi'></span><span className="nameSpan">{resultEntry[0].recordType}</span></p>
                    
                </div>
                <div className='selectDiv'>
                    <div className='jigouDiv'>
                        <span>机构：</span>
                        <Select value={this.state.selectOagName} style={{ width: 180 }} onChange={this.handleChange1}>
                          
                          {this.getSelectOagName()}
                        </Select>
                    </div>
                    <div className='jigouDiv'>
                        <span>期间：</span>
                        <Select value={this.state.selectMonth} style={{ width: 180 }} onChange={this.handleChange2}>
                          {this.getSelectMonth()}
                        </Select>
                    </div>
                    <div className='jigouDiv'>
                        <Button className='selectBtn' onClick={this.onSearchClick}>查询</Button>
                        <Button className='selectBtn' onClick={this.onResetClick} style={{'float':'right'}}>重置</Button>
                    </div>


                </div>
            <Spin spinning={this.state.loading} size="large" className="loadingBtn"></Spin>

            </div>
        )
    }

}
