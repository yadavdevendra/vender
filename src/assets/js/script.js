$(document).ready(function() {
        
    
        $(function() {
            $(window).scroll(function() {
                var aTop = $('nav').height();
                if ($(this).scrollTop() >= 50) {
                    $("nav").addClass("shrinked");

                    // instead of alert you can use to show your ad
                    // something like $('#footAd').slideup();
                } else {
                    $("nav").removeClass("shrinked");
                }
            });
        });
    })


    setTimeout(function() {

            $('.follow-easy-carousel').owlCarousel({
                loop: false,
                margin: 10,
                nav: false,
                responsiveClass:true,
                items:1
            })
            
            $('.blog-owl-carousel').owlCarousel({
                loop: false,
                margin: 10,
                nav: false,
                responsiveClass:true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 2
                    },
                    1000: {
                        items: 2
                    }
                }
            })

        }, 3000);
    /*Floating Label Script*/
var formFields = $('.floating-label');

formFields.each(function() {
    var field = $(this);
    var input = field.find('input');
    var label = field.find('label');

    function checkInput() {
        var valueLength = input.val().length;

        if (valueLength > 0) {
            input.addClass('focus-visible')
        } else {
            input.removeClass('focus-visible')
        }
    }

    input.change(function() {
        checkInput()
    })
});

// Disable form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Get the forms we want to add validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();
// Example starter JavaScript for disabling form submissions if there are invalid fields
// (function() {
//     'use strict'

//     // Fetch all the forms we want to apply custom Bootstrap validation styles to
//     var forms = document.querySelectorAll('.needs-validation')

//     // Loop over them and prevent submission
//     Array.prototype.slice.call(forms)
//         .forEach(function(form) {
//             form.addEventListener('submit', function(event) {
//                 if (!form.checkValidity()) {
//                     event.preventDefault()
//                     event.stopPropagation()
//                 }

//                 form.classList.add('was-validated')
//             }, false)
//         })
// })()