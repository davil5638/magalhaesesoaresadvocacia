# Magalhães & Soares Advocacia — Site institucional

Site institucional estático, rápido e responsivo, feito em **HTML + CSS + JavaScript puro** (sem
frameworks ou etapa de build). Basta abrir os arquivos em qualquer navegador ou publicar em qualquer
hospedagem de arquivos estáticos.

Identidade: paleta sóbria (azul-marinho, grafite, off-white e dourado/champagne), tipografia serifada
(Playfair Display) nos títulos e sans-serif (Inter) no corpo. Conteúdo em conformidade com o
**Provimento nº 205/2021** e o **Código de Ética e Disciplina da OAB**.

---

## 📁 Estrutura

```
.
├── index.html                       # Página principal (todas as seções)
├── politica-de-privacidade.html     # Política de Privacidade (LGPD)
├── artigos/                         # Blog / artigos jurídicos
│   ├── pensao-alimenticia-como-funciona.html
│   ├── demissao-sem-justa-causa-direitos.html
│   └── cobranca-indevida-o-que-fazer.html
├── css/styles.css                   # Estilos (design system + responsivo)
├── js/main.js                       # Menu, validação, FAQ, cookies, WhatsApp
├── assets/                          # Imagens (placeholders) e favicon
├── robots.txt                       # SEO
├── sitemap.xml                      # SEO
└── README.md
```

---

## ▶️ Como visualizar localmente

Abra o `index.html` diretamente no navegador **ou** rode um servidor local (recomendado, para o mapa e as fontes):

```powershell
# Opção 1 — Python (já instalado nesta máquina)
python -m http.server 8000

# Opção 2 — Node
npx serve .
```

Depois acesse **http://localhost:8000**.

---

## ✅ O que personalizar antes de publicar

Os dados abaixo são **placeholders**. Procure e substitua pelos dados reais do escritório.

### 1. Telefone / WhatsApp / e-mail  → `js/main.js` (objeto `CONFIG`, no topo)
```js
var CONFIG = {
  whatsappNumber: "5511900000000",   // 55 + DDD + número (somente dígitos)
  whatsappMessage: "Olá! Gostaria de agendar uma consulta...",
  contactEmail: "contato@magalhaesesoares.adv.br",
  formEndpoint: ""                    // ver seção "Formulário" abaixo
};
```
> Todos os botões de WhatsApp do site (flutuante, cabeçalho, equipe, contato, rodapé) usam esse número
> automaticamente — basta alterar em um lugar.

### 2. Dados que aparecem no texto  → `index.html`
- **Nome da advogada, OAB, formação e bio** → seção `#equipe` (o site está configurado para **uma advogada**; a segunda sócia poderá ser adicionada duplicando o `<article class="lawyer">` e removendo a classe `team-grid--single`)
- **Endereço, telefone, e-mail, horário** → seção `#contato` e rodapé
- **Cidade / SEO local** → `<title>`, `<meta name="description">`, `<meta name="keywords">` (ex.: "advogada em [sua cidade]")
- **Número da OAB da sociedade** → rodapé (`.footer__oab`)
- **Redes sociais** → links de Instagram/LinkedIn no rodapé e na equipe
- **Dados estruturados (Schema.org)** → blocos `<script type="application/ld+json">` no `<head>`

### 3. Imagens  → pasta `assets/`
Os arquivos `.svg` são placeholders elegantes. Substitua por **fotos profissionais reais**:
- `advogada-magalhaes.svg` / `advogada-soares.svg` → retratos (proporção 4:5)
- `hero.svg` → imagem institucional do hero (proporção 4:5)
- `sobre.svg` → ambiente do escritório (proporção 5:6)
- `og-cover.svg` → imagem de compartilhamento em redes sociais

> Você pode manter o nome do arquivo (trocando o conteúdo) **ou** trocar o `src` no HTML.
> Para fotos, prefira `.webp`/`.jpg` otimizados. Mantenha os atributos `width`/`height` e `alt`.
>
> **OG image:** para a prévia de compartilhamento (WhatsApp/Facebook/LinkedIn), o ideal é exportar um
> **PNG/JPG de 1200×630 px** e atualizar as tags `og:image`/`twitter:image`. SVG nem sempre é
> renderizado pelas redes sociais.

### 4. Domínio  → substitua `https://www.magalhaesesoares.adv.br/`
Aparece em: `canonical`, Open Graph, `sitemap.xml` e `robots.txt`.

---

## ✉️ Formulário de contato

Por padrão (sem back-end), ao enviar o formulário ele **abre o aplicativo de e-mail** do visitante já
preenchido. Para receber as mensagens automaticamente, use um serviço de formulários:

**Formspree (gratuito para começar):**
1. Crie um formulário em https://formspree.io e copie o endpoint (ex.: `https://formspree.io/f/abcdwxyz`).
2. Em `js/main.js`, preencha `formEndpoint` no `CONFIG`.

Outras opções equivalentes: **Netlify Forms**, **Web3Forms**, **Getform**. O formulário já valida campos,
tem proteção anti-spam (honeypot) e exige consentimento (LGPD).

---

## 🗺️ Google Maps & Google Meu Negócio

- **Mapa:** a seção de contato usa um `<iframe>` do Google Maps. Para fixar o endereço exato, no
  Google Maps clique em **Compartilhar → Incorporar um mapa**, copie o `src` e substitua o do `index.html`.
- **Google Meu Negócio (Perfil da Empresa):** cadastre o escritório em
  https://business.google.com para aparecer nas buscas e no mapa. Os dados estruturados `LegalService`
  já incluídos no site reforçam essa presença. Mantenha nome, endereço e telefone **idênticos** aos do perfil.

---

## 🚀 Publicação (deploy)

Por ser estático, publica em segundos:

| Serviço | Como |
|---|---|
| **Netlify** | Arraste a pasta em app.netlify.com/drop |
| **Vercel** | `vercel` na pasta, ou importe o repositório |
| **GitHub Pages** | Suba os arquivos e ative Pages nas configurações |
| **Hospedagem tradicional** | Envie tudo via FTP para a pasta pública (`public_html`) |

Configure HTTPS (todos os serviços acima oferecem certificado gratuito).

---

## ⚖️ Conformidade ética (importante)

O conteúdo foi redigido para respeitar o Provimento nº 205/2021 e o Código de Ética da OAB:

- ❌ Sem promessas de resultado ou menção a valores/honorários;
- ❌ Sem linguagem mercantilista, sensacionalista ou de captação de clientela;
- ✅ Tom informativo, sóbrio e discreto;
- ✅ Depoimentos sem divulgação de resultados, com identificação preservada;
- ✅ Avisos de que o conteúdo é informativo e não substitui orientação individualizada.

Ao inserir dados reais, mantenha esse padrão. **Recomenda-se revisão por profissional responsável antes da publicação.**

---

## ♿ Acessibilidade & desempenho

- HTML semântico, navegação por teclado, foco visível, *skip link* e textos alternativos;
- Suporte a `prefers-reduced-motion` (reduz animações);
- Sem dependências externas além das fontes do Google (carregadas com `display=swap`);
- Imagens com `loading="lazy"` e dimensões definidas (evita deslocamento de layout).

Sugestão: rode o **Lighthouse** (DevTools do Chrome) após inserir as fotos reais para conferir as pontuações.
