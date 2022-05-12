
// có thể copy lại biến var errorElement = inputElement.parentElement.querySelector('.form-message')


    // ĐỐi tượng `function``
    //Hàm thực hiện validate
    function validator (options) {

        function onSubmit () {
            
        }
        var selectorRules = {};


        function validate (inputElement, rule) {
            var errorMessage;
            var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
            
            // Lấy ra rules của Selector
            var rules = selectorRules[rule.selector];

            //Lặp quá từng rule và kiểm tra
            //Nếu có lỗi thì dừng việc kiểm tra
            for(var i = 0; i < rules.length; i++) {
                errorMessage = rules[i](inputElement.value)
                if(errorMessage) break;
            }

            if(errorMessage) {
                errorElement.innerText = errorMessage;
                inputElement.parentElement.classList.add('validate');
            }else{
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('validate');
            }
            return !errorMessage
        }
        // Lấy element của form Validate
        var formElement = document.querySelector(options.form);
        
        if(formElement) {

            // Khi submitForm
            formElement.onsubmit = function(e) {
                e.preventDefault();

                var isSucess = true;
                // Thực hiện lặp qua từng rule vè validated all Rule
                options.rules.forEach (function (rule) {
                    var inputElement = formElement.querySelector(rule.selector)
                    var isFormSucess = validate (inputElement, rule);
                    if(!isFormSucess) {
                        isSucess = false;
                    }
                });
                if(isSucess) {
                    // Trường hợp Submit với javascript
                    if(typeof onSubmit === 'function'){

                        var enableInput = formElement.querySelectorAll('[name]:not([disable])') 
                        var formValue = Array.from (enableInput).reduce (function (values, input) {
                             values[input.name] = input.value;
                                return values;
                        }, {});
                        options.onSubmit(formValue);
                    }
                    // Trường hợp submit với hành vi mạc định
                    else{
                        formElement.submit();
                    }
                }
            }
            // Xử lý lặp qua mỗi rule (lắng nghe các sự kiện)
            options.rules.forEach (function (rule) {

                // Lưu lại các rule cho mỗi input
                if(Array.isArray(selectorRules[rule.selector])){
                    selectorRules[rule.selector].push(rule.test);
                }else {
                    selectorRules[rule.selector] =[rule.test];
                }

                var inputElement = formElement.querySelector(rule.selector)
                if(inputElement){
                    // Xử Lý trường hợp blur khỏi input
                    inputElement.onblur = function () {
                        validate (inputElement, rule)
                    }
                    // Xử lý mỗi khi người nhập vào inputElement
                    inputElement.oninput = function () {
                         var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
                        errorElement.innerText = '';
                        inputElement.parentElement.classList.remove('validate');
                    }
                }
            })
        }
    }
    
    // Định nghĩa  rules
    // Nguyên tắc của rules
    // 1. Khi có lỗi => Trả về message lỗi
    // 2. Khi không có lỗi => Không chả về cái gì (undefined)
    // .trim() loại bỏ tất cả các dấu cách ở bên dưới
validator.isRequired = function (selector) {
    return  {
        selector : selector,
        test : function (value) {
            return value.trim() ? undefined : "Vui lòng nhập trường này"
        }
        
    }
}

validator.isEmail = function (selector) {
    return  {
        selector : selector,
        test : function (value) {
            var regex =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là Email";
        }
    }
}
validator.minLength = function (selector,min) {
    return  {
        selector : selector,
        test : function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự` ;
        }
    }
}
validator.isComfirmed = function (selector,getConfirmValue, message) {
    return {
        selector: selector,
        test :function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }

    }
}