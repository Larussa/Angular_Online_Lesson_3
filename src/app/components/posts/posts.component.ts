import {Component, OnInit, ViewChild} from '@angular/core';
import { PostsService } from "../../services/posts.service";
import { Post } from "../../models/Post";
import { CommentsService } from "../../services/comments.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  addPost: Post = {
    userId: 1,
    title: '',
    body: '',
  };

  posts: Post[];
  isAdmin = true;
  @ViewChild('form') form: NgForm;

  constructor(
    public commentService: CommentsService,
    public postService: PostsService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.addPost = new Post();

    this.spinner.show();

    this.postService.getPosts().subscribe((request: Post[]) => {
        this.posts = request;
        this.spinner.hide();
      },
      error => console.error(error.message)
    );
  }

  public getPostComments(post: Post) {
    if (post.comments) {
      post.comments = null;
    } else {
      this.spinner.show();
      this.commentService.getComments(post.id).subscribe((request: Comment[]) => {
        post.comments = request;
        this.spinner.hide();

      }, error => {
        this.toastr.error(error.message, error);
      });
    }
  }

  onSubmitPost(form) {
    if (form.invalid) return;
    const addNewPost: Post = {
      userId: this.addPost.userId,
      title: this.addPost.title,
      body: this.addPost.body
    };
  this.postService.addPost(addNewPost).subscribe((request: Post) => {
    addNewPost.id = request.id;
    this.posts.unshift(addNewPost);
    this.form.resetForm();
    this.toastr.success('New post add success','message');
  }, error => {
    this.toastr.error(error.message, error);
  });
  }

  public onDelete(post: Post) {

    this.spinner.show();

    this.postService.deletePost(post.id).subscribe((data: Object) => {
      this.posts = this.posts.filter(filteredPost => filteredPost.id != post.id);
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
        this.toastr.success('post deleted success','message');
      }, error => {
      this.toastr.error(error.message, error);
    });
  }
}


