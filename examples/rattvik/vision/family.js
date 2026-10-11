// Släkten Halvars: one family in central Rättvik followed through five generations, from Margit, who
// saw horses race on Siljan's ice as a little girl, to Mats, born in 2096. Their lives follow the place
// the player builds – how long they live, who moves away and who comes home, what they work with and what
// they remember. Halvars is a farm name (gårdsnamn): round Siljan the farm's name was long said before
// the first name. Signe is seven in 2026; if Rättvik takes care of its people she is in the church boat
// to Kyrkudden at Midsummer 2126, aged 107. The facts are from research/deep (the ice, the trotting on
// it, the church boats, the two in three young people who think they will move away, the hot days);
// every other number is the model's.
import { t, int } from '@engine/i18n.js';
import { CITY } from '@engine/city-config.js';

// Homes are real residential buildings in the model (OpenStreetMap, metres from 60.886 N 15.1098 E,
// x east, z south): the flats at Storgatan 14, a house on Hjort Anders väg (named after the Bingsjö
// fiddler) near Nyhedsskolan, the HSB flats at HSBgatan 1A by the square, and the flats at Torggatan 3
// next to Församlingshemmet.
const STORGATAN={x:517,z:290},HJORT_ANDERS={x:588,z:-467},HSBGATAN={x:376,z:-22},TORGGATAN={x:529,z:66};
export const FAMILY=[
  {id:'margit',first:'Margit',last:'Halvars',birth:1950,female:true,shirt:0x8e44ad,span:5,home:STORGATAN},
  {id:'karin',first:'Karin',last:'Halvars',birth:1979,female:true,shirt:0x2a78d6,span:2,home:HJORT_ANDERS},
  {id:'per',first:'Per',last:'Ersson',birth:1976,female:false,shirt:0x6d4c41,span:-2,home:HJORT_ANDERS},
  {id:'elin',first:'Elin',last:'Halvars',birth:2010,female:true,shirt:0x27ae60,span:1,home:HSBGATAN},
  {id:'signe',first:'Signe',last:'Halvars',birth:2019,female:true,shirt:0xc0392b,span:17,home:HJORT_ANDERS},
  {id:'ture',first:'Ture',last:'Halvars',birth:2042,female:false,shirt:0xf39c12,span:-1,home:HSBGATAN},
  {id:'brita',first:'Brita',last:'Halvars',birth:2049,female:true,shirt:0x16a085,span:2,home:TORGGATAN},
  {id:'jon',first:'Jon',last:'Halvars',birth:2054,female:false,shirt:0x34495e,span:0,home:HJORT_ANDERS},
  {id:'tyra',first:'Tyra',last:'Halvars',birth:2073,female:true,shirt:0xf1c40f,span:3,home:HSBGATAN},
  {id:'kari',first:'Kari',last:'Halvars',birth:2081,female:true,shirt:0x1abc9c,span:4,home:TORGGATAN},
  {id:'mats',first:'Mats',last:'Halvars',birth:2096,female:false,shirt:0xe67e22,span:1,home:HJORT_ANDERS},
];
const BORN=Object.fromEntries(FAMILY.map(m=>[m.id,m.birth]));
// Year of death from the model's life expectancy when each member is 70, plus a personal margin.
export function lifespans(run){
  const out={};
  for(const m of FAMILY){
    const y70=Math.min(2126,m.birth+70),row=run.years[Math.max(0,y70-2026)];
    const le=row?row.ind.lifeExp:83.96;
    out[m.id]=Math.round(m.birth+le+m.span+(m.birth<2000?-1:0));
  }
  return out;
}
export function alive(m,year,spans){return year>=m.birth&&year<spans[m.id];}

const pick=(cond,a,b)=>cond?a:b;
const join=(...parts)=>parts.filter(Boolean).join(' ');
const at=(run,y)=>run.years[Math.max(0,Math.min(run.years.length-1,y-2026))];
// The train to Stockholm as the key figures show it, to the nearest five minutes.
const rail=h=>{const m=Math.round(h*12)*5,a=Math.floor(m/60),b=m%60;return t(b?`${a} timmar och ${b} minuter`:`${a} timmar`,b?`${a} hours ${b} minutes`:`${a} hours`);};
const hundreds=v=>int(Math.round(v/100)*100);

// The turns of a life, read from the run once so that the decades tell one story.
// Elin studies in Uppsala and comes home by 2036 if there is something to come home to – a summer farm
// that pays, the learning centre, a place people want to live in – else in the 2040s, when her parents
// grow old.
const elinPath=run=>{const a=at(run,2036);return a.I.regionalt>.3?'fabod':a.I.kunskap>.3?'study':a.ind.attract>.8?'home':'away';};
// The first decade the family keeps animals at the summer farm again (0: never), up to `year`.
const fabodFrom=(run,year)=>{if(elinPath(run)==='fabod')return 2036;for(let y=2046;y<=year;y+=10)if(at(run,y).I.regionalt>.5)return y;return 0;};
// Signe plays her grandfather's fiddle when childhood and work leave room for it – a phone-free school or
// a shorter working week – from the first decade that does (0: never), up to `year`.
const playsBy=(run,year)=>{for(let y=2036;y<=year;y+=10){const a=at(run,y);if(a.I.analog>.4||a.ind.workHours<36)return y;}return 0;};
// Where the old live: Margit moves into the Generation House if there is one by 2036, Karin and Per by 2056.
const margitMoved=run=>at(run,2036).ind.cohousing>.05,parentsMoved=run=>at(run,2056).ind.cohousing>.15;
// Brita, 17 in 2066, stays if Rättvik is a place to stay in or its school is a living lab.
const britaStays=run=>{const a=at(run,2066);return a.ind.attract>.8||a.I.kunskap>.5;};

// A paragraph per decade, written from the state at the start of that decade.
export function familyText(year,run){
  const r=at(run,year),d=r.ind,I=r.I,spans=lifespans(run),W=run.world||{};
  const age=id=>year-BORN[id],is=id=>alive(FAMILY.find(m=>m.id===id),year,spans),lived=id=>spans[id]-BORN[id];
  const died=id=>t(`${FAMILY.find(m=>m.id===id).first} dog ${spans[id]}, ${lived(id)} år gammal.`,`${FAMILY.find(m=>m.id===id).first} died in ${spans[id]}, aged ${lived(id)}.`);
  // What tested Rättvik in the decade just gone (events.js), as the family remembers it; the wording
  // alternates so two events in a decade, or the same verdict decade after decade, do not repeat.
  const evText=run.chronicle.filter(e=>e.year<year&&e.year>=year-10).map((e,i)=>{
    const k=e.good||e.severity<.3?0:e.severity<.6?1:2,v=(i+(year-2026)/10)%2;
    return t(`${e.title} ${e.year} – ${[['Rättvik klarade det bra.','bygden höll ihop.'],['det satte spår, också i familjen.','det kändes i hela bygden.'],['det slog hårt mot hela bygden.','familjen minns det som en svår tid.']][k][v]}`,
      `${e.title}, ${e.year} – ${[['Rättvik came through well.','the community held together.'],['it left a mark, on the family too.','the whole community felt it.'],['it hit the whole community hard.','the family remembers it as a hard time.']][k][v]}`);
  }).join(' ');
  const fabodNow=I.regionalt>.5,carFree=I.bilfritt>.45&&d.depave>.3;
  switch(year){
    case 2026:return t(
      `Margit Halvars, ${age('margit')}, bor ensam på Storgatan, med sin döde man Anders fiol på väggen. Som liten såg hon travet köras på Siljans is, mellan Långbryggan och kyrkan – det flyttade därifrån 1955. Nu ligger isen drygt två månader om året, mot fyra på 1800-talet. Dottern Karin är distriktssköterska, svärsonen Per jobbar på kalkverket, och deras yngsta, Signe, sju, vill lära sig spela fiol. Storasyster Elin, ${age('elin')}, går naturbruket på Stiernhööksgymnasiet och mjölkar kor på skoljordbruket. ”Jag flyttar härifrån”, säger hon – som två av tre unga i Rättvik.`,
      `Margit Halvars, ${age('margit')}, lives alone on Storgatan, with her late husband Anders’s fiddle on the wall. As a little girl she watched the trotting races on the ice of Lake Siljan, between Långbryggan and the church – they moved off the ice in 1955. Now the ice lasts a little over two months a year, against four in the 1800s. Her daughter Karin is a district nurse, her son-in-law Per works at the lime works, and their youngest, Signe, seven, wants to learn the fiddle. Signe’s big sister Elin, ${age('elin')}, is in the natural resource programme at Stiernhööksgymnasiet and milks cows on the school farm. “I’m moving away,” she says – like two in three young people in Rättvik.`);
    case 2036:{
      const m=age('margit'),e=age('elin'),s=age('signe');
      const margit=!is('margit')?died('margit'):margitMoved(run)
        ?t(`Margit, ${m}, har flyttat till Generationshuset vid Församlingshemmet. På torsdagarna bakar hon tunnbröd med förskolebarnen på bottenvåningen.`,`Margit, ${m}, has moved into the Generation House by the parish hall. On Thursdays she bakes flatbread with the preschool children on the ground floor.`)
        :pick(d.lowParticipation<.25,
          t(`Margit, ${m}, bor kvar på Storgatan. Grannarna ringer på varje dag, och på onsdagarna går hon på trivselträffen.`,`Margit, ${m}, still lives on Storgatan. The neighbours ring her bell every day, and on Wednesdays she goes to the seniors’ get-together.`),
          t(`Margit, ${m}, bor kvar ensam på Storgatan. Hemtjänsten kommer fyra gånger om dagen, men ingen hinner sätta sig ner – i Rättvik besväras hälften av de äldre som har hemtjänst av ensamhet.`,`Margit, ${m}, still lives alone on Storgatan. Home care comes four times a day, but nobody has time to sit down – in Rättvik half of the elderly who have home care are troubled by loneliness.`));
      const karin=!is('karin')?'':I.forebyggande>.4
        ?t('Karin jobbar på nya Hälsotorget, där man kan få promenader längs Siljan på recept.','Karin works at the new Health Square, where a doctor can prescribe walks along Lake Siljan.')
        :t('På vårdcentralen, där Karin jobbar, är det fortfarande svårt att få en läkartid.','At the health centre where Karin works, it is still hard to get a doctor’s appointment.');
      const elin={
        fabod:t(`Elin, ${e}, pluggade i Uppsala men har flyttat hem. Hon har tagit upp familjens gamla fäbod igen och kokar messmör där om somrarna.`,`Elin, ${e}, studied in Uppsala but has moved home. She has brought the family’s old summer farm back to life and makes whey butter there in summer.`),
        study:t(`Elin, ${e}, pluggade i Uppsala men har flyttat hem. Hon läser vidare på distans vid lärcentrumet på stationen och jobbar på skoljordbruket.`,`Elin, ${e}, studied in Uppsala but has moved home. She goes on studying remotely at the learning centre by the station and works on the school farm.`),
        home:t(`Elin, ${e}, pluggade i Uppsala men har flyttat hem igen och jobbar på skoljordbruket.`,`Elin, ${e}, studied in Uppsala but has moved home again and works on the school farm.`),
        away:t(`Elin, ${e}, bor kvar i Uppsala och kommer bara hem till midsommar.`,`Elin, ${e}, has stayed in Uppsala and only comes home for Midsummer.`),
      }[elinPath(run)];
      const signe=playsBy(run,2036)
        ?t(`Signe, ${s}, spelar morfar Anders fiol och går på kurs på Folkmusikens hus två kvällar i veckan${I.analog>.4?'. Mobilen lämnar hon in när skoldagen börjar':''}.`,`Signe, ${s}, plays her grandfather Anders’s fiddle and takes classes at Folkmusikens hus two evenings a week${I.analog>.4?'. She hands in her phone when the school day starts':''}.`)
        :t(`Signe, ${s}, fick morfar Anders fiol när hon var åtta, men den ligger mest i fodralet. Kvällarna går åt till skärmen.`,`Signe, ${s}, was given her grandfather Anders’s fiddle when she was eight, but it mostly stays in its case. Her evenings go to the screen.`);
      return join(margit,karin,elin,signe,evText);
    }
    case 2046:{
      const e=age('elin'),u=age('ture'),path=elinPath(run);
      const margit=is('margit')?t(`Margit fyller ${age('margit')}.`,`Margit turns ${age('margit')}.`)
        :join(died('margit'),playsBy(run,2036)?t('Signe spelade morfars fiol på begravningen i Rättviks kyrka.','Signe played her grandfather’s fiddle at the funeral in Rättvik church.')
          :at(run,spans.margit).ind.lowParticipation<.2?t('Halva Storgatan kom till begravningen.','Half of Storgatan came to the funeral.'):'');
      const elin=path==='fabod'
        ?pick(fabodNow,
          t(`Elin, ${e}, har getter och kor på fäboden om somrarna och säljer ost och messmör på torget. Sonen Ture, ${u}, sover middag i fäbodstugan.`,`Elin, ${e}, keeps goats and cows at the summer farm and sells cheese and whey butter on the square. Her son Ture, ${u}, naps in the summer-farm cottage.`),
          t(`Elin, ${e}, har sålt getterna – fäboden gick inte att leva på. Hon jobbar på skoljordbruket, och sonen Ture, ${u}, går på förskolan.`,`Elin, ${e}, has sold the goats – the summer farm did not pay. She works on the school farm, and her son Ture, ${u}, goes to preschool.`))
        :path==='away'
        ?pick(fabodNow,
          t(`Elin, ${e}, har flyttat hem med sonen Ture, ${u}, nu när Karin och Per börjar bli gamla. Hon har tagit upp familjens gamla fäbod igen.`,`Elin, ${e}, has moved home with her son Ture, ${u}, now that Karin and Per are getting old. She has brought the family’s old summer farm back to life.`),
          t(`Elin, ${e}, har flyttat hem med sonen Ture, ${u}, nu när Karin och Per börjar bli gamla. Hon jobbar i hemtjänsten, där det alltid saknas folk.`,`Elin, ${e}, has moved home with her son Ture, ${u}, now that Karin and Per are getting old. She works in home care, which is always short of hands.`))
        :pick(fabodNow,
          t(`Elin, ${e}, har tagit upp familjens gamla fäbod igen, och sonen Ture, ${u}, sover middag i fäbodstugan.`,`Elin, ${e}, has brought the family’s old summer farm back to life, and her son Ture, ${u}, naps in the summer-farm cottage.`),
          t(`Elin, ${e}, jobbar på skoljordbruket, och sonen Ture, ${u}, går på förskolan. Familjens fäbod står tom om somrarna.`,`Elin, ${e}, works on the school farm, and her son Ture, ${u}, goes to preschool. The family’s summer farm stands empty in summer.`));
      const per=!is('per')?died('per'):pick(I.bilfritt>.45,
        t(`Per, ${age('per')}, har gått i pension från kalkverket. Han har kvar sin veteranbil, men Storgatan och torget är bilfria nu; under Classic Car Week kör han ut till travbanan, dit hela veckan har flyttat.`,`Per, ${age('per')}, has retired from the lime works. He still has his vintage car, but Storgatan and the square are car-free now; during Classic Car Week he drives out to the trotting track, where the whole week has moved.`),
        t(`Per, ${age('per')}, har gått i pension från kalkverket och putsar sin veteranbil inför Classic Car Week varje sommar.${is('karin')?' Karin flyr till fäboden den veckan.':''}`,`Per, ${age('per')}, has retired from the lime works and polishes his vintage car before Classic Car Week every summer.${is('karin')?' Karin escapes to the summer farm that week.':''}`));
      return join(margit,elin,per,evText);
    }
    case 2056:{
      const kids=t(`Signe, ${age('signe')}, har två barn: Brita, ${age('brita')}, och Jon, ${age('jon')}.`,`Signe, ${age('signe')}, has two children: Brita, ${age('brita')}, and Jon, ${age('jon')}.`);
      const work=playsBy(run,2036)?t('Hon undervisar i fiol på Folkmusikens hus.','She teaches the fiddle at Folkmusikens hus.')
        :playsBy(run,2056)?t('Hon är lärare på Nyhedsskolan och har börjat spela morfars fiol igen.','She teaches at Nyhedsskolan and has taken up her grandfather’s fiddle again.')
        :t('Hon är lärare på Nyhedsskolan.','She teaches at Nyhedsskolan.');
      const street=pick(carFree,
        t('Brita cyklar själv genom centrum ner till Siljansbadet; där det var parkering finns nu odlingar och lekplatser.','Brita cycles through the centre to Siljansbadet on her own; where the car parks were there are now gardens and playgrounds.'),
        t('Brita får inte cykla ensam ner till stranden – det är för mycket trafik på vägen dit.','Brita is not allowed to cycle down to the beach on her own – there is too much traffic on the way.'));
      const both=is('karin')&&is('per'),who=both?t('Karin och Per','Karin and Per'):is('karin')?'Karin':is('per')?'Per':'';
      const old=!who?'':parentsMoved(run)
        ?t(`${who} har flyttat till Generationshuset${margitMoved(run)?', där Margit bodde sina sista år':''}, och Signe har tagit över villan på Hjort Anders väg.`,`${who} ${both?'have':'has'} moved into the Generation House${margitMoved(run)?', where Margit spent her last years':''}, and Signe has taken over the house on Hjort Anders väg.`)
        :t(`${who} bor kvar i villan på Hjort Anders väg, och Signe har flyttat in på övervåningen med barnen.`,`${who} still ${both?'live':'lives'} in the house on Hjort Anders väg, and Signe has moved in upstairs with the children.`);
      return join(kids,work,street,old,evText);
    }
    case 2066:{
      const old=is('karin')
        ?join(is('per')?t(`Karin är ${age('karin')} och Per ${age('per')}.`,`Karin is ${age('karin')} and Per ${age('per')}.`):t(`Karin, ${age('karin')}, har varit änka sedan ${spans.per}.`,`Karin, ${age('karin')}, has been a widow since ${spans.per}.`),
          parentsMoved(run)?t('Hon äter middag i Generationshusets kvarterskök varje kväll.','She has dinner in the Generation House’s shared kitchen every evening.')
            :t('Hon bor kvar i huset på Hjort Anders väg, med Signe och barnen på övervåningen.','She still lives in the house on Hjort Anders väg, with Signe and the children upstairs.'))
        :is('per')?t(`Karin dog ${spans.karin}. Per, ${age('per')}, bor kvar i huset på Hjort Anders väg.`,`Karin died in ${spans.karin}. Per, ${age('per')}, still lives in the house on Hjort Anders väg.`)
        :t(`Per dog ${spans.per} och Karin ${spans.karin}, ${lived('karin')} år gammal.`,`Per died in ${spans.per} and Karin in ${spans.karin}, aged ${lived('karin')}.`);
      const ture=pick(d.windMW>150,
        pick(I.vind>.8,
          t(`Ture, ${age('ture')}, är tekniker i vindparkerna i norra delen av kommunen, som numera gör vätgas och säljer el långt utanför Dalarna.`,`Ture, ${age('ture')}, is a technician at the wind farms in the north of the municipality, which now make hydrogen and sell power far beyond Dalarna.`),
          t(`Ture, ${age('ture')}, är tekniker i vindparken i norra delen av kommunen, som byarna äger tillsammans.`,`Ture, ${age('ture')}, is a technician at the wind farm in the north of the municipality, which the villages own together.`)),
        t(`Ture, ${age('ture')}, pendlar till Borlänge – tåget tar knappt en timme.`,`Ture, ${age('ture')}, commutes to Borlänge – the train takes just under an hour.`));
      const brita=join(britaStays(run)
        ?t(`Brita, ${age('brita')}, går på naturbruket, som moster Elin en gång, och tänker stanna i Rättvik.`,`Brita, ${age('brita')}, is in the natural resource programme, as her aunt Elin once was, and means to stay in Rättvik.`)
        :t(`Brita, ${age('brita')}, säger samma sak som moster Elin sa i hennes ålder: ”Jag flyttar härifrån.”`,`Brita, ${age('brita')}, says what her aunt Elin said at her age: “I’m moving away.”`),
        t('Om somrarna jobbar hon på Dalhalla, i det gamla kalkbrottet.','In summer she works at Dalhalla, in the old lime quarry.'));
      const j=age('jon');
      const jon=I.ai>.5&&I.analog>.4?t(`Jon, ${j}, har en AI-handledare i matte men ingen egen mobil.`,`Jon, ${j}, has an AI tutor for maths but no phone of his own.`)
        :I.ai>.5?t(`Jon, ${j}, pratar mer med sin AI-assistent än med kompisarna.`,`Jon, ${j}, talks more with his AI assistant than with his friends.`)
        :I.analog>.4?t(`Jon, ${j}, har aldrig haft en egen skärm; han bygger flottar vid Enåns mynning.`,`Jon, ${j}, has never had a screen of his own; he builds rafts at the mouth of the Enån.`)
        :t(`Jon, ${j}, sitter med mobilen till sent på kvällarna.`,`Jon, ${j}, sits up with his phone until late at night.`);
      return join(old,ture,brita,jon,evText);
    }
    case 2076:{
      const stayed=britaStays(run),demo=I.demokrati>.6&&d.trust>.78,b=age('brita');
      const brita=join(stayed?'':t(`Brita, ${b}, flyttade till Stockholm efter studenten men har kommit hem igen.`,`Brita, ${b}, moved to Stockholm after school but has come home again.`),
        demo?t(`${stayed?`Brita, ${b},`:'Hon'} har lottats in i medborgarrådet, som möts varje sommar vid Vasastenen – där Gustav Vasa enligt traditionen talade till dalkarlarna 1520.`,`${stayed?`Brita, ${b},`:'She'} has been chosen by lot for the citizens’ assembly, which meets every summer at Vasastenen – where, by tradition, Gustav Vasa spoke to the men of Dalarna in 1520.`)
          :t(`${stayed?`Brita, ${b},`:'Hon'} röstar i varje val men tycker att besluten om bygden fattas långt härifrån.`,`${stayed?`Brita, ${b},`:'She'} votes in every election but feels that the decisions about the community are made far away.`));
      const j=age('jon');
      const jon=I.kollektivt>.55
        ?pick(I.kollektivt>.9&&d.aiCapacity>.7,
          t(`Jon, ${j}, övervakar de självkörande skyttlarna till byarna från en skärm på stationen.`,`Jon, ${j}, watches over the self-driving shuttles to the villages from a screen at the station.`),
          t(`Jon, ${j}, kör eldriven båtbuss från Långbryggan till Leksand och Mora.`,`Jon, ${j}, drives an electric boat bus from Långbryggan to Leksand and Mora.`))
        :pick(d.carShare<.4,
          t(`Jon, ${j}, har aldrig haft bil; han cyklar överallt, också till jobbet i Vikarbyn.`,`Jon, ${j}, has never had a car; he cycles everywhere, even to his job in Vikarbyn.`),
          t(`Jon, ${j}, pendlar med bil till Leksand, som många i Rättvik.`,`Jon, ${j}, drives to work in Leksand, like many in Rättvik.`));
      const tyra=t(`Ture har fått dottern Tyra, ${age('tyra')}.`,`Ture has a daughter, Tyra, ${age('tyra')}.`);
      return join(brita,jon,tyra,evText);
    }
    case 2086:{
      const kari=t(`Signe, ${age('signe')}, har fått ett barnbarn: Britas dotter Kari, ${age('kari')}.`,`Signe, ${age('signe')}, has a grandchild: Brita’s daughter Kari, ${age('kari')}.`);
      const hot=W.hotDays?t(`Somrarna har omkring ${W.hotDays} dagar över 25 grader, mot ${CITY.hotDaysToday??16} när Signe var barn.`,`Summers bring about ${W.hotDays} days above 25 °C, against ${CITY.hotDaysToday??16} when Signe was a child.`):'';
      const fish=pick(I.hav>.5&&d.waters>.7,
        t('Harren och öringen leker i Enån igen, och Signe tar med Kari till mynningen för att se dem.','Grayling and trout spawn in the Enån again, and Signe takes Kari to the river mouth to see them.'),
        t('Siljan är lika klar som när Signe var liten, men dammarna stänger fortfarande ute öringen från de gamla lekplatserna.','Lake Siljan is as clear as when Signe was little, but the dams still shut the trout out of their old spawning grounds.'));
      const y=age('tyra');
      const ice=d.stress>.6?t(`Tyra, ${y}, åker skridskor på isbanan vid Prästskogsvallen – Siljans is bär sällan längre.`,`Tyra, ${y}, skates on the rink at Prästskogsvallen – the ice on Lake Siljan rarely holds any more.`)
        :d.stress>.3?t(`Isen på Siljan kommer sent och går tidigt, men i februari hann Tyra, ${y}, åka långfärdsskridskor på den.`,`The ice on Lake Siljan comes late and goes early, but in February Tyra, ${y}, managed a long-distance skate on it.`)
        :t(`Isen på Siljan bär fortfarande de flesta vintrar, och Tyra, ${y}, åker långfärdsskridskor ut mot Vikarbyn.`,`The ice on Lake Siljan still holds most winters, and Tyra, ${y}, skates out towards Vikarbyn.`);
      return join(kari,hot,fish,ice,evText);
    }
    case 2096:{
      const mats=t(`Jon, ${age('jon')}, har blivit pappa till lille Mats.`,`Jon, ${age('jon')}, has become a father to little Mats.`);
      const elin=!is('elin')?died('elin'):fabodNow&&fabodFrom(run,2096)
        ?t(`Elin, ${age('elin')}, går fortfarande upp till fäboden varje sommar och lär barnbarnet Tyra att koka messmör.`,`Elin, ${age('elin')}, still walks up to the summer farm every summer and teaches her granddaughter Tyra to make whey butter.`)
        :d.lowParticipation<.2?t(`Elin, ${age('elin')}, bor kvar på HSBgatan, och grannarna tittar in varje dag.`,`Elin, ${age('elin')}, still lives on HSBgatan, and the neighbours drop in every day.`)
        :d.aiCapacity>.6?t(`Elin, ${age('elin')}, bor kvar på HSBgatan och har mest sin AI-assistent som sällskap.`,`Elin, ${age('elin')}, still lives on HSBgatan, with mostly her AI assistant for company.`)
        :t(`Elin, ${age('elin')}, bor kvar på HSBgatan och har mest radion som sällskap.`,`Elin, ${age('elin')}, still lives on HSBgatan, with mostly the radio for company.`);
      const y=age('tyra');
      const tyra=I.anpassning>.6?t(`Tyra, ${y}, är vattenvårdare och bygger våtmarker som tar emot skyfallen och Siljans högvatten.`,`Tyra, ${y}, is a water warden and builds wetlands that take the cloudbursts and Lake Siljan’s high water.`)
        :d.floodRisk>.2?t(`Tyra, ${y}, lade sandsäckar vid campingen när Siljan steg i våras; vid stranden har ingen byggt något skydd.`,`Tyra, ${y}, laid sandbags at the campsite when Lake Siljan rose last spring; nobody has built any protection along the shore.`)
        :t(`Tyra, ${y}, jobbar i hemtjänsten.`,`Tyra, ${y}, works in home care.`);
      const boat=pick(d.lowParticipation<.15,
        t(`Kari, ${age('kari')}, rodde kyrkbåten till Kyrkudden för första gången i midsomras. Båten var full, och fler ville ro än det fanns plats för.`,`Kari, ${age('kari')}, rowed the church boat to Kyrkudden for the first time last Midsummer. The boat was full, and more wanted to row than there was room for.`),
        t(`Kari, ${age('kari')}, rodde kyrkbåten till Kyrkudden för första gången i midsomras. Det var svårt att få ihop roddare till alla årparen.`,`Kari, ${age('kari')}, rowed the church boat to Kyrkudden for the first time last Midsummer. It was hard to find rowers for all the pairs of oars.`));
      return join(mats,elin,tyra,boat,evText);
    }
    case 2106:{
      const elin=is('elin')?t(`Elin fyller ${age('elin')}.`,`Elin turns ${age('elin')}.`)
        :join(died('elin'),fabodNow?t('Tyra har tagit över fäboden.','Tyra has taken over the summer farm.'):fabodFrom(run,2106)?t('Fäboden står tom.','The summer farm stands empty.'):'');
      const k=age('kari');
      const kari=pick(I.hav>.5&&d.waters>.75,
        t(`Kari, ${k}, är sjövårdare och räknar harren och öringen som leker i Enån.`,`Kari, ${k}, is a lake keeper and counts the grayling and trout that spawn in the Enån.`),
        t(`Kari, ${k}, jobbar på campingen om somrarna och i hemtjänsten på vintern.`,`Kari, ${k}, works at the campsite in summer and in home care in winter.`));
      const m=age('mats');
      const fiddle=!is('signe')?t(`Mats, ${m}, hittade släktfiolen bland farmor Signes saker.`,`Mats, ${m}, found the family fiddle among Grandma Signe’s things.`)
        :playsBy(run,2106)?t(`Signe, ${age('signe')}, lär Mats, ${m}, att spela på släktfiolen.`,`Signe, ${age('signe')}, is teaching Mats, ${m}, to play the family fiddle.`)
        :t(`Mats, ${m}, hittade släktfiolen i farmor Signes garderob. Ingen i familjen kan spela på den.`,`Mats, ${m}, found the family fiddle in Grandma Signe’s wardrobe. Nobody in the family can play it.`);
      return join(elin,kari,fiddle,evText);
    }
    case 2116:{
      const m=age('mats'),stays=d.attract>.8||(I.kunskap>.5&&d.unemployment<.05);
      const mats=stays
        ?t(`Mats, ${m}, sa som unga i Rättvik alltid har sagt: ”Jag flyttar härifrån.” Han stannade. Här finns jobb, och tåget till Stockholm tar ${rail(d.railMain)} när han vill dit.`,`Mats, ${m}, said what young people in Rättvik have always said: “I’m moving away.” He stayed. There is work here, and the train to Stockholm takes ${rail(d.railMain)} when he wants to go.`)
        :t(`Mats, ${m}, flyttar till Stockholm i höst, som så många unga före honom. Tåget tar ${rail(d.railMain)}, och han lovar att komma hem till midsommar.`,`Mats, ${m}, is moving to Stockholm this autumn, like so many young people before him. The train takes ${rail(d.railMain)}, and he promises to come home for Midsummer.`);
      const signe=!is('signe')?died('signe'):join(t(`Signe, ${age('signe')}, är äldst i släkten.`,`Signe, ${age('signe')}, is the oldest in the family.`),
        d.cohousing>.3?t('Hon bor i Generationshuset och äter i kvartersköket med grannar i alla åldrar.','She lives in the Generation House and eats in its shared kitchen with neighbours of all ages.')
          :t('Hon bor kvar i huset på Hjort Anders väg, med Jon och Mats på övervåningen.','She still lives in the house on Hjort Anders väg, with Jon and Mats upstairs.'));
      const town=t(`Rättvik har ${hundreds(d.pop)} invånare, och en vanlig julidag är ${hundreds(d.summerPeople)} människor i kommunen.`,`Rättvik has ${hundreds(d.pop)} inhabitants, and on an ordinary July day ${hundreds(d.summerPeople)} people are in the municipality.`);
      return join(mats,signe,town,evText);
    }
  }
  return '';
}
// Midsummer 2126: the church boats row to Kyrkudden, as they have for centuries.
export function familyEpilogue(run){
  const d=at(run,2126).ind,spans=lifespans(run),signe=FAMILY.find(m=>m.id==='signe');
  const shore=join(pick(d.lowParticipation<.15,
      t('Båten är full, och på stranden står halva bygden.','The boat is full, and half the community stands on the shore.'),
      t('Det var svårt att få ihop roddare i år, och några platser i båten är tomma.','It was hard to find rowers this year, and a few places in the boat are empty.')),
    pick(d.carShare<.25,t('Från land hörs bara fioler.','From the shore all you hear is fiddles.'),t('Från Riksvägen hörs trafiken.','From Riksvägen comes the sound of traffic.')));
  if(alive(signe,2126,spans))return join(
    t(`Midsommar 2126 ror släkten Halvars kyrkbåten över Rättviken till Kyrkudden. Signe, ${2126-signe.birth}, sitter i aktern med släktfiolen i knät; Mats och Kari ror. ”När jag var sju fick jag inte gå på isen, och bilarna mullrade genom centrum varje sommar. Ingen visste hur det skulle bli. Men en kyrkbåt kommer ingenstans om inte alla ror i takt.”`,
      `At Midsummer 2126 the Halvars family rows the church boat across Rättviken to Kyrkudden. Signe, ${2126-signe.birth}, sits in the stern with the family fiddle in her lap; Mats and Kari row. “When I was seven I wasn’t allowed on the ice, and cars rumbled through the centre every summer. Nobody knew how things would turn out. But a church boat gets nowhere unless everyone rows in time.”`),
    shore);
  return join(
    t(`Signe hann bli ${spans.signe-signe.birth} år. Midsommar 2126 ror Mats och Kari kyrkbåten över Rättviken till Kyrkudden, med släktfiolen i ett fodral under toften – fiolen som hängde på Margits vägg 2026.`,
      `Signe lived to ${spans.signe-signe.birth}. At Midsummer 2126 Mats and Kari row the church boat across Rättviken to Kyrkudden, with the family fiddle in a case under the thwart – the fiddle that hung on Margit’s wall in 2026.`),
    playsBy(run,2116)?t('På kyrkbacken spelar Mats låten som Signe lärde honom.','On the church hill Mats plays the tune Signe taught him.'):t('Ingen i båten kan spela på den.','Nobody in the boat can play it.'),
    shore);
}
// How the family is introduced in the Family tab.
export const FAMILY_INTRO={
  sv:'Släkten Halvars i Rättviks centrum, fem generationer. Halvars är ett gårdsnamn: runt Siljan har man länge sagt gårdens namn före förnamnet – Halvars Margit. Hur länge de lever och hur de lever beror på bygden du bygger.',
  en:'The Halvars family in central Rättvik, five generations. Halvars is a farm name: round Lake Siljan the farm’s name has long been said before the first name – Halvars Margit. How long and how well they live depends on the place you build.',
};
export const FAMILY_TITLE={sv:'Släkten Halvars',en:'The Halvars family'};
