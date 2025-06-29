#!/bin/sh
#!/bin/sh

# Start nginx container
docker compose up -d nginx

echo "Waiting 5 seconds for NGINX to initialize..."
sleep 5

# Run certbot certonly with webroot
docker run --rm \
  -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
  -v "$(pwd)/certbot/www:/var/www/certbot" \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  --email contact@learnxchain.io --agree-tos --no-eff-email \
  -d learnxchain.io -d www.learnxchain.io -d api.learnxchain.io

echo "✅ Certificate request complete. Uncomment HTTPS blocks in nginx/default.conf and restart NGINX."
