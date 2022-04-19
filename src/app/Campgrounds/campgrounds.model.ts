import { Review } from "../Reviews/reviews.model";
import { Creator } from "./creator.model";

export interface Campground {
  _id: string
  title: string
  location: string
  price: number
  description: string
  image: string,
  creator: Creator
  reviews: Review[]
}
