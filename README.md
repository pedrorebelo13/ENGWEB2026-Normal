# ENGWEB2026-Normal
# ENGWEB2026 — Exame de Época Normal

**UC:** Engenharia Web — 3º ano LEI  
**Data:** 25 de Maio de 2026  
**Aluno:** A104091 

---

## Estrutura do Repositório

```
ENGWEB2026-Normal/
├── README.md
├── ex1/                         # Exercício 1 — API Jogos de Tabuleiro
│   ├── queries.txt              # Queries MongoDB (1.2)
│   ├── docker-compose.yml
│   └── api-dados/
│       ├── Dockerfile
│       ├── app.js
│       ├── swagger.json
│       ├── package.json
│       ├── dados/
│       │   └── jogos.json       # Dataset (27 jogos)
│       ├── models/
│       │   └── jogosModel.js
│       ├── controllers/
│       │   └── jogosController.js
│       └── routes/
│           └── jogosRouter.js
└── ex2/                         # Exercício 2 — Reading List
    ├── docker-compose.yml
    ├── api-dados/
    │   ├── Dockerfile
    │   ├── app.js
    │   ├── package.json
    │   ├── dados/
    │   │   └── livros.json      # Dataset inicial (6 livros)
    │   ├── models/
    │   │   └── livrosModel.js
    │   ├── controllers/
    │   │   └── livrosController.js
    │   └── routes/
    │       └── livrosRouter.js
    └── interface/
        ├── Dockerfile
        ├── server.js
        ├── package.json
        └── index.html
```

---

## Exercício 1 — API de Jogos de Tabuleiro

### 1.1 Persistência de Dados e Setup da Base de Dados

**Base de dados:** MongoDB  
**Nome da BD:** `jogostabuleiro`  
**Nome da coleção:** `jogos`

O dataset fornecido (`jogos.json`) contém 27 jogos de tabuleiro. O campo `id` do ficheiro original foi mapeado para `_id` no documento MongoDB (campo string, não ObjectId), para preservar os identificadores semânticos do dataset (ex: `"catan"`, `"ticket-to-ride"`).

Cada documento tem a seguinte estrutura:

```json
{
  "_id": "catan",
  "name": "Catan",
  "year": 1995,
  "category": "Family",
  "minPlayers": 3,
  "maxPlayers": 4,
  "playingTimeMinutes": 120,
  "descriptionEN": "...",
  "autores":   [{ "_id": "klaus-teuber", "name": "Klaus Teuber" }],
  "editoras":  [{ "_id": "kosmos", "name": "KOSMOS", "country": "Germany" }],
  "mecanicas": [{ "_id": "dice-rolling", "name": "Dice Rolling" }],
  "premios":   [{ "_id": "sdj-1995", "name": "Spiel des Jahres", "year": 1995 }]
}
```

**Importação manual (se necessário, fora do Docker):**

```bash
mongoimport --db jogostabuleiro --collection jogos --jsonArray --file ex1/api-dados/dados/jogos.json
```

> Com Docker Compose, a importação é feita automaticamente pelo seed no arranque da API (ver secção de execução).

### 1.2 Queries MongoDB

As queries encontram-se em `ex1/queries.txt`.


### 1.3 API de Dados — Rotas Disponíveis

A API corre na **porta 17000** e expõe as seguintes rotas:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/jogos` | Lista todos os jogos (`_id`, `name`, `year`, `category`, `minPlayers`) |
| GET | `/jogos?editora=EEEE` | Filtra jogos pela editora (`_id`, `name`, `year`) |
| GET | `/jogos/:id` | Retorna toda a informação de um jogo |
| POST | `/jogos` | Cria um novo jogo |
| PUT | `/jogos/:id` | Atualiza um jogo existente |
| DELETE | `/jogos/:id` | Remove um jogo |
| GET | `/autores` | Lista de autores ordenada alfabeticamente, com os seus jogos |
| GET | `/categorias` | Lista de categorias ordenada alfabeticamente, com os seus jogos |
| GET | `/api-docs` | Interface Swagger |

### Executar o Exercício 1 com Docker Compose

pode correr com 
```bash
npm i
npm start
```
ou 

```bash
cd ex1
docker compose up --build
```

Após o arranque:
- **API:** http://localhost:17000/jogos
- **Swagger:** http://localhost:17000/api-docs

Para parar e remover volumes:
```bash
docker compose down -v
```

---

## Exercício 2 — Reading List (Engenharia Reversa)

### 2.1 Modelo de Dados (Mongoose)

Derivado da análise da interface Vue.js fornecida, o modelo `Livro` tem os seguintes campos:

```js
// models/livrosModel.js
const livrosSchema = new mongoose.Schema({
    titulo:  { type: String,  required: true },
    autor:   { type: String,  required: true },
    paginas: { type: Number,  required: true },
    genero:  { type: String,  required: true },
    lido:    { type: Boolean, default: false }
});
```

- `titulo`, `autor`, `paginas`, `genero` — enviados no POST pela interface
- `lido` — estado booleano alterado via PUT; começa a `false` por omissão

**Base de dados:** MongoDB  
**Nome da BD:** `livrosDB`  
**Nome da coleção:** `livros` (gerado automaticamente pelo Mongoose a partir do modelo `Livro`)

### 2.2 Dataset Inicial

O ficheiro `ex2/api-dados/dados/livros.json` contém 6 registos exemplificativos que são inseridos automaticamente na primeira vez que a API arranca (quando a coleção está vazia):

```json
[
  { "titulo": "Os Maias",                  "autor": "Eça de Queirós",           "paginas": 714, "genero": "Romance",             "lido": true  },
  { "titulo": "1984",                       "autor": "George Orwell",             "paginas": 328, "genero": "Ficção Distópica",    "lido": false },
  { "titulo": "Ensaio sobre a Cegueira",    "autor": "José Saramago",             "paginas": 312, "genero": "Ficção",              "lido": true  },
  { "titulo": "O Senhor dos Anéis",         "autor": "J.R.R. Tolkien",            "paginas": 423, "genero": "Fantasia",            "lido": false },
  { "titulo": "O Principezinho",            "autor": "Antoine de Saint-Exupéry",  "paginas": 96,  "genero": "Fábula",             "lido": true  },
  { "titulo": "Duna",                       "autor": "Frank Herbert",             "paginas": 412, "genero": "Ficção Científica",   "lido": false }
]
```

### 2.3 API de Dados — Endpoints

A API corre na **porta 19020** e implementa os seguintes endpoints esperados pela interface:

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/livros` | Lista todos os livros (suporta `?search=X` para filtrar por título ou autor) |
| POST | `/api/livros` | Cria um novo livro (body: `titulo`, `autor`, `paginas`, `genero`) |
| PUT | `/api/livros/:id` | Altera o estado `lido` do livro identificado |
| DELETE | `/api/livros/:id` | Remove o livro identificado |

### 2.4 Arquitetura Docker


- **MongoDB** — apenas acessível internamente (sem mapeamento de portas externas)
- **API de dados** — exposta na porta `19020`
- **Interface** — ficheiro `index.html` servido via Nginx na porta `19021`

### Executar o Exercício 2 com Docker Compose

```bash
cd ex2
docker compose up --build
```

Após o arranque (pode demorar alguns segundos até o MongoDB estar pronto):
- **Interface:** http://localhost:19021
- **API:** http://localhost:19020/api/livros

Para parar e remover volumes:
```bash
docker compose down -v
```

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- Portas `17000`, `19020` e `19021` disponíveis na máquina host

## Notas

- O seed da base de dados é feito automaticamente no arranque da API (apenas se a coleção estiver vazia), pelo que não é necessário importar dados manualmente.
- A API do ex2 tem retry logic na ligação ao MongoDB para evitar falhas de race condition no arranque dos containers.