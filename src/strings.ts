import {NewFootprintObservationSteps} from './constants';

export const strings: any = {
  name: 'Vardas',
  lastName: 'Pavardė',
  email: 'Elektroninis paštas',
  ticketNumber: 'Medžiotojo bilieto nr.',
  phoneNumber: 'Telefono numeris',
  personalNumber: 'Asmens kodas',
  emptyState: {
    huntingHistory: 'Medžioklių nėra',
    noData: 'Duomenų nėra',
  },
  common: {
    back: 'Atgal',
    continue: 'Tęsti',
    cancel: 'Atšaukti',
    edit: 'Redaguoti',
    delete: 'Ištrinti',
    ok: 'Gerai',
    understand: 'Supratau',
    save: 'Saugoti',
    yes: 'Taip',
    no: 'Ne',
    ask: 'Prašyti',
    from: 'Nuo',
    to: 'Iki',
    filter: `Filtruoti`,
  },
  huntingTabs: {
    members: 'Dalyviai',
    loot: 'Laimikiai',
    map: 'Žemėlapis',
  },
  tabs: {
    events: 'Medžioklės',
    hunting: 'Vyksta dabar',
    limits: 'Statistika',
  },
  violation: {
    LIMIT: 'Viršytas limitas',
    PERIOD: 'Sumedžiotas ne termino metu',
    OTHER_ANIMAL: 'Kitas gyvūnas',
    CAR_ACCIDENT: 'Sužalotas autoįvykio metu',
    SICK_OR_HURT: 'Sužalotas ar akivaizdžiai sergantis',
  },
  activeEvent: 'Vyksta dabar',
  inactiveEvent: 'Nieko nevyksta',
  wolfHuntingType: {
    VAROMOJI: 'varant',
    TYKOJAMOJI: 'tykojant',
    SU_VELIAVELEMIS: 'su vėliavėlėmis',
  },
  registrationMethod: {
    MOBILE: 'Mobili programėlė',
    IVR: 'Interaktyvus balso atsakiklis',
    ADMIN: 'AAD darbuotojas',
  },
  monthAbbreviations: {
    1: 'SAU',
    2: 'VAS',
    3: 'KOV',
    4: 'BAL',
    5: 'GEG',
    6: 'BIR',
    7: 'LIE',
    8: 'RGP',
    9: 'RGS',
    10: 'SPA',
    11: 'LAP',
    12: 'GRU',
  },
  months: {
    january: 'Sausis',
    february: 'Vasaris',
    martch: 'Kovas',
    april: 'Balandis',
    may: 'Gedužė',
    june: 'Birželis',
    july: 'Liepa',
    august: 'Rugpjūtis',
    september: 'Rugsėjis',
    october: 'Spalis',
    november: 'Lapkristis',
    decemper: 'Gruodis',
  },
  today: 'Šiandien',
  upcoming: 'Artėjantys',
  happening: 'Vyksta dabar',
  registrationStarted: 'Pradėta registracija',
  finished: 'Praėję',
  newHunting: 'Nauja medžioklė',
  createNewHunting: 'Sukurti medžioklę',
  startRegistration: 'Pradėti registraciją',
  participate: 'Tvirtinti dalyvavimą',
  confirmMysef: 'Tvirtinti savo dalyvavimą',
  registerForParticipation: 'Prisijungti į medžioklę',
  startHunting: 'Pradėti medžioklę',
  endRegistration: 'Baigti medžioklę',
  endHunting: 'Baigti medžioklę',
  newHuntingSteps: {
    type: 'Pasirinkite medžioklės tipą',
    date: 'Pasirinkite medžioklės laiką',
    notes: 'Parašykite pastabas',
    huntingArea: 'Pasirinkite medžioklės plotą',
  },
  footprintWizardSteps: {
    [NewFootprintObservationSteps.Date]: 'Pasirinkite stebėjimo laiką',
    [NewFootprintObservationSteps.Trail]: 'Pasirinkite maršrutą',
  },
  myHuntings: 'Mano medžioklės',
  personalHuntings: 'Asmeninės medžioklės',
  inviteHunter: 'Pakviesti medžiotoją',
  search: 'Paieška',
  addMember: 'Pridėkite būrelio narį',
  huntingInvitationTitle: 'Pakviesti',
  userInvitationTitle: 'Pridėkite būrelio narį',
  guestInvitationTitle: 'Pridėkite  svečią ',
  invitationTitle: {
    user: 'Pridėkite būrelio narį',
    guest: 'Pridėkite  svečią ',
    hunting: 'Pakviesti:',
  },
  invite: {
    user: 'NARĮ',
    guest: 'SVEČIĄ',
  },
  clean: 'Išvalyti',
  create: 'Sukurti',
  error: {
    required: 'Privalomas laukas',
    photoRequired: 'Nuotrauka privaloma',
    incorrectValue: 'Neteisingas įrašas',
    invalidEmail: 'Neteisingas elektroninis paštas',
    invalidPhoneNumber: 'Neteisingas telefono nr.',
    invalidPersonalCode: 'Neteisingas asmens kodas',
    invalidTicketNumber: 'Neteisingas medžiotojo bilieto numeris',
  },
  guest: {
    lithuanian: 'Lietuvos pilietis',
    foreigner: 'Užsienio pilietis',
  },
  user: 'Vartotojas',
  pasword: 'Slaptažodis',
  login: 'Prisijungti',
  login2: 'Prisijungti per el. valdžios vartus',
  memberOptions: {
    locationOnMap: 'Vieta žemėlapyje',
    makeManager: 'Paskirti vadovu',
    remove: 'Pašalinti iš medžioklės',
    decline: 'Atšaukti dalyvavimą',
    confirm: 'Tvirtinti dalyvavimą',
    confirmMyself: 'Patvirtinti dalyvavimą',
    registerLoot: 'Registruoti laimikį',
    loot: 'Laimikiai',
  },
  lootCaseType: {
    STANDARD: 'Medžioklė',
    CAR_ACCIDENT: 'Autoįvykis',
    SICK_OR_HURT: 'Sužeistas ar sergantis',
  },
  manager: 'Vadovas',
  admin: 'Administratoriai',
  members: 'Nariai',
  guests: 'Svečiai',
  left: 'Išvykę',
  profile: 'Nario informacija',
  ownerProfile: 'Vadovo informacija',
  organization: 'Medžiotojų būrelis',
  limits: 'Limitai',
  newMember: 'Naujas narys',
  confirmationTerms:
    'Patvirtinu, kad esu susipažinęs su saugaus elgesio medžioklėje reikalavimais ir leidimas laikyti (nešiotis) ginklą yra galiojantis (jeigu medžiojama su šaunamuoju ginklu)',
  sign: 'Pasirašyti',
  clear: 'Išvalyti',
  editHunting: 'Redaguoti medžioklę',
  deleteHunting: 'Ištrinti medžioklę',
  huntingComment: 'Medžioklės pastabos',
  noActiveHuntingTitle: 'Šiuo metu medžioklė nevyksta',
  huntingInProgressTitle: 'Šiuo metu vyksta medžioklė',
  noActiveHuntingSubtitle:
    'Prasidėjus medžioklei, čia galėsite valdyti vykstančią medžioklę bei registruoti laimikius',
  loot: 'Sumedžiotas gyvūnas',
  loots: 'Laimikiai',
  animal: 'Gyvūnas',
  huntingInprgressSutitle:
    'Pradėti registraciją į naują medžioklę galėsite pabaigus šiuo metu vykstančią medžioklę',
  errors: {
    noActiveHunting: {
      title: 'Šiuo metu medžioklė nevyksta',
      subtitle:
        'Prasidėjus medžioklei, čia galėsite valdyti vykstančią medžioklę bei registruoti laimikius',
    },
    huntingInProgress: {
      title: 'Šiuo metu vyksta medžioklė',
      subtitle:
        'Pradėti registraciją į naują medžioklę galėsite pabaigus šiuo metu vykstančią medžioklę',
    },
    cannotConfirm: {
      title: 'Patvirtinti dalyvavimo negalima',
      subtitle: 'Turite baigti kitą šiuo metu vykstančią medžioklę',
    },
    notAllMembersResponded: {
      title: 'Dėmesio!',
      subtitle:
        'Ne visi dalyviai patvirtino registraciją. Pradėjus medžioklę, nepatvirtinusieji registracijos bus automatiškai pašalinti',
    },
    huntingInThePast: {
      title: 'Medžioklės laikas yra praėjęs',
      subtitle:
        'Pridėti naują dalyvį galėsite tik medžioklės vadovui atnaujinus medžioklės laiką',
      subtitleAdmin:
        'Pridėti naują dalyvį galėsite tik atnaujinus medžioklės laiką',
    },
    joinHuntingNotAllowed: {
      title: 'Negalima prisijungti į medžioklę',
      subtitle:
        'Ši medžioklė jau yra prasidėjusi. Norėdami prisijungti, susisiekite su šios medžiokles vadovu.',
    },
  },
  huntingManageLabel: 'Vadovas',
  me: 'Aš',
  MALE: 'Patinas',
  FEMALE: 'Patelė',
  JUNIOR: 'Jauniklis',
  amount: 'Kiekis',
  rightHorn: 'Dešinys ragas',
  leftHorn: 'Kairys ragas',
  rightHornLabel: 'Dešinio rago šakų skaičius:',
  leftHornLabel: 'Kairio rago šakų skaičius:',
  oneBranch: 'Viena šaka',
  branches: 'šakos',
  noBranches: '0 šakų',
  role: {
    HUNTER: 'Narys',
    USER_ADMIN: 'Administratorius',
    FARMER: 'Žemės savininkas',
    OWNER: 'Vadovas',
  },
  waitingForConfirmation: 'Laukiama patvirtinimo',
  inviteNewMember: 'Pakviesti narį',
  huntingAreas: 'Medžioklės plotų vienetai',
  roleLabel: 'Rolė',
  myRoles: 'Mano rolės',
  branchCount: 'Šakų skaičius',
  TWO_YEAR: 'Vyresnis nei 1m.',
  ADULT: 'Vyresnis nei 2m.',
  ONE_YEAR: 'Jauniklis (iki 1m.)',
  gender: 'Lytis',
  age: 'Amžius',
  wolfHuntingTypeQuestion: 'Sumedžiojimo būdas:',
  hasScabies: 'Oda ar kailis pažeista niežų?',
  hasDefects: 'Kiti aiškai matomi fiziniai defektai',
  isWolfPackMember: {
    label: 'Ar priklausė gaujai?',
    yes: 'Priklausė',
    no: 'Nepriklausė',
    isNot: 'Nėra',
    is: 'Yra',
    packMembers: 'Kiek gaujoje buvo:',
    total: 'Viso vilkų',
    adults: 'Suaugusių vilkų',
    juniors: 'Jauniklių',
    totalWolfs: 'Kiek gaujoje buvo viso vilkų?',
    totalAdults: 'Kiek gaujoje buvo suaugusių vilkų?',
    totalJuniors: 'Kiek gaujoje buvo jauniklių?',
  },
  animalInformation: 'Informacija apie gyvūną:',
  whoHunted: 'Sumedžiojo:',
  whoRegistered: 'Užregistravo:',
  whenRegistered: 'Užregistruota:',
  whenSaved: 'Išsaugota:',
  registrationMethodLabel: 'Registracijos būdas:',
  registerLoot: 'Registruoti laimikį',
  disabledLootRegistration: 'Medžioklė šiuo metu nevyksta',
  noLoots: 'Laimikių nėra',
  huntingAreaUser: 'Informacija',
  membersSettings: 'Narių valdymas',
  myProfile: 'Mano informacija',
  myTenantUsers: `MPV Naudotojai:`,
  huntingAreaSwitchTitle: 'MPV valdymas',
  askLimits: 'Prašyti limitų',
  aditionalData: 'Papildomi duomenys',
  huntingAreaSwitchInfo:
    'Pasirinkus kitą medžioklės plotų vienetą, galėsite valdyti šio medžioklės ploto narius, limitus bei medžiokles',
  huntingRegistrationStarted: 'Registracija į medžioklę pradėta.',
  huntingStarted: 'Medžioklė pradėta.',
  huntingEnded: 'Medžioklė pabaigta.',
  genericError: 'Įvyko klaida.',
  genericNetworkError: 'Nėra interneto ryšio',
  remove: 'Pašalinti',
  update: 'Atnaujinti',
  requiredAdditionalData: 'Pateikti papildomus duomenis',
  limitsRequest: 'Limitų prašymas',
  huntings: 'Medžioklės',
  huntingStatus: {
    registrationStarted: 'Pradėta registracija',
    huntingStarted: 'Vyksta dabar',
    huntingEnded: 'Medžioklė pasibaigusi',
    notStarted: 'Medžioklė neprasidėjusi',
  },
  season: 'SEZONAS',
  hunterInvited: 'Medžiotojas pakviestas',
  addHuntingLocation: 'Ar norėtumėte priskirti vietą medžioklės plote?',
  signIpDenied: 'Prisijungimas negalimas',
  toLogin: 'Į prisijungimo langą',
  signInInstruction:
    'Norint prisijungti prie BĮIP "Medžioklės žurnalas" programėlės:',
  singInInstructionCompany:
    'Jeigu esate juridinio asmens valdančio medžioklės plotų vienetą vadovas, norint gauti prieigą prie medžioklės žurnalo programėlės, susisiekite su Aplinkos apsaugos departamentu',
  singInInstructionPrivate:
    'Jeigu esate fizinis asmuo turintis teisę medžioti viename ar keliuose medžioklės plotuose, kreipkitės į medžioklės plotų vienetą valdančios įmonės (Būrelio/Medžiotojų asociacijos) vadovą, kad jus pakviestų.',
  confirmLoot: 'Ar tikrai norite užregistruoti laimikį?',
  confirmLootSubtitle: 'Šio veiksmo nebus galima atšaukti ar redaguoti',
  confirmHuntingDelete: 'Ar tikrai norite ištrinti šią medžioklę?',
  removeMember: 'Pašalinti narį',
  confirmRemoveMember: 'Ar tikrai norite pašalinti narį iš medžioklės būrelio?',
  removeMemberHunting: 'Pašalinti dalyvį iš medžioklės',
  confirmRemoveMemberHunting:
    'Ar tikrai norite pašalinti dalyvį iš šios medžioklės?',
  confirmHuntingEnd: 'Ar tikrai norite užbaigti medžioklę?',
  confirmHuntingEndSubtitle: 'Šio veiksmo nebus galima atšaukti ar redaguoti',
};
