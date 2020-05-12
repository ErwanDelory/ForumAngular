import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PhpData } from '../php-data';
import { Observable, Subject } from 'rxjs';
import { BreadcrumbData } from '../breadcrumb/breadcrumb.component';



interface Cours {
  coursID: number,
  nom: string,
  nbSujets: number,
  nbPosts: number,
  last: object
}




@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.css']
})

export class CoursComponent implements OnInit, OnDestroy {

  courses : Cours[];

  dtTrigger: Subject<any> = new Subject();

  breadcrumb : BreadcrumbData[];

  constructor( private http : HttpClient ) { }

  getCourses() : Observable<PhpData> {
    return this.http.post<PhpData>( 'http://127.0.0.1:3000/getCourses', null, { withCredentials: true } );
  }

  ngOnInit(): void {
    let x =this.getCourses(); 
      x.subscribe({
        next : value => {
          this.courses = value.data;
          this.breadcrumb = [            
            {nom : "Cours auxquels vous avez accès", route : ''}
          ];
          this.dtTrigger.next();
        }
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  

}
