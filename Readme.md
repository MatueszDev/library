Opis diagramu erd dla projektu biblioteka
Tabela Autor zawiera informaje na temat autora książki
Atrybuty:
- id_autor - klucz głowny
- imie - imie autora
- kraj_pochodzenia - karaj_pochodzenia autora
- nazwisko - nazwisko autora
Tabela Ksiżka zawiera wszystkie niezbędne informacje związane z książką
Atrybuty:
- id_książka - klucz główny
- tytul - tytul książki
- l_stron - liczba stron w książce
- id_gatunek - klucz obcy mówiący o gatunku książki
- id_oprawa -  klucz obcy mówiący o rodzaju oprawy książki
- id_jezyk -  klucz obcy mówiący o języku w jakim jest książka
- id_komentarz -  klucz obcy prowadzący do komentarzy na temat książki
Table autor_ksiazka jest tabela asocjacyjna łączącą ksiazke oraz autora
Tabela słownikowa oparawa zawiera rodzaje opraw
Atrybuty:
- id_oprawa - klucz główny
- oprawa - rodzaj oprawy
Tabela słownikowa jezyk zawiera nazwy jezyków
Atrybuty:
- id_jezyk - klucz główny
- jezyk - nazwa jezyka
Tabela słownikowa gatunek zawiera rodzaje gatunków książki
Atrybuty:
- id_gatunek - klucz główny
- gatunek - rodzaje gatunków
Tabela komentarz zawiera opinie o książce danego użytkownika
Atrybuty:
- id_komentarz - klucz główny
- komentarz - opinia na temat książki
- data_dod - data dotania komentarza
- id_czytelnik - id osoby dodającej komentarz
Tabela Kopia służy do przechoywania inforamcji o ksiażkach ilości ich stanu
Atrybuty:
- id_egzemplarz - klucz Główny
- id_magazyn - klucz obcy do miejsca przechoywania
- status - dostepnosc na obecna chwile
- id_ksiazka - klucz obcy zawierajacy informacje o ksiżce
Tabela Magazyn służy do przechoywania informaji o miejscu książki
Atrybuty:
- id_magazyn - klucz główny
- pojemnosc - liczba egzemplarzy jakie sie zmieszcza w magazynie
- miejscowsc - miejscowsc magazynu
- ulica - konkretna lokalizacja
Tabela czytelnik zawiera informacje o osobie wypozyczajacej
Atrybuty:
- id_czytelnik - klucz główny
- imie - imie czytelnika
- nazwisko - nazwisko czytelnika
- nr_telefonu - nummer telefonu czytelnika
- data_o - data otwarcia konta
- data_z - data zamkniecia konta
- id_karta - klucz obcy do karty znizkowej
Tabela asocjacyjna czyt_kopia zawiera informacje o egzemplarzach posiadanych prze czytelnika
Atrybuty:
- id_czytelnik - klucz glowny obcy do czytelnika
- id_egzemplarz - klucz glowny obcy do ksizaki
- data_wypozyczenia - data wypozyczenia ksiazki
- data_zwrotu - data zwrotu ksiazki
Tabela Karta_stal_kl zawiera informacje o karcie znizkowej czytelnika
Atrybuty:
- id_karta - klucz głowny
- znizka - procent znizki za posiadanie karty
- data_zal_kar - data zalozenia karty znizkowej
Tabela uzytkownik zawiera informacje o osobie korzystajacej z serwisu
Atrybuty:
- email - klucz glowny emial uzytkownika
- login - login uzytkownika
- haslo - haslo uzytkownika
- id_czytelnik - klucz obcy do czytelnika
Tabela cennik zawiera informacje o koszcie wypozyczenia ksiazki
Atrybuty:
- id_gatunek - klucz glowny
- mnoznik - mnoznik ceny bazowej za dzien opoznienia
- c_bazowa - cena bazowa gatunku ksiazki
