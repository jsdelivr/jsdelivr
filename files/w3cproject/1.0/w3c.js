/*!
 * aJax API W3CProject v1.0 (http://w3cproject.xyz/)
 * git repository: https://github.com/w3cproject/ajaxapi.git
 */

"use strict";

/**
 * Default values
 */

var defaultValues = [{
    "info": {
        "clearForm": "W3CProject Form success clear!",
        "submitForm": "W3CProject Form success submit!",
        "alertMessageShow": "W3CProject Message Alert Show!",
        "alertMessageHide": "W3CProject Message Alert Hide!"
    }
}];

/**
 * W3CProject Object
 */

function W3CProject() {
    var defaultValuesInfo = defaultValues[0].info;
    this._clearFormResponse = defaultValuesInfo.clearForm;
    this._submitFormResponse = defaultValuesInfo.submitForm;
    this._alertMessageShow = defaultValuesInfo.alertMessageShow;
    this._alertMessageHide = defaultValuesInfo.alertMessageHide;
}

/**
 * Send form with ajax and clearForm
 * @param {Object} params
 */

W3CProject.prototype.ajaxSubmit = function (params) {
    var _ = this,
        form = params.form,
        file = params.file,
        data = params.data,
        clear = params.clear || false;

    form.submit(function (e) {
        $.ajax({
            url: file,
            method: 'POST',
            data: data || form.serialize(),
            success: function (response) {
                console.info(_._submitFormResponse);

                if (clear === true) {
                    _.clearForm(form, 'input, textarea');

                    console.info(_._clearFormResponse);
                }
            },
            error: function (response) {
                console.log(response);
            }
        });

        e.preventDefault();
    });

    return _;
};

/**
 * Load html content to selector
 * @param {Object} selector
 * @param {Object} html
 */

W3CProject.prototype.loadContentHtml = function (selector, html) {
    selector[0].innerHTML = html;
};

/**
 * Load content from file to selector
 * @param {Object} selector
 * @param {Object} file
 */

W3CProject.prototype.loadContentFile = function (selector, file) {
    selector.load(file);
};

/**
 * Clear form input values
 * @param {Object} form
 * @param {String} selectors
 */

W3CProject.prototype.clearForm = function (form, selectors) {
    var inputs = form.find(selectors);

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        if (input.type !== 'submit') {
            input.value = '';
        }
    }
};

/**
 * Show and hide message with fade
 * @param {Object} params
 */

W3CProject.prototype.alertMessage = function (params) {
    var _ = this,
        selector = params.selector,
        message = params.message || 'Form success send',
        timeOut = params.timeOut || 4000,
        speed = params.speed || 400,
        target = params.target,
        event = params.event || 'click';

    function printMsg() {
        selector.text(message);

        selector.fadeIn(speed);

        console.info(_._alertMessageShow);

        setTimeout(function () {
            selector.fadeOut(speed);
            console.info(_._alertMessageHide);
        }, timeOut);
    }

    target[0].addEventListener(event, function () {
        printMsg();
    });

    return this;
};

/**
 * Check if element is disabled (return boolean)
 * @param {Object} selector
 */

W3CProject.prototype.isDisabled = function (selector) {
    return selector.attr('disabled') === 'disabled';
};

/**
 * Debug
 * @param {Object} response
 */

W3CProject.prototype.debug = function (response) {
    /*var links = document.querySelectorAll('a');

     for(var i = 0; i < links.lenght; i++) {
     var link = links[i];

     link.addEventListener('click', function () {

     });
     }*/

    return 'debug method here';
};
