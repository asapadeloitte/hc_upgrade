import { Component, OnInit, Input, OnDestroy, ɵConsole } from '@angular/core';
import { ReloadEvent } from 'src/app/shared/events/reloadEvent';






class Segment {
  public chartLabel: string;

  constructor(public label: string, public value: number, public percentage: number) {
    this.chartLabel = value.toString();
  }
}

@Component({
  selector: 'app-hiring-status',
  templateUrl: './hiring-status.component.html',
  styleUrls: ['./hiring-status.component.scss']
})
export class HiringStatusComponent implements OnInit, OnDestroy {
  @Input() year;
  @Input() hiringStatus;
  public options: any;
  public data: Segment[] = [];
  public response;
  private colorList: string[] = ['#004C8A', '#D14200', '#6E6E6E'];
  constructor(private reloadEvent: ReloadEvent) {
    this.reloadEvent.listen().subscribe(response => {
      if (response) {
        this.hiringStatus = response.hiringStatus;
        this.loadHiringData();
        }
    });
  }
  ngOnInit() {
    this.loadHiringData();
  }
   loadHiringData() {
    this.data = [];
    this.response = this.hiringStatus;
    this.getPieChartData();
  }
  getPieChartData() {
    const total = Number(this.response.actualPositionsOnboard) + Number(this.response.pendingHiresInQueue)
      + Number(this.response.remainingVacancies);
    this.data.push(new Segment('Current Positions Onboard', this.response.actualPositionsOnboard,
      (Number((this.response.actualPositionsOnboard / total) * 100))));
    this.data.push(new Segment('Pending Hires In Queue', this.response.pendingHiresInQueue,
      (Number((this.response.pendingHiresInQueue / total) * 100))));
    this.data.push(new Segment('Remaining Vacancies', this.response.remainingVacancies,
      (Number((this.response.remainingVacancies / total) * 100))));

    this.options = {
      autoSize: false,
      width: 350,
      height: 350,
      padding: {
        top: 30,
        bottom: 60
      },
      data: this.data,
      series: [
        {
          type: 'pie',
          labelKey: 'chartLabel',
          angleKey: 'value',
          innerRadiusOffset: -40,
          callout: {
            strokeWidth: 1,
            length: 10
          },
          fills: this.colorList,
          strokes: this.colorList,
          minAngle: 0,
          label: {
            enabled: true,
            minAngle: 0,
            offset: 10,
            fontWeight: 'bold',
            fontSize: 13
          },
          tooltip: {
            renderer: (params) => {
              return params.datum.label +
                ' <br>' +  '<div style="text-align:center"> ' + params.datum.value;
             }
          },
          highlightStyle: {
            fill: undefined, // default: 'yellow'
          },
        },
      ],
      legend: {
        enabled: true,
        position: 'bottom',
        item: {
          paddingX: 100,
          paddingY: 4,
          label: {
            onClick: null,
            fontWeight: 'bold',
            formatter: (params) => {
             return this.data[params.itemId].label + ' (' + this.data[params.itemId].value + ')';
           }
          },
        },
        // onClick: (e) => {
        //   e.stopPropagation();
        // }
       }
    };
    }
ngOnDestroy() {
  }
}



