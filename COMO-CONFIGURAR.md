# Como ligar a página no seu Google Drive

A página está pronta e publicada. Falta só **um passo único** (~2 minutos) pra
fazer as fotos das clientes caírem direto na sua planilha do Drive.

## Passo a passo

### 1. Criar o "robozinho" no Apps Script

1. Abre **https://script.google.com** (logada com sua conta `vinossauros@gmail.com`)
2. Clica em **"Novo projeto"** (canto superior esquerdo)
3. Apaga tudo que vier escrito na tela
4. Abre o arquivo **`apps-script.gs`** desta pasta, copia TODO o conteúdo, e cola lá no Apps Script
5. Clica no ícone de disquete 💾 pra salvar (pode dar qualquer nome, ex: `Diagnostico Flores`)

### 2. Publicar como "App da Web"

1. Clica em **"Implantar"** (botão azul no canto superior direito) → **"Nova implantação"**
2. Engrenagem ⚙️ ao lado de "Selecionar tipo" → escolhe **"App da Web"**
3. Preenche:
   - **Descrição**: Diagnostico Flores
   - **Executar como**: Eu (vinossauros@gmail.com)
   - **Quem tem acesso**: **Qualquer pessoa** (importante!)
4. Clica em **"Implantar"**
5. Vai pedir autorização — clica em **"Autorizar acesso"** → escolhe sua conta → "Avançado" → "Acessar (não seguro)" → "Permitir"
   - (Esse aviso aparece porque é seu próprio script, não tem risco)
6. Copia a **URL do app da Web** que ele mostrar (termina com `/exec`)

### 3. Conectar a URL na página

Abre o arquivo `index.html` desta pasta, e encontra a linha:

```js
const WEBHOOK_URL = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
```

Cola sua URL no lugar do texto entre aspas. Exemplo:

```js
const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycb.../exec";
```

Salva o arquivo e me avisa que eu publico de novo no GitHub Pages
(ou rodo `git add . && git commit -m "config webhook" && git push` na pasta).

## Pronto, e agora?

A primeira vez que uma cliente enviar uma foto, automaticamente:

- 📁 Cria uma **pasta no seu Drive** chamada `Diagnostico-Flores - Fotos`
- 📊 Cria uma **planilha** chamada `Diagnostico Flores - Submissoes` com as colunas:
  Data, Nome, WhatsApp, Descrição, Link da Foto
- 📷 Salva a foto na pasta e cola o link na linha da planilha

Cada nova cliente = 1 linha nova + 1 foto nova. Você abre a planilha,
clica no link da foto, vê a flor e responde no WhatsApp dela.

## Pra testar

Abre o link da página, clica em **"Tirar foto agora"** ou **"Enviar foto da galeria"**,
preenche nome + WhatsApp + envia. Em segundos a linha aparece na sua planilha.
