---
description: "Gerencia deploy (condicional: só se APIs/MCP detectados). Pergunta ao usuário antes de agir."
agent: devops

subtask: true

---

## Pré-requisito

Verificar se APIs/MCP foram detectados no projeto (usar skill `detectar-stack`).

Se não houver APIs/MCP, comunicar: "Deploy não é aplicável a este projeto (nenhuma API/MCP detectada)."

Se houver, perguntar ao usuário: "Detectei APIs/MCP no projeto. Quer fazer deploy? (staging/production)"

## Processo

1. **Verificar pré-requisitos**
   - Build configurado
   - Testes passando
   - Variáveis de ambiente configuradas

2. **Build da aplicação**
   - Compilar/transpilar código
   - Minificar assets
   - Gerar artefato de deploy

3. **Executar testes**
   - Testes unitários
   - Testes de integração
   - Garantir que tudo passa

4. **Deploy para staging**
   - Enviar artefato para staging
   - Configurar ambiente

5. **Testar em staging**
   - `@critico-usuario` testa fluxos principais
   - Verificar performance
   - Validar funcionamento

6. **Perguntar ao usuário:** "Deploy em staging aprovado. Prosseguir para produção?"

7. **Deploy para produção** (após aprovação)
   - Enviar artefato para produção
   - Configurar monitoramento
   - Configurar alertas
   - Configurar logs

8. **Validar em produção**
   - `@critico-usuario` testa fluxos principais
   - Verificar performance
   - Confirmar funcionamento

9. **Configurar monitoramento**
   - Logs centralizados
   - Alertas de erro
   - Métricas de performance
   - Backups automáticos

10. **Documentar em `/docs/deployment/deployment-guide.md`**