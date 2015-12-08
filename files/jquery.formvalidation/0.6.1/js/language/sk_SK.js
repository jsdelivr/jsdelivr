(function($) {
    /**
     * Slovak language package
     * Translated by @budik21. Improved by @PatrikGallik
     */
    FormValidation.I18n = $.extend(true, FormValidation.I18n, {
        'sk_SK': {
            base64: {
                'default': 'Prosím zadajte správny base64'
            },
            between: {
                'default': 'Prosím zadajte hodnotu medzi %s a %s',
                notInclusive: 'Prosím zadajte hodnotu medzi %s a %s (vrátane týchto čísel)'
            },
            bic: {
                'default': 'Prosím zadajte správne BIC číslo'
            },
            callback: {
                'default': 'Prosím zadajte správnu hodnotu'
            },
            choice: {
                'default': 'Prosím vyberte správnu hodnotu',
                less: 'Hodnota musí byť minimálne %s',
                more: 'Hodnota nesmie byť viac ako %s',
                between: 'Prosím vyberte medzi %s a %s'
            },
            color: {
                'default': 'Prosím zadajte správnu farbu'
            },
            creditCard: {
                'default': 'Prosím zadajte správne číslo kreditnej karty'
            },
            cusip: {
                'default': 'Prosím zadajte správne CUSIP číslo'
            },
            cvv: {
                'default': 'Prosím zadajte správne CVV číslo'
            },
            date: {
                'default': 'Prosím zadajte správny dátum',
                min: 'Prosím zadajte dátum pred %s',
                max: 'Prosím zadajte dátum po %s',
                range: 'Prosím zadajte dátum v rozmedzí %s až %s'
            },
            different: {
                'default': 'Prosím zadajte inú hodnotu'
            },
            digits: {
                'default': 'Toto pole môže obsahovať len čísla'
            },
            ean: {
                'default': 'Prosím zadajte správne EAN číslo'
            },
            ein: {
                'default': 'Prosím zadajte správne EIN číslo'
            },
            emailAddress: {
                'default': 'Prosím zadajte správnu emailovú adresu'
            },
            file: {
                'default': 'Prosím vyberte súbor'
            },
            greaterThan: {
                'default': 'Prosím zadajte hodnotu väčšiu alebo rovnú %s',
                notInclusive: 'Prosím zadajte hodnotu väčšiu ako %s'
            },
            grid: {
                'default': 'Prosím zadajte správné GRId číslo'
            },
            hex: {
                'default': 'Prosím zadajte správne hexadecimálne číslo'
            },
            iban: {
                'default': 'Prosím zadajte správne IBAN číslo',
                country: 'Prosím zadajte správne IBAN číslo pre %s',
                countries: {
                    AD: 'Andorru',
                    AE: 'Spojené arabské emiráty',
                    AL: 'Albánsko',
                    AO: 'Angolu',
                    AT: 'Rakúsko',
                    AZ: 'Ázerbajdžán',
                    BA: 'Bosnu a Herzegovinu',
                    BE: 'Belgicko',
                    BF: 'Burkina Faso',
                    BG: 'Bulharsko',
                    BH: 'Bahrajn',
                    BI: 'Burundi',
                    BJ: 'Benin',
                    BR: 'Brazíliu',
                    CH: 'Švajčiarsko',
                    CI: 'Pobrežie Slonoviny',
                    CM: 'Kamerun',
                    CR: 'Kostariku',
                    CV: 'Cape Verde',
                    CY: 'Cyprus',
                    CZ: 'Českú Republiku',
                    DE: 'Nemecko',
                    DK: 'Dánsko',
                    DO: 'Dominikánsku republiku',
                    DZ: 'Alžírsko',
                    EE: 'Estónsko',
                    ES: 'Španielsko',
                    FI: 'Fínsko',
                    FO: 'Faerské ostrovy',
                    FR: 'Francúzsko',
                    GB: 'Veľkú Britániu',
                    GE: 'Gruzínsko',
                    GI: 'Gibraltár',
                    GL: 'Grónsko',
                    GR: 'Grécko',
                    GT: 'Guatemalu',
                    HR: 'Chorvátsko',
                    HU: 'Maďarsko',
                    IE: 'Írsko',
                    IL: 'Izrael',
                    IR: 'Irán',
                    IS: 'Island',
                    IT: 'Taliansko',
                    JO: 'Jordánsko',
                    KW: 'Kuwait',
                    KZ: 'Kazachstan',
                    LB: 'Libanon',
                    LI: 'Lichtenštajnsko',
                    LT: 'Litvu',
                    LU: 'Luxemburgsko',
                    LV: 'Lotyšsko',
                    MC: 'Monako',
                    MD: 'Moldavsko',
                    ME: 'Čiernu horu',
                    MG: 'Madagaskar',
                    MK: 'Macedónsko',
                    ML: 'Mali',
                    MR: 'Mauritániu',
                    MT: 'Maltu',
                    MU: 'Mauritius',
                    MZ: 'Mosambik',
                    NL: 'Holandsko',
                    NO: 'Nórsko',
                    PK: 'Pakistan',
                    PL: 'Poľsko',
                    PS: 'Palestínu',
                    PT: 'Portugalsko',
                    QA: 'Katar',
                    RO: 'Rumunsko',
                    RS: 'Srbsko',
                    SA: 'Saudskú Arábiu',
                    SE: 'Švédsko',
                    SI: 'Slovinsko',
                    SK: 'Slovensko',
                    SM: 'San Marino',
                    SN: 'Senegal',
                    TN: 'Tunisko',
                    TR: 'Turecko',
                    VG: 'Britské Panenské ostrovy'
                }
            },
            id: {
                'default': 'Prosím zadajte správne rodné číslo',
                country: 'Prosím zadajte správne rodné číslo pre %s',
                countries: {
                    BA: 'Bosnu a Hercegovinu',
                    BG: 'Bulharsko',
                    BR: 'Brazíliu',
                    CH: 'Švajčiarsko',
                    CL: 'Chile',
                    CN: 'Čínu',
                    CZ: 'Českú Republiku',
                    DK: 'Dánsko',
                    EE: 'Estónsko',
                    ES: 'Španielsko',
                    FI: 'Fínsko',
                    HR: 'Chorvátsko',
                    IE: 'Írsko',
                    IS: 'Island',
                    LT: 'Litvu',
                    LV: 'Lotyšsko',
                    ME: 'Čiernu horu',
                    MK: 'Macedónsko',
                    NL: 'Holandsko',
                    PL: 'Poľsko',
                    RO: 'Rumunsko',
                    RS: 'Srbsko',
                    SE: 'Švédsko',
                    SI: 'Slovinsko',
                    SK: 'Slovensko',
                    SM: 'San Marino',
                    TH: 'Thajsko',
                    ZA: 'Južnú Afriku'
                }
            },
            identical: {
                'default': 'Prosím zadajte rovnakú hodnotu'
            },
            imei: {
                'default': 'Prosím zadajte správne IMEI číslo'
            },
            imo: {
                'default': 'Prosím zadajte správne IMO číslo'
            },
            integer: {
                'default': 'Prosím zadajte celé číslo'
            },
            ip: {
                'default': 'Prosím zadajte správnu IP adresu',
                ipv4: 'Prosím zadajte správnu IPv4 adresu',
                ipv6: 'Prosím zadajte správnu IPv6 adresu'
            },
            isbn: {
                'default': 'Prosím zadajte správne ISBN číslo'
            },
            isin: {
                'default': 'Prosím zadajte správne ISIN číslo'
            },
            ismn: {
                'default': 'Prosím zadajte správne ISMN číslo'
            },
            issn: {
                'default': 'Prosím zadajte správne ISSN číslo'
            },
            lessThan: {
                'default': 'Prosím zadajte hodnotu menšiu alebo rovnú %s',
                notInclusive: 'Prosím zadajte hodnotu menšiu ako %s'
            },
            mac: {
                'default': 'Prosím zadajte správnu MAC adresu'
            },
            meid: {
                'default': 'Prosím zadajte správne MEID číslo'
            },
            notEmpty: {
                'default': 'Toto pole nesmie byť prázdne'
            },
            numeric: {
                'default': 'Prosím zadajte číselnú hodnotu'
            },
            phone: {
                'default': 'Prosím zadajte správne telefónne číslo',
                country: 'Prosím zadajte správne telefónne číslo pre %s',
                countries: {
                    AE: 'Spojené arabské emiráty',
                    BG: 'Bulharsko',
                    BR: 'Brazíliu',
                    CN: 'Čínu',
                    CZ: 'Českú Republiku',
                    DE: 'Nemecko',
                    DK: 'Dánsko',
                    ES: 'Španielsko',
                    FR: 'Francúzsko',
                    GB: 'Veľkú Britániu',
                    IN: 'Indiu',
                    MA: 'Maroko',
                    NL: 'Holandsko',
                    PK: 'Pakistan',
                    RO: 'Rumunsko',
                    RU: 'Rusko',
                    SK: 'Slovensko',
                    TH: 'Thajsko',
                    US: 'Spojené Štáty Americké',
                    VE: 'Venezuelu'
                }
            },
            regexp: {
                'default': 'Prosím zadajte hodnotu spĺňajúcu zadanie'
            },
            remote: {
                'default': 'Prosím zadajte správnu hodnotu'
            },
            rtn: {
                'default': 'Prosím zadajte správne RTN číslo'
            },
            sedol: {
                'default': 'Prosím zadajte správne SEDOL číslo'
            },
            siren: {
                'default': 'Prosím zadajte správne SIREN číslo'
            },
            siret: {
                'default': 'Prosím zadajte správne SIRET číslo'
            },
            step: {
                'default': 'Prosím zadajte správny krok %s'
            },
            stringCase: {
                'default': 'Len malé písmená sú povolené v tomto poli',
                upper: 'Len veľké písmená sú povolené v tomto poli'
            },
            stringLength: {
                'default': 'Toto pole nesmie byť prázdne',
                less: 'Prosím zadajte hodnotu kratšiu ako %s znakov',
                more: 'Prosím zadajte hodnotu dlhú %s znakov a viacej',
                between: 'Prosím zadajte hodnotu medzi %s a %s znakov'
            },
            uri: {
                'default': 'Prosím zadajte správnu URI'
            },
            uuid: {
                'default': 'Prosím zadajte správne UUID číslo',
                version: 'Prosím zadajte správne UUID vo verzii %s'
            },
            vat: {
                'default': 'Prosím zadajte správne VAT číslo',
                country: 'Prosím zadajte správne VAT číslo pre %s',
                countries: {
                    AT: 'Rakúsko',
                    BE: 'Belgicko',
                    BG: 'Bulharsko',
                    BR: 'Brazíliu',
                    CH: 'Švajčiarsko',
                    CY: 'Cyprus',
                    CZ: 'Českú Republiku',
                    DE: 'Nemecko',
                    DK: 'Dánsko',
                    EE: 'Estónsko',
                    ES: 'Španielsko',
                    FI: 'Fínsko',
                    FR: 'Francúzsko',
                    GB: 'Veľkú Britániu',
                    GR: 'Grécko',
                    EL: 'Grécko',
                    HU: 'Maďarsko',
                    HR: 'Chorvátsko',
                    IE: 'Írsko',
                    IS: 'Island',
                    IT: 'Taliansko',
                    LT: 'Litvu',
                    LU: 'Luxemburgsko',
                    LV: 'Lotyšsko',
                    MT: 'Maltu',
                    NL: 'Holandsko',
                    NO: 'Norsko',
                    PL: 'Poľsko',
                    PT: 'Portugalsko',
                    RO: 'Rumunsko',
                    RU: 'Rusko',
                    RS: 'Srbsko',
                    SE: 'Švédsko',
                    SI: 'Slovinsko',
                    SK: 'Slovensko',
                    VE: 'Venezuelu',
                    ZA: 'Južnú Afriku'
                }
            },
            vin: {
                'default': 'Prosím zadajte správne VIN číslo'
            },
            zipCode: {
                'default': 'Prosím zadajte správne PSČ',
                country: 'Prosím zadajte správne PSČ pre %s',
                countries: {
                    AT: 'Rakúsko',
                    BG: 'Bulharsko',
                    BR: 'Brazíliu',
                    CA: 'Kanadu',
                    CH: 'Švajčiarsko',
                    CZ: 'Českú Republiku',
                    DE: 'Nemecko',
                    DK: 'Dánsko',
                    ES: 'Španielsko',
                    FR: 'Francúzsko',
                    GB: 'Veľkú Britániu',
                    IE: 'Írsko',
                    IN: 'Indiu',
                    IT: 'Taliansko',
                    MA: 'Maroko',
                    NL: 'Holandsko',
                    PL: 'Poľsko',
                    PT: 'Portugalsko',
                    RO: 'Rumunsko',
                    RU: 'Rusko',
                    SE: 'Švédsko',
                    SG: 'Singapur',
                    SK: 'Slovensko',
                    US: 'Spojené Štáty Americké'
                }
            }
        }
    });
}(jQuery));
