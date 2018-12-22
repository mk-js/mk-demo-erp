taskkill -f /im redis-server.exe
taskkill /F /im node.exe /fi "windowtitle eq sys-*"
taskkill /F /im java.exe /fi "windowtitle eq erp-*"
