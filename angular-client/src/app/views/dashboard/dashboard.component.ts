import { Component, OnInit } from '@angular/core';
import { IHogLog } from '../../models/IHogLog';
import { config } from '../../app.config'
import 'rxjs/add/operator/take';
import { map } from 'rxjs/operators';
import * as Highcharts from 'highcharts';
import { MphPipe } from '../../../pipes/mph.pipe';
import { MilesPipe } from '../../../pipes/miles.pipe';
import { Http } from '@angular/http';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  API = 'http://192.168.1.210:3000';

  latest: IHogLog
  fastest: IHogLog
  pastTwelveHours: Array<IHogLog>

  Highcharts = Highcharts;
  updateTemperatureChartFlag = false
  updateHumidityChartFlag = false
  updateDistanceChartFlag = false
  temperatureChartOptions = {
    series: [{
      name: 'Temperature',
      data: []
    }],
    chart:{
      backgroundColor: 'transparent',
      style:{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }
    },
    colors: ['#E8840A'],
    title:{
      text: 'Temperature, Past 12 Hours',
      style:{
        
        color: '#FFF'
      }
    },
    yAxis:{
      title:{
        text:''
      },
      labels:{
        style:{
          color: '#FFF'
        }
      }
    },
    xAxis: {
      type: 'datetime',
      labels:{
        style:{
          color: '#FFF'
        }
      }
    },
    time:{
      useUTC: false
    },
    tooltip:{
      valueDecimals: 2,
      valueSuffix: ' °F'
    },
    legend:{
      itemStyle:{
        color: '#FFF'
      }
    }


  };
  humidityChartOptions = {
    series: [{
      name: 'Humidity',
      data: []
    }],
    colors: ['#0AE8E7'],
    chart:{
      backgroundColor: 'transparent',
      style:{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        color: '#fff'
      }
    },
    title:{
      text: 'Humidity, Past 12 Hours',
      style:{
        color: '#FFF'
      }
    },
    xAxis: {
      type: 'datetime',
      labels:{
        style:{
          color: '#FFF'
        }
      }
    },
    yAxis:{
      title:{
        text:''
      },
      labels:{
        style:{
          color: '#FFF'
        }
      }
    },
    time:{
      useUTC: false
    },
    tooltip:{
      valueDecimals: 2,
      valueSuffix: '%'
    },
    legend:{
      itemStyle:{
        color: '#FFF'
      }
    }
  };
  distanceChartOptions = {
    series: [{
      name: 'Speed',
      data: [],
      tooltip:{
        valueDecimals: 2,
        valueSuffix: ' mph'  
        }
    },{
      name: 'Distance',
      data: [],
      tooltip:{
        valueDecimals: 2,
        valueSuffix: ' miles'  
        }
      },
      
    ],
    colors: ['#AEFF18', '#FFF'],
    chart:{
      backgroundColor: 'transparent',
      style:{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        color: '#fff'
      }
    },
    title:{
      text: 'Speed and Distance, Past 12 Hours',
      style:{
        color: '#FFF'
      }
    },
    xAxis: {
      type: 'datetime',
      labels:{
        style:{
          color: '#FFF'
        }
      }
    },
    yAxis:{
      title:{
        text:''
      },
      labels:{
        style:{
          color: '#FFF'
        }
      }
    },
    time:{
      useUTC: false
    },
    
    legend:{
      itemStyle:{
        color: '#FFF'
      }
    }
  };

  ngOnInit(): void {
   
  }

  getFastest(){
    this.http.get(`${this.API}/hoglogs/fastest`).pipe(
      map(res => res.json())
    )
    .subscribe(fastest => {
      this.fastest = fastest
    })
  }

  getLatest(){
    this.http.get(`${this.API}/hoglogs/latest`).pipe(
      map(res => res.json())
    )
    .subscribe(latest => {
      this.latest = latest
    })
  }

  getPastTwelveHours(){
    this.http.get(`${this.API}/hoglogs/timestamp/${Date.now() - 43200000 }`).pipe(
      map(res => res.json())
    )
    .subscribe(log => {
      this.pastTwelveHours = log
      this.temperatureChartOptions.series[0].data = log.map(l => [l.timestamp, l.temperature_f]);
      this.updateTemperatureChartFlag = true;
      this.humidityChartOptions.series[0].data = log.map(l => [l.timestamp, l.humidity]);
      this.updateHumidityChartFlag = true;
      this.distanceChartOptions.series[0].data = log.map(l => [l.timestamp, this.mph.transform(l.ticks)]);
      this.distanceChartOptions.series[1].data = log.map(l => [l.timestamp, this.mph.transform(l.ticks)]);
      var sum = 0;
      this.distanceChartOptions.series[1].data.forEach((point)=>{
        sum += point[1]
        point[1] =  this.miles.transform(sum);
      })
      this.updateDistanceChartFlag = true;
    });
  }

  constructor( private mph: MphPipe, private miles: MilesPipe, private http: Http){
   this.getFastest()  
   this.getLatest()  
   this.getPastTwelveHours()  
  }

}
