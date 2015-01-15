/*!
 * jquery.alert
 */
(function ($) {

    /**
     * Alert a link or a button
     * @param [options] {{title, text, confirm, cancel, confirmButton, cancelButton, post, confirmButtonClass}}
     */
    $.fn.alert = function (options) {
        if (typeof options === 'undefined') {
            options = {};
        }

        this.click(function (e) {
            e.preventDefault();

            var newOptions = $.extend({
                button: $(this)
            }, options);

            $.alert(newOptions, e);
        });

        return this;
    };

    /**
     * Show a confirmation dialog
     * @param [options] {{title, text, confirm, cancel, confirmButton, cancelButton, post, confirmButtonClass}}
     * @param [e] {Event}
     */
    $.alert = function (options, e) {
        // Do nothing when active confirm modal.
        if ($('.alert-modal').length > 0)
            return;

        // Parse options defined with "data-" attributes
        var dataOptions = {};
        if (options.button) {
            var dataOptionsMapping = {
                'title': 'title',
                'text': 'text',
                'close-button': 'closeButton',
                'close-button-class': 'closeButtonClass'
            };
            $.each(dataOptionsMapping, function(attributeName, optionName) {
                var value = options.button.data(attributeName);
                if (value) {
                    dataOptions[optionName] = value;
                }
            });
        }

        // Default options
        var settings = $.extend({}, $.alert.options, {
            close: function (o) {
            },
            button: null
        }, dataOptions, options);

        // Modal
        var modalHeader = '';
        if (settings.title !== '') {
            modalHeader =
            	'<div class="modal-header">' + 
            		'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            		'<h4 class="modal-title" id="alertModalLabel"><i class="' + settings.titleIcoClass + '"></i>  ' + settings.title + '</h4>' + 
            	'</div>';
        }
        var modalHTML =
                '<div class="alert-modal modal fade" tabindex="-1" role="dialog" aria-labelledby="alertModalLabel" aria-hidden="true">' +
                    '<div class="modal-dialog modal-sm">' +
                        '<div class="modal-content">' +
                            modalHeader +
                            '<div class="modal-body">' + settings.text + '</div>' +
                            '<div class="modal-footer">' +
                                '<button class="closebtn btn ' + settings.closeButtonClass + '" type="button" data-dismiss="modal">' +
                                    settings.closeButton +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

        var modal = $(modalHTML);

        modal.on('shown.bs.modal', function () {
            modal.find(".btn-primary:first").focus();
        });
        modal.on('hidden.bs.modal', function () {
            modal.remove();
        });
        modal.find(".closebtn").click(function () {
            settings.close(settings.button);
        });

        // Show the modal
        $("body").append(modal);
        modal.modal('show');
    };

    /**
     * Globally definable rules
     */
    $.alert.options = {
        text: "你确定?",
        title: "信息提示框",
        closeButton: "关闭",
        closeButtonClass: "btn-primary",
        titleIcoClass: "icon-warning text-warning"
    }
})(jQuery);
