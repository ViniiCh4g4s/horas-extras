#!/bin/bash

echo "=== Testando Login ==="
LOGIN_RESPONSE=$(curl -s -X POST 'http://horas-extras.test/api/login' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{"email":"teste@teste.com","password":"12345678"}')

echo "$LOGIN_RESPONSE" | head -3

TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo "ERRO: Token não obtido"
    exit 1
fi

echo ""
echo "Token obtido com sucesso!"
echo ""
echo "=== Testando Update Profile ==="

UPDATE_RESPONSE=$(curl -s -X PUT 'http://horas-extras.test/api/profile' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Teste Updated","cargo":"Desenvolvedor","salario":6000}')

echo "$UPDATE_RESPONSE"

echo ""
echo "=== Testando Criar Registro ==="

REGISTRO_RESPONSE=$(curl -s -X POST 'http://horas-extras.test/api/registros-ponto' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "data": "2024-11-04",
    "observacao": "Teste",
    "periodos": [
      {
        "data_entrada": "2024-11-04",
        "entrada": "08:00",
        "data_saida": "2024-11-04",
        "saida": "12:00"
      }
    ]
  }')

echo "$REGISTRO_RESPONSE"
