import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PhpData } from '../php-data';
import { Observable, Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbData } from '../breadcrumb/breadcrumb.component';
import * as bootstrap from 'bootstrap';
import { DataTableDirective } from 'angular-datatables';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';




interface Post {
  postID: number,
  date: string,
  message: string,
  utilisateur: string
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})



export class PostsComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  posts : Post[];

  dtTrigger: Subject<any> = new Subject();

  breadcrumb : BreadcrumbData[];

  new_post : string = "";
  
  error : string = "";

  public Editor = ClassicEditor;
  
  constructor( private http : HttpClient , private route : ActivatedRoute) { }

  getPosts() : Observable<PhpData> {

    let data ={
      'topicId' : this.route.snapshot.paramMap.get('id')
    }

    return this.http.post<PhpData>( 'http://127.0.0.1:3000/getPosts', data, { withCredentials: true } );
  }

  ngOnInit(): void {
    let x =this.getPosts(); 
      x.subscribe({
        next : value => {
          this.posts = value.data.slice(3);
          this.dtTrigger.next();
          this.breadcrumb = [            
            {nom : "Tous les cours", route : '/cours'},
            {nom : value.data[0]['nom'], route : '/topics/'+ value.data[2]},
            {nom : value.data[1]['nom'], route : ''}
          ];
        }
      });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  sendNewPost() : void {
    if(this.new_post.length>0){

      this.error = "";

      let data = {
        'topicId' : this.route.snapshot.paramMap.get('id'),
        'newPost' : this.new_post
      };
  
      let p = this.http.post<PhpData>( 'http://127.0.0.1:3000/saveNewPost', data, { withCredentials: true } );
  
      console.log(this.new_post);
      p.subscribe({
        next : value => {
           this.posts.push({
            postID: value.data['insertId'],
            message: this.new_post,
            utilisateur: "Vous",
            date: "A l'instant"
           });

           $('#newPostModal').modal('hide');


           this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
             dtInstance.destroy();
             this.dtTrigger.next();
            });
          },
         complete : () => { this.new_post = ""; } 
      });
    }
    else{
      this.error = "Champ vide";
    }
  }

}
