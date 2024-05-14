function setStatus(status, idElement){
  const element = document.getElementById(idElement);
  const icon = element.children[0];
  const text = element.children[1];
  if (status){
    icon.className = 'icono-luz prendido';
    text.textContent = 'ACTIVO';
  } else{
    icon.className = 'icono-luz ';
    text.textContent = 'INACTIVO';
  }
}

function updateHealthStatus() {
  fetch('http://localhost:1987/health')
    .then(response => {
      setStatus(true, 'api-status')
      return response.json();
    })
    .then(sensor => {
      setStatus(sensor.status, 'sensor-status')
    })
    .catch(_ => {
      setStatus(false, 'api-status')
      setStatus(false, 'sensor-status')
    });  
}

function updateLastInfo(){
  fetch('http://localhost:1987/lastinfo')
  .then(response => {return response.json()})
  .then(data => {
    document.getElementById('last-temperature-value').textContent = data.temperatura + '°C';
    document.getElementById('last-pressure-value').textContent = data.presion + ' hPa';
    document.getElementById('last-altitude-value').textContent = data.altura + ' m';
  })
}

function updateGlobal(){
  updateHealthStatus();
  updateGraph();
  updateLastInfo()
}

setInterval(updateGlobal, 1000);

function updateGraph(){
  const limit_data = 5;
  fetch(`http://localhost:1987/datos?limit=${limit_data}`)
  .then(response => {return response.json()})
  .then(data => {
    updateGraphWithData(data)
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

var chartPreassure = anychart.area();
var chartTemperature = anychart.line();

function updateGraphWithData(data){
  console.log(data)
  // chart.data(getData())
  chartPreassure.data(data.grafica1)
  chartTemperature.data(data.grafica2)
}

function getToday(){
  return new Date().toLocaleDateString("es-ES", {
      timeZone: 'America/Bogota',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
  });
} 

function makeGraphTemperature(){
  // Contendra los datos de temperatura
          // create data set on our data
      // create data set on our data
      var dataSet = anychart.data.set([]);

      // map data for the first series, take x from the zero column and value from the first column of data set
      var firstSeriesData = dataSet.mapAs({ x: 0, value: 1 });

      var secondSeriesData = dataSet.mapAs({ x: 0, value: 2 });

      // create line chart
      chartTemperature = anychart.line();

      // turn on chart animation
      chartTemperature.animation(true);

      // Desactivar ejes x
      chartTemperature.xAxis(0).labels(false);

      // set chart title text settings
      chartTemperature.title(
        'Valores extras del día ' + getToday() 
      );

      // create first series with mapped data
      var firstSeries = chartTemperature.line(firstSeriesData).color('#FA5421');
      firstSeries.name('Temperatura');
      firstSeries.markers().zIndex(100);
      firstSeries.tooltip().enabled(true).format('Temperatura: {%Value}°C');
      firstSeries.hovered().markers().enabled(true).type('circle').size(4);

      // create second series with mapped data
      var secondSeries = chartTemperature.line(secondSeriesData).color('#B197FC').enabled(false);
      secondSeries.name('Altura');
      secondSeries.markers().zIndex(100);
      secondSeries.tooltip().enabled(true).format('Altura: {%Value}m');
      secondSeries.hovered().markers().enabled(true).type('circle').size(4);

      // turn the legend on
      chartTemperature.legend().enabled(true).fontSize(13).padding([0, 0, 0, 0]);

      // set container id for the chart
      chartTemperature.container('container');
      // initiate chart drawing
      chartTemperature.draw();
}

function makeGraphPreassure(){

  // create data set on our data
  // var dataSet = anychart.data.set(getData());
  var dataSet = anychart.data.set([]);

  // create area chart
  chartPreassure = anychart.area();

  // turn on chart animation
  chartPreassure.animation(true);

  // set chart title text settings
  chartPreassure.title(
    "Valores de presión del día " + getToday() 
  );

  // set Y axis title
  chartPreassure.yAxis(0).title('Valores');

  // create additional xAxis to place category labels on top
  chartPreassure.xAxis(0).labels(false);

  // create additional xAxis to place category labels on top
  chartPreassure.yAxis(1).orientation('right').labels(false);

  // helper function to setup label settings for all series
  var setupSeries = function (series, name, format) {
    series.name(name);
    series.markers().zIndex(100);
    // establecer un label
    series.tooltip().enabled(true).format(`${name}: {%Value} ${format}.`);
    series
      .hovered()
      .markers()
      .enabled(true)
      .type('circle')
      .size(4)
      .stroke('1.5 #fff');
  };

  // temp variable to store series instance

  function createSeries(...args){
    // args es un {} con {nombre: str, formato: str}
    let i = 1;
    args.forEach((arg) => {
      const series = chartPreassure.area(dataSet.mapAs({ x: 0, value: i })).color('#74C0FC');
      setupSeries(series, arg.nombre, arg.formato);
      i++;
    })
  }

  createSeries(
    {nombre: 'Presión atmosferica', formato: 'hPa'},
  )

  // turn on legend
  chartPreassure.legend().enabled(true).fontSize(13).padding([0, 0, 0, 0]);

  // set container id for the chart
  chartPreassure.container('container2');

  // initiate chart drawing
  chartPreassure.draw();
}

anychart.onDocumentReady(function () {
  makeGraphTemperature()
  makeGraphPreassure()

  //remove all class with anychart-credits-text
  document.querySelectorAll('.anychart-credits').forEach((element) => {
    element.remove();
  });

});

function getData() {
  return [
    ['14:01:02', 322, 242, 142],
    ['14:02:02', 324, 254, 154],
    ['14:03:02', 329, 226, 126],
    ['14:04:02', 342, 232, 132],
    ['14:05:02', 348, 268, 168],
    ['14:06:02', 334, 254, 154],
    ['14:07:02', 325, 235, 135],
    ['14:08:02', 316, 266, 166],
    ['14:09:02', 318, 288, 188],
    ['14:10:02', 330, 220, 120],
    ['14:11:02', 355, 215, 115],
    ['14:12:02', 366, 236, 136],
    ['14:13:02', 337, 247, 147],
    ['14:14:02', 352, 172, 240],
    ['14:15:02', 377, 37, 73],
    ['14:16:02', 383, 23, 33],
    ['14:17:02', 344, 34, 43],
    ['14:18:02', 366, 46, 63],
    ['14:19:02', 389, 59, 93],
    ['14:20:02', 334, 44, 43]
  ];
}