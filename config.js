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
    polaroidPlaceholder: "assets/birthday_girl.jpg", // Image for the password page polaroid
    memoryImage: "assets/birthday_girl.jpg", // Large full-screen memory image
    letterPhoto: "assets/birthday_girl.jpg", // Small photo inside the love letter
  },

  // Audio / Music Settings
  // A soft, romantic background piano/instrumental track URL.
  // Plays automatically after passcode unlock.
  musicUrl:
    "assets/Happy Birthday.mp3", // Configurable royalty-free mp3 track

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
  birthdayHeading: "HAPPY BIRTHDAY GOLU MOLU",
  birthdaySubtitle: "Today Is All About You",

  // Memory Image Quotes
  memoryHeading: "Happy Birthday Mam",
  memoryQuote:
    "“In the garden of my life, you are the most beautiful flower. Thank you for bringing so much light, grace, and happiness into this world.”",

  // Love Letter Content
  letterContent: {
    greeting: "My Dearest Golu Molu, Gudiya, Mam,",
    paragraphs: [
      "On this beautiful and magical day, I wanted to take a moment to write down what you truly mean to me. Words often fall short when trying to express the immense respect, gratitude, and appreciation I have for you. You are not just a wonderful presence; you are a spark of pure joy and grace in my life.",
      "From our cutest little moments and deep conversations to the beautiful memories we’ve shared, every second has been an absolute treasure. Your laughter is contagious, your confidence is inspiring, and your kindness is a gentle reminder of the goodness in the world.",
      "As you step into this new year of your life, I wish you endless happiness, robust health, and the courage to chase every single one of your dreams. May this year bring you closer to all the grand achievements you deserve. Believe in yourself as much as I believe in you, and watch the world unfold its magic for you.",
      "Thank you for simply being you—for being so special, so bright, and so incredibly unique. I am forever grateful to have you in my journey.",
    ],
    closing: "With all my love, respect, and warmest wishes,",
    signature: "Forever Yours ❤️",
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
  ],
};
