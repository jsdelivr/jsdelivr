<table class="col-10 mt1 ml1 transforming-table">    
    <!-- ko if: accepted -->
    <thead data-bind="template: headerTemplate">

    </thead>

    <tbody data-bind="template: bodyTemplate">

    </tbody>
    <!-- /ko -->
</table>


<template id="td_template_dept">
        <!-- ko foreach: tabledata -->
            <tr class="transforming-row">
                <td class="border" data-bind="text: headerValues[1].column"></td>
                <td class="border" data-bind="text: headerValues[2].column"></td>
                <td class="border" data-bind="text: headerValues[3].column"></td>                
            </tr>
        <!-- /ko -->
</template>

<template id="th_template_dept">
    <th data-bind="text: headerValues[1].name">First Number</th>
    <th data-bind="text: headerValues[2].name">Last Name</th>
    <th data-bind="text: headerValues[3].name">Email</th> 
</template>

