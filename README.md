<div align='center'>

<h1>Pheonix: Impossible Mission Force Gadget API Development Challenge</h1>
<p>Challenge Description: The Impossible Missions Force (IMF) needs your help! They require a secure API to manage their gadgets. Your mission, should you choose to accept it, is to build this API using Node.js, Express, and PostgreSQL.</p>

<h4> <a href=https://impossible-missions-task-force.onrender.com>View Demo</a> <span> · </span> <a href="https://github.com/KT-1114/upraise/blob/master/README.md"> Documentation </a> <span> · </span> <a href="https://github.com/KT-1114/upraise/issues"> Report Bug </a> <span> · </span> <a href="https://github.com/KT-1114/upraise/issues"> Request Feature </a> </h4>


</div>

# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)


## :star2: About the Project

### :dart: Features
- Register agents
- Add gadgets
- Update gadgets
- Decommission gadgets
- Initialize self-destruction of gadgets
- JWT based authentication


### :key: Environment Variables
To run this project, you will need to add the following environment variables to your .env file
`Supbase url (SUPABASE_URL)`

`Supabase anon key (SUPABASE_ANON_PUBLIC_KEY))`

`JWT secret key (JWT_SECRET_KEY))`

## :notebook_with_decorative_cover: Database Schema

### User Schema
```sql
create table public.users (
  id uuid not null default gen_random_uuid (),
  username text not null,
  password text not null,
  created_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_username_key unique (username)
) TABLESPACE pg_default;
```
### Gadgets Schema
```sql
create table public.gadgets (
  id uuid not null default gen_random_uuid (),
  name text null,
  status public.status not null,
  created_at timestamp with time zone not null default now(),
  last_updated_at timestamp with time zone null,
  decommissioned_at timestamp with time zone null,
  constraint gadgets_pkey primary key (id)
) TABLESPACE pg_default;
```
