
document.addEventListener('DOMContentLoaded', () => {

    let body = document.querySelector('body');
    let scrollWidth = window.innerWidth - document.documentElement.offsetWidth;
    function togglePadding() {

        let scrollWidthOnActive = window.innerWidth - document.documentElement.offsetWidth;
        if (scrollWidthOnActive == 0) {
            body.style.paddingRight = `${scrollWidth}px`;
        } else {
            body.style.paddingRight = ``;
        }
    }

    $('.popup-youtube').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: true,
        fixedContentPos: true,
        iframe: {
            markup: '<div class="mfp-iframe-scaler">' +
                '<div class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
                '</div>',
        }
    });


    const sendForm = document.querySelector('#sendForm');
    const messageForm = document.querySelector('#messageForm');

    const formAddError = (input) => {
        input.parentElement.classList.add('_error');
        input.classList.add('_error')
    }
    const formRemoveError = (input) => {
        input.parentElement.classList.remove('_error');
        input.classList.remove('_error')
    }
    // Функция проверки email
    const emailTest = (input) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !re.test(input.value);
    }
    // Функция проверки номера телефона
    function validatePhone(input) {
        let regex = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        return regex.test(input.value);
    }

    const formValidate = (form) => {
        let error = 0;
        let formReq = form.querySelectorAll('._req');
        for (let index = 0; index < formReq.length; index++) {
            const input = formReq[index];
            formRemoveError(input);
            if (input.classList.contains('_email')) {
                if (emailTest(input) || (input.value === '')) {
                    formAddError(input);
                    error++;
                }
            } else if (input.getAttribute('type') === 'tel') {
                if (!validatePhone(input) || (input.value === '')) {
                    formAddError(input);
                    error++;
                }
            }
            else {
                if (input.value === '') {
                    formAddError(input);
                    error++;
                }
            }
        }
        return error;
    }
    const formSend = async (e) => {
        let form = e.target;
        e.preventDefault();
        let error = formValidate(form);



        let formData = new FormData(form);
        if (error === 0) {
            form.classList.add('_sending')
            let response = await fetch('sendmail.php', {
                method: 'POST',
                body: formData
            });

            if (form.id === 'sendForm') {
                let messageForm = document.querySelector('.modal__message');
                messageForm.classList.add('active');
                document.body.style.overflow = 'hidden';
                togglePadding();
            }
            if (response.ok) {
                let result = await response.json();
                console.log(result.message);
                form.reset();
                //вывести модалку об успешной отправке
                form.classList.remove('_sending');

            } else {
                form.classList.remove('_sending');
                console.log('Ошибка');

            }
            if (form.closest('.modal__form') && form.closest('.modal__form').classList.contains('active')) {
                form.closest('.modal__form').classList.remove('active')
                document.body.style.overflow = '';
                body.style.paddingRight = ``;
            }
        } else {
            const errorMessage = "Заполнены не все обязательные поля";
            console.log(errorMessage);
        }
    }

    sendForm.addEventListener('submit', formSend);
    messageForm.addEventListener('submit', formSend);

    const swiper = new Swiper('.swiper-container', {
        // Optional parameters
        loop: true,
        autoHeight: true,
        breakpoints: {
            992: {
                autoHeight: false,
            }
        },
        speed: 600,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        preloadImages: false,
        lazy: true,
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });


    //Мобильное меню бургер
    const mobileMenuBtn = document.querySelector('.modile__menu');
    const mobileNavigation = document.querySelector('.header__nav');
    const menuOpened = (e) => {
        const btn = e.target.closest('.modile__menu');
        if ((mobileNavigation.classList.contains('active')
            && mobileMenuBtn.classList.contains('active')
            && !e.target.closest('.header__nav')
            && !btn) || (mobileNavigation.classList.contains('active') && e.target.closest('.list_item'))) {
            mobileMenuBtn.classList.remove('active')
            mobileNavigation.classList.remove('active')
            document.body.style.overflow = '';
            body.style.paddingRight = ``;
        }
        if (btn) {
            btn.classList.toggle('active')
            if (btn.classList.contains('active')) {
                mobileNavigation.classList.add('active')
                document.body.style.overflow = 'hidden';
                togglePadding();
            } else {
                mobileNavigation.classList.remove('active')
                document.body.style.overflow = '';
                body.style.paddingRight = ``;
            }
        }
    }
    document.addEventListener('click', menuOpened);



    const modalForm = document.querySelector('.modal__form');
    document.addEventListener('click', (e) => {
        const modalOpenBtn = e.target.closest('.open__modal');
        let messageForm = document.querySelector('.modal__message');
        if (e.target.closest('.modal_close')) {
            modalForm.classList.remove('active')
            document.body.style.overflow = '';
            body.style.paddingRight = ``;
        }

        if (!e.target.closest('.form__wrapper') && modalForm.classList.contains('active')) {
            modalForm.classList.remove('active');
            document.body.style.overflow = '';
            body.style.paddingRight = ``;
        }
        if (modalOpenBtn) {
            e.preventDefault();
            modalForm.classList.add('active');
            document.body.style.overflow = 'hidden';
            togglePadding();

        }

        if (messageForm.classList.contains('active') && (e.target.closest('#modal_btn_return') || !e.target.closest('.modal__mesage_content'))) {
            messageForm.classList.remove('active');
            document.body.style.overflow = '';
            body.style.paddingRight = ``;

        }



    })
});