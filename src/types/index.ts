export type ProductCategory = 
  | 'bieres'
  | 'vins'
  | 'spiritueux'
  | 'cocktails'
  | 'softs'
  | 'snacks'
  | 'divers';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice?: number;
  stock: number;
  minStockAlert: number;
  volume?: string;
  color?: string;
  barcode?: string;
  isPopular?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export type PaymentMethod = 'especes' | 'momo' | 'carte' | 'credit';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  amountPaid: number;
  changeGiven: number;
  customerName?: string;
  customerPhone?: string;
  status: 'paye' | 'rembourse' | 'annule';
  sessionId: string;
}

export interface CashSession {
  id: string;
  openedAt: string;
  closedAt?: string;
  openedBy: string;
  initialCash: number;
  cashSales: number;
  momoSales: number;
  cardSales: number;
  creditSales: number;
  totalSales: number;
  ordersCount: number;
  expectedCash: number;
  actualCash?: number;
  discrepancy?: number;
  closingNote?: string;
  status: 'ouverte' | 'fermee';
}

export interface StoreSettings {
  barName: string;
  subTitle: string;
  address: string;
  phone: string;
  currency: string;
  taxRate: number;
  receiptHeader: string;
  receiptFooter: string;
  autoPrintReceipt: boolean;
  pinHash?: string;
}
