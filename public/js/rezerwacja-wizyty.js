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

function showAvailableAppointments(event) {
    event.preventDefault();

    if (!validateSearchInput())
        return;

    let lekarz = $('#lekarz').val();

    $.ajax({
        url: "/lekarze/"+lekarz+"/przyjecia",
        type: "GET",
        dataType: 'json'  
    }).done(function (przyjecia) {
        console.log("done");
        console.log($('#datefrom').datetimepicker('viewDate').format('YYYY-MM-DD'));
        
        $.ajax({
            url: "/wizyty/zajete/data/" + $('#datefrom').datetimepicker('viewDate').format('YYYY-MM-DD'),
            type: "GET",
            // data: { 
            //     'data': $('#datefrom').datetimepicker('viewDate').format('YYYY-MM-DD')
            // },
            dataType: 'json'  
        }).done(function (zajetosc) {
            console.log("done");

            let zajeteGodziny = []

            zajetosc.forEach(value => {
                let time = moment(value.Data).format('HH:mm');
                zajeteGodziny.push(time);
            });

            console.log("zajeteGodziny: ");
            console.log(zajeteGodziny);

            let appoint = generateAppointments(zajetosc, przyjecia, 0.5);

            if (appoint == false) {
                $("#lista-wizyt").html("<div class=\"alert alert-primary\" role=\"alert\" style=\"margin-top: 30px;\">Brak możliwości umówienia wizyty w tym dniu.</div>");
                return;
            }
            
            let string = '<table class="table"><thead><tr> <th>Godzina</th><th>Data</th><th>Lekarz</th><th class="cell-align-right">Rezerwuj wizytę</th></tr></thead>';
            
            let rowCounter = 1;

            appoint.forEach(timeslot => {
                string +=   "<tr id=\"rezerwuj-row-"+rowCounter+"\"><td>" + timeslot + "</td><td>"+$('#datefrom').datetimepicker('viewDate').format("DD.MM")+'</td>\
                            <td>'+przyjecia[0].TytulNaukowy + " " + przyjecia[0].Imie + " " + przyjecia[0].Nazwisko +"</td>\
                            <td class=\"cell-align-right\">\
                            <input name=\"godzina\" type=\"hidden\" value=\""+timeslot+"\"/>\
                            <input name=\"data\" type=\"hidden\" value=\""+$('#datefrom').datetimepicker('viewDate').format("DD.MM")+"\"/>\
                            <input name=\"lekarz\" type=\"hidden\" value=\""+ przyjecia[0].NumerPWZ +"\"/>\
                            <a id=\"rezerwuj-nowa-"+rowCounter+"\" href=\"rezerwuj-wizyte\\utworz\" class=\"btn btn-outline-primary rezerwuj-nowa\">Rezerwuj</a>\
                            </td>\
                            </tr>";
                rowCounter++;
            });

            string += '</table>'; 
            $("#lista-wizyt").html(string); 

            return;

        }).fail(function(jqXHR, textStatus) {
            console.log("fail: "+textStatus);
        });

        return;
    }).fail(function(jqXHR, textStatus) {
        console.log("fail: "+textStatus);
    });
}

function initAppointmentsSearch() {
    $("#rezerwacja").submit(function(event){
        showAvailableAppointments(event)
    });
}