#!/bin/bash
# ============================================================
#  VentaCore — Setup inicial del servidor (Ubuntu 22.04/24.04)
#  Ejecutar UNA SOLA VEZ en una instancia Lightsail nueva.
#  Uso: sudo bash setup-server.sh
# ============================================================
set -euo pipefail

echo "══════════════════════════════════════"
echo "  VentaCore — Setup del servidor"
echo "══════════════════════════════════════"

# ── 1. Actualizar sistema ──
echo "[1/7] Actualizando sistema..."
apt-get update && apt-get upgrade -y

# ── 2. Configurar swap ──
# Sin swap, el build de vite/tsc muere por OOM en instancias chicas.
echo "[2/7] Configurando swap..."
bash "$(dirname "$0")/setup-swap.sh" 4G

# ── 3. Instalar Node.js 24 ──
echo "[3/7] Instalando Node.js 24..."
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs
echo "Node: $(node -v) | npm: $(npm -v)"

# ── 4. Instalar PostgreSQL ──
echo "[4/7] Instalando PostgreSQL..."
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# Crear base de datos y usuario
echo "[4/7] Configurando base de datos..."
DB_USER="ventacore"
DB_PASSWORD="$(openssl rand -base64 24)"
DB_NAME="ventacore"

sudo -u postgres psql <<SQL
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
SQL

echo ""
echo "  ┌─────────────────────────────────────────┐"
echo "  │  GUARDAR ESTAS CREDENCIALES:            │"
echo "  │  DB_USER: ${DB_USER}                    │"
echo "  │  DB_PASSWORD: ${DB_PASSWORD}            │"
echo "  │  DB_NAME: ${DB_NAME}                    │"
echo "  └─────────────────────────────────────────┘"
echo ""

# ── 5. Instalar Nginx ──
echo "[5/7] Instalando Nginx..."
apt-get install -y nginx
systemctl enable nginx

# ── 6. Instalar PM2 ──
echo "[6/7] Instalando PM2..."
npm install -g pm2
pm2 startup systemd -u ubuntu --hp /home/ubuntu
env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# ── 7. Crear directorios ──
echo "[7/7] Creando directorios..."
mkdir -p /home/ubuntu/logs
mkdir -p /home/ubuntu/ventacore
chown -R ubuntu:ubuntu /home/ubuntu/logs
chown -R ubuntu:ubuntu /home/ubuntu/ventacore

# ── Firewall (UFW) ──
echo "Configurando firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo ""
echo "══════════════════════════════════════"
echo "  Setup completado!"
echo "  Siguiente paso: ejecutar deploy.sh"
echo "══════════════════════════════════════"
