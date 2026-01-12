# bbommapala-0a19fc14-d0eb-42ed-850d-63023568a3e3.
FULL STACK CODING CHALLENGE
Setup Instructions
Prerequisites
Node.js (v18+)Docker (optional, for PostgreSQL) or SQLite (default)
NX CLI (npm install -g nx)
Installation
Clone the repository:
Bashgit clone <repo-url>
cd jsmith-0a19fc14-d0eb-42ed-850d-63023568a3e3
Install dependencies:
Bash
npm install
Environment Setup: Create a .env file in apps/api/.env:
Code snippet
JWT_SECRET=super-secret-key-123
DATABASE_URL="postgresql://user:pass@localhost:5432/db" # Or SQLite path
PORT=3000
Running the AppsBackend:
npx nx serve apiFrontend: 
npx nx serve dashboardRun Tests: 
npx nx test api or npx nx test dashboard
🏗️ Architecture Overview
This project is built using an NX Monorepo for strict separation of concerns and code sharing:
apps/api: NestJS backend handling the business logic, JWT authentication, and TypeORM database interactions.
apps/dashboard: Angular 17+ frontend with TailwindCSS and CdkDragDrop for task management.
libs/data: Shared library containing TypeScript Interfaces, DTOs, and TypeORM Entities. This ensures the frontend and backend always share the same data shapes.
libs/auth: A reusable security library containing RBAC decorators, JWT strategy, and the RbacGuard.
🗃️ Data Model & Hierarchy
The system uses a 2-Level Organizational Hierarchy to isolate data.Organization: Self-referencing table.
A Level 2 organization has a parentId pointing to a Level 1.
Users: Belong to one Organization and have one Role.
Tasks: Linked to an Organization ID and an Owner (User).
Roles & Permissions
Role,Description
Owner,Full access to their organization and all sub-organizations.
Admin,Full CRUD access but only within their specific organization.
Viewer,Read-only access to tasks within their organization.
🔐 Access Control Implementation
RBAC Logic
Permissions are enforced using a combination of Role Inheritance and Organization Scoping:
JWT Verification: Every request is checked for a valid Bearer token.
Role Guard: A custom @Permissions() decorator checks if the user's role is sufficient.
Scoped Queries: The TaskService automatically filters queries:
SQL-- Example for an Admin in Org B
SELECT * FROM tasks WHERE organizationId = 'Org_B';
Audit Logging
All write operations (POST, PUT, DELETE) are intercepted by a global logger that outputs to the console/file:[TIMESTAMP] ACTION: CREATE | USER: user-uuid | RESOURCE: Task | STATUS: SUCCESS
Method,Endpoint,Access,Description
POST,/auth/login,Public,Returns JWT token
GET,/tasks,Authenticated,List tasks scoped to user org
POST,/tasks,"Owner, Admin",Create a new task
PUT,/tasks/:id,"Owner, Admin",Update task status/content
DELETE,/tasks/:id,Owner,Delete a task
GET,/audit-log,"Owner, Admin",View system access logs
🚀 Future ConsiderationsRefresh Tokens: 
Implement a rotation strategy to improve security without logging users out frequently.
RBAC Caching: Use Redis to cache user permissions to reduce database load on high-traffic endpoints.
Granular Permissions: Move from Role-based to Attribute-based access control (ABAC) for more complex hierarchies.
