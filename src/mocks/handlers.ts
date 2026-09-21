import { http, HttpResponse, delay } from 'msw';
import {
  getStoredCustomers,
  saveCustomers,
  getStoredDeals,
  saveDeals,
  INITIAL_USER,
  saveAuthSession,
  clearAuthSession,
  getStoredUser
} from './db';
import type { Customer } from '../features/customers/customerTypes';
import type { Deal } from '../features/deals/dealTypes';

export const handlers = [
  // Authentication
  http.post('/api/auth/login', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email) {
      return HttpResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }
    
    // Accept any valid demo password or email
    const token = `mock-jwt-token-${Date.now()}`;
    const user = {
      ...INITIAL_USER,
      email: body.email,
      name: body.email.split('@')[0].replace('.', ' ').toUpperCase(),
    };
    saveAuthSession(user, token);

    return HttpResponse.json({
      success: true,
      data: { user, token },
      message: 'Login successful',
    });
  }),

  http.post('/api/auth/logout', async () => {
    await delay(150);
    clearAuthSession();
    return HttpResponse.json({ success: true, message: 'Logged out successfully' });
  }),

  http.get('/api/auth/me', async () => {
    const user = getStoredUser();
    if (!user) {
      return HttpResponse.json({ success: false, message: 'Unauthenticated' }, { status: 401 });
    }
    return HttpResponse.json({ success: true, data: user });
  }),

  // Customers API
  http.get('/api/customers', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const status = url.searchParams.get('status') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'descend';

    let customers = getStoredCustomers();

    // Filter status
    if (status && status !== 'all') {
      customers = customers.filter((c) => c.status === status);
    }

    // Search filter
    if (search) {
      customers = customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.company.toLowerCase().includes(search)
      );
    }

    // Sort
    customers.sort((a, b) => {
      let valA = a[sortBy as keyof Customer] ?? '';
      let valB = b[sortBy as keyof Customer] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'ascend' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ascend' ? 1 : -1;
      return 0;
    });

    const total = customers.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = customers.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json({
      success: true,
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    });
  }),

  http.post('/api/customers', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Omit<Customer, 'id' | 'createdAt'>;
    const customers = getStoredCustomers();
    
    const newCustomer: Customer = {
      ...body,
      id: customers.length > 0 ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
      createdAt: new Date().toISOString().split('T')[0],
    };

    customers.unshift(newCustomer);
    saveCustomers(customers);

    return HttpResponse.json({ success: true, data: newCustomer, message: 'Customer created successfully' }, { status: 201 });
  }),

  http.put('/api/customers/:id', async ({ params, request }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const body = (await request.json()) as Partial<Customer>;
    const customers = getStoredCustomers();
    
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) {
      return HttpResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }

    const updated = { ...customers[index], ...body };
    customers[index] = updated;
    saveCustomers(customers);

    return HttpResponse.json({ success: true, data: updated, message: 'Customer updated successfully' });
  }),

  http.delete('/api/customers/:id', async ({ params }) => {
    await delay(250);
    const id = parseInt(params.id as string, 10);
    let customers = getStoredCustomers();
    
    const exists = customers.some((c) => c.id === id);
    if (!exists) {
      return HttpResponse.json({ success: false, message: 'Customer not found' }, { status: 404 });
    }

    customers = customers.filter((c) => c.id !== id);
    saveCustomers(customers);

    return HttpResponse.json({ success: true, message: 'Customer deleted successfully' });
  }),

  // Deals API
  http.get('/api/deals', async ({ request }) => {
    await delay(200);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10', 10);
    const search = (url.searchParams.get('search') || '').toLowerCase();
    const stage = url.searchParams.get('stage') || 'all';
    const priority = url.searchParams.get('priority') || 'all';
    const customerIdStr = url.searchParams.get('customerId');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'descend';

    let deals = getStoredDeals();
    const customers = getStoredCustomers();
    const customerMap = new Map(customers.map((c) => [c.id, c.name]));

    // Attach customer names
    deals = deals.map((d) => ({
      ...d,
      customerName: customerMap.get(d.customerId) || 'Unknown Customer',
    }));

    if (stage && stage !== 'all') {
      deals = deals.filter((d) => d.stage === stage);
    }

    if (priority && priority !== 'all') {
      deals = deals.filter((d) => d.priority === priority);
    }

    if (customerIdStr) {
      const cId = parseInt(customerIdStr, 10);
      deals = deals.filter((d) => d.customerId === cId);
    }

    if (search) {
      deals = deals.filter(
        (d) =>
          d.title.toLowerCase().includes(search) ||
          (d.customerName && d.customerName.toLowerCase().includes(search))
      );
    }

    deals.sort((a, b) => {
      let valA = a[sortBy as keyof Deal] ?? '';
      let valB = b[sortBy as keyof Deal] ?? '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'ascend' ? -1 : 1;
      if (valA > valB) return sortOrder === 'ascend' ? 1 : -1;
      return 0;
    });

    const total = deals.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedData = deals.slice(startIndex, startIndex + pageSize);

    return HttpResponse.json({
      success: true,
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages,
    });
  }),

  http.post('/api/deals', async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Omit<Deal, 'id' | 'createdAt'>;
    const deals = getStoredDeals();
    
    const newDeal: Deal = {
      ...body,
      id: deals.length > 0 ? Math.max(...deals.map((d) => d.id)) + 1 : 101,
      createdAt: new Date().toISOString().split('T')[0],
    };

    deals.unshift(newDeal);
    saveDeals(deals);

    return HttpResponse.json({ success: true, data: newDeal, message: 'Deal created successfully' }, { status: 201 });
  }),

  http.put('/api/deals/:id', async ({ params, request }) => {
    await delay(300);
    const id = parseInt(params.id as string, 10);
    const body = (await request.json()) as Partial<Deal>;
    const deals = getStoredDeals();
    
    const index = deals.findIndex((d) => d.id === id);
    if (index === -1) {
      return HttpResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
    }

    const updated = { ...deals[index], ...body };
    deals[index] = updated;
    saveDeals(deals);

    return HttpResponse.json({ success: true, data: updated, message: 'Deal updated successfully' });
  }),

  http.delete('/api/deals/:id', async ({ params }) => {
    await delay(250);
    const id = parseInt(params.id as string, 10);
    let deals = getStoredDeals();
    
    const exists = deals.some((d) => d.id === id);
    if (!exists) {
      return HttpResponse.json({ success: false, message: 'Deal not found' }, { status: 404 });
    }

    deals = deals.filter((d) => d.id !== id);
    saveDeals(deals);

    return HttpResponse.json({ success: true, message: 'Deal deleted successfully' });
  }),

  // Analytics Endpoint
  http.get('/api/analytics/summary', async () => {
    await delay(250);
    const customers = getStoredCustomers();
    const deals = getStoredDeals();

    const activeCustomers = customers.filter((c) => c.status === 'active').length;
    const totalDealValue = deals.reduce((acc, d) => acc + d.value, 0);
    const wonDeals = deals.filter((d) => d.stage === 'won');
    const wonDealValue = wonDeals.reduce((acc, d) => acc + d.value, 0);
    const activeDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').length;
    const conversionRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;
    const avgDealSize = deals.length > 0 ? Math.round(totalDealValue / deals.length) : 0;

    const monthlyTrend = [
      { month: 'Apr', revenue: 140000, dealsCount: 6, newCustomers: 3 },
      { month: 'May', revenue: 195000, dealsCount: 8, newCustomers: 5 },
      { month: 'Jun', revenue: 230000, dealsCount: 11, newCustomers: 7 },
      { month: 'Jul', revenue: 310000, dealsCount: 14, newCustomers: 8 },
      { month: 'Aug', revenue: 380000, dealsCount: 16, newCustomers: 10 },
      { month: 'Sep', revenue: 445000, dealsCount: 19, newCustomers: 12 },
    ];

    const stages: Record<string, { count: number; value: number }> = {
      prospect: { count: 0, value: 0 },
      proposal: { count: 0, value: 0 },
      negotiation: { count: 0, value: 0 },
      won: { count: 0, value: 0 },
      lost: { count: 0, value: 0 },
    };

    deals.forEach((d) => {
      if (stages[d.stage]) {
        stages[d.stage].count += 1;
        stages[d.stage].value += d.value;
      }
    });

    const stageDistribution = Object.entries(stages).map(([stage, val]) => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: val.count,
      value: val.value,
    }));

    const priorities: Record<string, { count: number; value: number }> = {
      low: { count: 0, value: 0 },
      medium: { count: 0, value: 0 },
      high: { count: 0, value: 0 },
    };

    deals.forEach((d) => {
      if (priorities[d.priority]) {
        priorities[d.priority].count += 1;
        priorities[d.priority].value += d.value;
      }
    });

    const priorityDistribution = Object.entries(priorities).map(([priority, val]) => ({
      priority: priority.charAt(0).toUpperCase() + priority.slice(1),
      count: val.count,
      value: val.value,
    }));

    return HttpResponse.json({
      success: true,
      data: {
        kpis: {
          totalCustomers: customers.length,
          activeCustomers,
          totalDeals: deals.length,
          activeDeals,
          totalDealValue,
          wonDealValue,
          conversionRate,
          avgDealSize,
        },
        monthlyTrend,
        stageDistribution,
        priorityDistribution,
      },
    });
  }),
];
