---
name: analytics-geolocalizacao
description: Protocolo of rastreamento of scans e geolocalização anônima for o dashboard of the QRGen.
metadata:
  agent: "@specialist-geolocalizacao"
  Participants: "@engineering-backend-architect, @engineering-database-optimizer"
  triggered_by: "implementação of rastreamento of scans ou dashboard of analytics"
---

## 🌍 Rastreamento of Scans (QRGen)

### Geolocalização Anônima
- **MaxMind GeoLite2:** Usar a base of data MaxMind for lookup of IP no backend.
- **Privacidade (LGPD/GDPR):** NUNCA armazenar o IP completo of the user. Armazenar apenas `country_code`, `city` e `region`.
- **User-Agent:** Identificar o dispositivo (iOS/Android/Desktop) e o navegador of the scan.

### Analytics e Performance
- **Evento of Scan:** Registrar cada scan na tabela `scan_events` with `qr_id`, `timestamp` e data of geolocalização.
- **Agregação:** Criar views no Supabase for contagem rápida of scans por país e dispositivo.
- **Cache:** Usar Redis for contagem of scans in tempo real antes of persistir no database.

---

## ✅ Checklist of Analytics

- [ ] O IP of the user está sendo anonimizado (ex: `192.168.1.XXX`)?
- [ ] O lookup of geolocalização não atrasa o redirecionamento of the user?
- [ ] O dashboard mostra o top 5 países of origem dos scans?
- [ ] O sistema diferencia scans únicos of scans totais?
- [ ] Os data of geolocalização estão sendo salvos with o `ISO 3166-1 alpha-2` (ex: BR, US)?

---

## 🛠️ Colaboração Multi-agent
1. **@specialist-geolocalizacao:** Define a lógica of lookup e anonimização of IP.
2. **@engineering-backend-architect:** Implementa o middleware of rastreamento e redirecionamento.
3. **@engineering-database-optimizer:** Otimiza as tabelas e views of analytics for performance.
