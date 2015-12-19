

Cascade.drawchart(
    "#flot-demo",
    1.6,
    [[ ["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9] ]],
    {
        series: {
            bars: {
                show: true,
                barWidth: 0.5,
                align: "center"
            }
        },
        xaxis: {
            mode: "categories",
            font: {
                size: 12
            }
        },
        yaxis: {
            font: {
                size: 12
            }
        }
    });