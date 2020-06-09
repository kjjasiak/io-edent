function decToTime(timeString){
    var sign = timeString < 0 ? "-" : "";
    var hours = Math.floor(Math.abs(timeString));
    var minutes = Math.floor((Math.abs(timeString) * 60) % 60);
    return sign + (hours < 10 ? "0" : "") + hours + ":" + (minutes < 10 ? "0" : "") + minutes;
}

function timeToDecimal(timeString) {
    let time = timeString.split(':');
    let hours = parseFloat(time[0]);
    let minutes = parseFloat((time[1]/60.0).toFixed(2));
    return parseFloat(hours+minutes);
}

function evalDayName(dayNumber) {
    let days = ['poniedziałki', 'wtorki', 'środy', 'czwartki', 'piątki', 'soboty', 'niedziele'];
    return days[dayNumber];
}

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
        $('#timeto').datetimepicker('maxDate', moment(e.date.format('MM/DD/YYYY') + ' 20:00'));
        $('#timeto').datetimepicker('date', moment(e.date.format('MM/DD/YYYY') + " " + $('#timeto').datetimepicker('viewDate').format('HH:mm')));
        $('#timefrom').datetimepicker('date', moment(e.date.format('MM/DD/YYYY') + " " + $('#timefrom').datetimepicker('viewDate').format('HH:mm')));
    });
}

function initSelects() {
    $.ajax({
        url: "/lekarze/specjalnosci",
        type: "GET" 
    }).done(function (result) {
        console.log("done");

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

function validateSearchInput() {
    let date = $('#datefrom').datetimepicker('viewDate');
    let timeFrom = $('#timefrom').datetimepicker('viewDate');
    let timeTo = $('#timeto').datetimepicker('viewDate');
    let specjalnosc = $('#specjalnosc').val();
    let lekarz = $('#lekarz').val();

    timeFrom = moment(date.format('MM/DD/YYYY') + " " + timeFrom.format('HH:mm'));
    timeTo = moment(date.format('MM/DD/YYYY') + " " + timeTo.format('HH:mm'));

    let valid = true;
    let today = moment(new Date()).format('MM/DD/YYYY');

    if (date < moment(today + " 00:00")) {
        $('#datefrom .invalid-tooltip').html("Data nie może być wcześniejsza niż obecna");
        $('#datefrom input').removeClass('is-valid').addClass('is-invalid');
        valid = false;
    }
    else {
        $('#datefrom input').removeClass('is-invalid').addClass('is-valid');
    }

    if (timeTo < timeFrom) {
        $('#timeto .invalid-tooltip').html("Godzina do musi być godziną późniejszą niż Godzina od");
        $('#timeto input').removeClass('is-valid').addClass('is-invalid');
        valid = false;
    }
    else {
        $('#timeto input').removeClass('is-invalid').addClass('is-valid');
    }

    if (specjalnosc == '') {
        $('#specjalnosc').parent('.form-group').css('position', 'relative');
        $('#specjalnosc ~ .invalid-tooltip').html("Proszę wybrać specjalność");
        $('#specjalnosc').removeClass('is-valid').addClass('is-invalid');
        valid = false;
    }
    else {
        $('#specjalnosc').removeClass('is-invalid').addClass('is-valid');
    }

    if (!$('#lekarz').is(':disabled')) {
        if (lekarz == '') {
            $('#lekarz').parent('.form-group').css('position', 'relative');
            $('#lekarz ~ .invalid-tooltip').html("Proszę wybrać lekarza");
            $('#lekarz').removeClass('is-valid').addClass('is-invalid');
            valid = false;
        }
        else {
            $('#lekarz').removeClass('is-invalid').addClass('is-valid');
        }
    }

    if (valid) {
        $('#datefrom input, #timefrom input, #timeto input').removeClass('is-invalid').addClass('is-valid');
    }

    return valid;
}

function showAvailableAppointments(event) {
    event.preventDefault();

    if (!validateSearchInput())
        return;

    let lekarz = $('#lekarz').val();

    $.ajax({
        url: "/lekarze/" + lekarz + "/przyjecia",
        type: "GET",
        dataType: 'json'  
    }).done(function (przyjecia) {
        console.log("done");
        
        $.ajax({
            url: "/wizyty/zajete/data/" + $('#datefrom').datetimepicker('viewDate').format('YYYY-MM-DD'),
            type: "GET",
            dataType: 'json'  
        }).done(function (zajetosc) {
            console.log("done");

            let zajeteGodziny = [];

            zajetosc.forEach(value => {
                let time = moment(value.Data).format('HH:mm');
                zajeteGodziny.push(time);
            });

            let appoint = generateAppointments(zajetosc, przyjecia, 0.5);

            if (appoint == false) {
                let string = "<div class=\"alert alert-primary\" role=\"alert\" style=\"margin-top: 30px;\">Brak możliwości umówienia wizyty w tym dniu.\
                                <br/>" + przyjecia[0].TytulNaukowy + " " + przyjecia[0].Imie + " " + przyjecia[0].Nazwisko + " przyjmuje w";
                
                let dniPrzyjec = przyjecia[0].DniPrzyjec.split(';');

                dniPrzyjec.forEach((dzien, index) => {
                    string += ' ' + evalDayName(parseInt(dzien) - 1);

                    if ((dniPrzyjec.length > 2) && (index < (dniPrzyjec.length - 2))) {
                        string += ',';
                    }

                    if ((dniPrzyjec.length > 1) && (index == (dniPrzyjec.length - 2))) {
                        string += ' i';
                    }
                });

                string += ".</div>";
                
                $("#lista-wizyt").html(string);

                return;
            }
            
            let string = '<table class="table"><thead><tr> <th>Godzina</th><th>Data</th><th>Lekarz</th><th class="cell-align-right">Rezerwuj wizytę</th></tr></thead>';
            let rowCounter = 1;

            appoint.forEach(timeslot => {
                string +=   "<tr id=\"rezerwuj-row-"+rowCounter+"\"><td>" + timeslot + "</td><td>"+$('#datefrom').datetimepicker('viewDate').format("DD.MM.YYYY")+'</td>\
                            <td>'+przyjecia[0].TytulNaukowy + " " + przyjecia[0].Imie + " " + przyjecia[0].Nazwisko +"</td>\
                            <td class=\"cell-align-right\">\
                            <input name=\"godzina\" type=\"hidden\" value=\""+timeslot+"\"/>\
                            <input name=\"data\" type=\"hidden\" value=\""+$('#datefrom').datetimepicker('viewDate').format("DD.MM.YYYY")+"\"/>\
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

function makeReservation(e, idPacjenta) {
    e.preventDefault();
    
    let splitID = e.target.id.split('-');
    let ID = splitID[splitID.length-1];

    let godzina = $('#rezerwuj-row-'+ID+' input[name="godzina"]').val();
    let godzinaJS = godzina.split(':');
    let data = $('#datefrom').datetimepicker('viewDate').format('YYYY-MM-DD');
    let lekarz = $('#rezerwuj-row-'+ID+' input[name="lekarz"]').val();

    $.ajax({
        url: '/wizyty/zajete/data/' + data + '/godzina/' + godzina + ':00/lekarz/' + lekarz,
        type: "GET",
        dataType: 'json'  
    }).done(function (check) {
        console.log("done");

        if (check[0].liczba != 0) {
            $("#lista-wizyt").prepend("<div class=\"alert alert-primary alert-dismissable fade show\" role=\"alert\" style=\"margin-top: 30px;\"><span>Przykro nam, ale ktoś inny zdążył już zarezerwować ten termin. Prosimy wybrać inny.</span><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></div>");
            $('#rezerwuj-row-'+ID).remove();
            return;
        }

        let dataJS = moment(data + ' ' + godzina + ':00');

        $.ajax({
            url: "/wizyty/nowa-wizyta",
            type: "POST",
            data: {
                'IDPacjenta': idPacjenta,
                'PWZLekarza': lekarz,
                'Data': data + ' ' + godzina + ':00',
                'DataJS': dataJS.toDate()
            },
            dataType: 'json'
        }).done(function (result) {
            if (result) {
                $("#lista-wizyt").html("<div class=\"alert alert-primary\" role=\"alert\" style=\"margin-top: 30px;\">Dziękujemy! Wizyta została zarezerwowana, w niedługim czasie postaramy się ją potwierdzić.</div>");
                return;
            }
            
            $("#lista-wizyt").prepend("<div class=\"alert alert-primary alert-dismissable fade show\" role=\"alert\" style=\"margin-top: 30px;\"><span>Wystąpił błąd. Prosimy spróbować ponownie za kilka minut.</span><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></div>");
        }).fail(function(jqXHR, textStatus) {
            console.log("fail: "+textStatus);
        });
    }).fail(function(jqXHR, textStatus) {
        console.log("fail: "+textStatus);
    });
}

function initReservations(idPacjenta) {
    $(document).on('click', '.rezerwuj-nowa', function(e) {
        makeReservation(e, idPacjenta);
    });
}

function localizeDayOfWeek(numOfDay) {
    let result;

    switch(numOfDay) {
        case 0:
          result = 7;
          break;
        default:
          result = numOfDay;
      }
    return result;
}

function generateAppointments(zajetosc, przyjecia, interval) {
    zajetosc = zajetosc.map(function (x) {
        return timeToDecimal(moment(x.Data).format('HH:mm'));
    });

    let timeslots = [];
    let date = $('#datefrom').datetimepicker('viewDate').day();

    let appDays = przyjecia[0].DniPrzyjec.split(';');
    let appHours = przyjecia[0].GodzinyPrzyjec.split(';');

    appDays = appDays.map(function (x) { 
        return parseInt(x, 10); 
    });

    if (!appDays.includes(localizeDayOfWeek(date)))
        return false;

    let hours = appHours[appDays.indexOf(localizeDayOfWeek(date))].split('-');

    let timeFrom = $('#timefrom').datetimepicker('viewDate').format('HH:mm');
    let timeFromDec = timeToDecimal(timeFrom);
    let timeTo = $('#timeto').datetimepicker('viewDate').format('HH:mm');
    let timeToDec = timeToDecimal(timeTo);

    let startTime = parseFloat(hours[0]);
    let endTime = parseFloat(hours[1]);
    let numOfStops = parseInt((endTime-startTime)*(1.0/interval));

    for (i = 1; i <= numOfStops; i++) {
        if ( ((startTime >= timeFromDec) && (startTime <= timeToDec) ) && (!zajetosc.includes(startTime)) ) {
            timeslots.push(decToTime(startTime));
        }
        startTime += 0.5;
    }

    return timeslots;
}