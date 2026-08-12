# Sindauto Eco Track

Crie um sistema web responsivo chamado Sindauto Lixo Zero, destinado ao controle e acompanhamento da pesagem diária de resíduos do Sindauto Bahia.

O sistema deverá substituir o controle atual feito manualmente em papel e facilitar o registro, consulta e análise dos resíduos gerados pela instituição.

Objetivo do sistema

Permitir que uma pessoa responsável registre diariamente a quantidade, em quilogramas, de:

Rejeitos

Recicláveis

Orgânicos

A partir desses registros, o sistema deverá calcular automaticamente indicadores e apresentar os resultados em um dashboard simples e visual.

Estrutura do sistema

Crie uma aplicação com menu lateral contendo:

Dashboard

Registrar Pesagem

Histórico

Relatórios

Configurações

No mobile, transformar o menu lateral em um menu recolhível.

1. DASHBOARD

Criar uma página inicial com visão geral dos dados.

Na parte superior mostrar cards com:

Total de resíduos

Soma de todos os resíduos registrados no período selecionado.

Recicláveis

Quantidade total de resíduos recicláveis.

Orgânicos

Quantidade total de resíduos orgânicos.

Rejeitos

Quantidade enviada para rejeito/aterro.

Taxa de desvio do aterro

Calcular automaticamente:

Taxa de desvio = ((Recicláveis + Orgânicos) / Total de resíduos) × 100

Exemplo:

Recicláveis: 30 kg
Orgânicos: 20 kg
Rejeitos: 10 kg

Total = 60 kg

Desvio do aterro = 83,33%

Mostrar essa porcentagem de forma destacada.

Adicionar filtro de período:

Hoje

Esta semana

Este mês

Últimos 30 dias

Personalizado

2. GRÁFICOS

Adicionar gráficos no Dashboard.

Evolução da geração de resíduos

Gráfico mostrando a quantidade de resíduos ao longo dos dias.

Mostrar separadamente:

Recicláveis

Orgânicos

Rejeitos

Composição dos resíduos

Criar gráfico mostrando a proporção entre:

Recicláveis

Orgânicos

Rejeitos

Desvio do aterro

Criar indicador visual mostrando:

"XX% dos resíduos foram desviados do aterro."

Os gráficos devem atualizar automaticamente conforme os registros cadastrados.

3. REGISTRAR PESAGEM

Criar uma página simples e muito fácil de utilizar, pois poderá ser acessada diariamente pelo responsável pela coleta dos resíduos.

Campos:

Data

Preencher automaticamente com a data atual, mas permitir alteração.

Rejeitos

Campo numérico em kg.

Recicláveis

Campo numérico em kg.

Orgânicos

Campo numérico em kg.

Adicionar o campo opcional:

Observações

Exemplo:

"Grande quantidade de papel proveniente de material administrativo."

Adicionar botão principal:

Registrar Pesagem

Antes de salvar, mostrar um pequeno resumo:

Total registrado: XX kg

Depois do registro, exibir mensagem:

"Pesagem registrada com sucesso."

Não permitir valores negativos.

Permitir valores decimais, como:

2,5 kg
10,75 kg
0,8 kg

4. HISTÓRICO DE PESAGENS

Criar uma tabela contendo:

Data | Recicláveis | Orgânicos | Rejeitos | Total | Desvio do aterro | Ações

Exemplo:

10/08/2026 | 8 kg | 5 kg | 2 kg | 15 kg | 86,7% | visualizar / editar / excluir

Adicionar:

pesquisa

filtro por período

ordenação por data

paginação

Permitir:

visualizar registro

editar registro

excluir registro

Ao excluir, solicitar confirmação antes de apagar.

5. RELATÓRIOS

Criar página de relatórios com seleção de período.

Permitir selecionar:

Data inicial
Data final

Mostrar:

Total de resíduos

Total reciclado

Total de orgânicos

Total de rejeitos

Taxa média de desvio do aterro

Média diária de geração de resíduos

Número de pesagens realizadas

Apresentar também gráficos referentes ao período.

Preparar a interface para futuramente permitir exportação de relatório em PDF e Excel.

6. BANCO DE DADOS

Preparar o sistema para utilizar Supabase com PostgreSQL.

Criar uma estrutura de tabela chamada:

pesagens

Campos:

id
data
reciclaveis
organicos
rejeitos
observacoes
created_at
updated_at

Utilizar tipos adequados para números decimais.

O campo ID deve ser gerado automaticamente.

Os campos created_at e updated_at devem ser controlados automaticamente.

7. CÁLCULOS

O sistema deve realizar os cálculos automaticamente.

Total de resíduos

total = reciclaveis + organicos + rejeitos

Total recuperado/desviado

recuperado = reciclaveis + organicos

Percentual de desvio do aterro

desvio = (recuperado / total) × 100

Caso o total seja zero, retornar 0% para evitar erro de divisão.

Os cálculos devem ser realizados dinamicamente e não precisam necessariamente ser armazenados no banco.

8. INTERFACE E DESIGN

Quero aparência de software de gestão ambiental profissional, e não aparência de landing page.

Visual:

moderno

minimalista

limpo

profissional

bastante espaço entre os elementos

interface intuitiva

totalmente responsiva

Utilizar predominantemente:

branco

tons neutros

verde relacionado à sustentabilidade

pequenos detalhes nas cores institucionais quando necessário

Não exagerar no uso de verde.

Utilizar cards com bordas suaves e sombras discretas.

Tipografia moderna e de ótima legibilidade.

Os gráficos devem seguir o mesmo padrão visual.

9. RESPONSIVIDADE

O sistema precisa funcionar muito bem em:

computador

tablet

smartphone

A tela "Registrar Pesagem" deve ser especialmente otimizada para celular, pois poderá ser utilizada no momento da coleta dos resíduos.

Campos grandes e fáceis de preencher.

10. ESTRUTURA TÉCNICA

Utilizar:

React

TypeScript

Tailwind CSS

componentes reutilizáveis

arquitetura organizada

Supabase para banco de dados

Separar adequadamente:

components
pages
services
hooks
types
utils

Não colocar toda a lógica em apenas um arquivo.

Criar código limpo, organizado e fácil de manter.

11. PREPARAÇÃO PARA FUTURAS FUNCIONALIDADES

Não implementar agora, mas deixar a arquitetura preparada para futuramente adicionar:

login de usuários

diferentes unidades/empresas

categorias específicas de recicláveis

papel

plástico

vidro

metal

eletrônicos

óleo

madeira

cálculo de CO₂ evitado

metas mensais

comparação entre meses

certificação Lixo Zero

geração automática de relatórios

exportação PDF

exportação Excel

registro de responsáveis pela pesagem

anexar comprovantes ou fotos

controle de coleta por cooperativas

dashboards ambientais mais avançados

IMPORTANTE

Nesta primeira versão, mantenha o sistema simples.

O fluxo principal deve ser:

Registrar pesagem → salvar no banco → visualizar no histórico → calcular indicadores → visualizar resultados no dashboard.

Não criar funcionalidades complexas desnecessárias neste momento.

Priorizar organização, facilidade de uso e uma arquitetura que permita expansão futura.

O sistema deve ter aparência de um produto SaaS profissional de gestão de resíduos.

Nome temporário do sistema:

Sindauto Lixo Zero

Subtítulo:

Gestão e Monitoramento de Resíduos

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6aea67bb-1d40-4dcd-a120-0265af385ad8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

### Integração com API externa

O frontend consome um backend externo por HTTP. Configure a origem no arquivo `.env`:

```env
VITE_DATA_SOURCE=api
VITE_API_URL=https://seu-backend.com/api
```

O backend deve implementar as seguintes rotas:

```text
POST   /auth/login
GET    /auth/me
POST   /auth/logout
GET    /pesagens?inicio=YYYY-MM-DD&fim=YYYY-MM-DD
POST   /pesagens
PUT    /pesagens/:id
DELETE /pesagens/:id
```

O login deve retornar `{ "token": "..." }`. As demais rotas protegidas recebem o token no
cabeçalho `Authorization: Bearer <token>`.

```text
Usuário: admin
Senha: admin@123
```

Para iniciar o frontend:

```sh
npm run dev
```

O modo alternativo com armazenamento no navegador ainda pode ser ativado no arquivo `.env`:

```env
VITE_DATA_SOURCE=local
```

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
