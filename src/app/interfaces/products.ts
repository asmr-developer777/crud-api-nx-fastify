interface IParams {
  id: string;
}

interface ProductData {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export { IParams, ProductData };
