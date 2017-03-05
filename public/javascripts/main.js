var $ = require('jquery');

$(function () {

    // when changing number of tickets
    $("select", ".ticketInfo").change(function () {
        // change total price and set it in the url
        var numOfTickets = parseInt($(this).find('option:selected').text());
        var price = parseInt($('.columns').find('.price').text());
        var totalPrice = numOfTickets * price;

        $('.totalPrice span').text(totalPrice);
        $(".paymentLink", ".ticketInfo").attr("href", "/payment?tp=" + totalPrice);
    });

    // on submit $.POST a new purchase
    $('#paymentForm').submit(function (e) {
        e.preventDefault();
        var form = this;
        var container = $(form).closest('.mainContent');
        var params = ['email', 'firstName', 'lastName', 'country', 'totalPrice', 'productDescription'];
        var body = {};

        params.forEach(function (param) {
            body[param] = $('[name="' + param + '"]', form).val() || $('[name="' + param + '"]', form).text();
        });

        $(container).hide();
        $('#loadingAnimation').show();
        $.post('/payment', body).done(function (response) {

            // redirect if necessary (getting back from 3rd party payment)
            if (response.redirectURL) {
                location.href = response.redirectURL;
                return;
            } else {
                // show thank you message
                var thankMessage = $('#thankYouMessage');
                $('#loadingAnimation').hide();
                thankMessage.show();
                thankMessage.fadeOut(2700, function () {
                    var $orderConfirmed = $('.orderConfirmed');
                    $orderConfirmed.find('.email').text(body['email']);
                    $orderConfirmed.show();
                });
            }
        }).fail(function (e) {
            $('#loadingAnimation').hide();
            $(container).show();
            console.log(e);
            alert("Error, try again");
        });
    });

    // delete transaction line (admin)
    $(".delete").on("click", function () {
        var tr = $(this).parent(".trans");
        var id = tr.data("id");

        $.ajax({
            url: '/admin/payment?id=' + id,
            type: 'DELETE',
            success: function (result) {
                $(tr).fadeOut(500);
            }
        });
    });
});

