/**
 * A simple autocomplete plugin in JavaScript
 *
 * @author Andre Figueira <andre.figueira@me.com>
 * @version 0.0.1
 */
$.fn.autocompleter = function(settings) {

    var options = $.extend({
        format: null,
        activeClass: 'active',
        formatPlaceholderRegex: /\{\{ (.*?) \}\}/g,
        resultsSelector: 'autocompleter-results',
        nameKey: 'name',
        'source': function(query, results) {},
        'resultClick': function(element) {}
    }, settings || {});

    var input = $(this);
    var autocompleterHtmlSelectorKey = options.resultsSelector;
    var autocompleterHtmlSelector = '.' + autocompleterHtmlSelectorKey;

    var UP_KEY = 38;
    var DOWN_KEY = 40;
    var ENTER_KEY = 13;
    var ESCAPE_KEY = 27;

    /**
     * Lets attach a keyup event on the input
     */
    $(document).on('keyup', input, function(e){
        var query = input.val();

        // Lets bind some specific key events on escape hide results
        if (e.keyCode === ESCAPE_KEY) {
            hideResults();

            return false;
        }

        // Lets bind the down key event to highlight the currently selected result item
        if (e.keyCode === DOWN_KEY) {
            var currentActiveItemSelector = autocompleterHtmlSelector + ' li.' + options.activeClass;
            if ($(currentActiveItemSelector).size() > 0) {
                var nextItem = $(currentActiveItemSelector).next('li');

                if (nextItem.size() > 0) {
                    $(currentActiveItemSelector).removeClass(options.activeClass);
                    nextItem.addClass(options.activeClass);
                }
            } else {
                if ($(autocompleterHtmlSelector + ' li').size() > 0) {
                    $(autocompleterHtmlSelector + ' li').first().addClass(options.activeClass);
                }
            }

            return false;
        }

        // Lets bind the up key to highlight the currently selected result item
        if (e.keyCode === UP_KEY) {
            var currentActiveItemSelector = autocompleterHtmlSelector + ' li.' + options.activeClass;
            if ($(currentActiveItemSelector).size() > 0) {
                var nextItem = $(currentActiveItemSelector).prev('li');

                if (nextItem.size() > 0) {
                    $(currentActiveItemSelector).removeClass(options.activeClass);
                    nextItem.addClass(options.activeClass);
                } else {
                    $(currentActiveItemSelector).removeClass(options.activeClass);
                }
            } else {
                if ($(autocompleterHtmlSelector + ' li').size() > 0) {
                    $(autocompleterHtmlSelector + ' li').first().addClass(options.activeClass);
                }
            }

            return false;
        }

        // Check for results in the callback
        options.source.call(this, query, function(sourceData){
            if (typeof sourceData !== 'object') {
                return false;
            }

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
     * Bind seperate event iincluding all key press ones for the other keys not
     * involved in the search
     */
    $(document).on('keyup keypress keydown', input, function(e){

        // Lets bind the enter key to go to a href data action as the window location if there is an active result item
        if (e.keyCode === ENTER_KEY) {
            var currentActiveItemSelector = autocompleterHtmlSelector + ' li.' + options.activeClass;

            if ($(currentActiveItemSelector).size() > 0) {

                e.preventDefault();
                e.stopPropagation();

                var activeItemEl = $(currentActiveItemSelector);

                options.resultClick.call(this, activeItemEl);

                return false;
            }
        }

    });

    /**
     * Lets setup a body click event to hide the results if we click away from them
     */
    $(document).on('click', $('body'), function(){
        hideResults();
    });

    /**
     * Lets not hide the results if we click them!
     */
    $(document).on('click', autocompleterHtmlSelector, function(e){
        e.stopPropagation();
    });

    function hideResults() {
        if ($(autocompleterHtmlSelector).size() > 0) {
            $(autocompleterHtmlSelector).hide();
        }
    }

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

        $.each(data, function(index, item){
            var dataAttr = '';

            $.each(item, function(key, value){
                dataAttr += 'data-' + key + '="' + value + '" ';
            });

            if (options.format == null) {
                html += '<li ' + dataAttr + '>' + item.name + '</li>';
            } else {
                var htmlContent = '<li ' + dataAttr + '>' + options.format + '</li>';

                html += htmlContent.replace(options.formatPlaceholderRegex, function(match, token){

                    return item[token];

                });;
            }
        });

        return html;
    }

};