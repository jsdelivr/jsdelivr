(function($) {
    /**
     * Finnish language package
     * Translated by @traone
     */
    FormValidation.I18n = $.extend(true, FormValidation.I18n, {
        'fi_FI': {
            base64: {
                'default': 'Ole hyvä anna kelvollinen base64 koodattu merkkijono'
            },
            between: {
                'default': 'Ole hyvä anna arvo %s ja %s väliltä',
                notInclusive: 'Ole hyvä anna arvo %s ja %s väliltä'
            },
            bic: {
                'default': 'Ole hyvä anna kelvollinen BIC numero'
            },
            callback: {
                'default': 'Ole hyvä anna kelvollinen arvo'
            },
            choice: {
                'default': 'Ole hyvä anna kelvollinen arvo',
                less: 'Ole hyvä valitse vähintään %s valintaa',
                more: 'Ole hyvä valitse enintään %s valintaa',
                between: 'Ole hyvä valitse %s - %s valintaa'
            },
            color: {
                'default': 'Ole hyvä anna kelvollinen väriarvo'
            },
            creditCard: {
                'default': 'Ole hyvä anna kelvollinen luottokortin numero'
            },
            cusip: {
                'default': 'Ole hyvä anna kelvollinen CUSIP numero'
            },
            cvv: {
                'default': 'Ole hyvä anna kelvollinen CVV numero'
            },
            date: {
                'default': 'Ole hyvä anna kelvollinen päiväys',
                min: 'Ole hyvä anna %s jälkeinen päiväys',
                max: 'Ole hyvä anna %s edeltävä päiväys',
                range: 'Ole hyvä anna päiväys %s - %s väliltä'
            },
            different: {
                'default': 'Ole hyvä anna jokin toinen arvo'
            },
            digits: {
                'default': 'Vain numerot sallittuja'
            },
            ean: {
                'default': 'Ole hyvä anna kelvollinen EAN numero'
            },
            ein: {
                'default': 'Ole hyvä anna kelvollinen EIN numero'
            },
            emailAddress: {
                'default': 'Ole hyvä anna kelvollinen sähköpostiosoite'
            },
            file: {
                'default': 'Ole hyvä valitse kelvollinen tiedosto'
            },
            greaterThan: {
                'default': 'Ole hyvä anna arvoksi yhtä suuri kuin, tai suurempi kuin %s',
                notInclusive: 'Ole hyvä anna arvoksi suurempi kuin %s'
            },
            grid: {
                'default': 'Ole hyvä anna kelvollinen GRId numero'
            },
            hex: {
                'default': 'Ole hyvä anna kelvollinen heksadesimaali luku'
            },
            iban: {
                'default': 'Ole hyvä anna kelvollinen IBAN numero',
                country: 'Ole hyvä anna kelvollinen IBAN numero maassa %s',
                countries: {
                    AD: 'Andorra',
                    AE: 'Yhdistyneet arabiemiirikunnat',
                    AL: 'Albania',
                    AO: 'Angola',
                    AT: 'Itävalta',
                    AZ: 'Azerbaidžan',
                    BA: 'Bosnia ja Hertsegovina',
                    BE: 'Belgia',
                    BF: 'Burkina Faso',
                    BG: 'Bulgaria',
                    BH: 'Bahrain',
                    BI: 'Burundi',
                    BJ: 'Benin',
                    BR: 'Brasilia',
                    CH: 'Sveitsi',
                    CI: 'Norsunluurannikko',
                    CM: 'Kamerun',
                    CR: 'Costa Rica',
                    CV: 'Cape Verde',
                    CY: 'Kypros',
                    CZ: 'Tsekin tasavalta',
                    DE: 'Saksa',
                    DK: 'Tanska',
                    DO: 'Dominikaaninen tasavalta',
                    DZ: 'Algeria',
                    EE: 'Viro',
                    ES: 'Espanja',
                    FI: 'Suomi',
                    FO: 'Färsaaret',
                    FR: 'Ranska',
                    GB: 'Yhdistynyt kuningaskunta',
                    GE: 'Georgia',
                    GI: 'Gibraltar',
                    GL: 'Grönlanti',
                    GR: 'Kreikka',
                    GT: 'Guatemala',
                    HR: 'Kroatia',
                    HU: 'Unkari',
                    IE: 'Irlanti',
                    IL: 'Israel',
                    IR: 'Iran',
                    IS: 'Islanti',
                    IT: 'Italia',
                    JO: 'Jordan',
                    KW: 'Kuwait',
                    KZ: 'Kazakhstan',
                    LB: 'Libanon',
                    LI: 'Liechtenstein',
                    LT: 'Liettua',
                    LU: 'Luxembourg',
                    LV: 'Latvia',
                    MC: 'Monaco',
                    MD: 'Moldova',
                    ME: 'Montenegro',
                    MG: 'Madagascar',
                    MK: 'Makedonia',
                    ML: 'Mali',
                    MR: 'Mauritania',
                    MT: 'Malta',
                    MU: 'Mauritius',
                    MZ: 'Mozambik',
                    NL: 'Hollanti',
                    NO: 'Norja',
                    PK: 'Pakistan',
                    PL: 'Puola',
                    PS: 'Palestiina',
                    PT: 'Portugali',
                    QA: 'Qatar',
                    RO: 'Romania',
                    RS: 'Serbia',
                    SA: 'Saudi Arabia',
                    SE: 'Ruotsi',
                    SI: 'Slovenia',
                    SK: 'Slovakia',
                    SM: 'San Marino',
                    SN: 'Senegal',
                    TN: 'Tunisia',
                    TR: 'Turkki',
                    VG: 'Neitsytsaaret, Brittien'
                }
            },
            id: {
                'default': 'Ole hyvä anna kelvollinen henkilötunnus',
                country: 'Ole hyvä anna kelvollinen henkilötunnus maassa %s',
                countries: {
                    BA: 'Bosnia ja Hertsegovina',
                    BG: 'Bulgaria',
                    BR: 'Brasilia',
                    CH: 'Sveitsi',
                    CL: 'Chile',
                    CN: 'Kiina',
                    CZ: 'Tsekin tasavalta',
                    DK: 'Tanska',
                    EE: 'Viro',
                    ES: 'Espanja',
                    FI: 'Suomi',
                    HR: 'Kroatia',
                    IE: 'Irlanti',
                    IS: 'Islanti',
                    LT: 'Liettua',
                    LV: 'Latvia',
                    ME: 'Montenegro',
                    MK: 'Makedonia',
                    NL: 'Hollanti',
                    PL: 'Puola',
                    RO: 'Romania',
                    RS: 'Serbia',
                    SE: 'Ruotsi',
                    SI: 'Slovenia',
                    SK: 'Slovakia',
                    SM: 'San Marino',
                    TH: 'Thaimaa',
                    ZA: 'Etelä Afrikka'
                }
            },
            identical: {
                'default': 'Ole hyvä anna sama arvo'
            },
            imei: {
                'default': 'Ole hyvä anna kelvollinen IMEI numero'
            },
            imo: {
                'default': 'Ole hyvä anna kelvollinen IMO numero'
            },
            integer: {
                'default': 'Ole hyvä anna kelvollinen kokonaisluku'
            },
            ip: {
                'default': 'Ole hyvä anna kelvollinen IP osoite',
                ipv4: 'Ole hyvä anna kelvollinen IPv4 osoite',
                ipv6: 'Ole hyvä anna kelvollinen IPv6 osoite'
            },
            isbn: {
                'default': 'Ole hyvä anna kelvollinen ISBN numero'
            },
            isin: {
                'default': 'Ole hyvä anna kelvollinen ISIN numero'
            },
            ismn: {
                'default': 'Ole hyvä anna kelvollinen ISMN numero'
            },
            issn: {
                'default': 'Ole hyvä anna kelvollinen ISSN numero'
            },
            lessThan: {
                'default': 'Ole hyvä anna arvo joka on vähemmän kuin tai yhtä suuri kuin %s',
                notInclusive: 'Ole hyvä anna arvo joka on vähemmän kuin %s'
            },
            mac: {
                'default': 'Ole hyvä anna kelvollinen MAC osoite'
            },
            meid: {
                'default': 'Ole hyvä anna kelvollinen MEID numero'
            },
            notEmpty: {
                'default': 'Pakollinen kenttä, anna jokin arvo'
            },
            numeric: {
                'default': 'Ole hyvä anna kelvollinen liukuluku'
            },
            phone: {
                'default': 'Ole hyvä anna kelvollinen puhelinnumero',
                country: 'Ole hyvä anna kelvollinen puhelinnumero maassa %s',
                countries: {
                    AE: 'Yhdistyneet arabiemiirikunnat',
                    BG: 'Bulgaria',
                    BR: 'Brasilia',
                    CN: 'Kiina',
                    CZ: 'Tsekin tasavalta',
                    DE: 'Saksa',
                    DK: 'Tanska',
                    ES: 'Espanja',
                    FR: 'Ranska',
                    GB: 'Yhdistynyt kuningaskunta',
                    IN: 'Intia',
                    MA: 'Marokko',
                    NL: 'Hollanti',
                    PK: 'Pakistan',
                    RO: 'Romania',
                    RU: 'Venäjä',
                    SK: 'Slovakia',
                    TH: 'Thaimaa',
                    US: 'USA',
                    VE: 'Venezuela'
                }
            },
            regexp: {
                'default': 'Ole hyvä anna kaavan mukainen arvo'
            },
            remote: {
                'default': 'Ole hyvä anna kelvollinen arvo'
            },
            rtn: {
                'default': 'Ole hyvä anna kelvollinen RTN numero'
            },
            sedol: {
                'default': 'Ole hyvä anna kelvollinen SEDOL numero'
            },
            siren: {
                'default': 'Ole hyvä anna kelvollinen SIREN numero'
            },
            siret: {
                'default': 'Ole hyvä anna kelvollinen SIRET numero'
            },
            step: {
                'default': 'Ole hyvä anna kelvollinen arvo %s porrastettuna'
            },
            stringCase: {
                'default': 'Ole hyvä anna pelkästään pieniä kirjaimia',
                upper: 'Ole hyvä anna pelkästään isoja kirjaimia'
            },
            stringLength: {
                'default': 'Ole hyvä anna kelvollisen mittainen merkkijono',
                less: 'Ole hyvä anna vähemmän kuin %s merkkiä',
                more: 'Ole hyvä anna vähintään %s merkkiä',
                between: 'Ole hyvä anna arvo joka on vähintään %s ja enintään %s merkkiä pitkä'
            },
            uri: {
                'default': 'Ole hyvä anna kelvollinen URI'
            },
            uuid: {
                'default': 'Ole hyvä anna kelvollinen UUID numero',
                version: 'Ole hyvä anna kelvollinen UUID versio %s numero'
            },
            vat: {
                'default': 'Ole hyvä anna kelvollinen VAT numero',
                country: 'Ole hyvä anna kelvollinen VAT numero maahan: %s',
                countries: {
                    AT: 'Itävalta',
                    BE: 'Belgia',
                    BG: 'Bulgaria',
                    BR: 'Brasilia',
                    CH: 'Sveitsi',
                    CY: 'Kypros',
                    CZ: 'Tsekin tasavalta',
                    DE: 'Saksa',
                    DK: 'Tanska',
                    EE: 'Viro',
                    ES: 'Espanja',
                    FI: 'Suomi',
                    FR: 'Ranska',
                    GB: 'Yhdistyneet kuningaskunnat',
                    GR: 'Kreikka',
                    EL: 'Kreikka',
                    HU: 'Unkari',
                    HR: 'Kroatia',
                    IE: 'Irlanti',
                    IS: 'Islanti',
                    IT: 'Italia',
                    LT: 'Liettua',
                    LU: 'Luxemburg',
                    LV: 'Latvia',
                    MT: 'Malta',
                    NL: 'Hollanti',
                    NO: 'Norja',
                    PL: 'Puola',
                    PT: 'Portugali',
                    RO: 'Romania',
                    RU: 'Venäjä',
                    RS: 'Serbia',
                    SE: 'Ruotsi',
                    SI: 'Slovenia',
                    SK: 'Slovakia',
                    VE: 'Venezuela',
                    ZA: 'Etelä Afrikka'
                }
            },
            vin: {
                'default': 'Ole hyvä anna kelvollinen VIN numero'
            },
            zipCode: {
                'default': 'Ole hyvä anna kelvollinen postinumero',
                country: 'Ole hyvä anna kelvollinen postinumero maassa: %s',
                countries: {
                    AT: 'Itävalta',
                    BG: 'Bulgaria',
                    BR: 'Brasilia',
                    CA: 'Kanada',
                    CH: 'Sveitsi',
                    CZ: 'Tsekin tasavalta',
                    DE: 'Saksa',
                    DK: 'Tanska',
                    ES: 'Espanja',
                    FR: 'Ranska',
                    GB: 'Yhdistyneet kuningaskunnat',
                    IE: 'Irlanti',
                    IN: 'Intia',
                    IT: 'Italia',
                    MA: 'Marokko',
                    NL: 'Hollanti',
                    PL: 'Puola',
                    PT: 'Portugali',
                    RO: 'Romania',
                    RU: 'Venäjä',
                    SE: 'Ruotsi',
                    SG: 'Singapore',
                    SK: 'Slovakia',
                    US: 'USA'
                }
            }
        }
    });
}(jQuery));
