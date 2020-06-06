function getAppointments(idPacjenta) {
    $.ajax({
        url: "/wizyty/pacjent/" + idPacjenta,
        type: "GET"
    }).done(function (result) {
        console.log("done");
        console.log(result);

        if (result.wizyty.length == 0) {
            $("#lista-wizyt").html("<div class=\"alert alert-primary\" role=\"alert\" style=\"margin-top: 30px;\">Brak zarezerwowanych wizyt</div>");
            return;
        }

        let string = '<table class="table table-hover"><thead><tr><th scope="col">#</th><th scope="col">Data</th><th scope="col">Godzina</th>\
                      <th scope="col">Lekarz</th><th class="cell-align-right" scope="col">Status</th><th></th>\
                      </tr></thead><tbody>';

        $.each(result.wizyty, function(index, wizyta) 
        {
            let data = moment(wizyta.data).format('DD.MM.YYYY');
            let godzina = moment(wizyta.data).format('HH:mm');

            string += '<tr id="wizyta-' + wizyta.id +'"><th scope="row">' + parseInt(index+1) +'</th>'
                     + '<td>' + data + '</td><td>' + godzina + '</td><td>' + result.lekarze[index].TytulNaukowy + ' '
                     + result.lekarze[index].Imie + ' ' + result.lekarze[index].Nazwisko + '</td>'
                     + '<td class="cell-align-right"><span>' + wizyta.status + ' </span></td><td class="cell-align-right">';

            if ((wizyta.status != "anulowana") && (wizyta.status != "zakończona"))
                string += '<a id="anuluj-' + wizyta.id + '" href="/wizyty/' + wizyta.id + '/anuluj" class="anuluj">Anuluj rezerwację</a>';
            
            string += '</td></tr>';
        });

        string += '</tbody></table>';
        
        $("#lista-wizyt").html(string);
    }).fail(function(jqXHR, textStatus) {
        console.log("fail: "+textStatus);
    });
}

function initEvents() {
    $(document).on('click', '.zmien-status', function(e) {
        e.preventDefault();
        let splitID = e.target.id.split('-');
        let ID = splitID[splitID.length-1];

        let status = $('tr#wizyta-' + ID + ' select').val();

        $.ajax({
            url: "/wizyty/" + ID + "/zmien-status",
            type: "GET",
            data: {
                'nowyStatus': status
            },
            dataType: 'json'
        }).done(function (result) {
            if (!result) {
                $("#lista-wizyt").prepend("<div class=\"alert alert-primary alert-dismissable fade show\" role=\"alert\" style=\"margin-top: 30px;\"><span>Wystąpił błąd. Prosimy spróbować ponownie za kilka minut.</span><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></div>");
            }
        }).fail(function(jqXHR, textStatus) {
            console.log("fail: "+textStatus);
        });
    })

    $(document).on('click', 'a.anuluj', function(e) {
        e.preventDefault();
        let splitID = e.target.id.split('-');
        let ID = splitID[splitID.length-1];
        console.log(e.target.href);
        
        $.ajax({
            url: e.target.href,
            type: "GET",
            dataType: 'json'
        }).done(function (result) {
            console.log(result);
            $("#wizyta-" + ID + " td:last-child").html("<span>anulowana</span>");
            // if (!result) {
            //     $("#lista-wizyt").prepend("<div class=\"alert alert-primary alert-dismissable fade show\" role=\"alert\" style=\"margin-top: 30px;\"><span>Wystąpił błąd. Prosimy spróbować ponownie za kilka minut.</span><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></div>");
            // }
        }).fail(function(jqXHR, textStatus) {
            console.log("fail: "+textStatus);
        });
    })
}