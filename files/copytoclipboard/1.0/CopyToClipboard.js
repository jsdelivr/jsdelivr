var CopyToClipboard = CopyToClipboard || {};

CopyToClipboard.Events = CopyToClipboard.Events || {

    //Creates 'on' events for btn & input/textbox for copy to clipboard.
    InitializeCopyToClipboardTriggers: function (idPrefix) {
        try {
            var buttonId = idPrefix + "_btn_";
            var inputId = idPrefix + "_input_";

            CopyToClipboard.Events.SetUpOnClickEventOnBtn(buttonId);
            CopyToClipboard.Events.SetUpOnCopyEventOnInput(inputId, buttonId);

        } catch (err) {
            console.log(err);
        }
    },

    //btn on click event - when btn click is performed btn style is changed and input/textbox text is copied to clipboard.
    SetUpOnClickEventOnBtn: function (buttonId) {
        var browser = "";
        if (!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/))
            browser = "Safari";

        $(document).off('click.clipboard', '[id^="' + buttonId + '"]').on('click.clipboard', '[id^="' + buttonId + '"]', function (event) {
            var element = event.currentTarget.dataset["clipboardTarget"];
            CopyToClipboard.Events.SelectTextByElementId(element);
            document.execCommand('copy');
            if (browser !== "Safari") { //Avoid changing style since safari permissions won't allow copy using script.
                CopyToClipboard.Events.RevertBtnStyleToCopyCode(buttonId);

                var btn = $('#' + event.currentTarget.id);
                CopyToClipboard.Events.ChangeBtnStyleToCopied(btn);
            }
        });
    },

    //input copy event - when manual copy is performed on textbox/input btn style is changed.
    SetUpOnCopyEventOnInput: function (inputId, buttonId) {
        $(document).off('copy', '[id^="' + inputId + '"]').on('copy', '[id^="' + inputId + '"]', function (e) {
            
            CopyToClipboard.Events.RevertBtnStyleToCopyCode(buttonId);

            var btn = $('#' + e.target.id.replace('input', 'btn'));
            CopyToClipboard.Events.ChangeBtnStyleToCopied(btn);

            //Enable this only if ManualCopy doesn't work.
            //e.originalEvent.clipboardData.setData('text/plain', e.target.innerHTML);
        });
    },

    //Restore UI to its original look - COPY CODE.
    RevertBtnStyleToCopyCode: function (buttonId) {
        $('[id^="' + buttonId + '"]' + '.copied').removeClass('copied').html("<span class=\"copy\">COPY CODE</span>");
    },

    //Update UI - Copied.
    ChangeBtnStyleToCopied: function (button) {
        if (button != undefined) {
            $('#' + button[0].id).addClass('copied');
            button[0].innerHTML = "<span class=\"copied-text\"><span class=\"glyphicon glyphicon-check\" aria-hidden=\"true\"></span> COPIED</span>";
        }
    },

    //Selects text in textbox/input using element id.
    SelectTextByElementId: function (element) {
        var text = document.getElementById(element),
            range,
            selection;

        if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(text);
            range.select();
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
};