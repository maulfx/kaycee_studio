/**
 * Kaycee Studio Pro - Central Data Store
 * Default state: Clean Slate (0 mock/ghost data).
 * Real data must be connected or inputted by the user.
 */

const STORAGE_KEY = 'kaycee_studio_clean_v5';

/**
 * 100% Clean initial state - Zero ghost/dummy data
 */
export const INITIAL_DATA = {
  activeAccount: 'all',
  accounts: {},
  videos: [],
  contracts: [],
  adsPromo: {
    codes: [],
    pipeline: []
  },
  gameEvents: [],
  videoVault: [],
  sourceAssets: [],
  teamMembers: [
    {
      id: 'mem-01',
      name: 'Kaycee',
      email: 'owner@kayceestudio.com',
      role: 'Studio Owner & Creator',
      avatar: '/assets/avatar.jpg',
      status: 'Online',
      projectsCount: 0,
      isOwner: true
    }
  ],
  revenueGoal: 0,
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
      text: 'Halo Kaycee. Studio Anda siap digunakan. Hubungkan akun TikTok atau catat data kontrak dan video Anda.'
    }
  ]
};

/**
 * Optional sample data for users who want to preview the dashboard with demo data
 */
export const DEMO_DATA = {
  activeAccount: 'gaming',
  accounts: {
    gaming: {
      id: 'gaming',
      handle: '@kaycee.gaming',
      displayName: 'Kaycee MLBB & Valorant',
      category: 'Gaming & Esports',
      avatar: '/assets/avatar.jpg',
      bio: 'Daily Highlights & Gameplay MLBB / Valorant | Business: mgmt@kayceestudio.id',
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
      displayName: 'Kaycee Setup & Vlogs',
      category: 'Lifestyle & Tech',
      avatar: '/assets/setup_thumb.jpg',
      bio: 'Desk setup aesthetic, tech reviews, & life vlog | Kaycee Studio',
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
      title: 'Clutch 1v4 di Rank Mythic Glory pake Fanny',
      cover: '/assets/avatar.jpg',
      sound: 'Original Sound - Kaycee Beats',
      duration: '0:52',
      postDate: '12 Okt 2026',
      status: 'Published',
      views: 1420000,
      likes: 185400,
      comments: 6420,
      shares: 14300,
      viralScore: 98,
      tags: ['#MobileLegends', '#MLBB', '#GamingTips'],
      isSponsored: false,
      isViral: true
    },
    {
      id: 'vid-102',
      accountId: 'gaming',
      title: 'ROG Phone 9 Pro Gaming Test 120 FPS',
      cover: '/assets/setup_thumb.jpg',
      sound: 'Cyberpunk Synthwave',
      duration: '1:12',
      postDate: '10 Okt 2026',
      status: 'Published',
      views: 890000,
      likes: 92300,
      comments: 4120,
      shares: 8900,
      viralScore: 92,
      tags: ['#ROGPhone9', '#ASUSROG', '#TechReview'],
      isSponsored: true,
      sponsorBrand: 'ASUS ROG',
      isViral: true
    }
  ],
  contracts: [
    {
      id: 'ctr-01',
      brand: 'ASUS ROG Indonesia',
      title: 'ROG Phone 9 Pro Launch Campaign',
      logo: 'ROG',
      value: 45000000,
      status: 'active',
      startDate: '01 Okt 2026',
      endDate: '15 Nov 2026',
      targetAccount: '@kaycee.gaming',
      paymentTerms: [
        { term: 'DP 50% (Saat TTD Kontrak)', amount: 22500000, paid: true, dueDate: '02 Okt 2026' },
        { term: 'Pelunasan 50% (Setelah Semua Video Tayang)', amount: 22500000, paid: false, dueDate: '15 Nov 2026' }
      ],
      deliverables: [
        { task: '1 Video Dedicated Review TikTok 60-90 Detik', done: true, link: '#' },
        { task: '2 IG Story Swipe-Up Link ke Store', done: false, link: '' },
        { task: '1 Live Stream Showcase 2 Jam di TikTok Live', done: false, link: '' }
      ]
    }
  ],
  adsPromo: {
    codes: [
      {
        code: 'KAYCEEROG',
        brand: 'ASUS Official Store',
        discount: 'Diskon 10% (Maks Rp 500rb)',
        uses: 342,
        grossSales: 68400000,
        commissionRate: '5%',
        commissionEarned: 3420000,
        status: 'Active'
      }
    ],
    pipeline: [
      {
        id: 'camp-01',
        brand: 'SteelSeries',
        product: 'Arctis Nova 7 Headset',
        budget: 15000000,
        stage: 'Scripting',
        deadline: '24 Okt 2026',
        targetAccount: '@kaycee.gaming'
      }
    ]
  },
  gameEvents: [
    {
      id: 'event-01',
      title: 'MPL ID Season 14 Grand Finals Watch Party',
      game: 'Mobile Legends: Bang Bang',
      badgeColor: '#00f2fe',
      bannerImage: '/assets/event_banner.jpg',
      date: '2026-10-18T15:00:00',
      displayDate: '18 Okt 2026 • 15:00 WIB',
      platform: 'TikTok Live',
      organizer: 'Moonton Esports ID',
      creatorFee: 20000000,
      status: 'Upcoming',
      targetAccount: '@kaycee.gaming',
      requirements: ['Live stream watch party 4 jam', 'Giveaway skin turnamen'],
      prepChecklist: [
        { task: 'Download Asset & Overlay sponsor', done: true },
        { task: 'Tes Mikrofon & Game Capture', done: true },
        { task: 'Setting TikTok Live Stream Key', done: false }
      ]
    }
  ],
  revenueGoal: 100000000,
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
      text: 'Halo Kaycee. Data contoh demo sudah dimuat. Anda dapat menguji seluruh analitik TikTok, kontrak, ads, dan event game.'
    }
  ]
};

/**
 * Load persisted data or fallback to INITIAL_DATA (clean slate)
 */
export function getStudioData() {
  try {
    // Clear old versions with hardcoded ghost data
    localStorage.removeItem('kaycee_studio_data_v1');
    localStorage.removeItem('kaycee_studio_data_v2');
    localStorage.removeItem('kaycee_studio_clean_v3');
    localStorage.removeItem('kaycee_studio_clean_v4');

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
 * Reset data to clean empty state
 */
export function resetStudioData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return JSON.parse(JSON.stringify(INITIAL_DATA));
}

/**
 * Load Demo / Sample data on demand
 */
export function loadDemoData(data) {
  Object.assign(data, JSON.parse(JSON.stringify(DEMO_DATA)));
  saveStudioData(data);
  return data;
}

/**
 * Clear all data across all features (clean slate)
 */
export function clearEntireStudioData(data) {
  Object.assign(data, JSON.parse(JSON.stringify(INITIAL_DATA)));
  saveStudioData(data);
  return data;
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
    
    // Also remove videos from that account
    if (data.videos) {
      data.videos = data.videos.filter(v => v.accountId !== accountId);
    }

    const remainingKeys = Object.keys(data.accounts);
    data.activeAccount = remainingKeys.length > 0 ? remainingKeys[0] : 'all';
    saveStudioData(data);
  }
}

/**
 * Clear all accounts and videos
 */
export function clearAllAccounts(data) {
  data.accounts = {};
  data.videos = [];
  data.activeAccount = 'all';
  saveStudioData(data);
}
