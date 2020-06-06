const db = require('./db');

function Uzytkownik(login, haslo, imie, nazwisko, telefon, adres, email, rola) {
    let self = {
        id: null,
        login: login,
        imie: imie,
        nazwisko: nazwisko,
        telefon: telefon,
        adres: adres,
        email: email,
        rola: rola
    };

    this.zaloguj = function(login, haslo) {
        return;
    };

    this.pokazLogin = function() {
        return self.login;
    }

    this.pokazID = function() {
        return self.id;
    }

    return self;
}

function Pacjent(login, haslo, imie, nazwisko, telefon, adres, email, rola, pesel, dataUrodzenia, oddzialNFZ) {
    let self = Uzytkownik.call(this, login, haslo, imie, nazwisko, telefon, adres, email, rola);

    self.pesel = pesel;
    self.dataUrodzenia = new Date(dataUrodzenia);
    self.oddzialNFZ = oddzialNFZ;
    self.listaRecept = [];
    self.listaSkierowan = [];

    this.rezerwujWizyte = function(wizyta) {
        // ...
    }

    this.wyswietlRecepte = function(recepta) {
        // ...
    }
        
    this.wyswietlSkierowanie = function(skierowanie) {
        // ...
    }
        
    this.zlozWniosekORecepte = function(wniosek) {
        // ...
    }
        
    this.zlozWniosekOSkierowanie = function(wniosek) {
        // ...
    }
        
    this.anulujWizyte = function(idWizyty) {
        // ...
    }
        
    this.wyslijWiadomosciNaCzacie = function(idCzatu, wiadomosc) {
        // ...
    }
        
    this.wypelnijFormularzKontaktowy = function(formularz) {
        // ...
    }
        
    this.wyslijProsbeOUsuniecie = function(idUzytkownika) {
        // ...
    }
}

function Lekarz(login, haslo, imie, nazwisko, telefon, adres, email, rola, numerPWZ, tytulNaukowy, specjalnosc, dniPrzyjec, godzinyPrzyjec) {
    let self = Uzytkownik.call(this, login, haslo, imie, nazwisko, telefon, adres, email, rola);

    self.numerPWZ = numerPWZ;
    self.tytulNaukowy = tytulNaukowy;
    self.specjalnosc = specjalnosc;
    self.dniPrzyjec = dniPrzyjec;
    self.godzinyPrzyjec = godzinyPrzyjec;

    this.wystawRecepte = function(recepta) {
        // ...
    }

    this.wyswietlRecepte = function(idRecepty) {
        // ...
    }

    this.wyswietlSkierowanie = function(idSkierowania) {
        // ...
    }

    this.wystawSkierowanie = function(skierowanie) {
        // ...
    }

    this.skierujDoLekarza = function(idLekarza) {
        // ...
    }

    this.skierujDoPodmiotu = function(idPodmiotu) {
        // ...
    }

    this.zalozHistorieChoroby = function(idUzytkownika) {
        // ...
    }

    this.wyswietlHistorieChoroby = function(idHistoriiChoroby) {
        // ...
    }

    this.edytujHistorieChoroby = function(idHistoriiChoroby) {
        // ...
    }

    this.odpowiedzNaWiadomoscFormularz = function() {
        // ...
    }

    this.odpowiedzNaWiadomoscCzat = function() {
        // ...
    }
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

function Administrator(login, haslo, imie, nazwisko, telefon, adres, email, rola) {
    let self = Uzytkownik.call(this, login, haslo, imie, nazwisko, telefon, adres, email, rola);
    
    this.wykonajKopieZapasowa = function() {
        // ...
    }

    this.utworzKontoUzytkownika = function(uzytkownik) {
        // ...
    }

    this.edytujKontoUzytkownika = function(idUzytkownika) {
        // ...
    }

    this.utworzKopieZapasowa = function(kopiaZapasowa) {
        // ...
    }
}

function PracownikRecepcji(login, haslo, imie, nazwisko, telefon, adres, email, rola) {
    let self = Uzytkownik.call(this, login, haslo, imie, nazwisko, telefon, adres, email, rola);
    
    this.anulujWizyte = function(idWizyty) {
        // ...
    }

    this.potwierdzWizyte = function(idWizyty) {
        // ...
    }

    this.zalozHistorieChoroby = function(idUzytkownika) {
        // ...
    }

    this.odpowiedzNaWiadomoscFormularz = function() {
        // ...
    }

    this.odpowiedzNaWiadomoscCzat = function() {
        // ...
    }
}

module.exports = {
    Uzytkownik: Uzytkownik,
    Pacjent: Pacjent,
    Lekarz: Lekarz,
    Administrator: Administrator,
    PracownikRecepcji: PracownikRecepcji
};