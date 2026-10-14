/**
 * Kaycee Studio Pro - Central Data Store & Mock Database
 * Supports Multi-Account TikTok, Contracts, Ads/Promo, Game Events, and AI Context
 */

const STORAGE_KEY = 'kaycee_studio_data_v1';

export const INITIAL_DATA = {
  activeAccount: 'all', // 'gaming', 'lifestyle', 'all'
  
  accounts: {
    gaming: {
      id: 'gaming',
      handle: '@kaycee.gaming',
      displayName: 'Kaycee 🎮 MLBB & Valorant',
      category: 'Gaming & Esports',
      avatar: '/assets/avatar.jpg',
      bio: 'Pro Gamer & Content Creator 🚀 Daily Highlights, Tutorial, & Live Streaming | Business: mgmt@kayceestudio.id',
      followers: 842500,
      following: 184,
      totalLikes: 18400000,
      totalViewsMonth: 14820000,
      engagementRate: 9.4,
      estMonthlyRevenue: 38500000,
      avgWatchTime: '32s',
      completionRate: '68%',
      weeklyGrowth: '+12.4K',
      accentColor: '#00f2fe'
    },
    lifestyle: {
      id: 'lifestyle',
      handle: '@kaycee.lifestyle',
      displayName: 'Kaycee ✨ Daily & Setup',
      category: 'Lifestyle & Tech Vlogs',
      avatar: '/assets/setup_thumb.jpg',
      bio: 'Behind The Scenes of a Streamer ☕ Setup Aesthetic, Tech Reviews & Life Vlog | Managed by Kaycee Studio',
      followers: 318200,
      following: 240,
      totalLikes: 6200000,
      totalViewsMonth: 5410000,
      engagementRate: 8.1,
      estMonthlyRevenue: 18200000,
      avgWatchTime: '42s',
      completionRate: '62%',
      weeklyGrowth: '+5.8K',
      accentColor: '#ff0050'
    }
  },

  videos: [
    {
      id: 'vid-101',
      accountId: 'gaming',
      title: 'Clutch 1v4 di Rank Mythic Glory pake Fanny! Musuh auto surrender 😱🔥',
      cover: '/assets/avatar.jpg',
      sound: 'Original Sound - Kaycee Beats (Speed Up)',
      duration: '0:52',
      postDate: '12 Okt 2026',
      status: 'Published',
      views: 1420000,
      likes: 185400,
      comments: 6420,
      shares: 14300,
      viralScore: 98,
      tags: ['#MobileLegends', '#MLBB', '#FannyGameplay', '#GamingTips'],
      isSponsored: false,
      isViral: true
    },
    {
      id: 'vid-102',
      accountId: 'gaming',
      title: 'ROG Phone 9 Pro Gaming Test! Rata Kanan 120 FPS Anti Panas? 📱⚡',
      cover: '/assets/setup_thumb.jpg',
      sound: 'Epic Cyberpunk Synthwave - ROG Anthem',
      duration: '1:12',
      postDate: '10 Okt 2026',
      status: 'Published',
      views: 890000,
      likes: 92300,
      comments: 4120,
      shares: 8900,
      viralScore: 92,
      tags: ['#ROGPhone9', '#ASUSROG', '#GamingPhone', '#TechReview'],
      isSponsored: true,
      sponsorBrand: 'ASUS ROG',
      isViral: true
    },
    {
      id: 'vid-103',
      accountId: 'lifestyle',
      title: 'Aesthetic Gaming Room Tour 2026! Cozy Setup Kaycee Studio ✨🎧',
      cover: '/assets/setup_thumb.jpg',
      sound: 'Lofi Chill Morning Beats - Cozy Studio',
      duration: '1:35',
      postDate: '08 Okt 2026',
      status: 'Published',
      views: 1150000,
      likes: 142000,
      comments: 7800,
      shares: 21500,
      viralScore: 96,
      tags: ['#RoomTour', '#DeskSetup', '#CozyGaming', '#KayceeStudio'],
      isSponsored: false,
      isViral: true
    },
    {
      id: 'vid-104',
      accountId: 'gaming',
      title: 'Settingan Sensitivitas Valorant Pro 2026! Auto Headshot Tiap Ronde 🎯',
      cover: '/assets/event_banner.jpg',
      sound: 'Phonk Gaming Beats - Midnight Drive',
      duration: '0:45',
      postDate: '05 Okt 2026',
      status: 'Published',
      views: 640000,
      likes: 74200,
      comments: 3100,
      shares: 11200,
      viralScore: 88,
      tags: ['#Valorant', '#ValorantIndo', '#CrosshairTips', '#FPSGamer'],
      isSponsored: false,
      isViral: false
    },
    {
      id: 'vid-105',
      accountId: 'lifestyle',
      title: 'Unboxing Kursi Sultan Secretlab Titan Evo! Punggung auto terselamatkan 💺',
      cover: '/assets/setup_thumb.jpg',
      sound: 'Smooth Ambient Grooves - Minimal',
      duration: '1:05',
      postDate: '02 Okt 2026',
      status: 'Published',
      views: 480000,
      likes: 56100,
      comments: 2400,
      shares: 5300,
      viralScore: 84,
      tags: ['#Secretlab', '#ErgonomicChair', '#Unboxing', '#StreamerSetup'],
      isSponsored: true,
      sponsorBrand: 'Secretlab',
      isViral: false
    },
    {
      id: 'vid-106',
      accountId: 'gaming',
      title: 'Reaction Hero Baru Mobile Legends! Bakal Langganan Banned di Turnamen? 🤔',
      cover: '/assets/avatar.jpg',
      sound: 'Original Voice - Kaycee Reaction',
      duration: '0:58',
      postDate: '29 Sep 2026',
      status: 'Published',
      views: 710000,
      likes: 81200,
      comments: 4850,
      shares: 9400,
      viralScore: 89,
      tags: ['#MLBBUpdate', '#HeroBaru', '#MobileLegendsBangBang', '#GamingReview'],
      isSponsored: false,
      isViral: false
    }
  ],

  contracts: [
    {
      id: 'ctr-001',
      brand: 'ASUS ROG Indonesia',
      brandColor: '#ff0050',
      brandInitial: 'ROG',
      projectTitle: 'ROG Phone 9 Pro Exclusive Launch Campaign',
      category: 'Tech Hardware Endorsement',
      value: 45000000,
      startDate: '01 Okt 2026',
      endDate: '15 Nov 2026',
      status: 'active', // active, review, pending, completed, draft
      paymentStatus: 'DP 50% Paid (Rp 22.500.000)',
      targetAccount: '@kaycee.gaming',
      deliverables: [
        { id: 'd1', task: '1 Dedicated TikTok Video Review (Min 60 detik)', done: true },
        { id: 'd2', task: '1 Short Gameplay Reel Benchmark 120 FPS', done: true },
        { id: 'd3', task: '1 Live Stream Showcase 2 Jam bersama Penonton', done: false },
        { id: 'd4', task: '2 IG Story Swipe-Up Link ke Tokopedia ROG', done: false }
      ],
      notes: 'Wajib mention Snapdragon 8 Elite & fitur bypass charging. Dilarang sebut brand kompetitor selama masa kampanye.'
    },
    {
      id: 'ctr-002',
      brand: 'Moonton Indonesia',
      brandColor: '#4facfe',
      brandInitial: 'MLBB',
      projectTitle: 'M6 World Championship Official Creator Watch Party',
      category: 'Esports Streaming & Promotion',
      value: 35000000,
      startDate: '10 Okt 2026',
      endDate: '30 Nov 2026',
      status: 'active',
      paymentStatus: 'Net 30 (After Final Report)',
      targetAccount: '@kaycee.gaming',
      deliverables: [
        { id: 'd5', task: '3x Live Watch Party Babak Playoffs (Min 3 jam/stream)', done: true },
        { id: 'd6', task: '2x TikTok Highlights Momen Epik M6', done: false },
        { id: 'd7', task: 'Sematkan Banner & Hashtag Resmi #M6WatchParty', done: true }
      ],
      notes: 'Prioritas match tim perwakilan Indonesia (Fnatic ONIC / RRQ Hoshi).'
    },
    {
      id: 'ctr-003',
      brand: 'Hoyoverse (Genshin Impact)',
      brandColor: '#8b5cf6',
      brandInitial: 'HYV',
      projectTitle: 'Genshin Impact Ver 5.2 Creator Showcase Program',
      category: 'Game Publisher Campaign',
      value: 28000000,
      startDate: '20 Okt 2026',
      endDate: '10 Des 2026',
      status: 'review',
      paymentStatus: 'DP 30% Waiting Approval',
      targetAccount: '@kaycee.gaming',
      deliverables: [
        { id: 'd8', task: '1 Video Gacha & First Impression Karakter Baru', done: false },
        { id: 'd9', task: '1 Guide Eksplorasi Map Baru Natlan TikTok', done: false },
        { id: 'd10', task: 'Link Download Resmi di Bio TikTok selama 14 hari', done: false }
      ],
      notes: 'Brief sudah masuk, sedang review klausul hak cipta materi audio stream.'
    },
    {
      id: 'ctr-004',
      brand: 'Secretlab Gaming Indonesia',
      brandColor: '#10b981',
      brandInitial: 'SL',
      projectTitle: 'Annual Gaming Setup Ergonomic Ambassador 2026',
      category: 'Lifestyle & Setup Endorsement',
      value: 22000000,
      startDate: '15 Sep 2026',
      endDate: '15 Okt 2026',
      status: 'completed',
      paymentStatus: 'Fully Paid (Rp 22.000.000)',
      targetAccount: '@kaycee.lifestyle',
      deliverables: [
        { id: 'd11', task: '1 Dedicated TikTok Video Room Tour + Unboxing', done: true },
        { id: 'd12', task: 'Kursi selalu terlihat di live stream Kaycee', done: true },
        { id: 'd13', task: 'Distribusi kode voucher affiliate SECRETLAB-KC', done: true }
      ],
      notes: 'Kampanye sukses! Penjualan melebihi target 140%.'
    },
    {
      id: 'ctr-005',
      brand: 'Tokopedia Gaming Hub',
      brandColor: '#00f2fe',
      brandInitial: 'TKP',
      projectTitle: 'Mega Campaign Top-up Game & Gear 11.11',
      category: 'E-Commerce Affiliate & Promo',
      value: 12500000,
      startDate: '25 Okt 2026',
      endDate: '12 Nov 2026',
      status: 'pending',
      paymentStatus: 'Menunggu Pelunasan Invoice',
      targetAccount: 'all',
      deliverables: [
        { id: 'd14', task: '2 Video TikTok Edukasi Cashback 50% Top-Up', done: false },
        { id: 'd15', task: 'Broadcast Telegram & Discord Community link', done: false }
      ],
      notes: 'Invoice Rp 12.500.000 sudah dikirim ke tim finance Tokopedia.'
    }
  ],

  adsPromo: {
    codes: [
      {
        id: 'promo-1',
        code: 'KAYCEEROG',
        brand: 'ASUS ROG Indonesia',
        discount: 'Diskon 10% + Merchandise',
        uses: 1420,
        grossSales: 148500000,
        commissionRate: '10%',
        commissionEarned: 14850000,
        status: 'Active'
      },
      {
        id: 'promo-2',
        code: 'KAYCEETOPUP',
        brand: 'UniPin / MLBB Diamond',
        discount: 'Bonus 15% Diamonds',
        uses: 4890,
        grossSales: 174000000,
        commissionRate: '15%',
        commissionEarned: 26100000,
        status: 'Active'
      },
      {
        id: 'promo-3',
        code: 'SECRETLAB-KC',
        brand: 'Secretlab Indonesia',
        discount: 'Potongan Rp 500.000',
        uses: 36,
        grossSales: 288000000,
        commissionRate: '6%',
        commissionEarned: 17280000,
        status: 'Active'
      },
      {
        id: 'promo-4',
        code: 'KAYCEEKBD',
        brand: 'Noir Custom Keyboard',
        discount: 'Free Deskmat + 8% Off',
        uses: 610,
        grossSales: 54900000,
        commissionRate: '8%',
        commissionEarned: 4392000,
        status: 'Expired'
      }
    ],

    pipeline: [
      {
        id: 'pipe-1',
        stage: 'Scripting',
        client: 'Genshin Impact',
        title: 'Script Walkthrough Natlan & Gacha 60 Detik',
        budget: 28000000,
        targetDate: '18 Okt 2026',
        priority: 'High'
      },
      {
        id: 'pipe-2',
        stage: 'In Production',
        client: 'ASUS ROG',
        title: 'Video 2: Showcase Fitur AirTrigger & Bypass Charging',
        budget: 45000000,
        targetDate: '20 Okt 2026',
        priority: 'Urgent'
      },
      {
        id: 'pipe-3',
        stage: 'Client Review',
        client: 'Logitech G',
        title: 'Review Mouse Pro X Superlight 2 DEX White',
        budget: 16000000,
        targetDate: '22 Okt 2026',
        priority: 'Medium'
      },
      {
        id: 'pipe-4',
        stage: 'Live & Active',
        client: 'UniPin Gaming',
        title: 'Video Sketsa Top-Up Anti Rugi 100% Cepat',
        budget: 15000000,
        targetDate: '12 Okt 2026',
        priority: 'High'
      }
    ]
  },

  gameEvents: [
    {
      id: 'event-1',
      title: 'MPL Indonesia Season 14 Grand Finals Watch Party',
      game: 'Mobile Legends: Bang Bang',
      badgeColor: '#4facfe',
      bannerImage: '/assets/event_banner.jpg',
      date: '2026-10-18T15:00:00',
      displayDate: '18 Okt 2026, 15:00 WIB',
      platform: 'TikTok Live & Restream',
      organizer: 'Moonton Esports Indonesia',
      creatorFee: 20000000,
      status: 'Upcoming',
      targetAccount: '@kaycee.gaming',
      requirements: [
        'Live stream minimal 3 jam per match',
        'Gunakan hashtag #MPLIDS14 #M6WatchParty',
        'Tampilkan logo official sponsor MPL di overlay OBS',
        'Interaksi tebak skor berhadiah diamond untuk viewers'
      ],
      prepChecklist: [
        { task: 'Download OBS Overlay & Assets resmi MPL S14', done: true },
        { task: 'Setup restream link & tes audio mikrofon studio', done: true },
        { task: 'Siapkan giveaway diamond 5.000 MLBB sponsor', done: false },
        { task: 'Schedule TikTok Live event & buat video teaser', done: false }
      ]
    },
    {
      id: 'event-2',
      title: 'Genshin Impact Ver 5.2 Special Program Showcase',
      game: 'Genshin Impact (Hoyoverse)',
      badgeColor: '#8b5cf6',
      bannerImage: '/assets/setup_thumb.jpg',
      date: '2026-10-23T19:00:00',
      displayDate: '23 Okt 2026, 19:00 WIB',
      platform: 'TikTok Dedicated Video & Live Co-Stream',
      organizer: 'Hoyoverse Global',
      creatorFee: 15000000,
      status: 'Upcoming',
      targetAccount: '@kaycee.gaming',
      requirements: [
        'Tayangkan reaksi update karakter baru Natlan',
        'Pin link download resmi di kolom komentar TikTok',
        'Buat video rangkuman kode redeem primogems 300'
      ],
      prepChecklist: [
        { task: 'Daftar server preview creator beta', done: true },
        { task: 'Riset lore & kit karakter baru', done: false },
        { task: 'Siapkan template video TikTok cepat begitu livestream usai', done: false }
      ]
    },
    {
      id: 'event-3',
      title: 'Valorant Community Cup: Creator All-Stars Showmatch',
      game: 'VALORANT (Riot Games)',
      badgeColor: '#ff0050',
      bannerImage: '/assets/avatar.jpg',
      date: '2026-10-28T20:00:00',
      displayDate: '28 Okt 2026, 20:00 WIB',
      platform: 'TikTok Live Showmatch',
      organizer: 'Riot Games Southeast Asia',
      creatorFee: 12000000,
      status: 'Upcoming',
      targetAccount: '@kaycee.gaming',
      requirements: [
        'Main 3 match Best of 3 bareng 4 content creator pilihan',
        'Custom lobby khusus spectator broadcaster',
        'Highlight clutch wajib diunggah ke TikTok max 24 jam'
      ],
      prepChecklist: [
        { task: 'Lock line-up tim streamer (Kaycee Squad)', done: true },
        { task: 'Latihan scrim bareng 1 sesi', done: false },
        { task: 'Atur sound alert & custom crosshair fun', done: true }
      ]
    },
    {
      id: 'event-4',
      title: 'Monster Hunter Wilds Closed Creator Beta Stream',
      game: 'Monster Hunter Wilds (Capcom)',
      badgeColor: '#10b981',
      bannerImage: '/assets/event_banner.jpg',
      date: '2026-11-04T18:00:00',
      displayDate: '04 Nov 2026, 18:00 WIB',
      platform: 'TikTok Gaming Live',
      organizer: 'Capcom Asia',
      creatorFee: 18000000,
      status: 'Upcoming',
      targetAccount: '@kaycee.gaming',
      requirements: [
        'Hunting monster baru bareng viewer selama 4 jam',
        'Review performa grafis di PC gaming studio'
      ],
      prepChecklist: [
        { task: 'Klaim early access key Steam dari Capcom', done: true },
        { task: 'Pre-load game data 70 GB', done: false }
      ]
    }
  ],

  hermesConfig: {
    endpoint: '/api/hermes',
    model: 'Kaycee',
    localPort: 20128,
    status: 'connected'
  },

  aiChatHistory: [
    {
      sender: 'bot',
      timestamp: 'Baru saja',
      text: `Halo Kaycee. Hermes AI siap membantu. Saya terhubung dengan analitik akun TikTok, kontrak aktif, kampanye ads, dan jadwal event studio Anda. Apa yang ingin dicek hari ini?`
    }
  ]
};

/**
 * Load persisted data or fallback to INITIAL_DATA
 */
export function getStudioData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStudioData(INITIAL_DATA);
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed reading localStorage, using initial data', err);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

/**
 * Save updated data back to localStorage
 */
export function saveStudioData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed saving to localStorage', err);
  }
}

/**
 * Reset data to default demo state
 */
export function resetStudioData() {
  localStorage.removeItem(STORAGE_KEY);
  return getStudioData();
}

/**
 * Save or update a TikTok account
 */
export function saveOrUpdateAccount(data, account) {
  if (!data.accounts) data.accounts = {};
  
  if (!account.id) {
    account.id = 'acc_' + Date.now().toString(36);
  }
  
  data.accounts[account.id] = {
    id: account.id,
    handle: account.handle.startsWith('@') ? account.handle : `@${account.handle}`,
    displayName: account.displayName || account.handle,
    category: account.category || 'Creator',
    avatar: account.avatar || '/assets/avatar.jpg',
    bio: account.bio || 'TikTok Content Creator',
    followers: Number(account.followers) || 0,
    following: Number(account.following) || 0,
    totalLikes: Number(account.totalLikes) || 0,
    totalViewsMonth: Number(account.totalViewsMonth) || 0,
    engagementRate: Number(account.engagementRate) || 0,
    estMonthlyRevenue: Number(account.estMonthlyRevenue) || 0,
    avgWatchTime: account.avgWatchTime || '35s',
    completionRate: account.completionRate || '65%',
    weeklyGrowth: account.weeklyGrowth || '+0%',
    accentColor: account.accentColor || '#00f2fe'
  };

  data.activeAccount = account.id;
  saveStudioData(data);
  return account.id;
}

/**
 * Delete a connected account
 */
export function deleteConnectedAccount(data, accountId) {
  if (data.accounts && data.accounts[accountId]) {
    delete data.accounts[accountId];
    
    // Also remove or re-tag videos from that account
    if (data.videos) {
      data.videos = data.videos.filter(v => v.accountId !== accountId);
    }

    const remainingKeys = Object.keys(data.accounts);
    data.activeAccount = remainingKeys.length > 0 ? remainingKeys[0] : 'all';
    saveStudioData(data);
  }
}

/**
 * Clear all demo/ghost accounts and videos for a clean slate
 */
export function clearAllAccounts(data) {
  data.accounts = {};
  data.videos = [];
  data.activeAccount = 'all';
  saveStudioData(data);
}
