YUI.add('gallery-yql-finance', function(Y) {

    var YQLFinance = function () {
    };

    YQLFinance.prototype = {

        makeArray: function (symbols, columns, rows) {
            var i, j, k, count, nSymbols, nCols, prices = {};

            count = rows.length;
            nSymbols = symbols.length;
            nCols = columns.length;

            for (i = 0; i < count; i += nSymbols) {
                for (j = 0; j < nSymbols; j += 1) {
                    prices[symbols[j]] = prices[symbols[j]] || {};
                    for (k = 0; k < nCols; k += 1) {
                        prices[symbols[j]][columns[k]] =
                            prices[symbols[j]][columns[k]] || [];
                        prices[symbols[j]][columns[k]]
                            .push(rows[i + j][columns[k]]);
                    }
                }
            }

            return prices;
        },

        getQuotes: function (symbols, callback, params) {
            var sql = 'select {COLUMNS} from yahoo.finance.quotes ' +
                    'where symbol in ({SYMBOLS})',
                defaultColumns = ["Change"],
                query,
                symbolList = "",
                i,
                n;

            params = params || {};
            params.columns = params.columns || defaultColumns;

            n = symbols.length;
            for (i = 0; i < n; i += 1) {
                symbolList += '"' + symbols[i] + '"';
                if (i !== (n - 1)) {
                    symbolList += ',';
                }
            }
            query = Y.substitute(sql, {
                COLUMNS: params.columns.join(),
                SYMBOLS: symbolList
            });

            Y.YQL(query, function (data) {
                var prices = null;

                if (!data.hasOwnProperty("error") &&
                        data.query.hasOwnProperty("results") &&
                        data.query.results) {
                    prices = Y.YQL.Finance.makeArray(symbols,
                            params.columns, data.query.results.quote);
                }
                callback(prices);
            });
        },

        getHistoricalQuotes: function (symbols, callback, params) {
            var histUrl = '"http://ichart.finance.yahoo.com/table.csv?' +
                    's={SYMBOL}' +
                    '&g={FREQUENCY}' + '"',
                sql = 'select {COLUMNS} from csv where url in ' +
                    '({HIST_URLS})' +
                    ' and columns="Date,Open,High,Low,Close,Volume,AdjClose"' +
                    ' and Date >= "{START_DATE}" and Date <= "{END_DATE}"' +
                    ' | sort(field="{SORT_COLS}", descending="{SORT_DESC}")',
                defaultColumns = ["Date", "Open", "High", "Low", "Close",
                    "Volume", "AdjClose"],
                defaultMaxAge = 3600, // 1 hour
                query,
                jsonpConfig,
                histUrls = "",
                i,
                n,
                now,
                ddNow,
                mmNow,
                yyNow,
                startDate,
                endDate;

            now = new Date();
            ddNow = now.getDate();
            mmNow = now.getMonth();
            yyNow = now.getFullYear();
            startDate = yyNow + "-" + (mmNow + 1) + "-" + "01";
            endDate = yyNow + "-" + (mmNow + 1) + "-" + ddNow;

            params = params || {};
            params.columns = params.columns || defaultColumns;
            params.frequency = params.frequency || "d";
            params.startDate = params.startDate || startDate;
            params.endDate = params.endDate || endDate;
            params.sortCols = params.sortCols || "Date";
            params.sortDesc = params.sortDesc || "false";
            params.maxAge = params.maxAge || defaultMaxAge;

            n = symbols.length;
            for (i = 0; i < n; i += 1) {
                histUrls += Y.substitute(histUrl, {
                    SYMBOL: encodeURIComponent(symbols[i]),
                    FREQUENCY: params.frequency
                });
                if (i !== (n - 1)) {
                    histUrls += ',';
                }
            }
            query = Y.substitute(sql, {
                HIST_URLS: histUrls,
                COLUMNS: params.columns.join(),
                START_DATE: params.startDate,
                END_DATE: params.endDate,
                SORT_COLS: params.sortCols,
                SORT_DESC: params.sortDesc
            });


            jsonpConfig = {
                allowCache: true,
                on: {
                    success: function (data) {
                        var prices = null;

                        if (!data.hasOwnProperty("error") &&
                                data.query.hasOwnProperty("results") &&
                                data.query.results) {
                            prices = Y.YQL.Finance.makeArray(symbols,
                                    params.columns, data.query.results.row);
                        }
                        callback(prices);
                    }
                }
            };

            Y.YQL(query, jsonpConfig, { "_maxage": params.maxAge });
        }
    };

    Y.YQL.Finance = new YQLFinance();


}, 'gallery-2011.06.01-20-18' ,{requires:['substitute','yql']});
