import { Component } from '@angular/core';
import { RecordService } from '../../record.service';
import { Record } from '../../models/IRecord';
import { Observable } from 'rxjs';
import {config} from '../../app.config'


@Component({
  templateUrl: 'records.component.html'
})
export class RecordsComponent {

  topTenLongestNights : Observable<Record[]>
  topTenFastestIntervals : Observable<Record[]>
 constructor(){
   //this.topTenLongestNights = db.collection<Record>(config.records_endpoint, ref => ref.where('TotalTicks', '>', 0).orderBy('TotalTicks', 'desc').limit(10)).valueChanges();
   //this.topTenFastestIntervals = db.collection<Record>(config.records_endpoint, ref => ref.where('MaxTicks', '>', 0).orderBy('MaxTicks', 'desc').limit(10)).valueChanges();
 }

}
