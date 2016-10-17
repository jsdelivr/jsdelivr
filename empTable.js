define(['knockout','ojs/ojcore', 'jquery', 
         'ojs/ojknockout', 'promise', 'ojs/ojdatagrid',
           'ojs/ojarraydatagriddatasource',
          'ojs/ojchart'], function(ko, oj, $) {

 function tableViewModel(context){
     var self = this;
     self.expanded = ko.observable(false);
     var propsPromise = context.props;     
     var element = context.element;
     var objectId = null;
     var objectType = null;
     var columnsList = null;    

     propsPromise.then(function(props){    
        objectId = props.objectId;
        objectType = props.objectType;
        console.log("objectId: "+objectId + "objectType: "+objectType);
        self.styleForHeader= 'width: 75%; height: 20%;';
        self.primaryKey=props.primaryKey;
        self.tabledata = ko.observableArray();
        self.accepted = ko.observable(false);
        self.cellExpanded = ko.observable(false);
        if(objectType=="Employee"){
            columnsList = "[" +
     "{\"column\": \"EMP_ID\", \"name\": \"Employee ID\"}, " +
     "{\"column\": \"FIRST_NAME\", \"name\": \"First Name\"}, " +
     "{\"column\": \"LAST_NAME\", \"name\": \"Last Name\"}," +
     "{\"column\": \"email\", \"name\": \"Email\"}," +
     "{\"column\": \"PHONE_NUMBER\", \"name\": \"Phone Number: \"}," +
     "{\"column\": \"HIRE_DATE\", \"name\": \"Hire Date:\"}," +
     "{\"column\": \"JOB_ID\", \"name\": \"Job ID\"}, " +
     "{\"column\": \"Salary\", \"name\": \"Salary\"}," +
     "{\"column\": \"COMMISSION_PACT\", \"name\": \"Commission Pact\"}, " +
     "{\"column\": \"ManagerID\", \"name\": \"Manager ID\"}," +
     "{\"column\": \"DepartmentID\", \"name\": \"DepartmentID\"}"+
     "]"; 
            self.headerValues=JSON.parse(columnsList);
            console.log("In Department self.headerValues: "+self.headerValues);       
            $.getJSON("http://indl144125.idc.oracle.com:7011/sales/js/dummydata.json", {PARAM_ID : objectId}, function(data){
                 $.map(data.items, function(val, i){
                 //console.log("Hello: "+val.headerValues[0].column+"-"+val.headerValues[1].name+"-"+val.headerValues[2].name+"-"+val.headerValues[3].name+"-"+val.headerValues[4].name+"-"+val.headerValues[5].name);      
                    if(val.headerValues[10].column==objectId){
                        self.tabledata.push(val);
        }
                 });
                 self.headerTemplate = 'th_template_dept';
                 self.bodyTemplate = 'td_template_dept';
                 self.accepted(true);
            });            
        }else{
            columnsList = "[" +
                 "{\"column\": \"ID\", \"name\": \"ID\"}, " +
                 "{\"column\": \"FIRST_NAME\", \"name\": \"Location\"}, " +
                 "{\"column\": \"LAST_NAME\", \"name\": \"Location Code\"}," +
                 "{\"column\": \"DepartmentID\", \"name\": \"DepartmentID\"}"+
                 "]";
            self.headerValues=JSON.parse(columnsList);
            console.log("In Location self.headerValues: "+self.headerValues);
            $.getJSON("http://indl144125.idc.oracle.com:7011/sales/js/dummydata.json", {PARAM_ID : objectId}, function(data){
                 $.map(data.items, function(val, i){
                // console.log("Hello: "+val.headerValues[0].column+"-"+val.headerValues[1].name+"-"+val.headerValues[2].name+"-"+val.headerValues[3].name+"-"+val.headerValues[4].name+"-"+val.headerValues[5].name);      
                    if(val.headerValues[3].column==objectId){
                        self.tabledata.push(val);
                    }
                 });
                 self.headerTemplate = 'th_template_loc';
                 self.bodyTemplate = 'td_template_loc';
             self.accepted(true);
        });
        }
        
        

     });
        }
    return tableViewModel;

});
