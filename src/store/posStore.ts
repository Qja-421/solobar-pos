import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Order, CashSession, StoreSettings, PaymentMethod, ProductCategory } from '../types';
import { escapeHtml, formatMoney } from '../utils/security';

interface SoloBarState {
  // Données
  products: Product[];
  selectedCategory: ProductCategory | 'tous';
  searchQuery: string;
  cart: CartItem[];
  cartDiscount: number;
  customerName: string;
  customerPhone: string;
  currentSession: CashSession | null;
  sessionsHistory: CashSession[];
  orders: Order[];
  settings: StoreSettings;

  // Actions Interface & Filtres
  setSelectedCategory: (cat: ProductCategory | 'tous') => void;
  setSearchQuery: (query: string) => void;
  setCustomerInfo: (name: string, phone: string) => void;
  setCartDiscount: (amount: number) => void;

  // Actions Panier (One-Touch Fast Checkout)
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Encaissement & Validation
  checkout: (paymentMethod: PaymentMethod, amountPaid: number) => { success: boolean; order?: Order; error?: string };

  // Sessions de Caisse (Fond de caisse, Z de caisse)
  openSession: (initialCash: number, openedBy: string) => void;
  closeSession: (actualCash: number, note?: string) => CashSession | null;

  // Gestion des Produits & Stock
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, delta: number) => void;

  // Historique & Commandes
  refundOrder: (orderId: string) => void;

  // Paramètres
  updateSettings: (updates: Partial<StoreSettings>) => void;

  // Impression de ticket thermique assainie (anti-XSS)
  printReceipt: (order: Order) => void;
}

const DEFAULT_PRODUCTS: Product[] = [
  // Bières
  { id: 'b1', name: 'Castel Beer 65cl', category: 'bieres', price: 1000, costPrice: 700, stock: 48, minStockAlert: 12, volume: '65cl', isPopular: true },
  { id: 'b2', name: 'Beaufort Lager 50cl', category: 'bieres', price: 1200, costPrice: 850, stock: 36, minStockAlert: 12, volume: '50cl', isPopular: true },
  { id: 'b3', name: 'Heineken 33cl', category: 'bieres', price: 1500, costPrice: 1000, stock: 30, minStockAlert: 10, volume: '33cl', isPopular: true },
  { id: 'b4', name: 'Guinness Foreign Extra 33cl', category: 'bieres', price: 1500, costPrice: 1100, stock: 24, minStockAlert: 8, volume: '33cl', isPopular: true },
  { id: 'b5', name: 'Mutzig 65cl', category: 'bieres', price: 1000, costPrice: 750, stock: 40, minStockAlert: 12, volume: '65cl' },
  { id: 'b6', name: '1664 Blanc 33cl', category: 'bieres', price: 1800, costPrice: 1200, stock: 18, minStockAlert: 6, volume: '33cl' },

  // Vins
  { id: 'v1', name: 'Bordeaux Rouge Baron 75cl', category: 'vins', price: 6500, costPrice: 4200, stock: 12, minStockAlert: 4, volume: '75cl', isPopular: true },
  { id: 'v2', name: 'Verre de Vin Rouge', category: 'vins', price: 1500, costPrice: 800, stock: 50, minStockAlert: 10, volume: '15cl' },
  { id: 'v3', name: 'Vin Blanc Moelleux 75cl', category: 'vins', price: 7000, costPrice: 4500, stock: 10, minStockAlert: 3, volume: '75cl' },
  { id: 'v4', name: 'Rosé Piscine 75cl', category: 'vins', price: 8000, costPrice: 5000, stock: 8, minStockAlert: 3, volume: '75cl' },

  // Spiritueux
  { id: 's1', name: 'Whisky William Lawson (Dose)', category: 'spiritueux', price: 2000, costPrice: 900, stock: 45, minStockAlert: 10, volume: '5cl', isPopular: true },
  { id: 's2', name: 'Bouteille William Lawson 70cl', category: 'spiritueux', price: 18000, costPrice: 12000, stock: 6, minStockAlert: 2, volume: '70cl' },
  { id: 's3', name: 'Vodka Absolut (Dose)', category: 'spiritueux', price: 2500, costPrice: 1100, stock: 35, minStockAlert: 10, volume: '5cl' },
  { id: 's4', name: 'Rhum Blanc Saint-James (Dose)', category: 'spiritueux', price: 2000, costPrice: 900, stock: 30, minStockAlert: 8, volume: '5cl' },
  { id: 's5', name: 'Pastis 51 (Dose)', category: 'spiritueux', price: 1500, costPrice: 700, stock: 40, minStockAlert: 10, volume: '4cl' },

  // Cocktails
  { id: 'c1', name: 'Mojito Spécial Barman', category: 'cocktails', price: 3500, costPrice: 1500, stock: 50, minStockAlert: 10, isPopular: true },
  { id: 'c2', name: 'Caïpirinha Brésilienne', category: 'cocktails', price: 3500, costPrice: 1500, stock: 40, minStockAlert: 10 },
  { id: 'c3', name: 'Sex on the Beach', category: 'cocktails', price: 4000, costPrice: 1800, stock: 30, minStockAlert: 8 },

  // Softs
  { id: 'so1', name: 'Coca-Cola 33cl', category: 'softs', price: 800, costPrice: 500, stock: 60, minStockAlert: 15, volume: '33cl', isPopular: true },
  { id: 'so2', name: 'Fanta Orange 33cl', category: 'softs', price: 800, costPrice: 500, stock: 40, minStockAlert: 12, volume: '33cl' },
  { id: 'so3', name: 'Sprite 33cl', category: 'softs', price: 800, costPrice: 500, stock: 35, minStockAlert: 12, volume: '33cl' },
  { id: 'so4', name: 'Eau Minérale 1.5L', category: 'softs', price: 700, costPrice: 350, stock: 50, minStockAlert: 15, volume: '1.5L', isPopular: true },
  { id: 'so5', name: 'Boisson Energisante Red Bull', category: 'softs', price: 2000, costPrice: 1300, stock: 25, minStockAlert: 8, volume: '25cl' },

  // Snacks
  { id: 'sn1', name: 'Brochette de Bœuf Épicée', category: 'snacks', price: 1000, costPrice: 500, stock: 30, minStockAlert: 5, isPopular: true },
  { id: 'sn2', name: 'Portion Arachides Grillées', category: 'snacks', price: 500, costPrice: 200, stock: 50, minStockAlert: 10 },
  { id: 'sn3', name: 'Chips Artisanales', category: 'snacks', price: 700, costPrice: 350, stock: 25, minStockAlert: 5 }
];

const DEFAULT_SETTINGS: StoreSettings = {
  barName: 'LE REPAIRE DU BARMAN',
  subTitle: 'Bar • Cave • Lounge Express',
  address: 'Centre-Ville, Avenue Principale',
  phone: '+242 06 000 00 00',
  currency: 'FCFA',
  taxRate: 0,
  receiptHeader: 'Bienvenue chez nous ! Bonne dégustation.',
  receiptFooter: 'Merci pour votre fidélité ! À très bientôt.',
  autoPrintReceipt: true
};

export const useSoloBarStore = create<SoloBarState>()(
  persist(
    (set, get) => ({
      products: DEFAULT_PRODUCTS,
      selectedCategory: 'tous',
      searchQuery: '',
      cart: [],
      cartDiscount: 0,
      customerName: '',
      customerPhone: '',
      currentSession: {
        id: 'sess-' + Date.now(),
        openedAt: new Date().toISOString(),
        openedBy: 'Barman / Caissière',
        initialCash: 15000,
        cashSales: 0,
        momoSales: 0,
        cardSales: 0,
        creditSales: 0,
        totalSales: 0,
        ordersCount: 0,
        expectedCash: 15000,
        status: 'ouverte'
      },
      sessionsHistory: [],
      orders: [],
      settings: DEFAULT_SETTINGS,

      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setCustomerInfo: (name, phone) => set({ customerName: name, customerPhone: phone }),
      setCartDiscount: (amount) => set({ cartDiscount: Math.max(0, amount) }),

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((i) => i.productId === product.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === product.id
                  ? {
                      ...i,
                      quantity: i.quantity + quantity,
                      total: (i.quantity + quantity) * i.unitPrice - i.discount
                    }
                  : i
              )
            };
          }
          return {
            cart: [
              ...state.cart,
              {
                productId: product.id,
                product,
                quantity,
                unitPrice: product.price,
                discount: 0,
                total: product.price * quantity
              }
            ]
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((i) => i.productId !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((i) => i.productId !== productId) };
          }
          return {
            cart: state.cart.map((i) =>
              i.productId === productId
                ? {
                    ...i,
                    quantity,
                    total: quantity * i.unitPrice - i.discount
                  }
                : i
            )
          };
        });
      },

      clearCart: () => {
        set({ cart: [], cartDiscount: 0, customerName: '', customerPhone: '' });
      },

      checkout: (paymentMethod, amountPaid) => {
        const state = get();
        if (state.cart.length === 0) {
          return { success: false, error: 'Le panier est vide' };
        }

        const subtotal = state.cart.reduce((acc, item) => acc + item.total, 0);
        const finalTotal = Math.max(0, subtotal - state.cartDiscount);

        if (paymentMethod === 'especes' && amountPaid < finalTotal) {
          return { success: false, error: 'Montant en espèces insuffisant' };
        }

        const changeGiven = paymentMethod === 'especes' ? Math.max(0, amountPaid - finalTotal) : 0;
        const effectivePaid = paymentMethod === 'credit' ? 0 : finalTotal;

        const newOrder: Order = {
          id: 'ord-' + Date.now(),
          orderNumber: '#' + (state.orders.length + 1).toString().padStart(4, '0'),
          date: new Date().toISOString(),
          items: [...state.cart],
          subtotal,
          discount: state.cartDiscount,
          total: finalTotal,
          paymentMethod,
          amountPaid: effectivePaid,
          changeGiven,
          customerName: state.customerName.trim() || undefined,
          customerPhone: state.customerPhone.trim() || undefined,
          status: 'paye',
          sessionId: state.currentSession?.id || 'default'
        };

        // 1. Décrémentation automatique du stock
        const updatedProducts = state.products.map((p) => {
          const cartItem = state.cart.find((ci) => ci.productId === p.id);
          if (cartItem) {
            return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
          }
          return p;
        });

        // 2. Mise à jour de la session de caisse active
        let updatedSession = state.currentSession;
        if (updatedSession) {
          const cashIncrement = paymentMethod === 'especes' ? finalTotal : 0;
          const momoIncrement = paymentMethod === 'momo' ? finalTotal : 0;
          const cardIncrement = paymentMethod === 'carte' ? finalTotal : 0;
          const creditIncrement = paymentMethod === 'credit' ? finalTotal : 0;

          updatedSession = {
            ...updatedSession,
            cashSales: updatedSession.cashSales + cashIncrement,
            momoSales: updatedSession.momoSales + momoIncrement,
            cardSales: updatedSession.cardSales + cardIncrement,
            creditSales: updatedSession.creditSales + creditIncrement,
            totalSales: updatedSession.totalSales + finalTotal,
            ordersCount: updatedSession.ordersCount + 1,
            expectedCash: updatedSession.expectedCash + cashIncrement
          };
        }

        set({
          products: updatedProducts,
          orders: [newOrder, ...state.orders],
          currentSession: updatedSession,
          cart: [],
          cartDiscount: 0,
          customerName: '',
          customerPhone: ''
        });

        // Impression automatique du ticket si activée
        if (state.settings.autoPrintReceipt) {
          get().printReceipt(newOrder);
        }

        return { success: true, order: newOrder };
      },

      openSession: (initialCash, openedBy) => {
        const newSession: CashSession = {
          id: 'sess-' + Date.now(),
          openedAt: new Date().toISOString(),
          openedBy: openedBy || 'Barman / Caissière',
          initialCash: Math.max(0, initialCash),
          cashSales: 0,
          momoSales: 0,
          cardSales: 0,
          creditSales: 0,
          totalSales: 0,
          ordersCount: 0,
          expectedCash: Math.max(0, initialCash),
          status: 'ouverte'
        };
        set({ currentSession: newSession });
      },

      closeSession: (actualCash, note) => {
        const { currentSession, sessionsHistory } = get();
        if (!currentSession) return null;

        const discrepancy = actualCash - currentSession.expectedCash;
        const closedSession: CashSession = {
          ...currentSession,
          closedAt: new Date().toISOString(),
          actualCash,
          discrepancy,
          closingNote: note,
          status: 'fermee'
        };

        set({
          currentSession: null,
          sessionsHistory: [closedSession, ...sessionsHistory]
        });

        return closedSession;
      },

      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: 'prod-' + Date.now()
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p))
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          cart: state.cart.filter((i) => i.productId !== id)
        }));
      },

      adjustStock: (productId, delta) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p
          )
        }));
      },

      refundOrder: (orderId) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order || order.status !== 'paye') return;

        // Réintégration du stock
        const updatedProducts = state.products.map((p) => {
          const item = order.items.find((i) => i.productId === p.id);
          if (item) {
            return { ...p, stock: p.stock + item.quantity };
          }
          return p;
        });

        // Déduction de la session
        let updatedSession = state.currentSession;
        if (updatedSession && order.paymentMethod === 'especes') {
          updatedSession = {
            ...updatedSession,
            cashSales: Math.max(0, updatedSession.cashSales - order.total),
            totalSales: Math.max(0, updatedSession.totalSales - order.total),
            expectedCash: Math.max(0, updatedSession.expectedCash - order.total)
          };
        }

        set({
          products: updatedProducts,
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status: 'rembourse' } : o)),
          currentSession: updatedSession
        });
      },

      updateSettings: (updates) => {
        set((state) => ({ settings: { ...state.settings, ...updates } }));
      },

      // Impression sécurisée anti-XSS
      printReceipt: (order) => {
        const { settings } = get();
        const currency = settings.currency;

        const safeBarName = escapeHtml(settings.barName);
        const safeSubTitle = escapeHtml(settings.subTitle);
        const safeAddress = escapeHtml(settings.address);
        const safePhone = escapeHtml(settings.phone);
        const safeOrderNum = escapeHtml(order.orderNumber);
        const safeCustomer = escapeHtml(order.customerName || 'Client Comptoir');
        const safeDate = new Date(order.date).toLocaleString('fr-FR');
        const safeHeader = escapeHtml(settings.receiptHeader);
        const safeFooter = escapeHtml(settings.receiptFooter);

        const itemsRows = order.items
          .map(
            (i) => `
            <tr>
              <td style="padding:2px 0;">${escapeHtml(i.quantity)}x ${escapeHtml(i.product.name)}</td>
              <td style="text-align:right;padding:2px 0;">${escapeHtml(formatMoney(i.total, currency))}</td>
            </tr>
          `
          )
          .join('');

        const paymentLabel =
          order.paymentMethod === 'especes'
            ? 'Espèces'
            : order.paymentMethod === 'momo'
            ? 'Mobile Money (MTN/Airtel)'
            : order.paymentMethod === 'carte'
            ? 'Carte Bancaire'
            : 'Ardoise / Crédit Client';

        const printHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Ticket ${safeOrderNum}</title>
              <style>
                @page { size: 80mm auto; margin: 0; }
                body {
                  width: 74mm;
                  margin: 3mm auto;
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.3;
                  color: #000;
                  background: #fff;
                }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .bold { font-weight: bold; }
                .line { border-bottom: 1px dashed #000; margin: 4px 0; }
                .double-line { border-bottom: 2px solid #000; margin: 6px 0; }
                .title { font-size: 15px; font-weight: bold; text-transform: uppercase; }
                table { width: 100%; border-collapse: collapse; }
              </style>
            </head>
            <body>
              <div class="text-center">
                <div class="title">${safeBarName}</div>
                <div>${safeSubTitle}</div>
                <div>${safeAddress}</div>
                <div>Tél: ${safePhone}</div>
                ${safeHeader ? `<div style="margin-top:4px;font-style:italic;">${safeHeader}</div>` : ''}
              </div>

              <div class="double-line"></div>

              <div>
                <div><strong>Ticket:</strong> ${safeOrderNum}</div>
                <div><strong>Date:</strong> ${safeDate}</div>
                <div><strong>Client:</strong> ${safeCustomer}</div>
              </div>

              <div class="line"></div>

              <table>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>

              <div class="line"></div>

              ${
                order.discount > 0
                  ? `<div>Sous-total : <span style="float:right;">${escapeHtml(formatMoney(order.subtotal, currency))}</span></div>
                     <div>Remise : <span style="float:right;">-${escapeHtml(formatMoney(order.discount, currency))}</span></div>`
                  : ''
              }

              <div style="font-size:15px;font-weight:bold;margin:4px 0;">
                TOTAL: <span style="float:right;">${escapeHtml(formatMoney(order.total, currency))}</span>
              </div>

              <div class="line"></div>

              <div><strong>Mode:</strong> ${escapeHtml(paymentLabel)}</div>
              ${
                order.paymentMethod === 'especes'
                  ? `<div>Reçu : <span style="float:right;">${escapeHtml(formatMoney(order.amountPaid, currency))}</span></div>
                     <div>Monnaie rendue : <span style="float:right;font-weight:bold;">${escapeHtml(formatMoney(order.changeGiven, currency))}</span></div>`
                  : ''
              }

              <div class="double-line"></div>

              <div class="text-center" style="font-size:11px;margin-top:6px;">
                ${safeFooter}
                <div style="margin-top:4px;font-size:9px;color:#555;">Propulsé par SoloBar POS</div>
              </div>

              <script>
                window.focus();
                window.print();
                window.onafterprint = () => window.close();
              </script>
            </body>
          </html>
        `;

        const win = window.open('', '_blank', 'width=420,height=600');
        if (win) {
          win.document.open();
          win.document.write(printHtml);
          win.document.close();
        }
      }
    }),
    {
      name: 'solobar_storage_v1'
    }
  )
);
