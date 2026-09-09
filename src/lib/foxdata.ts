export type Learner = {
  id: string;
  name: string;
  emoji: string;
  level: string;
  desc: string;
  pin?: string;
  pro?: boolean;
};

export const learners: Learner[] = [
  {
    id: "ty",
    name: "Bé Tý",
    emoji: "🐭",
    level: "Cấp 1 · Mầm non",
    desc: "Làm quen chữ cái, màu sắc và bài hát vui nhộn",
  },
  {
    id: "mao",
    name: "Bé Mão",
    emoji: "🐱",
    level: "Cấp 2 · Tiểu học",
    desc: "Đọc truyện ngắn, học Phonics và Pinyin cơ bản",
  },
  {
    id: "dau",
    name: "Bé Dậu",
    emoji: "🐔",
    level: "Cấp 3 · Nâng cao",
    desc: "Truyện dài, hội thoại và trò chơi thử thách",
  },
  {
    id: "bome",
    name: "Bố & Mẹ",
    emoji: "🔒",
    level: "Pro Zone · Người lớn",
    desc: "Luyện nói Shadowing đời sống & công việc",
    pin: "1234",
    pro: true,
  },
];

export type Story = {
  id: string;
  title: string;
  titleEn: string;
  titleZh: string;
  level: string;
  minutes: number;
  color: string;
  emoji: string;
  summary: string;
  lang: "Anh" | "Trung";
  lines: { en: string; zh: string; pinyin: string; vi: string }[];
};

export const stories: Story[] = [
  {
    id: "little-fox-garden",
    lang: "Anh",
    title: "Cáo Nhỏ và khu vườn",
    titleEn: "Little Fox in the Garden",
    titleZh: "小狐狸的花园",
    level: "Cấp 1",
    minutes: 4,
    color: "peach",
    emoji: "🦊",
    summary: "Cáo Nhỏ trồng những hạt giống đầu tiên và học tên các loài hoa.",
    lines: [
      { en: "Little Fox has a small garden.", zh: "小狐狸有一个小花园。", pinyin: "Xiǎo húli yǒu yí gè xiǎo huāyuán.", vi: "Cáo Nhỏ có một khu vườn nhỏ." },
      { en: "He plants three red seeds.", zh: "他种了三颗红色的种子。", pinyin: "Tā zhòng le sān kē hóngsè de zhǒngzi.", vi: "Cậu ấy gieo ba hạt giống màu đỏ." },
      { en: "The sun is warm and bright.", zh: "太阳又暖又亮。", pinyin: "Tàiyáng yòu nuǎn yòu liàng.", vi: "Mặt trời thật ấm áp và rực rỡ." },
      { en: "Look! A little flower!", zh: "看！一朵小花！", pinyin: "Kàn! Yì duǒ xiǎo huā!", vi: "Nhìn kìa! Một bông hoa nhỏ!" },
    ],
  },
  {
    id: "rainy-day",
    lang: "Trung",
    title: "Ngày mưa của Mèo Mão",
    titleEn: "A Rainy Day",
    titleZh: "下雨天",
    level: "Cấp 2",
    minutes: 6,
    color: "sky",
    emoji: "☔",
    summary: "Mèo Mão quên mang ô và gặp một người bạn tốt bụng.",
    lines: [
      { en: "It is raining today.", zh: "今天下雨了。", pinyin: "Jīntiān xià yǔ le.", vi: "Hôm nay trời mưa." },
      { en: "Mao forgot his umbrella.", zh: "小猫忘了带雨伞。", pinyin: "Xiǎo māo wàng le dài yǔsǎn.", vi: "Mão quên mang ô." },
      { en: "Can I share with you?", zh: "我可以和你一起吗？", pinyin: "Wǒ kěyǐ hé nǐ yìqǐ ma?", vi: "Mình che chung nhé?" },
      { en: "Thank you, my friend!", zh: "谢谢你，我的朋友！", pinyin: "Xièxie nǐ, wǒ de péngyou!", vi: "Cảm ơn bạn nhé!" },
    ],
  },
  {
    id: "market-day",
    lang: "Trung",
    title: "Đi chợ cùng bà",
    titleEn: "Market Day",
    titleZh: "赶集的日子",
    level: "Cấp 2",
    minutes: 7,
    color: "mint",
    emoji: "🧺",
    summary: "Học tên rau củ, số đếm và cách hỏi giá bằng hai thứ tiếng.",
    lines: [
      { en: "How much is one apple?", zh: "一个苹果多少钱？", pinyin: "Yí gè píngguǒ duōshao qián?", vi: "Một quả táo bao nhiêu tiền?" },
      { en: "Five apples, please.", zh: "请给我五个苹果。", pinyin: "Qǐng gěi wǒ wǔ gè píngguǒ.", vi: "Cho cháu năm quả táo ạ." },
      { en: "The carrots look fresh.", zh: "胡萝卜看起来很新鲜。", pinyin: "Húluóbo kàn qǐlái hěn xīnxiān.", vi: "Cà rốt trông tươi quá." },
      { en: "Grandma smiles happily.", zh: "奶奶开心地笑了。", pinyin: "Nǎinai kāixīn de xiào le.", vi: "Bà mỉm cười vui vẻ." },
    ],
  },
  {
    id: "space-trip",
    lang: "Anh",
    title: "Chuyến bay lên mặt trăng",
    titleEn: "Trip to the Moon",
    titleZh: "月球之旅",
    level: "Cấp 3",
    minutes: 9,
    color: "lilac",
    emoji: "🚀",
    summary: "Gà Dậu lái phi thuyền và kể lại hành trình bằng thì quá khứ.",
    lines: [
      { en: "We built a paper rocket.", zh: "我们做了一个纸火箭。", pinyin: "Wǒmen zuò le yí gè zhǐ huǒjiàn.", vi: "Chúng mình làm một chiếc tên lửa giấy." },
      { en: "Three, two, one… lift off!", zh: "三、二、一……发射！", pinyin: "Sān, èr, yī… fāshè!", vi: "Ba, hai, một… phóng!" },
      { en: "The stars were everywhere.", zh: "星星到处都是。", pinyin: "Xīngxing dàochù dōu shì.", vi: "Những vì sao ở khắp mọi nơi." },
      { en: "What an amazing journey!", zh: "多么奇妙的旅程！", pinyin: "Duōme qímiào de lǚchéng!", vi: "Một hành trình tuyệt vời làm sao!" },
    ],
  },
];

export type Song = {
  id: string;
  title: string;
  lang: "Anh" | "Trung";
  level: string;
  emoji: string;
  color: string;
  lyrics: { line: string; vi: string }[];
};

export const songs: Song[] = [
  {
    id: "abc-fox",
    title: "ABC cùng Cáo Nhỏ",
    lang: "Anh",
    level: "Cấp 1",
    emoji: "🔤",
    color: "peach",
    lyrics: [
      { line: "A is for apple, red and sweet", vi: "A là quả táo, đỏ và ngọt" },
      { line: "B is for ball, bounce with your feet", vi: "B là quả bóng, nảy cùng đôi chân" },
      { line: "C is for cat, soft and small", vi: "C là chú mèo, mềm và nhỏ xinh" },
    ],
  },
  {
    id: "two-tigers",
    title: "两只老虎 · Hai chú hổ",
    lang: "Trung",
    level: "Cấp 1",
    emoji: "🐯",
    color: "mint",
    lyrics: [
      { line: "两只老虎，两只老虎 (Liǎng zhī lǎohǔ)", vi: "Hai chú hổ, hai chú hổ" },
      { line: "跑得快，跑得快 (Pǎo de kuài)", vi: "Chạy thật nhanh, chạy thật nhanh" },
      { line: "真奇怪，真奇怪 (Zhēn qíguài)", vi: "Thật kỳ lạ, thật kỳ lạ" },
    ],
  },
  {
    id: "rainbow-colors",
    title: "Rainbow Colors",
    lang: "Anh",
    level: "Cấp 2",
    emoji: "🌈",
    color: "sky",
    lyrics: [
      { line: "Red and orange, yellow too", vi: "Đỏ và cam, vàng nữa nhé" },
      { line: "Green and blue and purple, too", vi: "Xanh lá, xanh dương và tím nữa" },
    ],
  },
  {
    id: "counting-zh",
    title: "数字歌 · Bài hát số đếm",
    lang: "Trung",
    level: "Cấp 2",
    emoji: "🔢",
    color: "lilac",
    lyrics: [
      { line: "一二三四五 (Yī èr sān sì wǔ)", vi: "Một hai ba bốn năm" },
      { line: "上山打老虎 (Shàng shān dǎ lǎohǔ)", vi: "Lên núi gặp chú hổ" },
    ],
  },
];

export type Game = {
  id: string;
  title: string;
  desc: string;
  emoji: string;
  color: string;
  kind: "match" | "quiz" | "listen";
};

export const games: Game[] = [
  { id: "match-word", title: "Ghép từ Anh – Việt", desc: "Chạm đúng cặp từ để nhận sao", emoji: "🧩", color: "peach", kind: "match" },
  { id: "phonics-quiz", title: "Đố vui Phonics", desc: "Chọn âm đầu đúng của mỗi từ", emoji: "🎯", color: "mint", kind: "quiz" },
  { id: "pinyin-tone", title: "Nghe thanh điệu Pinyin", desc: "Đoán thanh điệu của từ tiếng Trung", emoji: "🎧", color: "sky", kind: "quiz" },
  { id: "memory-zoo", title: "Lật thẻ sở thú", desc: "Nhớ vị trí các con vật song ngữ", emoji: "🦁", color: "lilac", kind: "match" },
];

export const matchPairs = [
  { en: "apple", vi: "quả táo", zh: "苹果" },
  { en: "cat", vi: "con mèo", zh: "猫" },
  { en: "rain", vi: "mưa", zh: "雨" },
  { en: "moon", vi: "mặt trăng", zh: "月亮" },
  { en: "book", vi: "quyển sách", zh: "书" },
  { en: "flower", vi: "bông hoa", zh: "花" },
];

export const quizQuestions = [
  { q: "Từ “fish” bắt đầu bằng âm nào?", options: ["/f/", "/v/", "/th/"], answer: 0 },
  { q: "Từ “ship” bắt đầu bằng âm nào?", options: ["/s/", "/sh/", "/ch/"], answer: 1 },
  { q: "Chữ “māo” (猫) mang thanh điệu nào?", options: ["Thanh 1", "Thanh 2", "Thanh 4"], answer: 0 },
  { q: "Từ “cheese” bắt đầu bằng âm nào?", options: ["/ch/", "/k/", "/s/"], answer: 0 },
  { q: "Chữ “mǎ” (马) mang thanh điệu nào?", options: ["Thanh 2", "Thanh 3", "Thanh 4"], answer: 1 },
];

export const phonicsGroups = [
  { group: "Nhóm 1 · Âm đơn", items: [
    { sound: "/s/", word: "sun", vi: "mặt trời", emoji: "☀️" },
    { sound: "/a/", word: "ant", vi: "con kiến", emoji: "🐜" },
    { sound: "/t/", word: "tap", vi: "vòi nước", emoji: "🚰" },
    { sound: "/p/", word: "pin", vi: "cái ghim", emoji: "📌" },
  ]},
  { group: "Nhóm 2 · Âm ghép", items: [
    { sound: "/sh/", word: "ship", vi: "con tàu", emoji: "🚢" },
    { sound: "/ch/", word: "chair", vi: "cái ghế", emoji: "🪑" },
    { sound: "/th/", word: "three", vi: "số ba", emoji: "3️⃣" },
    { sound: "/ng/", word: "king", vi: "vua", emoji: "👑" },
  ]},
  { group: "Nhóm 3 · Nguyên âm dài", items: [
    { sound: "/ai/", word: "rain", vi: "mưa", emoji: "🌧️" },
    { sound: "/ee/", word: "tree", vi: "cái cây", emoji: "🌳" },
    { sound: "/oa/", word: "boat", vi: "con thuyền", emoji: "⛵" },
    { sound: "/oo/", word: "moon", vi: "mặt trăng", emoji: "🌙" },
  ]},
];

export const pinyinGroups = [
  { group: "Thanh mẫu (phụ âm)", items: ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s"] },
  { group: "Vận mẫu (nguyên âm)", items: ["a", "o", "e", "i", "u", "ü", "ai", "ei", "ao", "ou", "an", "en", "ang", "eng", "ong"] },
];

export const pinyinTones = [
  { tone: "Thanh 1 ˉ", example: "mā 妈", vi: "mẹ", note: "Cao và đều" },
  { tone: "Thanh 2 ˊ", example: "má 麻", vi: "cây gai", note: "Đi lên" },
  { tone: "Thanh 3 ˇ", example: "mǎ 马", vi: "con ngựa", note: "Xuống rồi lên" },
  { tone: "Thanh 4 ˋ", example: "mà 骂", vi: "mắng", note: "Xuống dứt khoát" },
];

export const shadowingSets = [
  {
    id: "daily",
    title: "Đời sống hằng ngày",
    emoji: "🏠",
    lines: [
      { en: "Could you help me with this, please?", zh: "你能帮我一下吗？", vi: "Bạn giúp mình một chút được không?" },
      { en: "I'd like a table for two, please.", zh: "我想要一张两人桌。", vi: "Cho tôi bàn hai người nhé." },
      { en: "How do I get to the station?", zh: "去车站怎么走？", vi: "Đi tới nhà ga thế nào ạ?" },
    ],
  },
  {
    id: "work",
    title: "Giao tiếp công việc",
    emoji: "💼",
    lines: [
      { en: "Let's schedule a follow-up meeting.", zh: "我们再安排一次后续会议。", vi: "Mình hẹn một buổi họp tiếp theo nhé." },
      { en: "I'll send you the report by Friday.", zh: "我周五之前把报告发给你。", vi: "Tôi sẽ gửi báo cáo trước thứ Sáu." },
      { en: "Could you clarify that point?", zh: "这一点能再说明一下吗？", vi: "Bạn làm rõ ý đó giúp mình nhé?" },
    ],
  },
];

export const starterVocab = [
  { en: "apple", zh: "苹果", pinyin: "píngguǒ", vi: "quả táo" },
  { en: "moon", zh: "月亮", pinyin: "yuèliang", vi: "mặt trăng" },
  { en: "friend", zh: "朋友", pinyin: "péngyou", vi: "bạn bè" },
];
