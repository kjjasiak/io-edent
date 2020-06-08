function getAppointments(idPacjenta) {
    $.ajax({
        url: "/wizyty/pacjent/" + idPacjenta,
        type: "GET"
    }).done(function (result) {
        console.log("done");

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
                     + '<td class="cell-align-right status">' + wizyta.status + '</td><td class="cell-align-right">';

            string += '<a class="btn btn-outline-primary anuluj"';
            
            if ((wizyta.status == "anulowana") || (wizyta.status == "zakończona"))
                string += ' style="visibility: hidden;"';
            
            string += ' id="anuluj-' + wizyta.id + '" href="panel/wizyty/pacjent/wizyta/' + wizyta.id + '/anuluj">Anuluj rezerwację</a>';
            string += '</td></tr>';
        });

        string += '</tbody></table>';
        
        $("#lista-wizyt").html(string);
    }).fail(function(jqXHR, textStatus) {
        console.log("fail: "+textStatus);
    });
}

function initEvents() {
    $(document).on('click', 'a.anuluj', function(e) {
        e.preventDefault();
        let splitID = e.target.id.split('-');
        let ID = splitID[splitID.length-1];

        $.ajax({
            url: e.target.href,
            type: "GET",
            dataType: 'json'
        }).done(function (result) {
            $("#wizyta-" + ID + " td.status").html("anulowana");
            $('#wizyta-' + ID + ' a.anuluj').css('visibility', 'hidden');
        }).fail(function(jqXHR, textStatus) {
            console.log("fail: "+textStatus);
        });
    })
}