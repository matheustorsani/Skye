# Skye

Um bot simples para WhatsApp — feito com TypeScript!

![Logo](https://i.pinimg.com/736x/a0/a7/1a/a0a71aff852b09b1a0e8e7a3c66c76f7.jpg)

Skye é um projeto pessoal de automação no WhatsApp, criado com o objetivo de aprofundar meus conhecimentos em **TypeScript**. Atualmente está sendo desenvolvido com a biblioteca **Baileys**, que permite a integração com o WhatsApp Web.

Este bot foi originalmente feito em JavaScript usando **@open-wa/wa-automate**, mas foi descontinuado por falta de interesse da equipe. Agora, está sendo reconstruído com foco em qualidade, organização modular e escalabilidade.

---

## Funcionalidades

* Conexão via QR Code com o WhatsApp Web
* Sistema modular de comandos
* Suporte a múltiplos idiomas
* Armazenamento de dados com MongoDB
* Respostas automatizadas e comandos personalizados

---

---

## Dependências

* [ffmpeg](https://www.ffmpeg.org)

---

## Instalação

1. Clone o repositório:
```bash
    git clone https://github.com/matheustorsani/Skye
```
2. Acesse a pasta do projeto:
```bash
   cd Skye
```
3. Instale as dependências:
```bash
   npm install
```
4. Configure o projeto:
Renomeie o arquivo ```config-example.json``` para ```config.json``` e preencha os campos obrigatórios conforme necessário (como tokens, chaves ou identificadores).

5. Inicie o bot:
```bash
   npm run dev
```

*Você não precisa compilar o código para JavaScript, ajuste se necessário.*

Após o início, será exibido um QR Code no terminal. Escaneie com seu WhatsApp para conectar.

⚠️ **Recomendação:** use um número secundário para evitar bloqueios ou situações indesejadas.

---

## Requisitos

* Node.js v18 ou superior
* npm ou Yarn
* Conta do WhatsApp (de preferência não pessoal)

---

## Contribuindo

Contribuições são bem-vindas!
Você pode:

* Fazer um fork do projeto
* Criar uma branch com sua melhoria
* Enviar um pull request com a alteração

Também é possível abrir uma issue com sugestões, bugs ou ideias.

---

## Licença

Este projeto ainda não possui uma licença definida.
Entre em contato caso queira utilizar para outros fins.

---

## Contato

Dúvidas, sugestões ou colaborações?
Me procure no [GitHub](https://github.com/matheustorsani) ou abra uma issue no repositório.

---
