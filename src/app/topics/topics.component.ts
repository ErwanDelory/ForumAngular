import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PhpData } from '../php-data';
import { Observable, Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbData } from '../breadcrumb/breadcrumb.component';
import * as bootstrap from 'bootstrap';
import { DataTableDirective } from 'angular-datatables';



interface Topic {
  sujetID: number,
  nom: string,
  nbPosts: number,
  last: object
}





@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})



export class TopicsComponent implements OnInit, OnDestroy {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  topics : Topic[];

  dtTrigger: Subject<any> = new Subject();

  breadcrumb : BreadcrumbData[];

  new_topic : string = "";

  error : string = "";

  constructor( private http : HttpClient , private route : ActivatedRoute) { }

  getTopics() : Observable<PhpData> {

    let data = {
      'coursId' : this.route.snapshot.paramMap.get('id')
    };

    return this.http.post<PhpData>( 'http://127.0.0.1:3000/getTopics', data, { withCredentials: true } );
  }

  ngOnInit(): void {
    let x =this.getTopics(); 
      x.subscribe({
        next : value => {
          
          this.topics = value.data.slice(1);
          this.dtTrigger.next();
          this.breadcrumb = [            
            {nom : "Tous les cours", route : '/cours'},
            {nom : value.data[0]['nom'], route : ''}
          ];
        }
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }




  sendNewTopic() : void {
    if(this.new_topic.length>0){

      let data = {
        'courseId' : this.route.snapshot.paramMap.get('id'),
        'newTopic' : this.new_topic
      };
  
      let p = this.http.post<PhpData>('http://127.0.0.1:3000/saveNewTopic', data, { withCredentials: true } );
  
      p.subscribe({
        next : value => {
          if(value.status != 'ok') this.error = value.data;
          else{
           this.error = "";

           this.topics.push({
            sujetID: value.data['insertId'],
            nom: this.new_topic,
            nbPosts: 0,
            last: null
           });

           $('#newTopic').modal('hide');


           this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
             dtInstance.destroy();
             this.dtTrigger.next();
            });
          }
            
        }
      });

    }
    else{
      this.error = "Champ vide";
    }


  }

}