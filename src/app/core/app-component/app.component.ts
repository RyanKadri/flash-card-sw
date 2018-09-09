import { Component, OnInit } from '@angular/core';
import { map as rxMap } from 'rxjs/operators';
import { PersistenceService } from '../services/persistence-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor( ) { }
  
  ngOnInit() { }
}
