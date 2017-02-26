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
        var container = $(form).closest('.mainContent');
        var params = ['email','firstName','lastName','country'];
        var body = {};
        body = {totalPrice: $('[name="totalPrice"]', form).data('price')};
        params.forEach(function(param){
            body[param] = $('[name="' + param + '"]',form).val();
        });

        $(container).hide();
        $('#loadingAnimation').show();
        $.post('/payment', body).done(function(data){
            var thankMessage = $('#thankYouMessage');
            $('#loadingAnimation').hide();
            thankMessage.show();
            thankMessage.fadeOut(2700, function() {
                var $orderConfirmed = $('.orderConfirmed');
                $orderConfirmed.find('.email').text(body['email']);
                $orderConfirmed.show();

            });
        }).fail(function(e){
            $('#loadingAnimation').hide();
            $(container).show();
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
                $(tr).fadeOut(500);
               /* $(tr).remove();*/
            }
        });
    });
});