export const currentUserId = 'u1'

export const users = [
  {
    id: 'u1',
    name: 'Rodrigo M.',
    username: 'rodrigopsique',
    bio: 'Interesso-me por psicologia, escuta ativa e bem-estar emocional no ambiente digital.',
    avatar: 'RD',
    cover:
      'linear-gradient(135deg, rgba(236, 122, 74, 0.95), rgba(162, 58, 46, 0.95))',
    following: ['u2', 'u3', 'u4'],
    followers: ['u2', 'u4', 'u5'],
    location: 'Sao Paulo, BR',
    website: 'psiconet.org/rodrigo',
    joinedAt: 'May 2026',
  },
  {
    id: 'u2',
    name: 'Dra. Mariana Costa',
    username: 'marianacosta.psi',
    bio: 'Psicologa clinica, interessada em ansiedade, rotina emocional e acolhimento online.',
    avatar: 'MP',
    cover:
      'linear-gradient(135deg, rgba(236, 176, 74, 0.92), rgba(232, 112, 63, 0.92))',
    following: ['u1', 'u3'],
    followers: ['u1', 'u3', 'u4'],
    location: 'Recife, BR',
    website: 'marianacosta.psi.br',
    joinedAt: 'April 2025',
  },
  {
    id: 'u3',
    name: 'Caio Mendes',
    username: 'caioterapia',
    bio: 'Estudante de psicologia compartilhando reflexoes sobre vinculo, escuta e autocuidado.',
    avatar: 'CA',
    cover:
      'linear-gradient(135deg, rgba(30, 88, 140, 0.94), rgba(19, 54, 98, 0.94))',
    following: ['u1'],
    followers: ['u1', 'u2'],
    location: 'Curitiba, BR',
    website: 'caioterapia.com',
    joinedAt: 'January 2024',
  },
  {
    id: 'u4',
    name: 'Lia Araujo',
    username: 'lia.menteleve',
    bio: 'Escrevo sobre autoestima, relacoes saudaveis e pequenos rituais de presenca.',
    avatar: 'LF',
    cover:
      'linear-gradient(135deg, rgba(56, 132, 111, 0.94), rgba(31, 94, 77, 0.94))',
    following: ['u1', 'u2'],
    followers: ['u1', 'u5'],
    location: 'Belo Horizonte, BR',
    website: 'menteleve.org',
    joinedAt: 'November 2025',
  },
  {
    id: 'u5',
    name: 'Nina F.',
    username: 'ninaemocional',
    bio: 'Compartilho leituras sobre saude mental, regulacao emocional e redes de apoio.',
    avatar: 'NQ',
    cover:
      'linear-gradient(135deg, rgba(97, 66, 160, 0.92), rgba(59, 39, 97, 0.92))',
    following: ['u4'],
    followers: ['u1'],
    location: 'Florianopolis, BR',
    website: 'ninaqa.dev',
    joinedAt: 'February 2026',
  },
]

export const posts = [
  {
    id: 'p1',
    authorId: 'u2',
    content:
      'Nem sempre o cansaco vem do corpo. As vezes ele nasce do excesso de alerta, da autocobranca e da dificuldade de descansar sem culpa.',
    createdAt: '2h',
    likes: ['u1', 'u3'],
    comments: [
      {
        id: 'c1',
        authorId: 'u1',
        content: 'Essa diferenca entre cansaco fisico e emocional faz muito sentido.',
      },
    ],
  },
  {
    id: 'p2',
    authorId: 'u3',
    content:
      'Escuta ativa nao e concordar com tudo. E oferecer presenca suficiente para que o outro consiga elaborar o que sente.',
    createdAt: '4h',
    likes: ['u1', 'u2', 'u4'],
    comments: [
      {
        id: 'c3',
        authorId: 'u4',
        content: 'Presenca sem julgamento muda completamente o rumo de uma conversa.',
      },
    ],
  },
  {
    id: 'p3',
    authorId: 'u4',
    content:
      'Uma rotina emocional saudavel nao precisa ser perfeita. Pequenos rituais de pausa e nomeacao dos sentimentos ja ajudam muito.',
    createdAt: '6h',
    likes: ['u2'],
    comments: [
      {
        id: 'c2',
        authorId: 'u5',
        content: 'Tenho tentado fazer isso no fim do dia e realmente traz mais clareza.',
      },
    ],
  },
  {
    id: 'p4',
    authorId: 'u5',
    content:
      'Rede de apoio tambem se constroi com mensagens simples: "como voce esta?" e "quer conversar?" podem ter muito peso.',
    createdAt: '9h',
    likes: ['u4'],
    comments: [
      {
        id: 'c4',
        authorId: 'u3',
        content: 'As vezes a disponibilidade genuina vale mais do que tentar dar conselhos.',
      },
    ],
  },
]
