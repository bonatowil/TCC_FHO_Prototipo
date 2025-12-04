
import { Injectable, computed, signal } from '@angular/core';

export interface Vehicle {
  id: string;
  model: string;
  brand: string;
  version: string;
  year: number;
  km: number;
  price: number;
  image: string;
  source: 'OLX' | 'WebMotors' | 'iCarros' | 'AutoLine' | 'Manual';
  url: string;
  location: string;
  dateFound: Date;
  fipePrice: number;
  marketAveragePrice: number;
  aiFairPrice: number; 
  projectedResalePrice: number;
  projectedProfit: number;
  profitMarginPercent: number;
  highlights: string[]; 
  issues: string[]; 
  negotiationStatus: 'Novo' | 'Salvo' | 'Em Contato' | 'Negociando' | 'Comprado' | 'Ignorado';
  notes?: string;
  daysInStock?: number;
  inventoryStatus?: 'Em Estoque' | 'Vendido';
  isFraudSuspect: boolean;
  patioId?: string;
}

export interface Patio {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  isActive: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Gerente' | 'Operador' | 'Visualizador';
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CompanySettings {
  targetProfitMargin: number;
  minimumProfitMargin: number;
  interestedBrands: string[];
  alertProfitMargin: number;
  alertEmailEnabled: boolean;
  alertNotificationEnabled: boolean;
  stagnantDaysThreshold: number;
  fraudSuspicionThreshold: number;
  kmDiscrepancyThreshold: number;
}

export interface Notification {
  id: string;
  type: 'high_margin' | 'fraud_alert' | 'stagnant_stock' | 'price_drop' | 'new_opportunity';
  title: string;
  message: string;
  vehicleId?: string;
  isRead: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentUser = signal<{name: string, email: string, role?: User['role']} | null>(null);
  
  private _companies: Company[] = [
    {
      id: '1',
      name: 'Revenda Premium',
      cnpj: '12.345.678/0001-90',
      email: 'contato@revendapremium.com.br',
      phone: '(11) 98765-4321',
      address: 'Av. Paulista, 1000',
      isActive: true,
      createdAt: new Date('2024-01-01')
    }
  ];
  
  private _patios: Patio[] = [
    {
      id: '1',
      name: 'Pátio Principal',
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      isActive: true,
      createdAt: new Date('2024-01-01')
    },
    {
      id: '2',
      name: 'Filial Zona Sul',
      address: 'Rua das Flores, 500',
      city: 'São Paulo',
      state: 'SP',
      isActive: true,
      createdAt: new Date('2024-01-15')
    }
  ];
  
  private _users: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@revendapremium.com.br',
      role: 'Admin',
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date()
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@revendapremium.com.br',
      role: 'Gerente',
      isActive: true,
      createdAt: new Date('2024-01-05')
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro@revendapremium.com.br',
      role: 'Operador',
      isActive: true,
      createdAt: new Date('2024-01-10')
    }
  ];
  
  private _settings: CompanySettings = {
    targetProfitMargin: 15,
    minimumProfitMargin: 12,
    interestedBrands: ['Volkswagen', 'Fiat', 'Toyota', 'Jeep', 'BMW', 'Hyundai', 'Chevrolet', 'Renault'],
    alertProfitMargin: 20,
    alertEmailEnabled: true,
    alertNotificationEnabled: true,
    stagnantDaysThreshold: 60,
    fraudSuspicionThreshold: 50,
    kmDiscrepancyThreshold: 5000
  };
  
  private _notifications: Notification[] = [
    {
      id: '1',
      type: 'high_margin',
      title: 'Oportunidade de Alto Lucro',
      message: 'BMW 320i encontrado com margem de 14.2%',
      vehicleId: '3',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      type: 'stagnant_stock',
      title: 'Alerta de Giro',
      message: 'Toyota Corolla está há 85 dias em estoque',
      vehicleId: '102',
      isRead: false,
      createdAt: new Date(Date.now() - 7200000)
    }
  ];
  
  companies = signal<Company[]>(this._companies);
  patios = signal<Patio[]>(this._patios);
  users = signal<User[]>(this._users);
  settings = signal<CompanySettings>(this._settings);
  notifications = signal<Notification[]>(this._notifications);

  private _rawVehicles: Vehicle[] = [
    {
      id: '1',
      brand: 'Volkswagen',
      model: 'Nivus',
      version: 'Highline 1.0 TSI',
      year: 2022,
      km: 32400,
      price: 108000,
      fipePrice: 118000,
      marketAveragePrice: 122000,
      aiFairPrice: 119500, 
      image: 'https://www.automaistv.com.br/wp-content/uploads/2024/07/vw_nivus_highline_3-1320x792.webp',
      source: 'WebMotors',
      url: 'https://www.webmotors.com.br/carros/estoque',
      location: 'SP',
      dateFound: new Date(),
      projectedResalePrice: 121500,
      projectedProfit: 13500,
      profitMarginPercent: 12.5,
      highlights: ['Único Dono', 'Todas Revisões CSS', 'Painel TFT'],
      issues: [],
      negotiationStatus: 'Novo',
      isFraudSuspect: false
    },
    {
      id: '2',
      brand: 'Jeep',
      model: 'Compass',
      version: 'Longitude T270',
      year: 2023,
      km: 15000,
      price: 145000,
      fipePrice: 158000,
      marketAveragePrice: 165000,
      aiFairPrice: 162000,
      image: 'https://stellantis3.dam-broadcast.com/medias/domain12808/media108143/2442959-wg4kc9o0aq-whr.jpg',
      source: 'OLX',
      url: 'https://www.webmotors.com.br/carros/estoque',
      location: 'PR',
      dateFound: new Date(),
      projectedResalePrice: 164000,
      projectedProfit: 19000,
      profitMarginPercent: 13.1,
      highlights: ['Garantia de Fábrica', 'Teto Solar', 'Pack Premium'], 
      issues: ['Pequeno arranhão para-choque'],
      negotiationStatus: 'Novo',
      isFraudSuspect: false
    },
    {
      id: '3',
      brand: 'BMW',
      model: '320i',
      version: 'M Sport',
      year: 2020,
      km: 55000,
      price: 210000,
      fipePrice: 235000,
      marketAveragePrice: 245000,
      aiFairPrice: 238000,
      image: 'https://cdn.motor1.com/images/mgl/4oVxq/s3/bmw-3er-2019-modell-m-sport.jpg',
      source: 'iCarros',
      url: 'https://www.icarros.com.br/principal/index.jsp',
      location: 'MG',
      dateFound: new Date(),
      projectedResalePrice: 240000,
      projectedProfit: 30000,
      profitMarginPercent: 14.2,
      highlights: ['Interno Cognac', 'Pneus Runflat Novos'],
      issues: [],
      negotiationStatus: 'Em Contato',
      notes: 'Cliente pediu para retornar segunda-feira.',
      isFraudSuspect: false
    },
    {
      id: '4',
      brand: 'Hyundai',
      model: 'HB20',
      version: 'Diamond 1.0 Turbo',
      year: 2021,
      km: 42000,
      price: 72000,
      fipePrice: 79000,
      marketAveragePrice: 81000,
      aiFairPrice: 79500,
      image: 'https://cdn.diariodolitoral.com.br/upload/dn_arquivo/2022/07/hyundai-hb20-platinum-pus.jpg',
      source: 'OLX',
      url: 'https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios',
      location: 'SP',
      dateFound: new Date(),
      projectedResalePrice: 80500,
      projectedProfit: 8500,
      profitMarginPercent: 11.8,
      highlights: ['Baixa KM', 'Sem Detalhes'],
      issues: [],
      negotiationStatus: 'Novo',
      isFraudSuspect: false
    },
    {
      id: '5',
      brand: 'Fiat',
      model: 'Toro',
      version: 'Volcano Diesel',
      year: 2019,
      km: 85000,
      price: 105000,
      fipePrice: 118000,
      marketAveragePrice: 120000,
      aiFairPrice: 115000,
      image: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Fiat_Toro_2018_in_Punta_del_Este_%28front%29_01.jpg',
      source: 'WebMotors',
      url: 'https://www.webmotors.com.br/carros/estoque',
      location: 'MG',
      dateFound: new Date(),
      projectedResalePrice: 118000,
      projectedProfit: 13000,
      profitMarginPercent: 12.3,
      highlights: ['4x4', 'Capota Marítima Nova'],
      issues: ['Pneus meia vida'],
      negotiationStatus: 'Salvo',
      notes: 'Verificar estado da turbina.',
      isFraudSuspect: false
    },
    {
      id: '99',
      brand: 'Honda',
      model: 'Civic',
      version: 'Touring',
      year: 2022,
      km: 5000,
      price: 60000,
      fipePrice: 145000,
      marketAveragePrice: 150000,
      aiFairPrice: 148000,
      image: 'https://jundiagora.com.br/wp-content/uploads/2018/09/CIVIC-TOURING.jpg',
      source: 'OLX',
      url: 'https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios',
      location: 'Unknown',
      dateFound: new Date(),
      projectedResalePrice: 0,
      projectedProfit: 0,
      profitMarginPercent: 0,
      highlights: [],
      issues: [], 
      negotiationStatus: 'Ignorado',
      isFraudSuspect: true 
    },
  ];

  private _inventory: Vehicle[] = [
    {
      id: '101',
      brand: 'Fiat',
      model: 'Pulse',
      version: 'Audace Turbo',
      year: 2023,
      km: 12000,
      price: 92000, 
      fipePrice: 102000,
      marketAveragePrice: 105000,
      aiFairPrice: 103000,
      image: 'https://portallubes.com.br/wp-content/uploads/2022/05/fiat-pulse-impetus.jpg',
      source: 'WebMotors',
      url: 'https://www.webmotors.com.br/carros/estoque',
      location: 'Pátio Principal',
      patioId: '1',
      dateFound: new Date('2024-02-15'),
      projectedResalePrice: 104000,
      projectedProfit: 12000,
      profitMarginPercent: 13,
      highlights: [],
      issues: [],
      negotiationStatus: 'Comprado',
      inventoryStatus: 'Em Estoque',
      daysInStock: 14,
      isFraudSuspect: false
    },
    {
      id: '102',
      brand: 'Toyota',
      model: 'Corolla',
      version: 'Altis Hybrid',
      year: 2020,
      km: 88000,
      price: 125000,
      fipePrice: 135000,
      marketAveragePrice: 140000,
      aiFairPrice: 136000,
      image: 'https://autoentusiastas.com.br/ae/wp-content/uploads/2020/03/DSCF1686.jpg',
      source: 'OLX',
      url: 'https://www.olx.com.br/autos-e-pecas/carros-vans-e-utilitarios',
      location: 'Pátio Principal',
      patioId: '1',
      dateFound: new Date('2023-11-20'),
      projectedResalePrice: 138000,
      projectedProfit: 13000,
      profitMarginPercent: 10.4,
      highlights: [],
      issues: [],
      negotiationStatus: 'Comprado',
      inventoryStatus: 'Em Estoque',
      daysInStock: 85, 
      isFraudSuspect: false
    },
    {
      id: '103',
      brand: 'Chevrolet',
      model: 'Onix',
      version: 'Premier 2',
      year: 2022,
      km: 25000,
      price: 82000,
      fipePrice: 88000,
      marketAveragePrice: 90000,
      aiFairPrice: 89000,
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgqiIVoUyGmtdtZD979zUgGUuos8-icHbAUzw4XTyWW1Ez7zJWCyluckF97sq3boCYp2H2mQwfDwilfPHsv7tYCiiYgSz_EG5SwdgxZ-iVFLzZiZ71HNfFZFWXB6HxOorHiu219tWDpRCA/s1600/Novo-Chevrolet-Onix-2017+%252810%2529.jpg',
      source: 'iCarros',
      url: 'https://www.icarros.com.br/principal/index.jsp',
      location: 'Filial Zona Sul',
      patioId: '2',
      dateFound: new Date('2024-01-10'),
      projectedResalePrice: 91000,
      projectedProfit: 9000,
      profitMarginPercent: 11.0,
      highlights: [],
      issues: [],
      negotiationStatus: 'Comprado',
      inventoryStatus: 'Em Estoque',
      daysInStock: 45,
      isFraudSuspect: false
    },
    {
      id: '104',
      brand: 'Jeep',
      model: 'Renegade',
      version: 'Trailhawk',
      year: 2021,
      km: 45000,
      price: 115000,
      fipePrice: 125000,
      marketAveragePrice: 128000,
      aiFairPrice: 126000,
      image: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2021/09/Jeep-Renegade.jpg?w=1200&h=900&crop=1',
      source: 'WebMotors',
      url: 'https://www.webmotors.com.br/carros/estoque',
      location: 'Pátio Principal',
      patioId: '1',
      dateFound: new Date('2023-12-05'),
      projectedResalePrice: 127000,
      projectedProfit: 12000,
      profitMarginPercent: 10.4,
      highlights: [],
      issues: [],
      negotiationStatus: 'Comprado',
      inventoryStatus: 'Em Estoque',
      daysInStock: 72, 
      isFraudSuspect: false
    }
  ];

  opportunities = signal<Vehicle[]>(this._rawVehicles.filter(v => !v.isFraudSuspect && v.inventoryStatus !== 'Em Estoque'));
  inventory = signal<Vehicle[]>(this._inventory);

  constructor() {}

  login(name: string, email: string) {
    const user = this._users.find(u => u.email === email);
    this.currentUser.set({ 
      name, 
      email, 
      role: user?.role || 'Visualizador' 
    });
    if (user) {
      user.lastLogin = new Date();
      this.users.set([...this._users]);
    }
  }
  
  addPatio(patio: Omit<Patio, 'id' | 'createdAt'>) {
    const newPatio: Patio = {
      ...patio,
      id: `PAT-${Date.now()}`,
      createdAt: new Date()
    };
    this._patios.push(newPatio);
    this.patios.set([...this._patios]);
    return newPatio;
  }
  
  updatePatio(id: string, updates: Partial<Patio>) {
    this._patios = this._patios.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    this.patios.set([...this._patios]);
  }
  
  deletePatio(id: string) {
    this._patios = this._patios.filter(p => p.id !== id);
    this.patios.set([...this._patios]);
  }
  
  addUser(user: Omit<User, 'id' | 'createdAt'>) {
    const newUser: User = {
      ...user,
      id: `USR-${Date.now()}`,
      createdAt: new Date()
    };
    this._users.push(newUser);
    this.users.set([...this._users]);
    return newUser;
  }
  
  updateUser(id: string, updates: Partial<User>) {
    this._users = this._users.map(u => 
      u.id === id ? { ...u, ...updates } : u
    );
    this.users.set([...this._users]);
  }
  
  deleteUser(id: string) {
    this._users = this._users.filter(u => u.id !== id);
    this.users.set([...this._users]);
  }
  
  updateSettings(updates: Partial<CompanySettings>) {
    this._settings = { ...this._settings, ...updates };
    this.settings.set(this._settings);
  }
  
  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) {
    const newNotif: Notification = {
      ...notification,
      id: `NOT-${Date.now()}`,
      isRead: false,
      createdAt: new Date()
    };
    this._notifications.unshift(newNotif);
    this.notifications.set([...this._notifications]);
    return newNotif;
  }
  
  markNotificationAsRead(id: string) {
    this._notifications = this._notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.notifications.set([...this._notifications]);
  }
  
  markAllNotificationsAsRead() {
    this._notifications = this._notifications.map(n => ({ ...n, isRead: true }));
    this.notifications.set([...this._notifications]);
  }
  
  getUnreadNotificationsCount() {
    return this._notifications.filter(n => !n.isRead).length;
  }
  
  hasPermission(permission: 'manage_users' | 'manage_patios' | 'manage_settings' | 'view_all'): boolean {
    const user = this.currentUser();
    if (!user || !user.role) return false;
    
    const permissions: Record<User['role'], string[]> = {
      'Admin': ['manage_users', 'manage_patios', 'manage_settings', 'view_all'],
      'Gerente': ['manage_patios', 'view_all'],
      'Operador': ['view_all'],
      'Visualizador': []
    };
    
    return permissions[user.role].includes(permission);
  }

  logout() {
    this.currentUser.set(null);
  }

  updateStatus(vehicleId: string, status: Vehicle['negotiationStatus']) {
    const opps = this.opportunities().map(v => 
      v.id === vehicleId ? { ...v, negotiationStatus: status } : v
    );
    this.opportunities.set(opps);
  }

  updateNotes(vehicleId: string, notes: string) {
    const opps = this.opportunities().map(v => 
      v.id === vehicleId ? { ...v, notes: notes } : v
    );
    this.opportunities.set(opps);
  }

  addToInventory(vehicle: Vehicle, patioId?: string) {
    const newInvItem = { 
      ...vehicle, 
      negotiationStatus: 'Comprado' as const, 
      inventoryStatus: 'Em Estoque' as const, 
      daysInStock: 0,
      patioId: patioId || this._patios[0]?.id
    };
    this._inventory = [newInvItem, ...this._inventory];
    this.inventory.set([...this._inventory]);

    const remainingOpps = this.opportunities().filter(v => v.id !== vehicle.id);
    this.opportunities.set(remainingOpps);
  }
  
  getInventoryByPatio(patioId: string) {
    return this.inventory().filter(v => v.patioId === patioId);
  }

  private carImages = [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop',
  ];

  getRandomCarImage(): string {
    return this.carImages[Math.floor(Math.random() * this.carImages.length)];
  }

  addManualInventoryItem(data: {brand: string, model: string, version: string, year: number, price: number, km: number, image?: string | null}) {
     const fipeMock = data.price * 1.15;
     const aiMock = data.price * 1.12;
     
     const newItem: Vehicle = {
       id: `MAN-${Date.now()}`,
       brand: data.brand,
       model: data.model,
       version: data.version,
       year: data.year,
       km: data.km,
       price: data.price,
       source: 'Manual',
       location: 'Estoque Local',
       image: data.image || this.getRandomCarImage(),
       url: '#',
       dateFound: new Date(),
       fipePrice: fipeMock,
       marketAveragePrice: fipeMock * 1.05,
       aiFairPrice: aiMock,
       projectedResalePrice: fipeMock * 1.02,
       projectedProfit: (fipeMock * 1.02) - data.price,
       profitMarginPercent: (((fipeMock * 1.02) - data.price) / data.price) * 100,
       highlights: ['Cadastrado Manualmente'],
       issues: [],
       negotiationStatus: 'Comprado',
       inventoryStatus: 'Em Estoque',
       daysInStock: 0,
       isFraudSuspect: false
     };

     this._inventory = [newItem, ...this._inventory];
     this.inventory.set([...this._inventory]);
  }

  getMarketTrends(modelName: string) {
    const basePrice = 100000 + (modelName.length * 5000);
    const volatility = 0.05;
    
    return Array.from({length: 6}, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i))
      const noise = Math.sin(i + modelName.length) * volatility;
      return {
        date,
        price: basePrice * (1 + noise),
        volume: Math.floor(Math.random() * 100) + 50
      };
    });
  }

  metrics = computed(() => {
    const opps = this.opportunities();
    const inv = this.inventory();
    
    const stagnantStock = inv.filter(i => (i.daysInStock || 0) > 60);

    return {
      potentialProfit: opps.reduce((acc, curr) => acc + curr.projectedProfit, 0),
      activeOpportunities: opps.length,
      inventoryValue: inv.reduce((acc, curr) => acc + curr.price, 0),
      stagnantStockCount: stagnantStock.length,
      averageMargin: opps.length > 0 
        ? opps.reduce((acc, curr) => acc + curr.profitMarginPercent, 0) / opps.length 
        : 0
    };
  });
}
