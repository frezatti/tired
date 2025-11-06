## Tecnologies

- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Database Command

```
podman run --name postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres
```
### or 

```
docker run --name postgres -e POSTGRES_PASSWORD=123456 -p 5432:5432 -d postgres
```

.env

`DATABASE_URL="postgresql://postgres:123456@localhost:5432/tired"`
