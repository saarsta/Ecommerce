var $ = require('jquery');

$(function(){

    $("select", ".ticketInfo").change(function() {
        // change total price and set it in the url
        var numOfTickets = parseInt($(this).find('option:selected').text());
        var price = parseInt($('.columns').find('.price').text());
        var totalPrice = numOfTickets * price;

        $('.totalPrice span').text(totalPrice);
        $(".paymentLink", ".ticketInfo").attr("href", "/payment?p=" + totalPrice);
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
        $('#loadingAnimation').show();
        $.post('/payment', body).done(function(data){
            $('#loadingAnimation').hide();
            $('#thankYouMessage').show();
            $('#thankYouMessage').fadeOut(2700, function() {
                $(form).show();
            });

            //alert(data);
            /*
             // redirect to home page
             window.location.replace("../");
             */
        }).fail(function(e){
            $('#loadingAnimation').hide();
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