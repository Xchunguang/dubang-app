import React from 'react';
import {Slider,Icon } from 'antd';
import './OperBlock.less';
class OperBlock extends React.Component{
	constructor(props){
		super(props);
		this.curLeftVar = parseFloat(props.leftVal);
		this.state=({
			left:props.left,
			top:props.top,
			name:props.name,
			leftVal:props.leftVal,
			rightVal:props.rightVal,
			keyNum:props.keyNum,
			max:this.curLeftVar + parseFloat(props.range),
			min:this.curLeftVar - parseFloat(props.range),
			width:props.width,
			height:props.height,
			showRate:parseFloat(props.leftVal)>parseFloat(props.rightVal)?'up':(parseFloat(props.leftVal)<parseFloat(props.rightVal)?'down':'mid')
		})
	}

	curLeftVar = 0;

	componentWillReceiveProps(nextProps){
		if(nextProps.reset){
			this.curLeftVar = parseFloat(nextProps.leftVal);	
		}
		this.setState({
			left:nextProps.left,
			top:nextProps.top,
			name:nextProps.name,
			leftVal:parseFloat(nextProps.leftVal),
			rightVal:parseFloat(nextProps.rightVal),
			keyNum:nextProps.keyNum,
			width:nextProps.width,
			max:this.curLeftVar + parseFloat(nextProps.range),
			min:this.curLeftVar - parseFloat(nextProps.range),
			height:nextProps.height,
			showRate:parseFloat(nextProps.leftVal)>parseFloat(nextProps.rightVal)?'up':(parseFloat(nextProps.leftVal)<parseFloat(nextProps.rightVal)?'down':'mid')
		})
		if(nextProps.reset){
			this.props.clearReset();
		}
	}

	onChange=(value)=>{
		this.setState({
			leftVal:value
		})
		this.props.changeValue(value,this.state.keyNum);
	}

	render(){
		return (
			<div className='resultBlockDiv' style={{'width':this.state.width+'px','height':this.state.height+'px','left':this.state.left,'top':this.state.top}}>
				<div className='titleDiv' style={{'lineHeight':parseFloat(this.state.height)*0.45+'px'}}>
					{this.state.name}
					<Icon type="arrow-down" className="titleDown" style={{'display':this.state.showRate==='down'?'inline-block':'none'}}/>
					<Icon type="arrow-up" className="titleUp" style={{'display':this.state.showRate==='up'?'inline-block':'none'}}/>
				</div>
				<div className='valDiv'>
					<span className='leftVal' style={{'lineHeight':parseFloat(this.state.height)*0.55+'px'}}>{this.state.leftVal}</span>	
					<span className='rightVal' style={{'lineHeight':parseFloat(this.state.height)*0.55+'px'}}>{this.state.rightVal}</span>	
				</div>
				<Slider onChange={this.onChange} value={parseFloat(this.state.leftVal)} className="silderBar" tipFormatter={null} min={parseFloat(this.state.min)} max={parseFloat(this.state.max)}/>
			</div>
		)
	}
}
export default OperBlock;