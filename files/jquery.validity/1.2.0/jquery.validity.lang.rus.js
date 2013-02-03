$.extend($.validity.messages, {
    require:"#{field} обязательное поле.",
    match:"#{field} неправильный формат.",
    integer:"#{field} должно быть положительным числом.",
    date:"#{field} должно быть отформатирован как дата. (число.месяц.Год, 04.05.2006)",
    email:"#{field} должно быть отформатированы как адреса электронной почты.",
    usd:"#{field} должно быть отформатированы как деньги США.",
    url:"#{field} должно быть отформатированы как URL.",
    number:"#{field} должно быть отформатирован в виде числа.",
    zip:"#{field} должно быть отформатированы как почтовый индекс. (###)",
    phone:"#{field} должно быть отформатированы как телефонный номер.",
    guid:"#{field} должно быть отформатированы как GUID (как {3F2504E0-4F89-11D3-9A0C-0305E82C3301}).",
    time24:"#{field} должно быть отформатированы 24-часовой.",
    time12:"#{field} должно быть отформатированы 12-часовой. (12:00 AM/PM)",

    // Value range messages:
    lessThan:"#{field} должно быть меньше #{max}.",
    lessThanOrEqualTo:"#{field} должно быть меньше или равным #{max}.",
    greaterThan:"#{field} должно быть больше #{min}.",
    greaterThanOrEqualTo:"#{field} должно быть больше или равно #{min}.",
    range:"#{field} должно быть между #{min} и #{max}.",

    // Value length messages:
    tooLong:"#{field} может быть не более #{max} букв.",
    tooShort:"#{field} может быть не меньше #{min} букв.}",

    // Aggregate validator messages:
    equal:"Значения не равны.",
    distinct:"Было повторено значения.",
    sum:"Показатели не добавить до #{sum}.",
    sumMax:"Сумма значений должно быть меньше #{max}.",
    sumMin:"Сумма значений должно быть больше #{min}.",

    nonHtml:"#{field} не может содержать символы HTML.",

    generic:"Неверно."
});

$.validity.setup({ defaultFieldName:"поле" });

$.extend($.validity.patterns, {
    // Based off of http://en.wikipedia.org/wiki/Calendar_date
    date:/^([012]\d|30|31)\.([01]\d)\.\d{1,4}$/, 
    
    // Russian postal codes, based off of http://en.wikipedia.org/wiki/List_of_postal_codes_in_Russia
    zip: /^\d{3}$/,
    
    // Russian phone number pattern from http://regexlib.com/REDetails.aspx?regexp_id=1463
    phone: /((8|\+7)-?)?\(?\d{3,5}\)?-?\d{1}-?\d{1}-?\d{1}-?\d{1}-?\d{1}((-?\d{1})?-?\d{1})?/
});
