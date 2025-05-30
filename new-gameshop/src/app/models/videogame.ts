import { Genres } from "./genres";

export class Videogame{
  idVideogame : number;
  titleVideogame : string;
  genres : Genres[];
  priceVideogame : number;
  descVideogame : string;
  rating : number;
  releaseDateVideogame : Date;
  platforms : string;
  coverImage: string;
  backgroundImage: string;
  sales: number;
  discount: number;
  discountedPrice:number;
  screenshots: string[];

  constructor(
    idVideogame:number,
    titleVideogame: string,
    genres:Genres[],
    priceVideogame:number,
    descVideogame:string,
    rating:number,
    releaseDate:Date,
    platforms : string,
    backgroundImage: string,
    sales: number,
    discount:number,
    discountedPrice:number,
    coverImage:string,
    screenshots:string[]
  ){
    this.idVideogame = idVideogame;
    this.titleVideogame = titleVideogame;
    this.genres = genres;
    this.priceVideogame = priceVideogame;
    this.descVideogame = descVideogame;
    this.rating = rating;
    this.releaseDateVideogame = releaseDate;
    this.platforms = platforms;
    this.backgroundImage = backgroundImage;
    this.sales = sales;
    this.discount = discount;
    this.discountedPrice = discountedPrice;
    this.coverImage = coverImage;
    this.screenshots = screenshots;
  }


}
