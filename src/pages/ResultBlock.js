import React from 'react';
import {Icon} from 'antd';
import './ResultBlock.less';
class ResultBlock extends React.Component{
	constructor(props){
		super(props);
		this.state=({
			left:props.left,
			top:props.top,
			name:props.name,
			leftVal:props.keyNum<=5?(parseFloat(props.leftVal)*100).toFixed(2)+'%':props.leftVal,
			rightVal:props.keyNum<=5?(parseFloat(props.rightVal)*100).toFixed(2)+'%':props.rightVal,
			keyNum:props.keyNum,
			width:props.width,
			height:props.height,
			showRate:parseFloat(props.leftVal)>parseFloat(props.rightVal)?'up':(parseFloat(props.leftVal)<parseFloat(props.rightVal)?'down':'mid')
		})
	}

	componentWillReceiveProps(nextProps){
		this.setState({
			left:nextProps.left,
			top:nextProps.top,
			name:nextProps.name,
			leftVal:nextProps.keyNum<=5?(parseFloat(nextProps.leftVal)*100).toFixed(2)+'%':nextProps.leftVal,
			rightVal:nextProps.keyNum<=5?(parseFloat(nextProps.rightVal)*100).toFixed(2)+'%':nextProps.rightVal,
			keyNum:nextProps.keyNum,
			width:nextProps.width,
			height:nextProps.height,
			showRate:parseFloat(nextProps.leftVal)>parseFloat(nextProps.rightVal)?'up':(parseFloat(nextProps.leftVal)<parseFloat(nextProps.rightVal)?'down':'mid')
		})
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
			</div>
		)
	}
}
export default ResultBlock;