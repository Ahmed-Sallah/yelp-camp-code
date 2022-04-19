import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { Review } from "./reviews.model";

@Injectable({providedIn: 'root'})

export class ReviewsService {
  private reviews: Review[] = []
  private reviewsUpdated = new Subject<Review[]>()


  constructor(private http: HttpClient) {}

  getReviewsUpdateListener() {
    return this.reviewsUpdated.asObservable()
  }

  getReviews(campId: string) {
    this.http.get<{reviews: Review[]}>("http://localhost:3000/campgrounds/" + campId + "/reviews")
      .subscribe((result) => {
        this.reviews = result.reviews
        this.reviewsUpdated.next([...this.reviews])
      })
  }

  addReview(campId: string, reviewBody, reviewRating) {
    const review = {reviewBody, reviewRating}
    this.http.post<{message: string, review: Review}>("http://localhost:3000/campgrounds/" + campId + "/review", review)
      .subscribe(result => {
        this.reviews.push(result.review)
        this.reviewsUpdated.next([...this.reviews])
      })
  }

  deleteReview(reviewId: string, campId: string) {
    this.http.delete<{message: string}>("http://localhost:3000/campgrounds/" + campId + "/reviews/" + reviewId)
      .subscribe(result => {
        const updatedReviews = this.reviews.filter(review => review._id !== reviewId)
        this.reviews = updatedReviews
        this.reviewsUpdated.next([...this.reviews])
      })
  }
}
