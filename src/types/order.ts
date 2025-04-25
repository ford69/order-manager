export interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  productCode: string;
  size: string;
  fitType: string;
  color: string;
  price: number;
}

export type FormErrors = {
  [key in keyof Order]?: string;
};

export interface OrderFilters {
  orderId: string;
  startDate: string;
  endDate: string;
}