const db = require('./db');

const wizytaStatus = {
    NP: 'niepotwierdzona',
    P: 'potwierdzona',
    A: 'anulowana',
    Z: 'zakończona'
};

let Wizyta = function(idWizyty = null, idPacjenta, PWZLekarza, data, typ, status = wizytaStatus.NP) {
    this.idWizyty = idWizyty;
    this.idPacjenta = idPacjenta;
    this.PWZLekarza =  PWZLekarza;
    this.data = new Date(data);
    this.typ = typ;
    this.status = status;
}

Wizyta.pobierzWizyty = async function pobierzWizyty(res) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        const wizyty = await conn.query('SELECT * FROM Wizyty ORDER BY Data DESC');

        let listaWizyt = [];

        wizyty.forEach(el => {
            w = new Wizyta(el.ID, el.IDPacjenta, el.PWZLekarza, el.Data, el.Typ, el.Status);
            listaWizyt.push(w);
        });

        const pacjenci = await conn.query('SELECT wizyty.ID AS IDWizyty, pacjenci.ID AS IDPacjenta, daneuzytkownikow.Imie, daneuzytkownikow.Nazwisko, pacjenci.Pesel FROM Wizyty'
                            + ' JOIN pacjenci ON pacjenci.ID = wizyty.IDPacjenta'
                            + ' JOIN daneuzytkownikow ON daneuzytkownikow.IDUzytkownika = pacjenci.IDUzytkownika'
                            + ' ORDER BY wizyty.Data DESC');

        const lekarze = await conn.query('SELECT wizyty.ID AS IDWizyty, lekarze.NumerPWZ, lekarze.TytulNaukowy, daneuzytkownikow.Imie, daneuzytkownikow.Nazwisko FROM Wizyty'
                                    + ' JOIN lekarze ON lekarze.NumerPWZ = wizyty.PWZLekarza'
                                    + ' JOIN daneuzytkownikow ON daneuzytkownikow.IDUzytkownika = lekarze.IDUzytkownika'
                                    + ' ORDER BY wizyty.Data DESC');

        result = {
            wizyty: listaWizyt,
            pacjenci: pacjenci,
            lekarze: lekarze,
            statusy: wizytaStatus
        }

        res.send(result);
    } catch (err){
        console.error(err);
    } finally {
        if (conn) return conn.end();
    }
};

Wizyta.pobierzWizytyPacjent = async function pobierzWizytyPacjent(res, idPacjenta) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        const wizyty = await conn.query('SELECT * FROM Wizyty WHERE IDPacjenta = ? ORDER BY Data DESC', [idPacjenta]);

        let listaWizyt = [];

        wizyty.forEach(el => {
            w = new Wizyta(el.ID, el.IDPacjenta, el.PWZLekarza, el.Data, el.Typ, el.Status);
            listaWizyt.push(w);
        });

        const lekarze = await conn.query('SELECT wizyty.ID AS IDWizyty, lekarze.TytulNaukowy, daneuzytkownikow.Imie, daneuzytkownikow.Nazwisko FROM Wizyty'
                                      + ' JOIN lekarze ON lekarze.NumerPWZ = wizyty.PWZLekarza'
                                      + ' JOIN daneuzytkownikow ON daneuzytkownikow.IDUzytkownika = lekarze.IDUzytkownika'
                                      + ' WHERE wizyty.IDPacjenta = ?'
                                      + ' ORDER BY wizyty.Data DESC', [idPacjenta]);

        result = {
            wizyty: listaWizyt,
            lekarze: lekarze
        }

        res.send(result);
    } catch (err){
        console.error(err);
        res.send(false);
    } finally {
        if (conn) return conn.end();
    }
};

Wizyta.pobierzZarezerwowaneWizyty = async function pobierzZarezerwowaneWizyty(res, data) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        //const rows = await conn.query('SELECT Data FROM Wizyty WHERE Data LIKE "%?%" AND NOT Status = "anulowana"', [data]);
        const rows = await conn.query('SELECT Data FROM Wizyty WHERE Data LIKE "%' + data + '%" AND NOT Status = "anulowana"');
        res.send(rows);
    } catch (err){
        console.error(err);
    } finally {
        if (conn) return conn.end();
    }
};

Wizyta.sprawdzTermin = async function sprawdzTermin(res, data, godzina, PWZLekarza) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        const rows = await conn.query('SELECT COUNT(*) AS liczba FROM Wizyty WHERE Data = "'+data+' '+godzina+'" AND PWZLekarza = "'+PWZLekarza+'" AND NOT Status = "anulowana" LIMIT 1');
        res.send(rows);
    } catch (err){
        console.error(err);
    } finally {
        if (conn) return conn.end();
    }
}

Wizyta.utworzWizyte = async function utworzWizyte(res, IDPacjenta, PWZLekarza, Data, DataJS, Typ) {
    let conn;

    try {
        wizyta = new Wizyta(null, IDPacjenta, PWZLekarza, DataJS, Typ);
        conn = await db.pool.getConnection();
        const rows = await conn.query('INSERT INTO Wizyty (IDPacjenta, PWZLekarza, Data, Typ, Status) VALUES (?, ?, ?, ?, ?)',[wizyta.idPacjenta, wizyta.PWZLekarza, wizyta.data, wizyta.typ, wizyta.status]);
        wizyta.idWizyty = rows.insertId;
        res.send(wizyta);
    } catch (err){
        res.send(false);
        console.error(err);
    } finally {
        if (conn) return conn.end();
    }
};

Wizyta.zmienStatus = async function zmienStatus(res, nowyStatus, IDWizyty) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        const rows = await conn.query('UPDATE Wizyty SET Status=? WHERE ID=?',[wizytaStatus[nowyStatus], IDWizyty]);
        res.send(rows);
    } catch (err){
        console.error(err);
        res.send(false);
    } finally {
        if (conn) return conn.end();
    }
};

Wizyta.pobierzWizyte = async function pobierzWizyte() {
    // ...
};

module.exports = {
    wizytaStatus: wizytaStatus,
    Wizyta: Wizyta
};