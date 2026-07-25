// Birthday Surprise Website Configuration
const CONFIG = {
  // Passcode Settings
  // The correct passcode to unlock the website. Recommended: numeric DOB in DDMMYYYY format.
  // Default: '03081994' (representing Aug 3rd, 1994)
  passcode: "03081994",

  // Personal Information
  name: "Golu Molu", // Main cute name
  nickname: "Gudiya", // Secondary cute name
  title: "Mam", // Respectful cute name (e.g., Mam, Dear)
  dob: "03-08-1994", // Date of Birth format: YYYY-MM-DD for live age statistics calculation

  // Visual Assets
  // You can use relative local paths (e.g., 'assets/photo.jpg') or absolute URLs.
  images: {
    polaroidPlaceholder: "assets/Image 1.jpg", // Image for the password page polaroid
    memoryImage: "assets/Image 2.jpg", // Large full-screen memory image
    letterPhoto: "assets/Image 1.jpg", // Small photo inside the love letter
  },

  // Audio / Music Settings
  // A soft, romantic background piano/instrumental track URL.
  // Plays automatically after passcode unlock.
  musicUrl: "assets/Happy Birthday.mp3", // Configurable royalty-free mp3 track

  // Cinematic Loader Phrases
  // Shown sequentially during the premium full-screen loading page.
  loaderPhrases: [
    "Hey Gurl...",
    "Loading Your Birthday Surprise...",
    "Collecting Beautiful Memories...",
    "Preparing Something Special...",
    "Almost Ready...",
    "Surprise Incoming... ✨",
  ],

  // Birthday Reveal Heading
  birthdayHeading: "HAPPY BIRTHDAY DEAREST ONE",
  birthdaySubtitle: "Today Is All About You",

  // Memory Image Quotes
  memoryHeading: "Happy Birthday My First Mentor",
  memoryQuote:
    "“More than just love, you gave me care, respect, wisdom, and the strength to believe in myself. You will always be my mentor and my greatest blessing.”",

  // Love Letter Content
  letterContent: {
    greeting: "My Dearest Golu Molu, Gudiya, Mam,",
    paragraphs: [
      "There are some people who walk into our lives and leave an impact that lasts forever, and you are one of those rare souls. ❤️ Your love, endless care, unwavering respect, and gentle guidance have shaped me in more ways than words can ever express. Every conversation with you teaches me something valuable, and every moment spent with you becomes a memory I'll cherish forever. Aap sirf ek special person nahi ho, aap meri mentor, meri guide aur meri biggest blessing ho.",
      "You have always inspired me to become a better version of myself. Your kindness, patience, confidence, and the way you handle every situation with so much grace make me admire you even more. Thank you for believing in me when I couldn't believe in myself, for encouraging me when I needed someone the most, and for always standing beside me. I honestly feel lucky that life gave me someone like you.",
      "Ek baat jo main dil se kehna chahta hoon... I never want to lose you. Sach mein, I can never afford to lose someone like you in my life. Some people become a chapter, but you've become a part of my story. No matter how busy life gets, kitni bhi problems aaye ya kitni bhi distance ho, I hope we always choose each other, stay connected, and keep creating beautiful memories together and aap meri family ho na ki koi part",
      "Aur jab hum buddhe ho jayenge... baal safed ho jayenge, face pe wrinkles aa jayenge, tab bhi I hope we'll still be sitting together, laughing over silly things, teasing each other, sharing chai, talking about our old memories and saying, 'Yaad hai woh din?' ❤️ That's the future I wish for. A bond that never fades, no matter how much time passes.",
      "Thank you for simply being you—for your love, your care, your respect, your guidance, and your beautiful heart. I promise to always value you, respect you, support you, and be there whenever you need me. No matter where life takes us, you'll always have a permanent place in my heart. I'm truly grateful that our paths crossed, and I pray they never part. ❤️",
    ],
    closing:
      "Aur last mein... bas itna hi kehna chahta hoon, I'm really sorry for every mistake I've made, for every time I raised my voice, got angry, or hurt you unknowingly. Mujhe pata hai main perfect nahi hoon, but I'm trying to become better every single day. Bas ek promise chahiye... please never leave my side. I don't want a life where you're just a memory. I want a future where you're always a part of it. I just need you... always. ❤️",
    signature: "Forever Yours, Always & Forever ❤️",
  },

  // Interactive Birthday Cake Section
  cakeHeading: "Make A Wish",
  timerDuration: 15, // Countdown duration in seconds for making a wish

  // Wishes List
  // These wishes will float upwards continuously from the bottom-right during the cake section.
  floatingWishes: [
    "Happy Birthday Mam 🌟",
    "Happy Birthday Gudiya 💖",
    "Happy Birthday Golu Molu 💕",
    "Happy Birthday Dear 🌹",
    "Stay Blessed Forever ✨",
    "Keep Smiling Always 😊",
    "Lots Of Happiness 🦄",
    "Have An Amazing Year 🎂",
    "May All Your Dreams Come True 🌠",
    "Success & Joy 🌻",
    "Good Health & Peace 🕊️",
    "Sending Warm Hugs 🤗",
  ],

  // Grand Finale Messages
  finaleMessages: [
    "🌠 May All Your Wishes Come True",
    "💖 May Happiness Follow You Everywhere",
    "✨ You Deserve Every Beautiful Thing In Life",
    "🎂 Happy Birthday Once Again",
    "❤️ Forever Special, Forever Loved",
    "🤍 Please Never Think of Leaving Me... You're My Family.",
    "🏡 You're Not Just Special to Me, You're Home.",
    "🫂 No Matter What Happens, I'll Always Need You in My Life.",
    "💞 Some Bonds Are Forever... I Hope Ours Is One of Them.",
    "🌸 Thank You for Being My Family, My Safe Place, and My Greatest Blessing.",
  ],
};
