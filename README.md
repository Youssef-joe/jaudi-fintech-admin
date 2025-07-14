#  Frontend – Activity Recommendation System

This is the frontend interface of the **Activity Recommendation Platform**, built using **Next.js 14**, **Tailwind CSS**, and **TypeScript**. It includes role-based dashboards for users and admins, transaction monitoring, and activity logs.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide
- **State Management**: useState / useEffect
- **API Layer**: `utils/api.ts` to communicate with backend (Express + Supabase)
- **Deployment**: Vercel

---

## Features

###  Authentication
- Token-based login for users and admins
- Session storage for access tokens
- Role-based routing and layout handling

###  Dashboards
- **User Dashboard**: Recommended activities + weather-based info
- **Admin Dashboards**:
  - **Global Admin**: View all transactions, audit logs, regions
  - **Regional Admin**: View transactions of assigned region only

###  Transactions Table
- Search, filter, and paginate transactions
- Colored status badges (Approved, Pending, Rejected)
- Region-aware visibility (based on role)

###  Audit Logs Table
- Displays detailed logs of system activity
- Searchable and paginated
- Includes user email, action type, timestamp, and IP address

###  Reusable Components
- `<Table />`, `<Badge />`, `<Pagination />`, `<Button />`
- Layout: Header + Sidebar for Admin roles

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/activity-recommendation-frontend.git
cd activity-recommendation-frontend
