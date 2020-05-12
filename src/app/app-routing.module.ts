import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoursComponent } from './cours/cours.component';
import { TopicsComponent } from './topics/topics.component';
import { PostsComponent } from './posts/posts.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  
  { path: 'login', component: LoginComponent },
  { path: '',
  canActivateChild : [ AuthGuard ],
  children: [
    { path: 'cours', component: CoursComponent },
    { path: 'topics/:id', component: TopicsComponent },
    { path: 'posts/:id', component: PostsComponent },
  ]
},
{ path: '**', component: CoursComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
