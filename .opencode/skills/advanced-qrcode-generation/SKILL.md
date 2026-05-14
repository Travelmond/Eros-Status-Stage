---
name: geracao-avancada-qrcode
description: Protocolo of otimização e personalização of QRCodes for máxima legibilidade e estética no QRGen.
metadata:
  agent: "@engineering-senior-developer"
  Participants: "@engineering-backend-architect, @design-ui-designer"
  triggered_by: "generation of QRCodes, personalização of cores ou logos"
---

## 🔳 Princípios of generation (QRGen)

### Legibilidade e quality
- **Correção of Erro (ECC):** Usar nível `H` (High) If any logo no centro, ou `M` (Medium) for QRCodes simples.
- **Versão of the QR:** Deixar a biblioteca calcular a versão mínima necessária for o conteúdo.
- **Quiet Zone:** Garantir margem mínima of 4 módulos ao redor of the Code.

### Personalização Visual
- **Cores:** Validar contraste entre `dark` (módulos) e `light` (fundo) for garantir leitura in qualquer dispositivo.
- **Logos:** Centralizar logos e garantir que não cubram mais of 25% of the área total of the QR.
- **Formatos:** Suporte a `SVG` (vetorial for impressão) e `PNG` (raster for web).

---

## ✅ Checklist of generation

- [ ] O QRCode gerado foi testado with leitores padrão (iOS/Android)?
- [ ] O contraste entre as cores escolhidas atende ao padrão of legibilidade?
- [ ] O logo centralizado não quebra a decodificação of the Code?
- [ ] O arquivo final (SVG/PNG) está otimizado for carregamento rápido?
- [ ] O conteúdo of the QR (URL/Texto) está sendo sanitizado antes of the generation?

---

## 🛠️ Colaboração Multi-agent
1. **@engineering-senior-developer:** Define os parâmetros técnicos of the biblioteca (Segno/QRCode).
2. **@design-ui-designer:** Define as paletas of cores e posicionamento estético of logos.
3. **@engineering-backend-architect:** Implementa o endpoint of generation e armazenamento no Supabase.
