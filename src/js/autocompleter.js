/**
 * A simple autocomplete plugin in JavaScript
 *
 * @author Andre Figueira <andre.figueira@me.com>
 * @version 0.0.1
 */
$.fn.autocompleter = function(settings) {

    var options = $.extend({
        resultsSelector: 'autocompleter-results',
        'source': function(query, results) {}
    }, settings || {});

    var input = $(this);

    /**
     * Lets attach a keyup event on the input
     */
    $(document).on('keyup', input, function(){
        var query = input.val();

        // Check for results in the callback
        options.source.call(this, query, function(sourceData){
            if (typeof sourceData !== 'object') {
                return false;
            }

            var autocompleterHtmlSelectorKey = options.resultsSelector;
            var autocompleterHtmlSelector = '.' + autocompleterHtmlSelectorKey;

            if (query == '') {
                if ($(autocompleterHtmlSelector).size() > 0) {
                    $(autocompleterHtmlSelector).hide();
                }
            } else {
                if (sourceData.length > 0) {
                    if ($(autocompleterHtmlSelector).size() > 0) {
                        var itemResults = generateResultsItemsHtml(sourceData);

                        $(autocompleterHtmlSelector).html(itemResults);
                        $(autocompleterHtmlSelector).show();
                    } else {
                        var mainHtml = generateResultsHtml(sourceData);

                        input.after(mainHtml);
                    }
                } else {
                    if ($(autocompleterHtmlSelector).size() > 0) {
                        $(autocompleterHtmlSelector).hide();
                    }
                }
            }
        });
    });

    /**
     * Generates the full autocomplete dropdown, used on initial search
     *
     * @param sourceData
     * @returns {string}
     */
    function generateResultsHtml(sourceData) {
        var itemResults = generateResultsItemsHtml(sourceData);

        return '<ul class="autocompleter ' + options.resultsSelector + '">' + itemResults + '</ul>';
    }

    /**
     * Generates items html, used for initial call and subsequent calls
     *
     * @param data
     * @returns {string}
     */
    function generateResultsItemsHtml(data) {
        var html = '';

        // @todo: Make the item information here customisable
        $.each(data, function(index, item){
            html += '<li>' + item.name + '</li>';
        });

        return html;
    }

};