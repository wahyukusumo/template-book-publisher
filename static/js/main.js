var swiper = new Swiper('#swiper-large', {
    slidesPerView: 1,
    spaceBetween: 10,
    freeMode: true,
    loop: true,
    lazy: true,
    // init: false,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        280: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        480: {
            slidesPerView: 5,
            spaceBetween: 10,
        },
        768: {
            slidesPerView: 6,
            spaceBetween: 10,
        },
        1200: {
            slidesPerView: 7,
            spaceBetween: 10,
        }
    }
});

var swiper = new Swiper('#swiper-small', {
    slidesPerView: 1,
    spaceBetween: 10,
    freeMode: true,
    loop: true,
    lazy: true,
    // init: false,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        280: {
            slidesPerView: 2,
            spaceBetween: 10,
        },
        480: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        1200: {
            slidesPerView: 4,
            spaceBetween: 10,
        }
    }
});

var swiper = new Swiper('#swiper-preview', {
    slidesPerView: 1,
    spaceBetween: 10,
    freeMode: true,
    loop: true,
    //lazy: true,
    // init: false,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        280: {
            slidesPerView: 3,
            spaceBetween: 10,
        },
        480: {
            slidesPerView: 5,
            spaceBetween: 10,
        },
        768: {
            slidesPerView: 6,
            spaceBetween: 10,
        },
        1200: {
            slidesPerView: 7,
            spaceBetween: 10,
        }
    }
});

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

$(function() {
    $('.lazy').Lazy();
});

function myFunction() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchBookStore");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableBookStore");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
