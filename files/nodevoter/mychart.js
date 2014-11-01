var socket = io();
				//oldalbetolteskor is el kell kuldeni az uzeneteket
				socket.emit('message', 'hello server kerem szepen a szavazas eredmenyet');
				socket.emit('message2', 'hello server kerem szepen az utolso 3 szavazas eredmenyet');

				socket.on('votes', function (msg) {
					var res = msg.split(",");
					console.log(res[0] + '-' + res[1] + '-' + res[2]);
					$('#mychart').highcharts().series[0].data[0].update(parseInt(res[0]));
					$('#mychart').highcharts().series[0].data[1].update(parseInt(res[1]));
					$('#mychart').highcharts().series[0].data[2].update(parseInt(res[2]));
					
				});
				
				//azert kell ez a resz hogy egybol a szavazas lezarasa utan amirol a szerver szol a voteclosed uzenettel elmenjen a keres az eredmenyekert
				socket.on('voteclosed', function (msg) {
					//console.log(msg);
					socket.emit('message2','kerem az eredmenyeket');
				});
				
				
				//a korabban elkuldott keresre a valasz az allresults uzenetben megerkezett azt mar csak fel kell dolgozni es megjeleniteni
				socket.on('allresults', function (msg) {
					var res1 = msg[0]['results'].split(",");
					var res2 = msg[1]['results'].split(",");
					var res3 = msg[2]['results'].split(",");
					
					$('#o11').html(res1[0]);
					$('#o21').html(res1[1]);
					$('#o31').html(res1[2]);
					$('#r1').html(res1[3]);
					
					$('#o12').html(res2[0]);
					$('#o22').html(res2[1]);
					$('#o32').html(res2[2]);
					$('#r2').html(res2[3]);

					$('#o13').html(res3[0]);
					$('#o23').html(res3[1]);
					$('#o33').html(res3[2]);
					$('#r3').html(res3[3]);
					
				//	console.log('Utolso 3 szavazas eredmenye: '+msg[0]['vote_id']+' - '+msg[0]['results']);
				//	console.log('Utolso 3 szavazas eredmenye: '+msg[1]['vote_id']+' - '+msg[1]['results']);
				//	console.log('Utolso 3 szavazas eredmenye: '+msg[2]['vote_id']+' - '+msg[2]['results']);
				});
				

				$('#mychart').highcharts({
					chart : {
						type : 'column'
					},

					title : {
						text : 'Daniel\'s chart'
					},
					subtitle : {
						text : 'Vote results'
					},
					xAxis : {
						categories : [
							'Option 1',
							'Option 2',
							'Option 3'
						]
					},
					yAxis : {
						min : 0,
						title : {
							text : '# of votes'
						}
					},
					tooltip : {
						headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y}</b></td></tr>',
						footerFormat : '</table>',
						shared : true,
						useHTML : true
					},
					plotOptions : {
						column : {
							pointPadding : 0.1,
							borderWidth : 0
						}
					},
					series : [{
							name : '# of votes',
							data : [0, 0, 0]

						}
					]
				});
