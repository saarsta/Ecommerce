var $ = require('jquery');

$(function(){

    $("select", ".ticketInfo").change(function() {
        // change total price and set it in the url
        var num_of_tickets = parseInt($(this).find('option:selected').text());
        var price = parseInt($('.columns').find('.price').text());
        var total_price = num_of_tickets * price;

        $('.totalPrice').text(total_price);
        $(".paymentLink", ".ticketInfo").attr("href", "/payment?=" + total_price);
    });

    $('#paymentForm').submit(function(e){
        e.preventDefault();
        var form = this;
        var params = ['email','firstName','lastName','country', 'totalPrice'];
        var body = {};
        params.forEach(function(param){
            body[param] = $('[name="' + param + '"]',form).val();
            /*body["date"] = Date.now();*/
        });
        $('#paymentForm').hide();
        $.post('/payment', body).done(function(data){
            $(form).show();
            alert(data);
            /*
             // redirect to home page
             window.location.replace("../");
             */
        }).fail(function(e){
            $(form).show();
            alert(e);
        });
    });


    $(".delete").on("click", function(){
        var tr = $(this).parent(".trans");
        var id = tr.data("id");

        $.ajax({
            url: '/admin/payment?id=' + id,
            type: 'DELETE',
            success: function(result) {
                $(tr).remove();
            }
        });
    });
});