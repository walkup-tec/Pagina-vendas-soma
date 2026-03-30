# Workflows N8n

## WhatsApp - Registrar Número

Workflow para registrar/ativar um número no WhatsApp Cloud API via Meta Graph API.

### Importar no N8n

1. Abra o N8n
2. **Menu** (⋮) → **Import from File** ou **Import from URL**
3. Selecione `whatsapp-register-phone.json`

### Configuração

Antes de executar, edite o node **Configuração** e preencha:

| Campo | Valor | Descrição |
|-------|-------|-----------|
| `phoneNumberId` | 1123470334172535 | ID do número no Meta (Phone Number ID) |
| `pin` | 123456 | PIN de 6 dígitos (verificação em duas etapas) |
| `accessToken` | EAAZBK... | User Access Token do Meta |
| `version` | v22.0 | Versão da Graph API |

### Fluxo

```
[Executar Manualmente] → [Configuração] → [Registrar Número WhatsApp] → [Sucesso?]
                                                                    ├→ [Sucesso]  (se success = true)
                                                                    └→ [Erro]    (caso contrário)
```

### Pré-requisitos

- Número verificado no [WhatsApp Manager](https://business.facebook.com/wa/manage/phone-numbers/)
- PIN de verificação em duas etapas configurado
- Token com permissão `whatsapp_business_management`
- Máximo 10 tentativas a cada 72 horas por número

### Documentação

- [Register a Business Phone Number - Meta](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/registration/)
