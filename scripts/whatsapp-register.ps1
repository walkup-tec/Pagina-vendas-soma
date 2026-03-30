# Script para registrar/ativar número WhatsApp Cloud API
# Documentação: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/registration/

$phoneNumberId = "1123470334172535"
$accessToken = "EAAZBKFyhV1xQBQ2AnhDknxO289e0gnOABKDQ69IPEOhwPuBpV5oTAlQZCZCZCUnyTOX1jKEYFydaltcWyASgSZCj1MWkwXamzK31Fet5vRhmiMWDXOtduWZBNPFQj6DXqQYc6KUEevvZBZAjAINnsL6e5D22XZA41pApcoZAfqbfg9NgZAFwFGIZCx045PWeDLmsnriGLqnHbMVDnEqro7omCcnxLs7ufrV4hoUMBtgRZCA0X3KfL2iL0GgQjJ73KejD4eBZAkkTMWXciDVhJbe5JA982avnDusZC7LzQ7DbljZB"
$version = "v22.0"

# IMPORTANTE: Substitua pelo seu PIN de 6 dígitos (verificação em duas etapas)
# Se não tiver, defina em: WhatsApp Manager > Configurações da conta > Verificação em duas etapas
# Uso: .\whatsapp-register.ps1 -Pin 123456
param(
    [Parameter(Mandatory = $true)]
    [string]$Pin
)
$pin = $Pin

if ($pin.Length -ne 6) {
    Write-Error "O PIN deve ter exatamente 6 dígitos."
    exit 1
}

$uri = "https://graph.facebook.com/$version/$phoneNumberId/register"
$body = @{
    messaging_product = "whatsapp"
    pin               = $pin
} | ConvertTo-Json

$headers = @{
    "Content-Type"  = "application/json"
    "Authorization" = "Bearer $accessToken"
}

Write-Host "Enviando requisição para: $uri" -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri $uri -Method Post -Headers $headers -Body $body
    Write-Host "Sucesso! Número registrado." -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "Erro na requisição:" -ForegroundColor Red
    $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message
    }
}
