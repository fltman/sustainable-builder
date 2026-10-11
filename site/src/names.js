// Names by birth decade, roughly following Swedish name statistics (SCB) and Kalmar's mix of origins.
// Later decades are invented but plausible: old names return, new ones arrive.
const F={
  1930:['Margit','Karin','Ingrid','Elsa','Maj','Gunvor','Astrid','Birgit'],
  1950:['Margareta','Eva','Birgitta','Kerstin','Marianne','Gunilla','Inger','Ulla'],
  1970:['Maria','Anna','Helena','Susanne','Carina','Lena','Petra','Annika'],
  1990:['Sara','Emma','Linda','Elin','Hanna','Amra','Josefin','Johanna','Leila'],
  2010:['Alva','Maja','Elsa','Wilma','Ebba','Amira','Nora','Saga','Ella'],
  2030:['Ines','Liv','Siri','Ronja','Yara','Majken','Tyra','Juni','Aisha'],
  2050:['Ellen','Vera','Rut','Iris','Selma','Lova','Nour','Hedda','Asta'],
  2070:['Malva','Idun','Lin','Svea','Talia','Edit','Sol','Ylva','Mira'],
  2090:['Kaja','Embla','Rosa','Tove','Zahra','Ingrid','Lea','Hjördis','Noa'],
  2110:['Astrid','Saga','Ilse','Lumi','Fatima','Märta','Yrsa','Alba','Sigrid'],
};
const M={
  1930:['Karl','Erik','Gunnar','Sven','Nils','Olle','Gösta','Bertil'],
  1950:['Lars','Bengt','Göran','Hans','Per','Leif','Anders','Jan'],
  1970:['Peter','Mikael','Thomas','Johan','Fredrik','Magnus','Jonas','Stefan'],
  1990:['Erik','Daniel','Oscar','Johan','Ali','Marcus','Emir','Viktor','Jesper'],
  2010:['Noah','Liam','William','Elias','Hugo','Omar','Leo','Adam','Matteo'],
  2030:['Ture','Love','Malte','Idris','Bo','Sixten','Otto','Alvar','Yusuf'],
  2050:['Folke','Sam','Eskil','Nils','Bilal','Viggo','Juno','Arvid','Elis'],
  2070:['Ask','Ilian','Torvald','Kian','Rune','Edvin','Isak','Melker','Teo'],
  2090:['Frej','Tor','Amir','Gustav','Vide','Sten','Eino','Loke','Ebbe'],
  2110:['Halvar','Ivo','Birger','Sami','Konrad','Alfons','Tage','Oden','Elof'],
};
const SURNAMES=['Johansson','Karlsson','Nilsson','Andersson','Eriksson','Petersson','Gustafsson','Lindqvist','Svensson','Lindgren','Ahmadi','Hodžić','Virtanen','Bergström','Holm','Sandberg','Ek','Lund','Ali','Nyström','Axelsson','Fransson','Öberg','Mehmedović','Korhonen','Rahimi','Strand','Al-Khatib','Wiklund','Sjöberg'];
const decade=y=>Math.max(1930,Math.min(2110,Math.floor((y-10)/20)*20+10));
export function firstName(birthYear,female,r){const list=(female?F:M)[decade(birthYear)]||F[1990];return list[Math.floor(r*list.length)%list.length];}
export function surname(r){return SURNAMES[Math.floor(r*SURNAMES.length)%SURNAMES.length];}
