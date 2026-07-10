#!/bin/bash
# ============================================================
#  VentaCore — Configurar swap
#  Necesario para que el build (vite/tsc) no muera por OOM
#  en instancias Lightsail chicas.
#  Uso: sudo bash setup-swap.sh [tamaño]   (default: 4G)
# ============================================================
set -euo pipefail

SWAPFILE="/swapfile"
SIZE="${1:-4G}"

if [ "$(id -u)" -ne 0 ]; then
    echo "Error: ejecutar con sudo"
    exit 1
fi

echo "══════════════════════════════════════"
echo "  VentaCore — Setup de swap (${SIZE})"
echo "══════════════════════════════════════"

if swapon --show | grep -q "$SWAPFILE"; then
    echo "Ya hay swap activo en ${SWAPFILE}:"
    swapon --show
    exit 0
fi

# El disco tiene que tener lugar para el swapfile.
AVAIL_KB="$(df --output=avail / | tail -1)"
NEED_KB="$(numfmt --from=iec "$SIZE" | awk '{print int($1/1024)}')"
if [ "$AVAIL_KB" -lt "$((NEED_KB + 1048576))" ]; then
    echo "Error: no hay espacio suficiente en / para un swapfile de ${SIZE}."
    echo "Disponible: $((AVAIL_KB / 1024)) MB — se necesitan $((NEED_KB / 1024)) MB + 1 GB de margen."
    exit 1
fi

echo "[1/4] Creando ${SWAPFILE} (${SIZE})..."
fallocate -l "$SIZE" "$SWAPFILE" || dd if=/dev/zero of="$SWAPFILE" bs=1M count="$((NEED_KB / 1024))"
chmod 600 "$SWAPFILE"

echo "[2/4] Formateando y activando..."
mkswap "$SWAPFILE"
swapon "$SWAPFILE"

echo "[3/4] Persistiendo en /etc/fstab..."
if ! grep -q "^${SWAPFILE}" /etc/fstab; then
    echo "${SWAPFILE} none swap sw 0 0" >>/etc/fstab
fi

# swappiness bajo: usar swap solo cuando la RAM realmente se acaba,
# no como cache. Importante porque el disco de Lightsail es lento.
echo "[4/4] Ajustando vm.swappiness=10..."
sysctl -w vm.swappiness=10
if ! grep -q "^vm.swappiness" /etc/sysctl.conf; then
    echo "vm.swappiness=10" >>/etc/sysctl.conf
else
    sed -i 's/^vm.swappiness.*/vm.swappiness=10/' /etc/sysctl.conf
fi

echo ""
echo "══════════════════════════════════════"
echo "  Swap configurado."
free -h
echo "══════════════════════════════════════"
