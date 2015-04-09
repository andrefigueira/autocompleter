# autocompleter
JavaScript autocompleter plugin for jQuery

## Usage

- Attach the plugin to an input
- You can modify the result item by using format, parameters are passed with double curly braces these represent keys in your resultset
- You should define a source, it passes query and results, query being the input query results being the callback for your results, in this case we are using the callback to pass back ajax results
- You should define a resultClick action, this is what happens when a user clicks the result item

By default the result item which is an li element will be populated with the data for that result item from your resultset, e.g. data-name, data-description, etc..

    $('#header-search input').autocompleter({
        format: '<img src="{{ picture }}"> {{ name }}',
        source: function(query, results) {
            $.ajax({
                url: BASE_URL + 'ajax/search/query',
                method: 'get',
                data: {
                    query: query
                },
                success: function(result) {
                    results(result);
                }
            });
        },
        resultClick: function(element) {
            window.location = element.data('permalink');
        }
    });
