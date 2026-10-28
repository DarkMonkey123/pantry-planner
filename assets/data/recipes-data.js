// Definimos as receitas direto em uma variavel global
const DEFAULT_RECIPES = [
  {
    "id": "rec_01",
    "title": "Omelete Recheado de Geladeira",
    "prepTimeMinutes": 15,
    "servings": 2,
    "ingredients": [
      { "name": "Ovo", "quantity": 3, "unit": "unid", "isBasic": false },
      { "name": "Tomate", "quantity": 1, "unit": "unid", "isBasic": false },
      { "name": "Queijo", "quantity": 50, "unit": "g", "isBasic": false },
      { "name": "Sal", "quantity": 1, "unit": "pitada", "isBasic": true },
      { "name": "Óleo", "quantity": 1, "unit": "colher de sopa", "isBasic": true }
    ],
    "instructions": [
      "Bata os ovos em um prato com uma pitada de sal.",
      "Pique o tomate e o queijo em cubos pequenos.",
      "Aqueça uma frigideira com um fio de óleo, despeje os ovos e adicione o recheio.",
      "Dobre ao meio quando dourar por baixo e sirva quente."
    ]
  },
  {
    "id": "rec_02",
    "title": "Macarrão Alho e Óleo com Toque de Ervas",
    "prepTimeMinutes": 20,
    "servings": 3,
    "ingredients": [
      { "name": "Macarrão", "quantity": 300, "unit": "g", "isBasic": false },
      { "name": "Alho", "quantity": 4, "unit": "dente", "isBasic": false },
      { "name": "Azeite", "quantity": 2, "unit": "colher de sopa", "isBasic": true },
      { "name": "Sal", "quantity": 1, "unit": "colher de sopa", "isBasic": true }
    ],
    "instructions": [
      "Cozinhe o macarrão em água fervente com sal até ficar al dente.",
      "Em uma frigideira, doure o alho fatiado no azeite em fogo baixo.",
      "Misture o macarrão escorrido na frigideira e envolva bem no azeite com alho."
    ]
  },
  {
    "id": "rec_03",
    "title": "Arroz Frito de Sobras (Arroz de Geladeira)",
    "prepTimeMinutes": 25,
    "servings": 4,
    "ingredients": [
      { "name": "Arroz", "quantity": 400, "unit": "g", "isBasic": false },
      { "name": "Ovo", "quantity": 2, "unit": "unid", "isBasic": false },
      { "name": "Cenoura", "quantity": 1, "unit": "unid", "isBasic": false },
      { "name": "Óleo", "quantity": 1, "unit": "colher de sopa", "isBasic": true },
      { "name": "Sal", "quantity": 1, "unit": "pitada", "isBasic": true }
    ],
    "instructions": [
      "Pique a cenoura em cubos bem pequenos.",
      "Refogue a cenoura em uma panela com óleo até amaciar.",
      "Empurre a cenoura para o canto da panela, quebre os ovos e mexa até cozinhar.",
      "Adicione o arroz cozido, misture tudo e acerte o sal."
    ]
  }
];