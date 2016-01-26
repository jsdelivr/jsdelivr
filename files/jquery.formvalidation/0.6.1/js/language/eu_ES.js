(function($) {
    /**
     * Basque language package
     * Translated by @xabikip
     */
    FormValidation.I18n = $.extend(true, FormValidation.I18n, {
        'eu_ES': {
            base64: {
                'default': 'Mesedez sartu base 64an balore egoki bat'
            },
            between: {
                'default': 'Mesedez sartu %s eta %s artean balore bat',
                notInclusive: 'Mesedez sartu %s eta %s arteko balore bat soilik'
            },
            bic: {
                'default': 'Mesedez sartu BIC zenbaki egoki bat'
            },
            callback: {
                'default': 'Mesedez sartu balore egoki bat'
            },
            choice: {
                'default': 'Mesedez sartu balore egoki bat',
                less: 'Mesedez aukeraru %s aukera gutxienez',
                more: 'Mesedez aukeraru %s aukera gehienez',
                between: 'Mesedez aukeratu %s eta %s arteko aukerak'
            },
            color: {
                'default': 'Mesedezn sartu kolore egoki bat'
            },
            creditCard: {
                'default': 'Mesedez sartu kerditu-txartelaren zenbaki egoki bat'
            },
            cusip: {
                'default': 'Mesedez sartu CUSIP zenbaki egoki bat'
            },
            cvv: {
                'default': 'Mesedez sartu CVV zenbaki egoki bat'
            },
            date: {
                'default': 'Mesedez sartu data egoki bat',
                min: 'Mesedez sartu %s baino geroagoko data bat',
                max: 'Mesedez sartu %s baino lehenagoko data bat',
                range: 'Mesedez sartu %s eta %s arteko data bat'
            },
            different: {
                'default': 'Mesedez sartu balore ezberdin bat'
            },
            digits: {
                'default': 'Mesedez sigituak soilik sartu'
            },
            ean: {
                'default': 'Mesedez EAN zenbaki egoki bat sartu'
            },
            ein: {
                'default': 'Mesedez EIN zenbaki egoki bat sartu'
            },
            emailAddress: {
                'default': 'Mesedez e-posta egoki bat sartu'
            },
            file: {
                'default': 'Mesedez artxibo egoki bat aukeratu'
            },
            greaterThan: {
                'default': 'Mesedez %s baino handiagoa edo berdina den zenbaki bat sartu',
                notInclusive: 'Mesedez %s baino handiagoa den zenbaki bat sartu'
            },
            grid: {
                'default': 'Mesedez GRID zenbaki egoki bat sartu'
            },
            hex: {
                'default': 'Mesedez sartu balore hamaseitar egoki bat'
            },
            iban: {
                'default': 'Mesedez, sartu IBAN zenbaki egoki bat',
                country: 'Mesedez, sartu IBAN zenbaki egoki bat honako: %s',
                countries: {
                    AD: 'Andorra',
                    AE: 'Arabiar Emirerri Batuak',
                    AL: 'Albania',
                    AO: 'Angola',
                    AT: 'Austria',
                    AZ: 'Azerbaijan',
                    BA: 'Bosnia-Herzegovina',
                    BE: 'Belgika',
                    BF: 'Burkina Faso',
                    BG: 'Bulgaria',
                    BH: 'Baréin',
                    BI: 'Burundi',
                    BJ: 'Benin',
                    BR: 'Brasil',
                    CH: 'Suitza',
                    CI: 'Boli Kosta',
                    CM: 'Kamerun',
                    CR: 'Costa Rica',
                    CV: 'Cabo Verde',
                    CY: 'Cyprus',
                    CZ: 'Txekiar Errepublika',
                    DE: 'Alemania',
                    DK: 'Danimarka',
                    DO: 'Dominikar Errepublika',
                    DZ: 'Aljeria',
                    EE: 'Estonia',
                    ES: 'Espainia',
                    FI: 'Finlandia',
                    FO: 'Feroe Irlak',
                    FR: 'Frantzia',
                    GB: 'Erresuma Batua',
                    GE: 'Georgia',
                    GI: 'Gibraltar',
                    GL: 'Groenlandia',
                    GR: 'Grezia',
                    GT: 'Guatemala',
                    HR: 'Kroazia',
                    HU: 'Hungaria',
                    IE: 'Irlanda',
                    IL: 'Israel',
                    IR: 'Iran',
                    IS: 'Islandia',
                    IT: 'Italia',
                    JO: 'Jordania',
                    KW: 'Kuwait',
                    KZ: 'Kazakhstan',
                    LB: 'Libano',
                    LI: 'Liechtenstein',
                    LT: 'Lituania',
                    LU: 'Luxemburgo',
                    LV: 'Letonia',
                    MC: 'Monako',
                    MD: 'Moldavia',
                    ME: 'Montenegro',
                    MG: 'Madagaskar',
                    MK: 'Mazedonia',
                    ML: 'Mali',
                    MR: 'Mauritania',
                    MT: 'Malta',
                    MU: 'Maurizio',
                    MZ: 'Mozambike',
                    NL: 'Herbeherak',
                    NO: 'Norvegia',
                    PK: 'Pakistán',
                    PL: 'Poland',
                    PS: 'Palestina',
                    PT: 'Portugal',
                    QA: 'Catar',
                    RO: 'Errumania',
                    RS: 'Serbia',
                    SA: 'Arabia Saudi',
                    SE: 'Suedia',
                    SI: 'Eslovenia',
                    SK: 'Eslovakia',
                    SM: 'San Marino',
                    SN: 'Senegal',
                    TN: 'Tunisia',
                    TR: 'Turkia',
                    VG: 'Birjina Uharte Britainiar'
                }
            },
            id: {
                'default': 'Mesedez baliozko identifikazio-zenbakia sartu',
                country: 'Mesedez baliozko identifikazio-zenbakia sartu honako: %s',
                countries: {
                    BA: 'Bosnia Herzegovina',
                    BG: 'Bulgaria',
                    BR: 'Brasil',
                    CH: 'Suitza',
                    CL: 'Txile',
                    CN: 'Txina',
                    CZ: 'Txekiar Errepublika',
                    DK: 'Danimarka',
                    EE: 'Estonia',
                    ES: 'Espainia',
                    FI: 'Finlandia',
                    HR: 'Kroazia',
                    IE: 'Irlanda',
                    IS: 'Islandia',
                    LT: 'Lituania',
                    LV: 'Letonia',
                    ME: 'Montenegro',
                    MK: 'Mazedonia',
                    NL: 'Herbeherak',
                    PL: 'Poland',
                    RO: 'Romania',
                    RS: 'Serbia',
                    SE: 'Suecia',
                    SI: 'Eslovenia',
                    SK: 'Eslovakia',
                    SM: 'San Marino',
                    TH: 'Tailandia',
                    ZA: 'Hegoafrika'
                }
            },
            identical: {
                'default': 'Mesedez, balio bera sartu'
            },
            imei: {
                'default': 'Mesedez, IMEI baliozko zenbaki bat sartu'
            },
            imo: {
                'default': 'Mesedez, IMO baliozko zenbaki bat sartu'
            },
            integer: {
                'default': 'Mesedez, baliozko zenbaki bat sartu'
            },
            ip: {
                'default': 'Mesedez, baliozko IP helbide bat sartu',
                ipv4: 'Mesedez, baliozko IPv4 helbide bat sartu',
                ipv6: 'Mesedez, baliozko IPv6 helbide bat sartu'
            },
            isbn: {
                'default': 'Mesedez, ISBN baliozko zenbaki bat sartu'
            },
            isin: {
                'default': 'Mesedez, ISIN baliozko zenbaki bat sartu'
            },
            ismn: {
                'default': 'Mesedez, ISMM baliozko zenbaki bat sartu'
            },
            issn: {
                'default': 'Mesedez, ISSN baliozko zenbaki bat sartu'
            },
            lessThan: {
                'default': 'Mesedez, %s en balio txikiagoa edo berdina sartu',
                notInclusive: 'Mesedez, %s baino balio txikiago sartu'
            },
            mac: {
                'default': 'Mesedez, baliozko MAC helbide bat sartu'
            },
            meid: {
                'default': 'Mesedez, MEID baliozko zenbaki bat sartu'
            },
            notEmpty: {
                'default': 'Mesedez balore bat sartu'
            },
            numeric: {
                'default': 'Mesedez, baliozko zenbaki hamartar bat sartu'
            },
            phone: {
                'default': 'Mesedez baliozko telefono zenbaki bat sartu',
                country: 'Mesedez baliozko telefono zenbaki bat sartu honako: %s',
                countries: {
                    AE: 'Arabiar Emirerri Batua',
                    BG: 'Bulgaria',
                    BR: 'Brasil',
                    CN: 'Txina',
                    CZ: 'Txekiar Errepublika',
                    DE: 'Alemania',
                    DK: 'Danimarka',
                    ES: 'Espainia',
                    FR: 'Frantzia',
                    GB: 'Erresuma Batuak',
                    IN: 'India',
                    MA: 'Maroko',
                    NL: 'Herbeherak',
                    PK: 'Pakistan',
                    RO: 'Errumania',
                    RU: 'Errusiarra',
                    SK: 'Eslovakia',
                    TH: 'Tailandia',
                    US: 'Estatu Batuak',
                    VE: 'Venezuela'
                }
            },
            regexp: {
                'default': 'Mesedez, patroiarekin bat datorren balio bat sartu'
            },
            remote: {
                'default': 'Mesedez balore egoki bat sartu'
            },
            rtn: {
                'default': 'Mesedez, RTN baliozko zenbaki bat sartu'
            },
            sedol: {
                'default': 'Mesedez, SEDOL baliozko zenbaki bat sartu'
            },
            siren: {
                'default': 'Mesedez, SIREN baliozko zenbaki bat sartu'
            },
            siret: {
                'default': 'Mesedez, SIRET baliozko zenbaki bat sartu'
            },
            step: {
                'default': 'Mesedez %s -ko pausu egoki bat sartu'
            },
            stringCase: {
                'default': 'Mesedez, minuskulazko karaktereak bakarrik sartu',
                upper: 'Mesedez, maiuzkulazko karaktereak bakarrik sartu'
            },
            stringLength: {
                'default': 'Mesedez, luzeera egoki bateko baloreak bakarrik sartu',
                less: 'Mesedez, %s baino karaktere gutxiago sartu',
                more: 'Mesedez, %s baino karaktere gehiago sartu',
                between: 'Mesedez, %s eta %s arteko luzeera duen balore bat sartu'
            },
            uri: {
                'default': 'Mesedez, URI egoki bat sartu.'
            },
            uuid: {
                'default': 'Mesedez, UUID baliozko zenbaki bat sartu',
                version: 'Mesedez, UUID bertsio egoki bat sartu honendako: %s'
            },
            vat: {
                'default': 'Mesedez, BEZ zenbaki egoki bat sartu',
                country: 'Mesedez, BEZ zenbaki egoki bat sartu herrialde hontarako: %s',
                countries: {
                    AT: 'Austria',
                    BE: 'Belgika',
                    BG: 'Bulgaria',
                    BR: 'Brasil',
                    CH: 'Suitza',
                    CY: 'Txipre',
                    CZ: 'Txekiar Errepublika',
                    DE: 'Alemania',
                    DK: 'Danimarka',
                    EE: 'Estonia',
                    ES: 'Espainia',
                    FI: 'Finlandia',
                    FR: 'Frantzia',
                    GB: 'Erresuma Batuak',
                    GR: 'Grezia',
                    EL: 'Grezia',
                    HU: 'Hungaria',
                    HR: 'Kroazia',
                    IE: 'Irlanda',
                    IS: 'Islandia',
                    IT: 'Italia',
                    LT: 'Lituania',
                    LU: 'Luxemburgo',
                    LV: 'Letonia',
                    MT: 'Malta',
                    NL: 'Herbeherak',
                    NO: 'Noruega',
                    PL: 'Polonia',
                    PT: 'Portugal',
                    RO: 'Errumania',
                    RU: 'Errusia',
                    RS: 'Serbia',
                    SE: 'Suedia',
                    SI: 'Eslovenia',
                    SK: 'Eslovakia',
                    VE: 'Venezuela',
                    ZA: 'Hegoafrika'
                }
            },
            vin: {
                'default': 'Mesedez, baliozko VIN zenbaki bat sartu'
            },
            zipCode: {
                'default': 'Mesedez, baliozko posta kode bat sartu',
                country: 'Mesedez, baliozko posta kode bat sartu herrialde honetarako: %s',
                countries: {
                    AT: 'Austria',
                    BG: 'Bulgaria',
                    BR: 'Brasil',
                    CA: 'Kanada',
                    CH: 'Suitza',
                    CZ: 'Txekiar Errepublika',
                    DE: 'Alemania',
                    DK: 'Danimarka',
                    ES: 'Espainia',
                    FR: 'Frantzia',
                    GB: 'Erresuma Batuak',
                    IE: 'Irlanda',
                    IN: 'India',
                    IT: 'Italia',
                    MA: 'Maroko',
                    NL: 'Herbeherak',
                    PL: 'Poland',
                    PT: 'Portugal',
                    RO: 'Errumania',
                    RU: 'Errusia',
                    SE: 'Suedia',
                    SG: 'Singapur',
                    SK: 'Eslovakia',
                    US: 'Estatu Batuak'
                }
            }
        }
    });
}(jQuery));
