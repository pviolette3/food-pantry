$(function() {
    // set up typeahead search
    console.log('were alive!');

    function doAjax() {
            console.log('RUNNING AJAX!');
            var data = {
                name: $('#clientName').val(), 
                phone: $('#clientPhone').val()
            };
            console.log(JSON.stringify(data));
            $.ajax({ url:'/clients/search?name='+data.name + '&phone=' + data.phone, 
                    cache: false,
                    success: function(result) {
                        console.log(result);
                        if(result.length == 0) {
                            $('#searchResults').html('None found.');
                        }
                        var resultsTable = "<table>";
                        resultsTable += "<tr>";
                        resultsTable += "<th>Name</th>";
                        resultsTable += "<th>Phone</th>";
                        resultsTable += "<th>Sign In</th>";
                        resultsTable += "<th>More</th>";
                        resultsTable += "</tr>"
                        for(var i = 0; i < result.length; i++) {
                            var client = result[i];
                            resultsTable += "<tr>";
                            resultsTable += "<td>" + client.FirstName + " " +
                              client.LastName + "</td>";
                            resultsTable += "<td>" + client.Phone + "</td>";
                            resultsTable += '<td><a href="/pickups/signin/' + 
                                client.CID + '">Sign in</a></td>';
                            resultsTable += '<td><a href="/clients/' + client.CID + '">More</a></td>'
                            resultsTable += "</tr>";
                        }
                        resultsTable += "</table>";
                        $('#searchResults').html(resultsTable);
                    }
            });
    }

    var lastTimeout;

    function searchTypeListener() {
        console.log("Searching!!");
        $('#searchResults').html('Searching...');
        clearInterval(lastTimeout);
        lastTimeout = setTimeout(doAjax, 200);
    }
    $('#clientName').keyup(searchTypeListener);
    $('#clientPhone').keyup(searchTypeListener);
    

    function refreshHighlightTable() {
        var rows = $("#productTable tr:gt(0)"); 
        var targetName = $('#productSearch').val();
        console.log("REFRESH highlight, looking for " + targetName);

        rows.each(function() {
          var row = $(this);
          row.removeClass('highlight');
          row.children('td').each(function() {
            if($(this).html().toLowerCase().indexOf(targetName.toLowerCase()) !== -1) {
                console.log("GOT ONE: " + $(this).html());
                row.addClass('highlight');
            }
          });
        });
    }

    var lastProdTimeout;
    function productSearchTypeListener() {
        clearInterval(lastProdTimeout);
        lastProdTimeout = setTimeout(refreshHighlightTable, 200);  
    }

    $('#productSearch').keyup(productSearchTypeListener);
});
