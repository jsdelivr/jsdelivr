/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Chinese Traditional language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'zh' ] = {
	// ARIA description.
	editor: '富文本編輯器',
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: '按 ALT+0 以獲得幫助',

		browseServer: '瀏覽伺服器端',
		url: 'URL',
		protocol: '通訊協定',
		upload: '上傳',
		uploadSubmit: '上傳至伺服器',
		image: '影像',
		flash: 'Flash',
		form: '表單',
		checkbox: '核取方塊',
		radio: '選項按鈕',
		textField: '文字方塊',
		textarea: '文字區域',
		hiddenField: '隱藏欄位',
		button: '按鈕',
		select: '清單/選單',
		imageButton: '影像按鈕',
		notSet: '<尚未設定>',
		id: 'ID',
		name: '名稱',
		langDir: '語言方向',
		langDirLtr: '由左而右 (LTR)',
		langDirRtl: '由右而左 (RTL)',
		langCode: '語言代碼',
		longDescr: '詳細 URL',
		cssClass: '樣式表類別',
		advisoryTitle: '標題',
		cssStyle: '樣式',
		ok: '確定',
		cancel: '取消',
		close: '关闭',
		preview: '预览',
		resize: '拖拽改變大小',
		generalTab: '一般',
		advancedTab: '進階',
		validateNumberFailed: '需要輸入數字格式',
		confirmNewPage: '現存的修改尚未儲存，要開新檔案？',
		confirmCancel: '部份選項尚未儲存，要關閉對話盒？',
		options: '选项',
		target: '目标',
		targetNew: '新窗口(_blank)',
		targetTop: '整页(_top)',
		targetSelf: '本窗口(_self)',
		targetParent: '父窗口(_parent)',
		langDirLTR: '由左而右 (LTR)',
		langDirRTL: '由右而左 (RTL)',
		styles: '樣式',
		cssClasses: '樣式表類別',
		width: '寬度',
		height: '高度',
		align: '對齊',
		alignLeft: '靠左對齊',
		alignRight: '靠右對齊',
		alignCenter: '置中',
		alignTop: '靠上對齊',
		alignMiddle: '置中對齊',
		alignBottom: '靠下對齊',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: '高度必須為數字格式',
		invalidWidth: '寬度必須為數字格式',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, 已關閉</span>'
	}
};
