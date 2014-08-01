
if(!window.AXConfig){
	/**
	 * AXISJ library default config
	 * ```json
	 * AXconfig.weekDays = [{label:""},..];
	 * AXConfig.AXReq.contentType = "";
	 * ```
	 * @namespace AXConfig
	 */
	var AXConfig = {
		/**
		 * calendar weekDays label
		 * @memberof AXConfig
		 */
		weekDays: [
			{ label: "일" },
			{ label: "월" },
			{ label: "화" },
			{ label: "수" },
			{ label: "목" },
			{ label: "금" },
			{ label: "토" }
		],
		/**
		 * AXReq default config
		 * @memberof AXConfig
		 */
		AXReq: {
			async: true, // AJAX 비동기 처리 여부
			okCode: "ok", // 통신 성공 코드
			responseType: "", // AJAX responseType
			dataType: "", // AJAX return Data type
			contentType: "application/x-www-form-urlencoded; charset=UTF-8", // AJAX contentType
			dataSendMethod: "parameter", // AJAX parameter send type
			crossDomain: false,
			resultFormatter: function () { // onsucc formatter
				return this;
			}
		},
		/**
		 * AXGrid default config
		 * @memberof AXConfig
		 */
		AXGrid: {
			passiveMode: false,
			passiveRemoveHide: false,
			fitToWidthRightMargin: 10,
			fitToWidth: false,
			pageSize: 10,
			pageHeight: 400,
			keyResult: "result",
			keyList: "list",
			emptyListMSG: "empty of list",
			listCountMSG: "<b>{listCount}</b> count(s)",
			pageCountMSG: "page(s)"
		},
		/**
		 * AXTree default config
		 * @memberof AXConfig
		 */
		AXTree: {
			fitToWidthRightMargin: 10,
			fitToWidth: false,
			pageSize: 10,
			pageHeight: 400,
			keyResult: "result",
			keyTree: "tree",
			keyList: "list",
			emptyListMSG: "목록이 없습니다."
		},
		/**
		 * AXProgress default config
		 * @memberof AXConfig
		 */
		AXProgress: {
			cancelMsg: "프로세스를 취소 하시겠습니까?"
		},
		/**
		 * AXUpload5 default config
		 * @memberof AXConfig
		 */
		AXUpload5: {
			buttonTxt: "Upload files",
			deleteConfirm: "정말 삭제하시겠습니까?",
			uploadSelectTxt: "업로드 하실 파일을 선택해주세요.",
			dropZoneTxt: "업로드할 파일을 여기에 놓습니다."
		},
		/**
		 * AXModal default config
		 * @memberof AXConfig
		 */
		AXModal: {
			contentDivClass: "bodyHeightDiv"
		},
		/**
		 * AXInput default config
		 * @memberof AXConfig
		 */
		AXInput: {
			errorPrintType: "toast",
			selectorOptionEmpty: "목록이 없습니다.",
			yearText:"{year}년",
			monthText:"{month}월",
			confirmText:"확인"
		},
		/**
		 * AXContextMenu default config
		 * @memberof AXConfig
		 */
		AXContextMenu: {
			title:"선택하세요"
		},
		/**
		 * mobile default config
		 * @memberof AXConfig
		 */
		mobile: {
			responsiveWidth: 0
		}
	};
}