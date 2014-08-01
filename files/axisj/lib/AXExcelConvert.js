/* AXISJ Javascript UI Framework */
/* http://www.axisj.com, license : http://www.axisj.com/license */
 

var AXExcelConvert = Class.create(AXJ, {
    version: "AXExcelConvert V1",
	author: "tom@axisj.com",
	logs: [
		"2013-08-21 오후 11:47:11 - modsAX 변환"
	],
    initialize: function(AXJ_super) {
        AXJ_super();
        this.ds = [];
    },
    init: function() {
		
    },
	readyData: function(){
		this.ds = []; //엑셀 데이터 초기화
		var re = this.config.targetID;
		var po = [];
		po.push("<div id='"+re+"_CT'>");
		po.push("<div style='padding:5px;'>엑셀데이터 붙여넣기 <span>- 변환하실 엑셀 데이터를 선택하여 아래에 붙여넣기 해주세요.</span></div>");
		po.push("<textarea id='"+re+"_TEXT' style='width:"+this.config.ctWidth+"px;height:"+this.config.ctHeight+"px;' class='AXTextarea'></textarea>");
		po.push("<div style='padding:10px;' align='right'><input type='button' value='변환하기' class='AXButton' id='"+re+"_convert' /> <input type='button' value='창 닫기' class='AXButton' id='"+re+"_close' /></div>");
		po.push("</div>");
		
		jQuery("#"+re).html(po.join(''));
		setTimeout(function(){
			jQuery("#"+re+"_TEXT").focus();
		}, 500);
		
		jQuery("#"+re+"_convert").bind("click", this.onConvert.bind(this));
		jQuery("#"+re+"_close").bind("click", this.onClose.bind(this));
	},
	onConvert: function(){
		var re = this.config.targetID;
		var tStr = jQuery("#"+re+"_TEXT").val().trim();
		if(tStr == ""){
			alert("변환할 내용이 없습니다. 내용을 입력하세요.");
			return;	
		}
		var codeR = tStr.split(/\n/g);

		for(var a=0;a<codeR.length;a++){
			if(codeR[a].trim() != ""){
				codeR[a] = codeR[a].replace(/\t\t/gi, "\t \t");
				var codeC = codeR[a].trim().split(/[\t]/gi);
				this.ds.push(codeC);
			}
		}
		this.gridPrint();
	},
	onClose: function(){
		if(this.config.onClose){
			this.config.onClose();
		}
	},
	gridPrint: function(){
		var re = this.config.targetID;
		var colnames = this.config.colnames;
		
		function getCOPT(nm){
			var copt = [];
			copt.push("<select name='colNames' class='colNamesSelect'>");
			copt.push("	<option value=''></option>");
			jQuery.each(colnames, function(){
				if(nm == this.nm){
			copt.push("	<option value='"+this.nm+"' selected='selected'>"+this.val+"</option>");
				}else{
			copt.push("	<option value='"+this.nm+"'>"+this.val+"</option>");
				}
			});
			copt.push("</select>");
			return copt.join('');
		}
		
		var po = [];
		po.push("<div id='"+re+"_CT'>");
		po.push("<div style='padding:5px;'>엑셀데이터 확인</div>");
		po.push("<div style='width:"+this.config.ctWidth+"px;height:"+this.config.ctHeight+"px;overflow:auto;border:1px solid #ccc;'>");
		po.push("<form name='"+re+"_frm'>");
		po.push("	<table cellspacing='0' cellpadding='0'>");
		po.push("		<thead>");
		po.push("			<tr>");
		jQuery.each(colnames, function(){
		po.push("				<td>"+getCOPT(this.nm)+"</td>");
		});
		po.push("			</tr>");
		po.push("		</thead>");
		po.push("		<tbody>");
		jQuery.each(this.ds, function(idx, R){
		po.push("			<tr>");
			jQuery.each(colnames, function(icx, C){
		po.push("				<td class='nowrap' title='"+R[icx]+"'>"+R[icx]+"</td>");
			});
		po.push("			</tr>");
		});
		po.push("		</tbody>");
		po.push("	</table>");
		po.push("</form>");
		po.push("</div>");
		po.push("<div style='padding:10px;' align='right'><input type='button' value='변환완료' class='AXButton' id='"+re+"_convert' /> <input type='button' value='창 닫기' class='AXButton' id='"+re+"_close' /></div>");
		po.push("</div>");
		jQuery("#"+re).html(po.join(''));
		
		jQuery("#"+re+"_convert").bind("click", this.onInsert.bind(this));
		jQuery("#"+re+"_close").bind("click", this.onClose.bind(this));
		
		jQuery(".colNamesSelect").bind("change", this.onColNameSelect.bind(this));
	},
	onInsert: function(){
		var re = this.config.targetID;
		var frm = document[re+"_frm"];
		var cols = [];
		for(var a=0;a<frm.colNames.length;a++){
			cols.push(
				{
					nm:frm.colNames[a][frm.colNames[a].selectedIndex].value,
					val:frm.colNames[a][frm.colNames[a].selectedIndex].text
				}
			);
		}
		
		if(this.config.onConvert){
			this.config.onConvert({
				cols:cols,
				ds:this.ds
			});
		}
	},
	onColNameSelect: function(event){
		var selVal = event.target.value;
		jQuery(".colNamesSelect").each(function(){
			if(event.target != this)
				if(this.value == selVal) this.value = "";
		});
	}
});