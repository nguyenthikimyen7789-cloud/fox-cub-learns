export type LessonLine = { en: string; zh: string; pinyin: string; vi: string };
export type LessonVocab = {
  en: string;
  zh: string;
  pinyin: string;
  vi: string;
  emoji: string;
  exampleEn: string;
  exampleZh: string;
};
export type QuizItem = {
  prompt: string;
  audioEn: string;
  audioZh: string;
  options: { emoji: string; label: string }[];
  answer: number;
};
export type Lesson = {
  id: string;
  title: string;
  titleEn: string;
  titleZh: string;
  level: string;
  emoji: string;
  video: string;
  poster?: string;
  lines: LessonLine[];
  vocab: LessonVocab[];
  quiz: QuizItem[];
  worksheet: { pairs: { word: string; emoji: string; vi: string }[]; blanks: { sentence: string; answer: string }[] };
  next?: string;
};

const SAMPLE_VIDEO = "/__l5e/assets-v1/5eae1e5a-fa0a-4baa-9e5e-51c16755b274/lesson-sample.mp4";

export const SECONDS_PER_LINE = 4;

const gardenLines: LessonLine[] = [
  { en: "Hello! I am Little Fox.", zh: "你好！我是小狐狸。", pinyin: "Nǐ hǎo! Wǒ shì xiǎo húli.", vi: "Xin chào! Mình là Cáo Nhỏ." },
  { en: "This is my small garden.", zh: "这是我的小花园。", pinyin: "Zhè shì wǒ de xiǎo huāyuán.", vi: "Đây là khu vườn nhỏ của mình." },
  { en: "I have three red seeds.", zh: "我有三颗红色的种子。", pinyin: "Wǒ yǒu sān kē hóngsè de zhǒngzi.", vi: "Mình có ba hạt giống màu đỏ." },
  { en: "I dig a little hole.", zh: "我挖一个小洞。", pinyin: "Wǒ wā yí gè xiǎo dòng.", vi: "Mình đào một cái hố nhỏ." },
  { en: "I put the seed inside.", zh: "我把种子放进去。", pinyin: "Wǒ bǎ zhǒngzi fàng jìnqù.", vi: "Mình đặt hạt giống vào trong." },
  { en: "Now I need some water.", zh: "现在我需要一些水。", pinyin: "Xiànzài wǒ xūyào yìxiē shuǐ.", vi: "Bây giờ mình cần một ít nước." },
  { en: "The sun is warm and bright.", zh: "太阳又暖又亮。", pinyin: "Tàiyáng yòu nuǎn yòu liàng.", vi: "Mặt trời thật ấm áp và rực rỡ." },
  { en: "A bird sings in the tree.", zh: "一只鸟在树上唱歌。", pinyin: "Yì zhī niǎo zài shù shàng chànggē.", vi: "Một chú chim hót trên cây." },
  { en: "I wait for many days.", zh: "我等了很多天。", pinyin: "Wǒ děng le hěn duō tiān.", vi: "Mình chờ rất nhiều ngày." },
  { en: "Look! A little green leaf!", zh: "看！一片小绿叶！", pinyin: "Kàn! Yí piàn xiǎo lǜ yè!", vi: "Nhìn kìa! Một chiếc lá xanh nhỏ!" },
  { en: "The plant grows taller.", zh: "小苗长高了。", pinyin: "Xiǎo miáo zhǎng gāo le.", vi: "Cây con lớn cao hơn rồi." },
  { en: "One red flower opens.", zh: "一朵红花开了。", pinyin: "Yì duǒ hóng huā kāi le.", vi: "Một bông hoa đỏ nở ra." },
  { en: "A butterfly comes to visit.", zh: "一只蝴蝶飞过来。", pinyin: "Yì zhī húdié fēi guòlái.", vi: "Một chú bướm bay tới thăm." },
  { en: "My garden is beautiful.", zh: "我的花园很漂亮。", pinyin: "Wǒ de huāyuán hěn piàoliang.", vi: "Khu vườn của mình thật đẹp." },
  { en: "Thank you for learning with me!", zh: "谢谢你和我一起学习！", pinyin: "Xièxie nǐ hé wǒ yìqǐ xuéxí!", vi: "Cảm ơn bạn đã học cùng mình!" },
];

const rainyLines: LessonLine[] = [
  { en: "It is raining today.", zh: "今天下雨了。", pinyin: "Jīntiān xià yǔ le.", vi: "Hôm nay trời mưa." },
  { en: "Mao forgot his umbrella.", zh: "小猫忘了带雨伞。", pinyin: "Xiǎo māo wàng le dài yǔsǎn.", vi: "Mão quên mang ô." },
  { en: "He stands by the door.", zh: "他站在门口。", pinyin: "Tā zhàn zài ménkǒu.", vi: "Cậu ấy đứng ở cửa." },
  { en: "A friend walks to him.", zh: "一个朋友走过来。", pinyin: "Yí gè péngyou zǒu guòlái.", vi: "Một người bạn đi tới." },
  { en: "Can I share with you?", zh: "我可以和你一起吗？", pinyin: "Wǒ kěyǐ hé nǐ yìqǐ ma?", vi: "Mình che chung nhé?" },
  { en: "They walk under one umbrella.", zh: "他们在一把伞下走。", pinyin: "Tāmen zài yì bǎ sǎn xià zǒu.", vi: "Hai bạn đi chung một chiếc ô." },
  { en: "The rain sounds like music.", zh: "雨声像音乐。", pinyin: "Yǔ shēng xiàng yīnyuè.", vi: "Tiếng mưa nghe như tiếng nhạc." },
  { en: "Thank you, my friend!", zh: "谢谢你，我的朋友！", pinyin: "Xièxie nǐ, wǒ de péngyou!", vi: "Cảm ơn bạn nhé!" },
];

const marketLines: LessonLine[] = [
  { en: "Today we go to the market.", zh: "今天我们去market。", pinyin: "Jīntiān wǒmen qù shìchǎng.", vi: "Hôm nay chúng mình đi chợ." },
  { en: "How much is one apple?", zh: "一个苹果多少钱？", pinyin: "Yí gè píngguǒ duōshao qián?", vi: "Một quả táo bao nhiêu tiền?" },
  { en: "Five apples, please.", zh: "请给我五个苹果。", pinyin: "Qǐng gěi wǒ wǔ gè píngguǒ.", vi: "Cho cháu năm quả táo ạ." },
  { en: "The carrots look fresh.", zh: "胡萝卜看起来很新鲜。", pinyin: "Húluóbo kàn qǐlái hěn xīnxiān.", vi: "Cà rốt trông tươi quá." },
  { en: "I like green vegetables.", zh: "我喜欢绿色的蔬菜。", pinyin: "Wǒ xǐhuān lǜsè de shūcài.", vi: "Cháu thích rau xanh." },
  { en: "Grandma pays the money.", zh: "奶奶付钱。", pinyin: "Nǎinai fù qián.", vi: "Bà trả tiền." },
  { en: "The basket is full now.", zh: "篮子满了。", pinyin: "Lánzi mǎn le.", vi: "Cái giỏ đã đầy rồi." },
  { en: "Grandma smiles happily.", zh: "奶奶开心地笑了。", pinyin: "Nǎinai kāixīn de xiào le.", vi: "Bà mỉm cười vui vẻ." },
];

const spaceLines: LessonLine[] = [
  { en: "We built a paper rocket.", zh: "我们做了一个纸火箭。", pinyin: "Wǒmen zuò le yí gè zhǐ huǒjiàn.", vi: "Chúng mình làm một chiếc tên lửa giấy." },
  { en: "We wore silver helmets.", zh: "我们戴上银色头盔。", pinyin: "Wǒmen dài shàng yínsè tóukuī.", vi: "Chúng mình đội mũ bảo hiểm bạc." },
  { en: "Three, two, one… lift off!", zh: "三、二、一……发射！", pinyin: "Sān, èr, yī… fāshè!", vi: "Ba, hai, một… phóng!" },
  { en: "The stars were everywhere.", zh: "星星到处都是。", pinyin: "Xīngxing dàochù dōu shì.", vi: "Những vì sao ở khắp mọi nơi." },
  { en: "The moon looked very close.", zh: "月亮看起来很近。", pinyin: "Yuèliang kàn qǐlái hěn jìn.", vi: "Mặt trăng trông thật gần." },
  { en: "We jumped on grey dust.", zh: "我们在灰色的尘土上跳。", pinyin: "Wǒmen zài huīsè de chéntǔ shàng tiào.", vi: "Chúng mình nhảy trên lớp bụi xám." },
  { en: "Then we flew back home.", zh: "然后我们飞回家。", pinyin: "Ránhòu wǒmen fēi huí jiā.", vi: "Sau đó chúng mình bay về nhà." },
  { en: "What an amazing journey!", zh: "多么奇妙的旅程！", pinyin: "Duōme qímiào de lǚchéng!", vi: "Một hành trình tuyệt vời làm sao!" },
];

export const lessons: Lesson[] = [
  {
    id: "little-fox-garden",
    title: "Cáo Nhỏ và khu vườn",
    titleEn: "Little Fox in the Garden",
    titleZh: "小狐狸的花园",
    level: "Cấp 1 · Mầm non",
    emoji: "🦊",
    video: SAMPLE_VIDEO,
    lines: gardenLines,
    next: "rainy-day",
    vocab: [
      { en: "garden", zh: "花园", pinyin: "huāyuán", vi: "khu vườn", emoji: "🌷", exampleEn: "This is my small garden.", exampleZh: "这是我的小花园。" },
      { en: "seed", zh: "种子", pinyin: "zhǒngzi", vi: "hạt giống", emoji: "🌰", exampleEn: "I have three red seeds.", exampleZh: "我有三颗红色的种子。" },
      { en: "water", zh: "水", pinyin: "shuǐ", vi: "nước", emoji: "💧", exampleEn: "Now I need some water.", exampleZh: "现在我需要一些水。" },
      { en: "sun", zh: "太阳", pinyin: "tàiyáng", vi: "mặt trời", emoji: "☀️", exampleEn: "The sun is warm and bright.", exampleZh: "太阳又暖又亮。" },
      { en: "leaf", zh: "叶子", pinyin: "yèzi", vi: "chiếc lá", emoji: "🍃", exampleEn: "Look! A little green leaf!", exampleZh: "看！一片小绿叶！" },
      { en: "flower", zh: "花", pinyin: "huā", vi: "bông hoa", emoji: "🌸", exampleEn: "One red flower opens.", exampleZh: "一朵红花开了。" },
      { en: "butterfly", zh: "蝴蝶", pinyin: "húdié", vi: "con bướm", emoji: "🦋", exampleEn: "A butterfly comes to visit.", exampleZh: "一只蝴蝶飞过来。" },
      { en: "bird", zh: "鸟", pinyin: "niǎo", vi: "con chim", emoji: "🐦", exampleEn: "A bird sings in the tree.", exampleZh: "一只鸟在树上唱歌。" },
    ],
    quiz: [
      { prompt: "The sun is warm and bright.", audioEn: "The sun is warm and bright.", audioZh: "太阳又暖又亮。", options: [{ emoji: "☀️", label: "mặt trời" }, { emoji: "🌙", label: "mặt trăng" }], answer: 0 },
      { prompt: "One red flower opens.", audioEn: "One red flower opens.", audioZh: "一朵红花开了。", options: [{ emoji: "🌸", label: "bông hoa" }, { emoji: "🍎", label: "quả táo" }], answer: 0 },
      { prompt: "A butterfly comes to visit.", audioEn: "A butterfly comes to visit.", audioZh: "一只蝴蝶飞过来。", options: [{ emoji: "🐝", label: "con ong" }, { emoji: "🦋", label: "con bướm" }], answer: 1 },
      { prompt: "Now I need some water.", audioEn: "Now I need some water.", audioZh: "现在我需要一些水。", options: [{ emoji: "🔥", label: "lửa" }, { emoji: "💧", label: "nước" }], answer: 1 },
      { prompt: "A bird sings in the tree.", audioEn: "A bird sings in the tree.", audioZh: "一只鸟在树上唱歌。", options: [{ emoji: "🐦", label: "con chim" }, { emoji: "🐟", label: "con cá" }], answer: 0 },
    ],
    worksheet: {
      pairs: [
        { word: "flower", emoji: "🌸", vi: "bông hoa" },
        { word: "sun", emoji: "☀️", vi: "mặt trời" },
        { word: "water", emoji: "💧", vi: "nước" },
        { word: "butterfly", emoji: "🦋", vi: "con bướm" },
      ],
      blanks: [
        { sentence: "The ____ is warm and bright.", answer: "sun" },
        { sentence: "One red ____ opens.", answer: "flower" },
        { sentence: "I have three red ____.", answer: "seeds" },
      ],
    },
  },
  {
    id: "rainy-day",
    title: "Ngày mưa của Mèo Mão",
    titleEn: "A Rainy Day",
    titleZh: "下雨天",
    level: "Cấp 2 · Tiểu học",
    emoji: "☔",
    video: SAMPLE_VIDEO,
    lines: rainyLines,
    next: "market-day",
    vocab: [
      { en: "rain", zh: "雨", pinyin: "yǔ", vi: "mưa", emoji: "🌧️", exampleEn: "It is raining today.", exampleZh: "今天下雨了。" },
      { en: "umbrella", zh: "雨伞", pinyin: "yǔsǎn", vi: "cái ô", emoji: "☂️", exampleEn: "Mao forgot his umbrella.", exampleZh: "小猫忘了带雨伞。" },
      { en: "friend", zh: "朋友", pinyin: "péngyou", vi: "bạn bè", emoji: "🧑‍🤝‍🧑", exampleEn: "Thank you, my friend!", exampleZh: "谢谢你，我的朋友！" },
      { en: "door", zh: "门", pinyin: "mén", vi: "cửa", emoji: "🚪", exampleEn: "He stands by the door.", exampleZh: "他站在门口。" },
      { en: "music", zh: "音乐", pinyin: "yīnyuè", vi: "âm nhạc", emoji: "🎶", exampleEn: "The rain sounds like music.", exampleZh: "雨声像音乐。" },
    ],
    quiz: [
      { prompt: "It is raining today.", audioEn: "It is raining today.", audioZh: "今天下雨了。", options: [{ emoji: "🌧️", label: "trời mưa" }, { emoji: "☀️", label: "trời nắng" }], answer: 0 },
      { prompt: "Mao forgot his umbrella.", audioEn: "Mao forgot his umbrella.", audioZh: "小猫忘了带雨伞。", options: [{ emoji: "🎒", label: "cặp sách" }, { emoji: "☂️", label: "cái ô" }], answer: 1 },
      { prompt: "He stands by the door.", audioEn: "He stands by the door.", audioZh: "他站在门口。", options: [{ emoji: "🚪", label: "cửa" }, { emoji: "🪟", label: "cửa sổ" }], answer: 0 },
      { prompt: "A friend walks to him.", audioEn: "A friend walks to him.", audioZh: "一个朋友走过来。", options: [{ emoji: "🧑‍🤝‍🧑", label: "người bạn" }, { emoji: "🐕", label: "chú chó" }], answer: 0 },
      { prompt: "The rain sounds like music.", audioEn: "The rain sounds like music.", audioZh: "雨声像音乐。", options: [{ emoji: "🔇", label: "im lặng" }, { emoji: "🎶", label: "âm nhạc" }], answer: 1 },
    ],
    worksheet: {
      pairs: [
        { word: "rain", emoji: "🌧️", vi: "mưa" },
        { word: "umbrella", emoji: "☂️", vi: "cái ô" },
        { word: "door", emoji: "🚪", vi: "cửa" },
        { word: "music", emoji: "🎶", vi: "âm nhạc" },
      ],
      blanks: [
        { sentence: "It is ____ today.", answer: "raining" },
        { sentence: "Mao forgot his ____.", answer: "umbrella" },
        { sentence: "Thank you, my ____!", answer: "friend" },
      ],
    },
  },
  {
    id: "market-day",
    title: "Đi chợ cùng bà",
    titleEn: "Market Day",
    titleZh: "赶集的日子",
    level: "Cấp 2 · Tiểu học",
    emoji: "🧺",
    video: SAMPLE_VIDEO,
    lines: marketLines,
    next: "space-trip",
    vocab: [
      { en: "apple", zh: "苹果", pinyin: "píngguǒ", vi: "quả táo", emoji: "🍎", exampleEn: "How much is one apple?", exampleZh: "一个苹果多少钱？" },
      { en: "carrot", zh: "胡萝卜", pinyin: "húluóbo", vi: "cà rốt", emoji: "🥕", exampleEn: "The carrots look fresh.", exampleZh: "胡萝卜看起来很新鲜。" },
      { en: "money", zh: "钱", pinyin: "qián", vi: "tiền", emoji: "💰", exampleEn: "Grandma pays the money.", exampleZh: "奶奶付钱。" },
      { en: "basket", zh: "篮子", pinyin: "lánzi", vi: "cái giỏ", emoji: "🧺", exampleEn: "The basket is full now.", exampleZh: "篮子满了。" },
      { en: "vegetable", zh: "蔬菜", pinyin: "shūcài", vi: "rau", emoji: "🥬", exampleEn: "I like green vegetables.", exampleZh: "我喜欢绿色的蔬菜。" },
    ],
    quiz: [
      { prompt: "How much is one apple?", audioEn: "How much is one apple?", audioZh: "一个苹果多少钱？", options: [{ emoji: "🍎", label: "quả táo" }, { emoji: "🍌", label: "quả chuối" }], answer: 0 },
      { prompt: "The carrots look fresh.", audioEn: "The carrots look fresh.", audioZh: "胡萝卜看起来很新鲜。", options: [{ emoji: "🥔", label: "khoai tây" }, { emoji: "🥕", label: "cà rốt" }], answer: 1 },
      { prompt: "Grandma pays the money.", audioEn: "Grandma pays the money.", audioZh: "奶奶付钱。", options: [{ emoji: "💰", label: "tiền" }, { emoji: "📚", label: "sách" }], answer: 0 },
      { prompt: "The basket is full now.", audioEn: "The basket is full now.", audioZh: "篮子满了。", options: [{ emoji: "🧺", label: "cái giỏ" }, { emoji: "🪣", label: "cái xô" }], answer: 0 },
      { prompt: "I like green vegetables.", audioEn: "I like green vegetables.", audioZh: "我喜欢绿色的蔬菜。", options: [{ emoji: "🍰", label: "bánh ngọt" }, { emoji: "🥬", label: "rau xanh" }], answer: 1 },
    ],
    worksheet: {
      pairs: [
        { word: "apple", emoji: "🍎", vi: "quả táo" },
        { word: "carrot", emoji: "🥕", vi: "cà rốt" },
        { word: "money", emoji: "💰", vi: "tiền" },
        { word: "basket", emoji: "🧺", vi: "cái giỏ" },
      ],
      blanks: [
        { sentence: "How much is one ____?", answer: "apple" },
        { sentence: "The ____ is full now.", answer: "basket" },
        { sentence: "I like green ____.", answer: "vegetables" },
      ],
    },
  },
  {
    id: "space-trip",
    title: "Chuyến bay lên mặt trăng",
    titleEn: "Trip to the Moon",
    titleZh: "月球之旅",
    level: "Cấp 3 · Nâng cao",
    emoji: "🚀",
    video: SAMPLE_VIDEO,
    lines: spaceLines,
    next: "little-fox-garden",
    vocab: [
      { en: "rocket", zh: "火箭", pinyin: "huǒjiàn", vi: "tên lửa", emoji: "🚀", exampleEn: "We built a paper rocket.", exampleZh: "我们做了一个纸火箭。" },
      { en: "star", zh: "星星", pinyin: "xīngxing", vi: "ngôi sao", emoji: "⭐", exampleEn: "The stars were everywhere.", exampleZh: "星星到处都是。" },
      { en: "moon", zh: "月亮", pinyin: "yuèliang", vi: "mặt trăng", emoji: "🌙", exampleEn: "The moon looked very close.", exampleZh: "月亮看起来很近。" },
      { en: "helmet", zh: "头盔", pinyin: "tóukuī", vi: "mũ bảo hiểm", emoji: "🪖", exampleEn: "We wore silver helmets.", exampleZh: "我们戴上银色头盔。" },
      { en: "journey", zh: "旅程", pinyin: "lǚchéng", vi: "hành trình", emoji: "🧭", exampleEn: "What an amazing journey!", exampleZh: "多么奇妙的旅程！" },
    ],
    quiz: [
      { prompt: "We built a paper rocket.", audioEn: "We built a paper rocket.", audioZh: "我们做了一个纸火箭。", options: [{ emoji: "🚀", label: "tên lửa" }, { emoji: "🚌", label: "xe buýt" }], answer: 0 },
      { prompt: "The stars were everywhere.", audioEn: "The stars were everywhere.", audioZh: "星星到处都是。", options: [{ emoji: "🌊", label: "sóng biển" }, { emoji: "⭐", label: "ngôi sao" }], answer: 1 },
      { prompt: "The moon looked very close.", audioEn: "The moon looked very close.", audioZh: "月亮看起来很近。", options: [{ emoji: "🌙", label: "mặt trăng" }, { emoji: "☀️", label: "mặt trời" }], answer: 0 },
      { prompt: "We wore silver helmets.", audioEn: "We wore silver helmets.", audioZh: "我们戴上银色头盔。", options: [{ emoji: "🪖", label: "mũ bảo hiểm" }, { emoji: "🧤", label: "găng tay" }], answer: 0 },
      { prompt: "Then we flew back home.", audioEn: "Then we flew back home.", audioZh: "然后我们飞回家。", options: [{ emoji: "🏫", label: "trường học" }, { emoji: "🏠", label: "ngôi nhà" }], answer: 1 },
    ],
    worksheet: {
      pairs: [
        { word: "rocket", emoji: "🚀", vi: "tên lửa" },
        { word: "star", emoji: "⭐", vi: "ngôi sao" },
        { word: "moon", emoji: "🌙", vi: "mặt trăng" },
        { word: "helmet", emoji: "🪖", vi: "mũ bảo hiểm" },
      ],
      blanks: [
        { sentence: "We built a paper ____.", answer: "rocket" },
        { sentence: "The ____ looked very close.", answer: "moon" },
        { sentence: "What an amazing ____!", answer: "journey" },
      ],
    },
  },
];

export function getLesson(id: string) {
  return lessons.find((l) => l.id === id);
}
