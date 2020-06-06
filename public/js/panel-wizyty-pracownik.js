function getAppointments() {
    $.ajax({
        url: "/wizyty/wszystkie",
        type: "GET"
    }).done(function (result) {
        console.log("done");
        console.log(result);

        if (result.wizyty.length == 0) {
            $("#lista-wizyt").html("<div class=\"alert alert-primary\" role=\"alert\" style=\"margin-top: 30px;\">Brak zarezerwowanych wizyt</div>");
            return;
        }

        let string = '<table class="table table-hover"><thead><tr><th scope="col">ID</th><th scope="col">Data</th><th scope="col">Godzina</th>\
                      <th scope="col">Lekarz</th><th scope="col">Pacjent</th><th scope="col">PESEL Pacjenta</th><th scope="col">Status</th>\
                      </tr></thead><tbody>';

        $.each(result.wizyty, function(index, wizyta) 
        {
            let data = moment(wizyta.data).format('DD.MM.YYYY');
            let godzina = moment(wizyta.data).format('HH:mm');

            string += '<tr id="wizyta-' + wizyta.id +'"><th scope="row">' + wizyta.id +'</th>'
                     + '<td>' + data + '</td><td>' + godzina + '</td><td>' + result.lekarze[index].TytulNaukowy + ' '
                     + result.lekarze[index].Imie + ' ' + result.lekarze[index].Nazwisko + '</td>'
                     + '<td>' + result.pacjenci[index].Imie + ' ' + result.pacjenci[index].Nazwisko + '</td>'
                     + '<td>' + result.pacjenci[index].Pesel + '</td>';

            string += '<td><div class="form-group"><select class="custom-select d-block w-100" id="status-wizyty-' + wizyta.id +'" required>';

            for (let [id, status] of Object.entries(result.statusy)) {
                string += '<option value="' + id + '"';
                
                if (wizyta.status == status)
                    string += ' selected';
                
                string += '>' + status + '</option>';
            }

            string += '</select>'
                    + '<a id="zmien-status-' + wizyta.id + '" href="/wizyta/zmien-status" class="btn btn-secondary zmien-status">Zmień status</a>'
                    + '</div></td></tr>';
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
}