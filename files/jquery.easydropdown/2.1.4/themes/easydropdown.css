/* --- EASYDROPDOWN DEFAULT THEME --- */

/* PREFIXED CSS */

.dropdown,
.dropdown div,
.dropdown li,
.dropdown div::after{
	-webkit-transition: all 150ms ease-in-out;
	-moz-transition: all 150ms ease-in-out;
	-ms-transition: all 150ms ease-in-out;
	transition: all 150ms ease-in-out;
}

.dropdown .selected::after,
.dropdown.scrollable div::after{
	-webkit-pointer-events: none;
	-moz-pointer-events: none;
	-ms-pointer-events: none;
	pointer-events: none;
}

/* WRAPPER */

.dropdown{
	position: relative;
	width: 160px;
	border: 1px solid #ccc;
	cursor: pointer;
	background: #fff;

	border-radius: 3px;
	
	-webkit-user-select: none;
	-moz-user-select: none;
	user-select: none;
}

.dropdown.open{
	z-index: 2;
}

.dropdown:hover{
	box-shadow: 0 0 5px rgba(0,0,0,.15);
}

.dropdown.focus{
	box-shadow: 0 0 5px rgba(51,102,248,.4);
}

/* CARAT */

.dropdown .carat{
	position: absolute;
	right: 12px;
	top: 50%;
	margin-top: -4px;
	border: 6px solid transparent;
	border-top: 8px solid #000;
}

.dropdown.open .carat{
	margin-top: -10px;
	border-top: 6px solid transparent;
	border-bottom: 8px solid #000;
}

.dropdown.disabled .carat{
	border-top-color: #999;
}

/* OLD SELECT (HIDDEN) */

.dropdown .old{
	position: absolute;
	left: 0;
	top: 0;
	height: 0;
	width: 0;
	overflow: hidden;
}

.dropdown select{
	position: absolute;
	left: 0px;
	top: 0px;
}

.dropdown.touch .old{
	width: 100%;
	height: 100%;
}

.dropdown.touch select{
	width: 100%;
	height: 100%;
	opacity: 0;
}

/* SELECTED FEEDBACK ITEM */ 

.dropdown .selected,
.dropdown li{
	display: block;
	font-size: 18px;
	line-height: 1;
	color: #000;
	padding: 9px 12px;
	overflow: hidden;
	white-space: nowrap;
}

.dropdown.disabled .selected{
	color: #999;
}

.dropdown .selected::after{
	content: '';
	position: absolute;
	right: 0;
	top: 0;
	bottom: 0;
	width: 60px;
	
	border-radius: 0 2px 2px 0;
	box-shadow: inset -55px 0 25px -20px #fff;
}

/* DROP DOWN WRAPPER */

.dropdown div{
	position: absolute;
	height: 0;
	left: -1px;
	right: -1px;
	top: 100%;
	margin-top: -1px;
	background: #fff;
	border: 1px solid #ccc;
	border-top: 1px solid #eee;
	border-radius: 0 0 3px 3px;
	overflow: hidden;
	opacity: 0;
}

/* Height is adjusted by JS on open */

.dropdown.open div{
	opacity: 1;
	z-index: 2;
}

/* FADE OVERLAY FOR SCROLLING LISTS */

.dropdown.scrollable div::after{
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 50px;
	
	box-shadow: inset 0 -50px 30px -35px #fff;
}

.dropdown.scrollable.bottom div::after{
	opacity: 0;
}

/* DROP DOWN LIST */

.dropdown ul{
	position: absolute;
	left: 0;
	top: 0;
	height: 100%;
	width: 100%;
	list-style: none;
	overflow: hidden;
}

.dropdown.scrollable.open ul{
	overflow-y: auto;
}

/* DROP DOWN LIST ITEMS */

.dropdown li{
	list-style: none;
	padding: 8px 12px;
}

/* .focus class is also added on hover */

.dropdown li.focus{
	background: #d24a67;
	position: relative;
	z-index: 3;
	color: #fff;
}

.dropdown li.active{
	font-weight: 700;
}