export interface ProductResponse {
  id: string;
  key: string;
  name: string;
  sku: string;
  price: {
    currencyCode: string;
    centAmount: number;
  };
  image: string;
}
