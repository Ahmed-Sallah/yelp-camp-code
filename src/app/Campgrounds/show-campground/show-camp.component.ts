import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Review } from "src/app/Reviews/reviews.model";
import { ReviewsService } from "src/app/Reviews/reviews.service";
import { CampgroundService } from "../camp-service.service";
import { Campground } from "../campgrounds.model";

@Component({
  selector: 'app-show-camp',
  templateUrl: './show-camp.component.html',
  styleUrls: ['./show-camp.component.css']
})
export class ShowCampgroundComponent implements OnInit, OnDestroy {
  id: string
  campground: Campground
  reviews: Review[]
  userISAuthenticated = false
  isLoading = false
  userId: string
  private reviewsSub: Subscription
  private paramsSub: Subscription
  private campgroundsSub: Subscription
  private authStatusSub: Subscription

  constructor(public campService: CampgroundService, private route: ActivatedRoute, public reviewService: ReviewsService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true
    this.userId = this.authService.getUserId()
    this.paramsSub = this.route.params.subscribe((params: Params) => {
      this.id = params.id
    })

    this.userISAuthenticated = this.authService.getIsAuth()

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userISAuthenticated = isAuthenticated
      this.userId = this.authService.getUserId()
    })

    this.campgroundsSub = this.campService.getCampground(this.id)
      .subscribe((campgroundData) => {
        this.campground = campgroundData.campground
      }, (error) => {
        this.router.navigate(['/campgrounds'])
      })

    this.reviewService.getReviews(this.id)
    this.reviewsSub = this.reviewService.getReviewsUpdateListener()
      .subscribe((reviews: Review[]) => {
        this.reviews = reviews
      })
    this.isLoading = false
  }

  onSubmitReviewForm(form: NgForm) {
    if(!this.authService.getIsAuth()) {
      this.router.navigate(['/login'])
    }
    this.reviewService.addReview(this.id, form.value.body, form.value.rating)
    form.resetForm()
  }

  onDeleteCampground() {
    this.campService.deleteCampground(this.id)
  }

  onDeleteReview(reviewId: string) {
    this.reviewService.deleteReview(reviewId, this.id)
  }

  ngOnDestroy() {
    this.reviewsSub.unsubscribe()
    this.campgroundsSub.unsubscribe()
    this.paramsSub.unsubscribe()
    this.authStatusSub.unsubscribe()
  }

}
