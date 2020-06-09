const db = require('./db');
const Classes = require('./classes')

function Uzytkownik(idUzytkownika = null, login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto) {
    let self = {
        idUzytkownika: idUzytkownika,
        login: login,
        imie: imie,
        nazwisko: nazwisko,
        rola: rola,
        telefon: telefon,
        email: email,
        ulica: ulica,
        nrDomuMieszkania: nrDomuMieszkania,
        kodPocztowy: kodPocztowy,
        miasto: miasto
    };

    this.edytuj = function() {
        // ...
    }

    return self;
}

Uzytkownik.pobierzDanePodstawowe = async function pobierzDanePodstawowe(res, idUzytkownika) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        const dane = await conn.query("SELECT ID, Login, Rola, Imie, Nazwisko FROM Uzytkownicy"
                                   + " JOIN DaneUzytkownikow ON DaneUzytkownikow.IDUzytkownika = Uzytkownicy.ID"
                                   + " WHERE ID = ?", [idUzytkownika]);
        res.send(dane);
    } catch (err){
        console.error(err);
    } finally {
        if (conn) return conn.end();
    }
}

Uzytkownik.dodaj = async function dodaj(login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto) {
    // ...
};

Uzytkownik.usun = async function usun(idUzytkownika) {
    // ...
};

Uzytkownik.zaloguj = async function zaloguj(login, haslo) {
    // ...
};

function Pacjent(idPacjenta = null, login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto, pesel, dataUrodzenia, oddzialNFZ) {
    let self = Uzytkownik.call(this, login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto);

    self.idPacjenta = idPacjenta;
    self.pesel = pesel;
    self.dataUrodzenia = new Date(dataUrodzenia);
    self.oddzialNFZ = oddzialNFZ;
    self.listaRecept = [];
    self.listaSkierowan = [];
}

Pacjent.rezerwujWizyte = async function utworzWizyte(res, IDPacjenta, PWZLekarza, Data, DataJS, Typ) {
    try {
        const wizyta = await Classes.Wizyta.utworzWizyte(res, IDPacjenta, PWZLekarza, Data, DataJS, Typ);
        //res.send(wizyta);
    } catch (err){
        //res.send(false);
        console.error(err);
    }
};

Pacjent.anulujWizyte = async function anulujWizyte(res, idWizyty) {
    try {
        const rows = await Classes.Wizyta.zmienStatus(res, "A", idWizyty);
        //res.send(wizyta);
    } catch (err){
        //res.send(false);
        console.error(err);
    }
};

Pacjent.pobierzListeRecept = async function pobierzListeRecept() {
    // ...
};

Pacjent.pobierzListeSkierowan = async function pobierzListeSkierowan() {
    // ...
};

Pacjent.wyswietlRecepte = async function wyswietlRecepte() {
    // ...
};
    
Pacjent.wyswietlSkierowanie = async function wyswietlSkierowanie() {
    // ...
};
    
Pacjent.zlozWniosekORecepte = async function zlozWniosekORecepte() {
    // ...
};
    
Pacjent.zlozWniosekOSkierowanie = async function zlozWniosekOSkierowanie() {
    // ...
};
    
Pacjent.wyslijWiadomosciNaCzacie = async function wyslijWiadomosciNaCzacie() {
    // ...
};
    
Pacjent.wypelnijFormularzKontaktowy = async function wypelnijFormularzKontaktowy() {
    // ...
};
    
Pacjent.wyslijProsbeOUsuniecie = async function wyslijProsbeOUsuniecie() {
    // ...
};

Pacjent.utworzKonto = async function utworzKonto() {
    // ...
};

function Lekarz(login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto, numerPWZ, tytulNaukowy, specjalnosc, dniPrzyjec, godzinyPrzyjec) {
    let self = Uzytkownik.call(this, login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto);

    self.numerPWZ = numerPWZ;
    self.tytulNaukowy = tytulNaukowy;
    self.specjalnosc = specjalnosc;
    self.dniPrzyjec = dniPrzyjec;
    self.godzinyPrzyjec = godzinyPrzyjec;
}

Lekarz.pobierzPrzyjecia = async function pobierzPrzyjecia(res, idLekarza) {
    let conn;
  
    try {
      conn = await db.pool.getConnection();
      const rows = await conn.query('SELECT uzytkownicy.ID,'
                                 + ' daneuzytkownikow.Imie,'
                                 + ' daneuzytkownikow.Nazwisko,'
                                 + ' lekarze.NumerPWZ,'
                                 + ' lekarze.TytulNaukowy,'
                                 + ' lekarze.DniPrzyjec,'
                                 + ' lekarze.GodzinyPrzyjec'
                                 + ' FROM uzytkownicy'
                                 + ' JOIN daneuzytkownikow ON uzytkownicy.ID = daneuzytkownikow.IDUzytkownika'
                                 + ' JOIN lekarze ON uzytkownicy.ID = lekarze.IDUzytkownika'
                                 + ' WHERE lekarze.IDUzytkownika = ?', [idLekarza]);
      res.send(rows);
    } catch (err){
      console.error(err);
    } finally {
      if (conn) return conn.end();
    }
};

Lekarz.pobierzSpecjalnosci = async function pobierzSpecjalnosci(res) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        const rows = await conn.query("SELECT DISTINCT Specjalnosc FROM Lekarze");
        res.send(rows);
    } catch (err){
        console.error(err);
    } finally {
        if (conn) return conn.end();
    }
};

Lekarz.pobierzLekarzySpecjalnosc = async function pobierzLekarzySpecjalnosc(res, specjalnosc) {
    let conn;

    try {
        conn = await db.pool.getConnection();
        const rows = await conn.query('SELECT uzytkownicy.ID, daneuzytkownikow.Imie, daneuzytkownikow.Nazwisko, lekarze.TytulNaukowy'
                                + ' FROM uzytkownicy'
                                + ' JOIN daneuzytkownikow ON uzytkownicy.ID = daneuzytkownikow.IDUzytkownika'
                                + ' JOIN lekarze ON uzytkownicy.ID = lekarze.IDUzytkownika'
                                + ' WHERE lekarze.Specjalnosc = ?',[specjalnosc]);
        res.send(rows);
    } catch (err){
        console.error(err);
    } finally {
        if (conn) return conn.end();
    }
}

Lekarz.wystawRecepte = async function wystawRecepte() {
    // ...
};

Lekarz.wyswietlRecepte = async function wyswietlRecepte() {
    // ...
};

Lekarz.wyswietlSkierowanie = async function wyswietlSkierowanie() {
    // ...
};

Lekarz.wystawSkierowanie = async function wystawSkierowanie() {
    // ...
};

Lekarz.skierujDoLekarza = async function skierujDoLekarza() {
    // ...
};

Lekarz.skierujDoPodmiotu = async function skierujDoPodmiotu() {
    // ...
};

Lekarz.zalozHistorieChoroby = async function zalozHistorieChoroby() {
    // ...
};

Lekarz.wyswietlHistorieChoroby = async function wyswietlHistorieChoroby() {
    // ...
};

Lekarz.edytujHistorieChoroby = async function edytujHistorieChoroby() {
    // ...
};

Lekarz.odpowiedzNaWiadomoscFormularz = async function odpowiedzNaWiadomoscFormularz() {
    // ...
};

Lekarz.odpowiedzNaWiadomoscCzat = async function odpowiedzNaWiadomoscCzat() {
    // ...
};

Lekarz.drukujHistorieChoroby = async function drukujHistorieChoroby() {
    // ...
};

function PracownikRecepcji(login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto) {
    let self = Uzytkownik.call(this, login, haslo, imie, nazwisko, rola, telefon, email, ulica, nrDomuMieszkania, kodPocztowy, miasto);
}

PracownikRecepcji.anulujWizyte = async function anulujWizyte() {
    // ...
};

PracownikRecepcji.potwierdzWizyte = async function potwierdzWizyte() {
    // ...
};

PracownikRecepcji.zalozHistorieChoroby = async function zalozHistorieChoroby() {
    // ...
};

PracownikRecepcji.odpowiedzNaWiadomoscFormularz = async function odpowiedzNaWiadomoscFormularz() {
    // ...
};

PracownikRecepcji.odpowiedzNaWiadomoscCzat = async function odpowiedzNaWiadomoscCzat() {
    // ...
};

PracownikRecepcji.drukujHistorieChoroby = async function drukujHistorieChoroby() {
    // ...
};

module.exports = {
    Uzytkownik: Uzytkownik,
    Pacjent: Pacjent,
    Lekarz: Lekarz,
    PracownikRecepcji: PracownikRecepcji
};