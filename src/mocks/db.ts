import type { Customer } from '../features/customers/customerTypes';
import type { Deal } from '../features/deals/dealTypes';
import type { User } from '../features/auth/authTypes';

const STORAGE_KEYS = {
  CUSTOMERS: 'crm_mock_customers',
  DEALS: 'crm_mock_deals',
  USER: 'crm_mock_user',
  TOKEN: 'crm_mock_token',
};

export const INITIAL_USER: User = {
  id: 'usr-1',
  name: 'Alex Mercer',
  email: 'alex.mercer@apexcorp.com',
  role: 'admin',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  department: 'Enterprise Sales',
};

const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1, name: "Ali Khan", email: "ali@example.com", company: "ABC Ltd", phone: "+1 (555) 234-5678", status: "active", value: 45000, createdAt: "2026-09-01", notes: "VIP Client" },
  { id: 2, name: "Sarah Jenkins", email: "sarah.j@techpulse.io", company: "TechPulse Inc", phone: "+1 (555) 876-5432", status: "active", value: 120000, createdAt: "2026-08-15", notes: "Enterprise Renewal" },
  { id: 3, name: "Michael Vance", email: "mvance@innovate.co", company: "Innovate Solutions", phone: "+1 (555) 345-6789", status: "lead", value: 30000, createdAt: "2026-08-20", notes: "Expressed interest in Q4 plan" },
  { id: 4, name: "Elena Rostova", email: "elena@quantum-data.com", company: "Quantum Data", phone: "+1 (555) 901-2345", status: "active", value: 85000, createdAt: "2026-07-10", notes: "Multi-year deal signed" },
  { id: 5, name: "David Chen", email: "dchen@nexuslogistics.com", company: "Nexus Logistics", phone: "+1 (555) 456-7890", status: "inactive", value: 15000, createdAt: "2026-06-05", notes: "Churned due to merger" },
  { id: 6, name: "Jessica Taylor", email: "jessica@apexglobal.net", company: "Apex Global", phone: "+1 (555) 678-9012", status: "active", value: 210000, createdAt: "2026-09-12", notes: "Top tier account" },
  { id: 7, name: "Marcus Brody", email: "mbrody@synergycorp.org", company: "Synergy Corp", phone: "+1 (555) 123-4567", status: "lead", value: 50000, createdAt: "2026-09-14", notes: "Demo scheduled" },
  { id: 8, name: "Amara Patel", email: "amara@cloudscape.io", company: "Cloudscape Systems", phone: "+1 (555) 789-0123", status: "active", value: 95000, createdAt: "2026-07-28", notes: "Upgraded subscription" },
  { id: 9, name: "Liam O'Connor", email: "liam@horizontech.com", company: "Horizon Tech", phone: "+1 (555) 890-1234", status: "lead", value: 40000, createdAt: "2026-09-02", notes: "Inbound inquiry" },
  { id: 10, name: "Chloe Bennett", email: "chloe@vanguardmedia.com", company: "Vanguard Media", phone: "+1 (555) 234-9012", status: "inactive", value: 20000, createdAt: "2026-05-18", notes: "Budget constraints" },
  { id: 11, name: "Carlos Mendez", email: "carlos@solargrid.es", company: "SolarGrid Energy", phone: "+1 (555) 345-0123", status: "active", value: 160000, createdAt: "2026-08-01", notes: "Green transition deal" },
  { id: 12, name: "Hannah Abbott", email: "hannah@biogenix.org", company: "BioGenix Health", phone: "+1 (555) 456-1234", status: "active", value: 75000, createdAt: "2026-08-25", notes: "Compliance check cleared" },
  { id: 13, name: "James Wilson", email: "jwilson@fintechhub.com", company: "FinTech Hub", phone: "+1 (555) 567-2345", status: "lead", value: 65000, createdAt: "2026-09-18", notes: "POC in progress" },
  { id: 14, name: "Olivia Martinez", email: "omartinez@aerostart.io", company: "AeroStart Labs", phone: "+1 (555) 678-3456", status: "active", value: 110000, createdAt: "2026-07-04", notes: "Contract extended" },
  { id: 15, name: "Robert Fischer", email: "rfischer@titanmfg.de", company: "Titan Manufacturing", phone: "+1 (555) 789-4567", status: "active", value: 310000, createdAt: "2026-06-22", notes: "Heavy machinery suite" }
];

const INITIAL_DEALS: Deal[] = [
  { id: 101, title: "Enterprise SaaS Expansion", customerId: 2, value: 85000, stage: "won", priority: "high", closingDate: "2026-09-30", createdAt: "2026-08-16", notes: "Negotiated 3-year term" },
  { id: 102, title: "Q4 Cloud Infrastructure Migration", customerId: 4, value: 60000, stage: "negotiation", priority: "high", closingDate: "2026-10-15", createdAt: "2026-08-01", notes: "Legal security review ongoing" },
  { id: 103, title: "CRM License Add-on", customerId: 1, value: 25000, stage: "proposal", priority: "medium", closingDate: "2026-10-05", createdAt: "2026-09-03", notes: "Sent proposal deck" },
  { id: 104, title: "Analytics Integration Module", customerId: 6, value: 120000, stage: "won", priority: "high", closingDate: "2026-09-15", createdAt: "2026-07-12", notes: "Closed by Alex" },
  { id: 105, title: "Security Operations Center License", customerId: 8, value: 45000, stage: "prospect", priority: "low", closingDate: "2026-11-01", createdAt: "2026-09-08", notes: "Initial discovery call" },
  { id: 106, title: "Renewable Energy Platform Pilot", customerId: 11, value: 95000, stage: "negotiation", priority: "high", closingDate: "2026-10-20", createdAt: "2026-08-22", notes: "Pricing review" },
  { id: 107, title: "Healthcare Compliance Module", customerId: 12, value: 35000, stage: "proposal", priority: "medium", closingDate: "2026-10-12", createdAt: "2026-09-01", notes: "Awaiting CFO signature" },
  { id: 108, title: "Fintech Core Gateway Integration", customerId: 13, value: 65000, stage: "prospect", priority: "medium", closingDate: "2026-11-15", createdAt: "2026-09-18", notes: "Sandbox testing" },
  { id: 109, title: "Automated Supply Chain Suite", customerId: 5, value: 50000, stage: "lost", priority: "medium", closingDate: "2026-08-30", createdAt: "2026-06-10", notes: "Lost to competitor pricing" },
  { id: 110, title: "Global ERP Rollout Phase 2", customerId: 15, value: 240000, stage: "won", priority: "high", closingDate: "2026-09-10", createdAt: "2026-06-25", notes: "Strategic account victory" },
  { id: 111, title: "Aerospace Telemetry Feed", customerId: 14, value: 70000, stage: "proposal", priority: "low", closingDate: "2026-10-30", createdAt: "2026-08-30", notes: "RFP response submitted" },
  { id: 112, title: "Media Asset Management Portal", customerId: 7, value: 30000, stage: "prospect", priority: "medium", closingDate: "2026-11-05", createdAt: "2026-09-15", notes: "Demo scheduled next week" },
];

export const getStoredCustomers = (): Customer[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
    return INITIAL_CUSTOMERS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_CUSTOMERS;
  }
};

export const saveCustomers = (customers: Customer[]): void => {
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
};

export const getStoredDeals = (): Deal[] => {
  const data = localStorage.getItem(STORAGE_KEYS.DEALS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(INITIAL_DEALS));
    return INITIAL_DEALS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_DEALS;
  }
};

export const saveDeals = (deals: Deal[]): void => {
  localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(deals));
};

export const getStoredUser = (): User | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
};

export const saveAuthSession = (user: User, token: string): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const clearAuthSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};
