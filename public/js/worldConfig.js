(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.WORLD_CONFIG = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  const WORLD_WIDTH = 2560;
  const WORLD_HEIGHT = 1200;
  const GRID_SIZE = 40;

  const PLAZA = {
    x: 900,
    y: 600,
    outerRadius: 210,
    stoneRadius: 128,
  };

  const MADING = {
    x: 900,
    y: 478,
    width: 84,
    height: 62,
    interactRadius: 72,
  };

  const GATE = {
    x: 900,
    y: 1030,
    width: 170,
    height: 64,
  };

  const PENDOPO = {
    x: 340,
    y: 385,
    w: 240,
    h: 185,
  };

  const POND = {
    ellipses: [
      { cx: 1320, cy: 650, rx: 122, ry: 92 },
      { cx: 1418, cy: 752, rx: 112, ry: 86 },
      { cx: 1300, cy: 766, rx: 98, ry: 70 },
    ],
  };

  const BRIDGE = {
    x: 1190,
    y: 668,
    w: 288,
    h: 58,
  };

  const FISHING_PIER = {
    x: 1218,
    y: 782,
    w: 118,
    h: 68,
  };

  const FISHING_BOARD = {
    x: 1168,
    y: 830,
  };

  const FISHING_CATCHES = [
    {
      id: 'ikan_mas',
      name: 'Ikan Mas',
      emoji: '🐟',
      points: 10,
      weight: 34,
      rare: false,
      bubble: 'Dapat Ikan Mas! 🐟 (+10 poin)',
    },
    {
      id: 'ikan_nila',
      name: 'Ikan Nila',
      emoji: '🐠',
      points: 15,
      weight: 28,
      rare: false,
      bubble: 'Dapat Ikan Nila! 🐠 (+15 poin)',
    },
    {
      id: 'koi_emas',
      name: 'Ikan Koi Emas',
      emoji: '🐟✨',
      points: 30,
      weight: 18,
      rare: true,
      bubble: 'Dapat Ikan Koi Emas! 🐟✨ (+30 poin)',
    },
    {
      id: 'lele_raksasa',
      name: 'Ikan Lele Raksasa',
      emoji: '🐋✨',
      points: 50,
      weight: 10,
      rare: true,
      bubble: 'Dapat Ikan Lele Raksasa! 🐋✨ (+50 poin)',
    },
    {
      id: 'sepatu_bot',
      name: 'Sepatu Bot Bekas',
      emoji: '🥾',
      points: 1,
      weight: 10,
      rare: false,
      bubble: 'Waduh, dapat Sepatu Bot Bekas! 🥾 (+1 poin)',
    },
  ];

  const NIGHT_MARKET = {
    bounds: { x: 1218, y: 90, w: 438, h: 228 },
    gate: { x: 1396, y: 318, width: 152, height: 54 },
    foodStalls: [
      {
        id: 'wedang',
        name: 'Kedai Kopi & Wedang Hangat',
        shortName: 'Kopi & Wedang',
        x: 1286,
        y: 146,
        icon: '☕',
        color: '#9c5d3b',
        stripe: '#f7e6c4',
        bubble: 'Menyeruput Kopi & Wedang Jahe hangat! ☕😋',
        interactRadius: 74,
      },
      {
        id: 'bakso',
        name: 'Stand Bakso & Sate',
        shortName: 'Bakso & Sate',
        x: 1392,
        y: 136,
        icon: '🍜',
        color: '#c44b3c',
        stripe: '#fff4df',
        bubble: 'Lagi jajan Bakso hangat nih! 🍜😋',
        interactRadius: 74,
      },
      {
        id: 'eskrim',
        name: 'Gerobak Es Krim & Manisan',
        shortName: 'Es Krim & Manisan',
        x: 1496,
        y: 146,
        icon: '🍦',
        color: '#4d9299',
        stripe: '#fde8ec',
        bubble: 'Segarnya Es Krim & Manisan pasar malam! 🍦✨',
        interactRadius: 74,
      },
    ],
    ferrisWheel: {
      id: 'ferris',
      name: 'Bianglala Mini',
      x: 1602,
      y: 170,
      wheelRadius: 38,
      cabinCount: 6,
      rideDurationMs: 10000,
      interactRadius: 88,
    },
    luckyWheel: {
      id: 'wheel',
      name: 'Roda Keberuntungan',
      x: 1284,
      y: 254,
      cooldownMs: 60000,
      interactRadius: 78,
    },
    stage: {
      id: 'stage',
      name: 'Panggung Hiburan Warga',
      x: 1492,
      y: 228,
      w: 124,
      h: 68,
      centerX: 1554,
      centerY: 262,
      performDurationMs: 25000,
    },
    wheelPrizes: [
      { id: 'pts_5', label: '+5 Poin Hiburan', points: 5, emoji: '🎈', funTitle: null, weight: 22 },
      { id: 'pts_10', label: '+10 Poin Hiburan', points: 10, emoji: '🎟️', funTitle: null, weight: 22 },
      { id: 'pts_15', label: '+15 Poin Hiburan', points: 15, emoji: '🌟', funTitle: null, weight: 18 },
      {
        id: 'title_jajan',
        label: 'Gelar "Raja Jajan 🍢" +10 Poin',
        points: 10,
        emoji: '🍢',
        funTitle: 'Raja Jajan 🍢',
        weight: 14,
      },
      {
        id: 'title_bintang',
        label: 'Gelar "Bintang Pasar Malam ✨" +15 Poin',
        points: 15,
        emoji: '✨',
        funTitle: 'Bintang Pasar Malam ✨',
        weight: 14,
      },
      {
        id: 'jackpot_25',
        label: 'JACKPOT +25 Poin & "Bintang Pasar Malam ✨"',
        points: 25,
        emoji: '👑',
        funTitle: 'Bintang Pasar Malam ✨',
        weight: 10,
      },
    ],
  };

  const PLOTS = [
    { id: 'utara-a', name: 'Kavling Utara A', x: 220, y: 110, w: 460, h: 200 },
    { id: 'utara-b', name: 'Kavling Utara B', x: 1030, y: 110, w: 170, h: 200 },
    { id: 'timur', name: 'Kavling Timur', x: 1180, y: 350, w: 460, h: 155 },
    { id: 'barat', name: 'Kavling Barat', x: 140, y: 665, w: 430, h: 325 },
    { id: 'selatan-a', name: 'Kavling Selatan A', x: 605, y: 845, w: 190, h: 210 },
    { id: 'selatan-b', name: 'Kavling Selatan B', x: 1020, y: 895, w: 500, h: 160 },
  ];

  const MAIN_ROAD = {
    northSidewalkY: 1070,
    northSidewalkH: 20,
    asphaltY: 1090,
    asphaltH: 66,
    southSidewalkY: 1156,
    southSidewalkH: 20,
    zebraX: 856,
    zebraW: 88,
    pjuLights: [180, 440, 740, 1060, 1340, 1620, 1880, 2180, 2440],
    halte: { x: 1022, y: 1072, w: 84, h: 36 },
    signs: [
      { x: 822, y: 1078, kind: 'zebra', label: '🚸' },
      { x: 966, y: 1078, kind: 'speed', label: '20' },
      { x: 2070, y: 1078, kind: 'speed', label: '15' },
    ],
  };

  // ==================== Area Komplek Perumahan (Cluster Hunian Warga) ====================
  const HOUSING_CLUSTER = {
    bounds: { x: 1796, y: 112, w: 688, h: 944 },
    gate: { x: 2140, y: 1036, width: 146, height: 56 },
    guardPost: { x: 2012, y: 1018, w: 72, h: 52 },
    directoryBoard: { x: 2258, y: 1014, w: 68, h: 54 },
    boulevardX: 2122,
    boulevardW: 36,
    blockLetters: ['A', 'B', 'C', 'D'],
    defaultBlockCount: 2, // Default 2 Blok (Blok A & B = 8 Kavling); Pak Kades bisa tambah Blok C (12) & D (16)!
    maxBlockCount: 4,
    // Row geometry per block (4 uniform plots per block, 124x116 px each, facing their own paving gang!)
    blockRows: [
      { letter: 'A', plotY: 756, plotH: 116, alleyY: 888, alleyH: 30 },
      { letter: 'B', plotY: 562, plotH: 116, alleyY: 694, alleyH: 30 },
      { letter: 'C', plotY: 368, plotH: 116, alleyY: 500, alleyH: 30 },
      { letter: 'D', plotY: 174, plotH: 116, alleyY: 306, alleyH: 30 },
    ],
    plotCols: [
      { num: '01', x: 1848, w: 124 },
      { num: '02', x: 1986, w: 124 },
      { num: '03', x: 2170, w: 124 },
      { num: '04', x: 2308, w: 124 },
    ],
  };

  function generateClusterKavlings(blockCount) {
    const count = Math.max(
      HOUSING_CLUSTER.defaultBlockCount,
      Math.min(HOUSING_CLUSTER.maxBlockCount, Number(blockCount) || HOUSING_CLUSTER.defaultBlockCount)
    );
    const list = [];
    for (let r = 0; r < count; r++) {
      const row = HOUSING_CLUSTER.blockRows[r];
      for (let c = 0; c < HOUSING_CLUSTER.plotCols.length; c++) {
        const col = HOUSING_CLUSTER.plotCols[c];
        const id = `${row.letter}-${col.num}`;
        list.push({
          id,
          block: row.letter,
          code: `Blok ${id}`,
          x: col.x,
          y: row.plotY,
          w: col.w,
          h: row.plotH,
          centerX: Math.round(col.x + col.w / 2),
          centerY: Math.round(row.plotY + row.plotH / 2),
          visitX: Math.round(col.x + col.w / 2),
          visitY: Math.round(row.alleyY + row.alleyH / 2),
        });
      }
    }
    return list;
  }

  function getClusterRoads(blockCount) {
    const count = Math.max(
      HOUSING_CLUSTER.defaultBlockCount,
      Math.min(HOUSING_CLUSTER.maxBlockCount, Number(blockCount) || HOUSING_CLUSTER.defaultBlockCount)
    );
    const topRow = HOUSING_CLUSTER.blockRows[count - 1];
    const topAlleyY = topRow ? topRow.alleyY : 694;
    const roads = [
      // Entrance driveway from Jalan Raya Utama North Sidewalk through Cluster Gate
      { id: 'cluster_entry', x: 2122, y: topAlleyY, w: 36, h: 1072 - topAlleyY },
      // Left & Right internal perimeter walkways
      { id: 'cluster_west_walk', x: 1816, y: topAlleyY, w: 22, h: 918 - topAlleyY },
      { id: 'cluster_east_walk', x: 2442, y: topAlleyY, w: 22, h: 918 - topAlleyY },
      // Connector from West Neighborhood network into Cluster entrance alley
      { id: 'cluster_sw_link', x: 1792, y: 888, w: 46, h: 30 },
    ];
    for (let r = 0; r < count; r++) {
      const row = HOUSING_CLUSTER.blockRows[r];
      roads.push({
        id: `cluster_alley_${row.letter}`,
        x: 1816,
        y: row.alleyY,
        w: 648,
        h: row.alleyH,
      });
    }
    return roads;
  }

  function getClusterLamps(blockCount) {
    const count = Math.max(
      HOUSING_CLUSTER.defaultBlockCount,
      Math.min(HOUSING_CLUSTER.maxBlockCount, Number(blockCount) || HOUSING_CLUSTER.defaultBlockCount)
    );
    const lamps = [
      { x: 2056, y: 1044 },
      { x: 2224, y: 1044 },
    ];
    for (let r = 0; r < count; r++) {
      const row = HOUSING_CLUSTER.blockRows[r];
      const ly = row.alleyY + 4;
      lamps.push(
        { x: 1830, y: ly },
        { x: 2114, y: ly },
        { x: 2166, y: ly },
        { x: 2450, y: ly }
      );
    }
    return lamps;
  }

  function findClusterKavlingAt(x, y, kavlings, pad) {
    const p = pad || 0;
    const list = Array.isArray(kavlings) && kavlings.length ? kavlings : generateClusterKavlings(HOUSING_CLUSTER.defaultBlockCount);
    for (let i = 0; i < list.length; i++) {
      const k = list[i];
      if (x >= k.x - p && x <= k.x + k.w + p && y >= k.y - p && y <= k.y + k.h + p) {
        return k;
      }
    }
    return null;
  }

  // Structured warm paving-block neighborhood roads connecting all zones without overlapping any existing buildings
  const NEIGHBORHOOD_ROADS = [
    // South Main Entrance: Main Road North Sidewalk -> Gate -> Alun-alun
    { id: 'axis_south', x: 878, y: 722, w: 44, h: 350 },
    // North Axis: Alun-alun -> North Crossroad -> Between Kavling Utara A & B
    { id: 'axis_north', x: 880, y: 200, w: 40, h: 245 },
    // Northern Ring Road: Kavling Utara A -> North Crossroad -> Pasar Malam Gate
    { id: 'ring_north', x: 340, y: 326, w: 1074, h: 32 },
    // Northern Spur to Kavling Utara A & B mid-lane
    { id: 'north_top_link', x: 690, y: 194, w: 416, h: 28 },
    // West Plaza Connector -> Pendopo & Kavling Barat Spine
    { id: 'west_branch', x: 576, y: 584, w: 196, h: 32 },
    { id: 'west_pendopo_spur', x: 576, y: 492, w: 32, h: 108 },
    // West Neighborhood Spine (threads cleanly between Kavling Barat x<=570 & Kavling Selatan A x>=605 down to Main Road)
    { id: 'west_spine', x: 576, y: 584, w: 28, h: 488 },
    // East Plaza Connector -> Pond, Dermaga Mancing, & KOPDES Spine
    { id: 'east_branch', x: 1026, y: 584, w: 146, h: 32 },
    // East Neighborhood Spine (x=1066..1096, clean west of Bench 1120 & KOPDES 1160) down to Main Road
    { id: 'east_spine', x: 1068, y: 584, w: 30, h: 488 },
    // Spur East to Dermaga Kayu Mancing & Papan Klasemen
    { id: 'pier_spur', x: 1094, y: 836, w: 128, h: 28 },
    // Front Promenade for KOPDES & Tempat Usaha Warga (y=1016..1044) extending cleanly East toward Komplek Perumahan!
    { id: 'kopdes_promenade', x: 1094, y: 1016, w: 726, h: 28 },
    // South-East connector down to Main Road sidewalk beside Kedai Kopi
    { id: 'se_drop', x: 1384, y: 1016, w: 28, h: 56 },
    // North-East connector from Pasar Malam Gate down to East Road corridor
    { id: 'pasar_south_link', x: 1382, y: 318, w: 28, h: 40 },
    // Cluster East-West link from KOPDES Promenade north into Komplek Gang Blok A
    { id: 'cluster_west_bridge', x: 1792, y: 888, w: 28, h: 156 },
  ];

  const ROAD_SIGNS = [
    { x: 856, y: 322, text: '← Kavling Utara | Pasar Malam →' },
    { x: 1054, y: 576, text: '↑ Pasar Malam | Dermaga →' },
    { x: 1052, y: 842, text: '← Alun-Alun | Dermaga & KOPDES →' },
    { x: 1776, y: 1010, text: '← KOPDES | Komplek Hunian →' },
  ];

  // Decorative perimeter trees around the village edge so the world feels nestled in lush nature
  const BORDER_TREES = [
    { x: 75, y: 90, scale: 1.15, shade: 0 },
    { x: 145, y: 65, scale: 0.95, shade: 1 },
    { x: 760, y: 72, scale: 1.1, shade: 2 },
    { x: 1020, y: 74, scale: 1.05, shade: 0 },
    { x: 1685, y: 95, scale: 1.2, shade: 1 },
    { x: 72, y: 265, scale: 1.05, shade: 1 },
    { x: 68, y: 455, scale: 1.15, shade: 0 },
    { x: 82, y: 605, scale: 0.95, shade: 2 },
    { x: 75, y: 855, scale: 1.1, shade: 0 },
    { x: 76, y: 1044, scale: 1.1, shade: 1 },
    { x: 265, y: 1184, scale: 0.95, shade: 2 },
    { x: 485, y: 1184, scale: 1.0, shade: 0 },
    { x: 715, y: 1184, scale: 0.95, shade: 1 },
    { x: 1125, y: 1184, scale: 1.0, shade: 2 },
    { x: 1385, y: 1184, scale: 1.05, shade: 0 },
    { x: 1645, y: 1184, scale: 1.05, shade: 1 },
    { x: 1920, y: 1184, scale: 1.0, shade: 2 },
    { x: 2210, y: 1184, scale: 1.05, shade: 0 },
    { x: 2450, y: 1184, scale: 1.0, shade: 1 },
    { x: 1732, y: 215, scale: 1.0, shade: 2 },
    { x: 1732, y: 525, scale: 1.05, shade: 0 },
    { x: 1732, y: 765, scale: 1.0, shade: 1 },
    { x: 1585, y: 605, scale: 0.95, shade: 2 },
    { x: 1595, y: 815, scale: 1.05, shade: 0 },
    { x: 260, y: 440, scale: 0.95, shade: 1 },
    { x: 270, y: 545, scale: 0.9, shade: 2 },
    // Lush eastern perimeter trees framing Komplek Hunian Warga
    { x: 1920, y: 66, scale: 1.1, shade: 1 },
    { x: 2140, y: 66, scale: 1.15, shade: 0 },
    { x: 2360, y: 68, scale: 1.05, shade: 2 },
    { x: 2515, y: 150, scale: 1.1, shade: 0 },
    { x: 2518, y: 390, scale: 1.05, shade: 1 },
    { x: 2518, y: 640, scale: 1.15, shade: 2 },
    { x: 2518, y: 890, scale: 1.05, shade: 0 },
    { x: 2510, y: 1038, scale: 1.0, shade: 1 },
  ];

  // Built-in warm lanterns around the plaza and gate
  const STATIC_LANTERNS = [
    { x: 805, y: 510 },
    { x: 995, y: 510 },
    { x: 805, y: 690 },
    { x: 995, y: 690 },
    { x: 818, y: 1018 },
    { x: 982, y: 1018 },
    { x: 590, y: 478 },
    { x: 1185, y: 697 },
    { x: 1485, y: 697 },
  ];

  const BUILD_CATALOG = [
    {
      type: 'rumah',
      name: 'Rumah Kayu-Kaca',
      shortName: 'Rumah',
      desc: 'Hunian kayu & kaca minimalis dengan cahaya hangat & papan nama.',
      icon: '🏡',
      width: 118,
      height: 90,
      collisionRadius: 56,
      snap: 20,
      hasLabel: true,
      isGroundLayer: false,
      emitsLight: true,
    },
    {
      type: 'pohon',
      name: 'Pohon & Taman Bunga',
      shortName: 'Pohon & Bunga',
      desc: 'Pohon rindang bergoyang lembut dikelilingi bunga liar.',
      icon: '🌳',
      width: 68,
      height: 68,
      collisionRadius: 30,
      snap: 20,
      hasLabel: false,
      isGroundLayer: false,
      emitsLight: false,
    },
    {
      type: 'lampu',
      name: 'Lampu Taman Hangat',
      shortName: 'Lampu Taman',
      desc: 'Lentera taman kayu dengan pendaran cahaya warm amber.',
      icon: '🏮',
      width: 34,
      height: 44,
      collisionRadius: 18,
      snap: 20,
      hasLabel: false,
      isGroundLayer: false,
      emitsLight: true,
    },
    {
      type: 'bangku',
      name: 'Bangku & Meja Ngopi',
      shortName: 'Meja Ngopi',
      desc: 'Set bangku kayu & meja kopi outdoor hangat untuk bersantai.',
      icon: '☕',
      width: 78,
      height: 54,
      collisionRadius: 34,
      snap: 20,
      hasLabel: false,
      isGroundLayer: false,
      emitsLight: false,
    },
    {
      type: 'kebun',
      name: 'Kebun Sayur & Pot',
      shortName: 'Kebun Sayur',
      desc: 'Bedengan kayu berisi sayur organik, herbal, dan pot terakota.',
      icon: '🪴',
      width: 74,
      height: 52,
      collisionRadius: 32,
      snap: 20,
      hasLabel: false,
      isGroundLayer: false,
      emitsLight: false,
    },
    {
      type: 'jalan',
      name: 'Paving Jalan Lingkungan',
      shortName: 'Paving Jalan',
      desc: 'Paving block hangat yang otomatis menyambung rapi antar-ubin & ke jalan utama.',
      icon: '🛣️',
      width: 40,
      height: 40,
      collisionRadius: 16,
      snap: 40,
      hasLabel: false,
      isGroundLayer: true,
      emitsLight: false,
    },
    {
      type: 'usaha',
      name: 'Tempat Usaha Warga',
      shortName: 'Tempat Usaha',
      desc: 'Bangun kedai kopi, studio kreatif, atau toko hasil kebun milikmu!',
      icon: '🏪',
      width: 118,
      height: 92,
      collisionRadius: 56,
      snap: 20,
      hasLabel: false,
      isBusiness: true,
      isGroundLayer: false,
      emitsLight: true,
    },
    {
      type: 'kopdes',
      name: 'Gedung KOPDES',
      shortName: 'KOPDES',
      desc: 'Koperasi Desa kayu-kaca modern untuk kas bersama & klaim poin harian (Khusus Pak Kades).',
      icon: '🏛️',
      width: 146,
      height: 104,
      collisionRadius: 68,
      snap: 20,
      hasLabel: false,
      adminOnly: true,
      isGroundLayer: false,
      emitsLight: true,
    },
  ];

  const BUSINESS_CATEGORIES = [
    { id: 'Kedai Kopi', icon: '☕', awning: '#9c6644' },
    { id: 'Studio Kreatif', icon: '🎨', awning: '#4e8a96' },
    { id: 'Toko Hasil Kebun', icon: '🥬', awning: '#568754' },
    { id: 'Bakeri & Kue Rumahan', icon: '🥐', awning: '#c97b4b' },
    { id: 'Galeri Tanaman Hias', icon: '🪴', awning: '#6f8f52' },
    { id: 'Bengkel & Jasa Warga', icon: '🛠️', awning: '#647692' },
  ];

  const BUILD_CATALOG_MAP = BUILD_CATALOG.reduce((acc, item) => {
    acc[item.type] = item;
    return acc;
  }, {});

  const QUICK_REACTIONS = [
    { type: 'wave', emoji: '👋', label: 'Melambaikan tangan!', short: 'Lambaikan' },
    { type: 'hello', emoji: '🏡', label: 'Halo Tetangga!', short: 'Halo Tetangga!' },
    { type: 'coffee', emoji: '☕', label: 'Ngopi bareng yuk!', short: 'Kopi Bareng' },
    { type: 'love', emoji: '❤️', label: 'Apresiasi hangat!', short: 'Apresiasi' },
  ];

  const SHIRT_COLORS = [
    { id: 'sage', name: 'Hijau Sage', hex: '#5f8d63' },
    { id: 'terracotta', name: 'Terakota', hex: '#c86d4b' },
    { id: 'amber', name: 'Kuning Madu', hex: '#d99b38' },
    { id: 'teal', name: 'Biru Telaga', hex: '#4c8e99' },
    { id: 'espresso', name: 'Cokelat Kopi', hex: '#7c553b' },
    { id: 'rose', name: 'Mawar Senja', hex: '#c4747e' },
    { id: 'olive', name: 'Zaitun', hex: '#7c8c4c' },
    { id: 'slate', name: 'Biru Langit', hex: '#5d7396' },
  ];

  const HAIR_STYLES = [
    { id: 'pendek', name: 'Rambut Pendek' },
    { id: 'panjang', name: 'Rambut Panjang' },
    { id: 'topi_jerami', name: 'Topi Jerami' },
    { id: 'beanie', name: 'Kupluk Hangat' },
    { id: 'sanggul', name: 'Sanggul Modern' },
    { id: 'bucket', name: 'Topi Rimba' },
  ];

  const MADING_COLORS = [
    { id: 'cream', name: 'Krem Batu', bg: '#fbf6ea', border: '#dfd2b8' },
    { id: 'sage', name: 'Hijau Daun', bg: '#eaf4e6', border: '#bed4b7' },
    { id: 'amber', name: 'Kuning Hangat', bg: '#fef3d6', border: '#ebd08d' },
    { id: 'peach', name: 'Senja Lembut', bg: '#fceddf', border: '#e8c4a7' },
  ];

  function isOnBridge(x, y, margin) {
    const m = margin || 0;
    return (
      x >= BRIDGE.x - m &&
      x <= BRIDGE.x + BRIDGE.w + m &&
      y >= BRIDGE.y - m &&
      y <= BRIDGE.y + BRIDGE.h + m
    );
  }

  function isOnFishingPier(x, y, margin) {
    const m = margin || 0;
    return (
      x >= FISHING_PIER.x - m &&
      x <= FISHING_PIER.x + FISHING_PIER.w + m &&
      y >= FISHING_PIER.y - m &&
      y <= FISHING_PIER.y + FISHING_PIER.h + m
    );
  }

  function isNearFishingPier(x, y) {
    return (
      x >= FISHING_PIER.x - 42 &&
      x <= FISHING_PIER.x + FISHING_PIER.w + 42 &&
      y >= FISHING_PIER.y - 34 &&
      y <= FISHING_PIER.y + FISHING_PIER.h + 46
    );
  }

  function getBobberSpot(playerX, playerY) {
    // Pick a clear water spot directly north/northeast of the pier!
    const bx = Math.max(1265, Math.min(1430, (playerX || 1280) + 46));
    const by = Math.max(738, Math.min(776, (playerY || 800) - 46));
    return { x: Math.round(bx), y: Math.round(by) };
  }

  function isInPondWater(x, y, padding) {
    const pad = padding || 0;
    for (let i = 0; i < POND.ellipses.length; i++) {
      const e = POND.ellipses[i];
      const dx = (x - e.cx) / (e.rx + pad);
      const dy = (y - e.cy) / (e.ry + pad);
      if (dx * dx + dy * dy <= 1) {
        return true;
      }
    }
    return false;
  }

  function isOnBuiltInRoad(x, y, pad, blockCount) {
    const p = pad || 0;
    // Main Road sidewalks & Zebra Cross
    if (y >= MAIN_ROAD.northSidewalkY - p && y <= MAIN_ROAD.northSidewalkY + MAIN_ROAD.northSidewalkH + p) {
      return true;
    }
    if (y >= MAIN_ROAD.southSidewalkY - p && y <= MAIN_ROAD.southSidewalkY + MAIN_ROAD.southSidewalkH + p) {
      return true;
    }
    if (
      x >= MAIN_ROAD.zebraX - p &&
      x <= MAIN_ROAD.zebraX + MAIN_ROAD.zebraW + p &&
      y >= MAIN_ROAD.asphaltY - p &&
      y <= MAIN_ROAD.asphaltY + MAIN_ROAD.asphaltH + p
    ) {
      return true;
    }
    for (let i = 0; i < NEIGHBORHOOD_ROADS.length; i++) {
      if (isInRect(x, y, NEIGHBORHOOD_ROADS[i], p)) {
        return true;
      }
    }
    const cRoads = getClusterRoads(blockCount || HOUSING_CLUSTER.maxBlockCount);
    for (let i = 0; i < cRoads.length; i++) {
      if (isInRect(x, y, cRoads[i], p)) {
        return true;
      }
    }
    return false;
  }

  function isOnPavedSurface(x, y, buildings, blockCount) {
    if (isOnBuiltInRoad(x, y, 4, blockCount)) return true;
    // Main asphalt road itself is also smooth pavement
    if (y >= MAIN_ROAD.asphaltY && y <= MAIN_ROAD.asphaltY + MAIN_ROAD.asphaltH) return true;
    // Alun-alun stone plaza & Pasar Malam stone courtyard
    if (Math.hypot(x - PLAZA.x, y - PLAZA.y) <= PLAZA.stoneRadius + 6) return true;
    if (isInNightMarket(x, y, 2)) return true;
    // Citizen-placed Paving Jalan Lingkungan tiles
    if (Array.isArray(buildings)) {
      for (let i = 0; i < buildings.length; i++) {
        const b = buildings[i];
        if (b && b.type === 'jalan' && Math.abs(x - b.x) <= 24 && Math.abs(y - b.y) <= 24) {
          return true;
        }
      }
    }
    return false;
  }

  function isWalkable(x, y) {
    if (x < 48 || x > WORLD_WIDTH - 48 || y < 56 || y > WORLD_HEIGHT - 22) {
      return false;
    }
    if (isInPondWater(x, y, -4) && !isOnBridge(x, y, -4) && !isOnFishingPier(x, y, -2)) {
      return false;
    }
    // Keep character from walking right through the physical Mading post
    if (
      Math.abs(x - MADING.x) < 34 &&
      y > MADING.y - 20 &&
      y < MADING.y + 18
    ) {
      return false;
    }
    return true;
  }

  function isInRect(x, y, rect, pad) {
    const p = pad || 0;
    return (
      x >= rect.x - p &&
      x <= rect.x + rect.w + p &&
      y >= rect.y - p &&
      y <= rect.y + rect.h + p
    );
  }

  function isInNightMarket(x, y, pad) {
    return isInRect(x, y, NIGHT_MARKET.bounds, pad || 0);
  }

  function isOnStage(x, y, pad) {
    return isInRect(x, y, NIGHT_MARKET.stage, pad || 0);
  }

  function getNearbyNightMarketAttraction(x, y) {
    if (isOnStage(x, y, 22)) {
      return { kind: 'stage', item: NIGHT_MARKET.stage, dist: 0 };
    }
    let best = null;
    let bestDist = Infinity;

    for (let i = 0; i < NIGHT_MARKET.foodStalls.length; i++) {
      const s = NIGHT_MARKET.foodStalls[i];
      const d = Math.hypot(x - s.x, y - (s.y + 18));
      if (d <= s.interactRadius && d < bestDist) {
        best = { kind: 'food', item: s, dist: d };
        bestDist = d;
      }
    }

    const fw = NIGHT_MARKET.ferrisWheel;
    const dFerris = Math.hypot(x - fw.x, y - (fw.y + 14));
    if (dFerris <= fw.interactRadius && dFerris < bestDist) {
      best = { kind: 'ferris', item: fw, dist: dFerris };
      bestDist = dFerris;
    }

    const lw = NIGHT_MARKET.luckyWheel;
    const dWheel = Math.hypot(x - lw.x, y - (lw.y + 10));
    if (dWheel <= lw.interactRadius && dWheel < bestDist) {
      best = { kind: 'wheel', item: lw, dist: dWheel };
      bestDist = dWheel;
    }

    return best;
  }

  function validatePlacement(type, x, y, existingBuildings, clusterState) {
    const item = BUILD_CATALOG_MAP[type];
    if (!item) {
      return { ok: false, reason: 'Jenis item tidak dikenal' };
    }

    const marginX = item.width / 2 + 40;
    const marginY = item.height / 2 + 45;
    if (
      x < marginX ||
      x > WORLD_WIDTH - marginX ||
      y < marginY ||
      y > WORLD_HEIGHT - marginY
    ) {
      return { ok: false, reason: 'Di luar batas kampung' };
    }

    // Cannot place inside pond, on wooden bridge, or on fishing pier & board
    if (
      isInPondWater(x, y, item.collisionRadius + 10) ||
      isOnBridge(x, y, item.collisionRadius) ||
      isOnFishingPier(x, y, item.collisionRadius + 14) ||
      Math.hypot(x - FISHING_BOARD.x, y - FISHING_BOARD.y) < item.collisionRadius + 40
    ) {
      return { ok: false, reason: 'Area kolam & dermaga mancing' };
    }

    // Cannot place on top of Mading Kampung
    if (Math.hypot(x - MADING.x, y - MADING.y) < item.collisionRadius + 58) {
      return { ok: false, reason: 'Area Mading Kampung' };
    }

    // Cannot place inside Pendopo Modern
    if (isInRect(x, y, PENDOPO, item.collisionRadius + 10)) {
      return { ok: false, reason: 'Area Pendopo Modern' };
    }

    // Cannot place inside Area Pasar Malam & Hiburan
    if (isInRect(x, y, NIGHT_MARKET.bounds, item.collisionRadius + 8)) {
      return { ok: false, reason: 'Area Pasar Malam & Hiburan' };
    }

    // Cannot place buildings on Jalan Raya Utama (asphalt & sidewalks)
    if (y + (item.isGroundLayer ? 12 : item.collisionRadius) >= MAIN_ROAD.northSidewalkY - 2) {
      return { ok: false, reason: 'Area Jalan Raya Utama & Trotoar' };
    }

    // Cannot place non-ground items on top of Neighborhood Roads or Cluster alleys
    const activeBlockCount =
      (clusterState && Number(clusterState.blockCount)) || HOUSING_CLUSTER.defaultBlockCount;
    if (!item.isGroundLayer && isOnBuiltInRoad(x, y, Math.min(26, item.collisionRadius * 0.45), activeBlockCount)) {
      return { ok: false, reason: 'Jangan membangun di badan jalan lingkungan' };
    }

    // Protect Komplek Perumahan entrance gate, Pos Ronda, and Directory Board
    if (
      Math.abs(x - HOUSING_CLUSTER.gate.x) < 82 + item.collisionRadius * 0.5 &&
      Math.abs(y - HOUSING_CLUSTER.gate.y) < 42 + item.collisionRadius * 0.5
    ) {
      return { ok: false, reason: 'Area Gerbang Komplek Hunian' };
    }
    if (
      Math.hypot(x - HOUSING_CLUSTER.guardPost.x, y - HOUSING_CLUSTER.guardPost.y) <
      item.collisionRadius + 38
    ) {
      return { ok: false, reason: 'Area Pos Keamanan Komplek' };
    }
    if (
      Math.hypot(x - HOUSING_CLUSTER.directoryBoard.x, y - HOUSING_CLUSTER.directoryBoard.y) <
      item.collisionRadius + 36
    ) {
      return { ok: false, reason: 'Area Papan Direktori Komplek' };
    }

    // Inside Area Komplek Perumahan: keep houses neatly snapped inside active Cluster Kavlings!
    const kavlings =
      (clusterState && Array.isArray(clusterState.kavlings) && clusterState.kavlings) ||
      generateClusterKavlings(activeBlockCount);
    const matchedKavling = findClusterKavlingAt(x, y, kavlings, 4);
    if (type === 'rumah' && isInRect(x, y, HOUSING_CLUSTER.bounds, 0)) {
      if (!matchedKavling) {
        return { ok: false, reason: 'Arahkan rumah tepat ke petak Kavling Komplek yang tersedia' };
      }
      if (matchedKavling.occupiedByBuildingId) {
        return { ok: false, reason: `${matchedKavling.code} sudah terisi (${matchedKavling.ownerName || 'Warga'})` };
      }
    }
    if (matchedKavling && matchedKavling.occupiedByBuildingId && type === 'rumah') {
      return { ok: false, reason: `${matchedKavling.code} sudah terisi` };
    }

    // Cannot place inside Gerbang Kampung
    if (Math.abs(x - GATE.x) < 95 + item.collisionRadius && Math.abs(y - GATE.y) < 55 + item.collisionRadius) {
      return { ok: false, reason: 'Area Gerbang Kampung' };
    }

    // Keep the inner stone plaza of the Alun-alun clear for gathering
    const distPlaza = Math.hypot(x - PLAZA.x, y - PLAZA.y);
    if ((type === 'rumah' || type === 'usaha' || type === 'kopdes') && distPlaza < PLAZA.outerRadius + 40) {
      return { ok: false, reason: 'Bangunan didirikan di area kavling/sekitar' };
    }
    if (!item.isGroundLayer && distPlaza < PLAZA.stoneRadius + item.collisionRadius - 10) {
      return { ok: false, reason: 'Area tengah Alun-alun' };
    }

    // Check overlap with existing buildings
    if (Array.isArray(existingBuildings)) {
      for (let i = 0; i < existingBuildings.length; i++) {
        const b = existingBuildings[i];
        const bMeta = BUILD_CATALOG_MAP[b.type];
        if (!bMeta) continue;
        // Ground paths can sit cleanly under non-path items, but don't stack identical paths on the exact spot
        if (item.isGroundLayer && bMeta.isGroundLayer) {
          if (Math.hypot(x - b.x, y - b.y) < 26) {
            return { ok: false, reason: 'Sudah ada jalan batu di sini' };
          }
          continue;
        }
        if (item.isGroundLayer || bMeta.isGroundLayer) {
          continue;
        }
        const minDist = item.collisionRadius + bMeta.collisionRadius - 6;
        if (Math.hypot(x - b.x, y - b.y) < minDist) {
          return { ok: false, reason: 'Terlalu dekat elemen lain' };
        }
      }
    }

    return { ok: true, reason: '', kavling: matchedKavling || null };
  }

  return {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    GRID_SIZE,
    PLAZA,
    MADING,
    GATE,
    PENDOPO,
    POND,
    BRIDGE,
    FISHING_PIER,
    FISHING_BOARD,
    FISHING_CATCHES,
    NIGHT_MARKET,
    MAIN_ROAD,
    HOUSING_CLUSTER,
    NEIGHBORHOOD_ROADS,
    ROAD_SIGNS,
    PLOTS,
    BORDER_TREES,
    STATIC_LANTERNS,
    BUILD_CATALOG,
    BUILD_CATALOG_MAP,
    BUSINESS_CATEGORIES,
    QUICK_REACTIONS,
    SHIRT_COLORS,
    HAIR_STYLES,
    MADING_COLORS,
    isOnBridge,
    isOnFishingPier,
    isNearFishingPier,
    getBobberSpot,
    isInNightMarket,
    isOnStage,
    getNearbyNightMarketAttraction,
    isOnBuiltInRoad,
    isOnPavedSurface,
    generateClusterKavlings,
    getClusterRoads,
    getClusterLamps,
    findClusterKavlingAt,
    isInPondWater,
    isWalkable,
    validatePlacement,
  };
});
