export class ProductForm {
  articleNumber: string;
  productName: string;
  color?: string | null;
  dimensions?: string | null;
  series?: string | null;
  category?: string | null;

  constructor(data?: Partial<ProductForm>) {
    this.articleNumber = data?.articleNumber || '';
    this.productName = data?.productName || '';
    this.color = data?.color ?? null;
    this.dimensions = data?.dimensions ?? null;
    this.series = data?.series ?? null;
    this.category = data?.category ?? null;
  }
}