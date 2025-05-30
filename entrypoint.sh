until nc -z postgres 5432; do
  echo "Aguardando o banco de dados..."
  sleep 2
done

npm run db:push && npm run dev