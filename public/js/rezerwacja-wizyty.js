function evalDateAndTime(dateToEval, openingTime, closingTime, timeSpanH, intervalM) {
    let date = moment(dateToEval);

    openingTime = moment(date.format('MM/DD/YYYY') + " " + openingTime);
    closingTime = moment(date.format('MM/DD/YYYY') + " " + closingTime);

    if (date > closingTime.subtract(intervalM, 'minutes')) {
        date = date.add(1, 'days');
    }

    return date;
}

function initDatepickers(openingTime, closingTime, timeSpanH, intervalM) {
    let today = moment(new Date());
    //let today = moment('06/06/2020 00:32');

    let date = evalDateAndTime(today, openingTime, closingTime, timeSpanH, intervalM);

    $('#datefrom').datetimepicker({
        format: 'L',
        defaultDate: date,
        locale: 'pl'
    });

    $('#timefrom').datetimepicker({
        format: 'HH:mm',
        defaultDate: moment(date.format('MM/DD/YYYY') + ' 09:00'),
        locale: 'pl',
        maxDate: false
    });

    $('#timeto').datetimepicker({
        format: 'HH:mm',
        defaultDate: moment(date.format('MM/DD/YYYY') + ' 20:00'),
        locale: 'pl',
        maxDate: moment(date.format('MM/DD/YYYY') + ' 20:00')
    });

    $('#datefrom').on("change.datetimepicker", function (e) {
        // console.log(e.date.format('MM/DD/YYYY HH:mm'));

        $('#timeto').datetimepicker('maxDate', moment(e.date.format('MM/DD/YYYY') + ' 20:00'));
        $('#timeto').datetimepicker('date', moment(e.date.format('MM/DD/YYYY') + " " + $('#timeto').datetimepicker('viewDate').format('HH:mm')));
        $('#timefrom').datetimepicker('date', moment(e.date.format('MM/DD/YYYY') + " " + $('#timefrom').datetimepicker('viewDate').format('HH:mm')));
        
        // console.log("#timeFrom: " + $('#timefrom').datetimepicker('viewDate').format('MM/DD/YYYY HH:mm'));
        // console.log("#timeTo: " + $('#timeto').datetimepicker('viewDate').format('MM/DD/YYYY HH:mm'));
    });

    // $("#timefrom").on("change.datetimepicker", function (e) {
    //     $('#timeto').datetimepicker('minDate', e.date);
    // });
}

function initSelects() {
    $.ajax({
        url: "/lekarze/specjalnosci",
        type: "GET" 
    }).done(function (result) {
        console.log("done");
        // console.log(result);

        $.each(result, function(key, value) 
        {
            $('#specjalnosc').append('<option value=' + value['Specjalnosc'] + '>' + value['Specjalnosc'] + '</option>');
        });
    }).fail(function(jqXHR, textStatus) {
        console.log("fail: "+textStatus);
    });

    $("#specjalnosc").change(function() {
        let option = $(this).val();

        if (option !== "") {
            $("#lekarz").prop("disabled", false)
                        .empty()
                        .append('<option value="">Wybierz...</option>');

            $.ajax({
                url: "/lekarze/specjalnosci/"+option,
                type: "GET"     
            }).done(function (result) {
                console.log("done");
                // console.log(result);

                $.each(result, function(key, value) 
                {
                    $('#lekarz').append('<option value=' + value['ID'] + '>' + value["TytulNaukowy"] + " " + value['Imie'] + " " + value["Nazwisko"] + '</option>');
                });

                return result;
            }).fail(function(jqXHR, textStatus) {
                console.log("fail: "+textStatus);
            });

        }
        else {
            $("#lekarz").prop("disabled", true)
                        .empty()
                        .append('<option value="">Lekarz</option>');
        }
    });
}