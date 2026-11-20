const path = require('path');
try {
  require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
} catch (_err) {
  // Optional dotenv
}
const express = require('express');
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const { Server } = require('socket.io');
const WORLD = require('./public/js/worldConfig');

const app = express();
app.set('trust proxy', 1);
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
  maxHttpBufferSize: 2 * 1024 * 1024, // 2MB untuk audio Megafon Suara
});

const PORT = process.env.PORT || 3000;
const ADMIN_PIN = (process.env.ADMIN_PIN || process.env.KADES_PIN || '1234').trim();
const DATA_FILE = path.join(__dirname, 'data-kampung.json');
const BACKUP_FILE = path.join(__dirname, 'data-kampung.bak.json');

const DEFAULT_SETTINGS = {
  maxHousesPerCitizen: 3, // 0 = tidak terbatas
  ambiance: 'sore', // 'pagi' | 'sore' | 'senja'
  megaphoneAllowedIds: [],
  festivalMode: false, // Mode Festival Pasar Malam (lampu meriah & kembang api)
};

function createSeedData() {
  const now = new Date().toISOString();
  return {
    citizens: [
      {
        id: 'cit_founder_budi',
        name: 'Pak RT Budi',
        role: 'Pengurus Kampung',
        avatar: { shirtColor: '#5f8d63', hairStyle: 'topi_jerami' },
        joinedAt: now,
      },
      {
        id: 'cit_founder_sari',
        name: 'Teh Sari',
        role: 'Peracik Kopi & Kebun',
        avatar: { shirtColor: '#c86d4b', hairStyle: 'sanggul' },
        joinedAt: now,
      },
    ],
    mading: [
      {
        id: 'mad_seed_1',
        author: 'Pak RT Budi',
        role: 'Pengurus Kampung',
        category: 'Pengumuman',
        color: 'cream',
        text: 'Selamat datang di Kampung Hijau Harmoni! Mari saling sapa, bersantai di Pendopo Barat, dan bangun kavling hijau bersama-sama.',
        createdAt: now,
      },
      {
        id: 'mad_seed_2',
        author: 'Teh Sari',
        role: 'Peracik Kopi & Kebun',
        category: 'Ajakan',
        color: 'amber',
        text: 'Sore ini ada seduh kopi hangat di area Pendopo & pinggir kolam. Mampir ya, tetangga!',
        createdAt: now,
      },
      {
        id: 'mad_seed_3',
        author: 'Warga Harmoni',
        role: 'Komunitas Hijau',
        category: 'Tips',
        color: 'sage',
        text: 'Gunakan menu "Bangun & Tanam" di bawah layar untuk mendirikan Rumah Kayu-Kaca berlabel namamu, menanam pohon, atau menambah lampu taman.',
        createdAt: now,
      },
    ],
    buildings: [
      {
        id: 'bld_seed_house',
        type: 'rumah',
        x: 340,
        y: 200,
        label: 'Rumah Pak RT',
        ownerName: 'Pak RT Budi',
        ownerId: 'cit_founder_budi',
        createdAt: now,
      },
      {
        id: 'bld_seed_tree_1',
        type: 'pohon',
        x: 460,
        y: 210,
        label: '',
        ownerName: 'Pak RT Budi',
        ownerId: 'cit_founder_budi',
        createdAt: now,
      },
      {
        id: 'bld_seed_garden',
        type: 'kebun',
        x: 540,
        y: 230,
        label: '',
        ownerName: 'Teh Sari',
        ownerId: 'cit_founder_sari',
        createdAt: now,
      },
      {
        id: 'bld_seed_bench',
        type: 'bangku',
        x: 1120,
        y: 620,
        label: '',
        ownerName: 'Teh Sari',
        ownerId: 'cit_founder_sari',
        createdAt: now,
      },
      {
        id: 'bld_seed_lamp',
        type: 'lampu',
        x: 410,
        y: 270,
        label: '',
        ownerName: 'Pak RT Budi',
        ownerId: 'cit_founder_budi',
        createdAt: now,
      },
    ],
  };
}

function sanitizeSettings(raw) {
  const s = raw && typeof raw === 'object' ? raw : {};
  const maxH = Number(s.maxHousesPerCitizen);
  const ambiance = ['pagi', 'sore', 'senja'].includes(s.ambiance)
    ? s.ambiance
    : DEFAULT_SETTINGS.ambiance;
  const allowedIds = Array.isArray(s.megaphoneAllowedIds)
    ? Array.from(new Set(s.megaphoneAllowedIds.filter((id) => typeof id === 'string' && id.trim())))
    : [];
  return {
    maxHousesPerCitizen:
      Number.isInteger(maxH) && maxH >= 0 && maxH <= 20
        ? maxH
        : DEFAULT_SETTINGS.maxHousesPerCitizen,
    ambiance,
    megaphoneAllowedIds: allowedIds,
    festivalMode: Boolean(s.festivalMode),
  };
}

function createDefaultKopdes() {
  const now = new Date().toISOString();
  return {
    treasury: 150,
    members: [
      {
        citizenId: 'cit_founder_budi',
        name: 'Pak RT Budi',
        role: 'Pengurus Kampung',
        points: 50,
        lastClaimDate: '',
        joinedAt: now,
      },
      {
        citizenId: 'cit_founder_sari',
        name: 'Teh Sari',
        role: 'Peracik Kopi & Kebun',
        points: 50,
        lastClaimDate: '',
        joinedAt: now,
      },
    ],
  };
}

function sanitizeKopdes(raw) {
  if (!raw || typeof raw !== 'object') {
    return createDefaultKopdes();
  }
  const treasury = Number(raw.treasury);
  const members = Array.isArray(raw.members)
    ? raw.members
        .filter((m) => m && typeof m.citizenId === 'string' && m.citizenId.trim())
        .map((m) => ({
          citizenId: m.citizenId.trim(),
          name: typeof m.name === 'string' ? m.name : 'Warga',
          role: typeof m.role === 'string' ? m.role : 'Warga Kampung',
          points: Number.isFinite(Number(m.points)) ? Math.max(0, Math.round(Number(m.points))) : 0,
          lastClaimDate: typeof m.lastClaimDate === 'string' ? m.lastClaimDate : '',
          joinedAt: typeof m.joinedAt === 'string' ? m.joinedAt : new Date().toISOString(),
        }))
    : createDefaultKopdes().members;
  return {
    treasury: Number.isFinite(treasury) && treasury >= 0 ? Math.round(treasury) : 150,
    members,
  };
}

function getLocalDateKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function createEmptyTournament() {
  return {
    active: false,
    mode: 'manual',
    title: 'Lomba Mancing Akhir Pekan',
    startedAt: null,
    endsAt: null,
    startedBy: '',
    manualEndedWeekendKey: '',
    scores: [],
  };
}

function sanitizeFishing(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      anglers: [],
      tournament: createEmptyTournament(),
      championCitizenId: null,
      championName: '',
      history: [],
    };
  }
  const anglers = Array.isArray(raw.anglers)
    ? raw.anglers
        .filter((a) => a && typeof a.citizenId === 'string' && a.citizenId.trim())
        .map((a) => ({
          citizenId: a.citizenId.trim(),
          name: typeof a.name === 'string' ? a.name : 'Warga',
          role: typeof a.role === 'string' ? a.role : 'Warga Kampung',
          totalPoints: Number.isFinite(Number(a.totalPoints)) ? Math.max(0, Math.round(Number(a.totalPoints))) : 0,
          totalCatches: Number.isFinite(Number(a.totalCatches)) ? Math.max(0, Math.round(Number(a.totalCatches))) : 0,
          bestCatch: typeof a.bestCatch === 'string' ? a.bestCatch : '',
          bestPoints: Number.isFinite(Number(a.bestPoints)) ? Math.max(0, Math.round(Number(a.bestPoints))) : 0,
          updatedAt: typeof a.updatedAt === 'string' ? a.updatedAt : new Date().toISOString(),
        }))
    : [];

  const rawT = raw.tournament && typeof raw.tournament === 'object' ? raw.tournament : {};
  const tournament = {
    active: Boolean(rawT.active),
    mode: rawT.mode === 'weekend' ? 'weekend' : 'manual',
    title: typeof rawT.title === 'string' && rawT.title.trim() ? rawT.title.trim() : 'Lomba Mancing Akhir Pekan',
    startedAt: rawT.startedAt ? Number(rawT.startedAt) || null : null,
    endsAt: rawT.endsAt ? Number(rawT.endsAt) || null : null,
    startedBy: typeof rawT.startedBy === 'string' ? rawT.startedBy : '',
    manualEndedWeekendKey:
      typeof rawT.manualEndedWeekendKey === 'string' ? rawT.manualEndedWeekendKey : '',
    scores: Array.isArray(rawT.scores)
      ? rawT.scores
          .filter((s) => s && typeof s.citizenId === 'string' && s.citizenId.trim())
          .map((s) => ({
            citizenId: s.citizenId.trim(),
            name: typeof s.name === 'string' ? s.name : 'Warga',
            role: typeof s.role === 'string' ? s.role : 'Warga Kampung',
            points: Number.isFinite(Number(s.points)) ? Math.max(0, Math.round(Number(s.points))) : 0,
            catches: Number.isFinite(Number(s.catches)) ? Math.max(0, Math.round(Number(s.catches))) : 0,
            bestCatch: typeof s.bestCatch === 'string' ? s.bestCatch : '',
            bestPoints: Number.isFinite(Number(s.bestPoints)) ? Math.max(0, Math.round(Number(s.bestPoints))) : 0,
          }))
      : [],
  };

  const history = Array.isArray(raw.history)
    ? raw.history
        .filter((h) => h && typeof h === 'object' && Array.isArray(h.winners))
        .slice(0, 20)
    : [];

  return {
    anglers,
    tournament,
    championCitizenId: typeof raw.championCitizenId === 'string' ? raw.championCitizenId : null,
    championName: typeof raw.championName === 'string' ? raw.championName : '',
    history,
  };
}

function sanitizeNightMarket(raw) {
  const nm = raw && typeof raw === 'object' ? raw : {};
  const rawPts = nm.pointsByCitizen && typeof nm.pointsByCitizen === 'object' ? nm.pointsByCitizen : {};
  const pointsByCitizen = {};
  Object.keys(rawPts).forEach((cid) => {
    const val = Number(rawPts[cid]);
    if (typeof cid === 'string' && cid.trim() && Number.isFinite(val) && val >= 0) {
      pointsByCitizen[cid.trim()] = Math.round(val);
    }
  });
  return { pointsByCitizen };
}

function sanitizeHousingCluster(raw, buildings) {
  const hc = raw && typeof raw === 'object' ? raw : {};
  const defBlocks = WORLD.HOUSING_CLUSTER.defaultBlockCount;
  const maxBlocks = WORLD.HOUSING_CLUSTER.maxBlockCount;
  const rawCount = Number(hc.blockCount);
  const blockCount =
    Number.isInteger(rawCount) && rawCount >= defBlocks && rawCount <= maxBlocks
      ? rawCount
      : defBlocks;

  const baseKavlings = WORLD.generateClusterKavlings(blockCount);
  const bList = Array.isArray(buildings) ? buildings : [];

  const kavlings = baseKavlings.map((k) => {
    // Match house either explicitly by kavlingId or geometrically sitting inside the kavling
    const house = bList.find(
      (b) =>
        b &&
        b.type === 'rumah' &&
        (b.kavlingId === k.id ||
          (b.x >= k.x && b.x <= k.x + k.w && b.y >= k.y && b.y <= k.y + k.h))
    );
    if (house) {
      house.kavlingId = k.id;
      return {
        ...k,
        occupiedByBuildingId: house.id,
        ownerId: house.ownerId || '',
        ownerName: house.ownerName || 'Warga',
        houseLabel: house.label || `Rumah ${house.ownerName || 'Warga'}`,
      };
    }
    return {
      ...k,
      occupiedByBuildingId: null,
      ownerId: '',
      ownerName: '',
      houseLabel: '',
    };
  });

  return {
    blockCount,
    kavlings,
  };
}

function normalizeVillageData(parsed) {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Struktur data kampung tidak valid');
  }
  const buildings = Array.isArray(parsed.buildings) ? parsed.buildings : [];
  return {
    citizens: Array.isArray(parsed.citizens) ? parsed.citizens : [],
    mading: Array.isArray(parsed.mading) ? parsed.mading : [],
    buildings,
    settings: sanitizeSettings(parsed.settings),
    kopdes: sanitizeKopdes(parsed.kopdes),
    fishing: sanitizeFishing(parsed.fishing),
    nightMarket: sanitizeNightMarket(parsed.nightMarket),
    housingCluster: sanitizeHousingCluster(parsed.housingCluster, buildings),
  };
}

function parseVillageJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw);
  return normalizeVillageData(parsed);
}

function loadVillageData() {
  // Always read existing data-kampung.json and NEVER overwrite it with seed/default data on restart
  if (fs.existsSync(DATA_FILE)) {
    try {
      const loaded = parseVillageJson(DATA_FILE);
      console.log(
        `Memuat data-kampung.json: ${loaded.citizens.length} warga, ${loaded.buildings.length} bangunan, ${loaded.mading.length} catatan mading.`
      );
      return loaded;
    } catch (err) {
      console.error('PERINGATAN: data-kampung.json gagal dibaca:', err.message);
      // Preserve the damaged file instead of overwriting it
      try {
        const corruptCopy = path.join(__dirname, `data-kampung.corrupt.${Date.now()}.json`);
        fs.copyFileSync(DATA_FILE, corruptCopy);
      } catch (_copyErr) {
        // Ignore copy error
      }
      if (fs.existsSync(BACKUP_FILE)) {
        try {
          const recovered = parseVillageJson(BACKUP_FILE);
          console.log('Berhasil memulihkan data dari data-kampung.bak.json.');
          return recovered;
        } catch (bakErr) {
          console.error('Cadangan juga tidak dapat dibaca:', bakErr.message);
        }
      }
      // Return empty in-memory structure without clobbering the preserved file
      return normalizeVillageData({ citizens: [], mading: [], buildings: [] });
    }
  }

  if (fs.existsSync(BACKUP_FILE)) {
    try {
      const recovered = parseVillageJson(BACKUP_FILE);
      saveLocalVillageData(recovered);
      return recovered;
    } catch (_err) {
      // Fall through to first-time seed only if neither file exists/is readable
    }
  }

  const seed = normalizeVillageData(createSeedData());
  saveLocalVillageData(seed);
  return seed;
}

function saveLocalVillageData(data) {
  const serialized = JSON.stringify(data, null, 2);
  try {
    // Keep a rolling backup of the previous good data-kampung.json before replacing
    if (fs.existsSync(DATA_FILE)) {
      try {
        fs.copyFileSync(DATA_FILE, BACKUP_FILE);
      } catch (_bakErr) {
        // Non-fatal
      }
    }
    const tempPath = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempPath, serialized, 'utf8');
    fs.renameSync(tempPath, DATA_FILE);
  } catch (err) {
    try {
      fs.writeFileSync(DATA_FILE, serialized, 'utf8');
    } catch (innerErr) {
      console.error('Gagal menyimpan data-kampung.json:', innerErr.message);
    }
  }
}

function saveVillageData(data) {
  saveLocalVillageData(data);
}

const villageData = loadVillageData();
if (!villageData.settings) {
  villageData.settings = sanitizeSettings(null);
}
if (!villageData.kopdes) {
  villageData.kopdes = createDefaultKopdes();
}
if (!villageData.fishing) {
  villageData.fishing = sanitizeFishing(null);
}
if (!villageData.nightMarket) {
  villageData.nightMarket = sanitizeNightMarket(null);
}
if (!villageData.housingCluster) {
  villageData.housingCluster = sanitizeHousingCluster(null, villageData.buildings);
}

function syncHousingClusterState() {
  villageData.housingCluster = sanitizeHousingCluster(
    villageData.housingCluster,
    villageData.buildings
  );
  return villageData.housingCluster;
}
const onlinePlayers = new Map(); // socketId -> player state
const adminSockets = new Set(); // socketIds authenticated in Mode Kades
const fishingSessions = new Map(); // socketId -> { state, bobberX, bobberY, waitTimer, escapeTimer, castX, castY }
const ferrisTimers = new Map(); // socketId -> timeout
const stageTimers = new Map(); // socketId -> timeout
const wheelCooldowns = new Map(); // citizenId -> nextAllowedTimestampMs
const recentChat = []; // last 50 live chat messages

function rollWheelPrize() {
  const prizes = WORLD.NIGHT_MARKET.wheelPrizes;
  const totalWeight = prizes.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < prizes.length; i++) {
    r -= prizes[i].weight;
    if (r <= 0) return prizes[i];
  }
  return prizes[0];
}

function clearFerrisRide(socketId, broadcast) {
  const timer = ferrisTimers.get(socketId);
  if (timer) {
    clearTimeout(timer);
    ferrisTimers.delete(socketId);
  }
  const p = onlinePlayers.get(socketId);
  if (p && p.ferrisRide) {
    p.ferrisRide = null;
    if (broadcast) {
      io.emit('nightMarket:ferrisUpdate', {
        socketId,
        riding: false,
        x: p.x,
        y: p.y,
      });
    }
  }
}

function clearStagePerform(socketId, broadcast) {
  const timer = stageTimers.get(socketId);
  if (timer) {
    clearTimeout(timer);
    stageTimers.delete(socketId);
  }
  const p = onlinePlayers.get(socketId);
  if (p && p.performing) {
    p.performing = null;
    if (broadcast) {
      io.emit('nightMarket:stageUpdate', {
        socketId,
        performing: false,
        name: p.name,
      });
    }
  }
}

function getWibContext() {
  // Compute current date & day-of-week strictly in WIB (UTC+7)
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const nowMs = Date.now();
  const wibDate = new Date(nowMs + WIB_OFFSET_MS);
  const day = wibDate.getUTCDay(); // 0 = Sunday, 6 = Saturday
  const y = wibDate.getUTCFullYear();
  const m = wibDate.getUTCMonth();
  const d = wibDate.getUTCDate();
  const isWeekend = day === 6 || day === 0;
  // Days until Sunday 23:59:59 WIB
  const daysToSunday = day === 0 ? 0 : 7 - day;
  const sundayEndWibUtc = Date.UTC(y, m, d + daysToSunday, 23, 59, 59, 999) - WIB_OFFSET_MS;
  // Unique key identifying this weekend's Sunday date (YYYY-MM-DD)
  const sunDate = new Date(sundayEndWibUtc + WIB_OFFSET_MS);
  const weekendKey = `${sunDate.getUTCFullYear()}-${String(sunDate.getUTCMonth() + 1).padStart(2, '0')}-${String(
    sunDate.getUTCDate()
  ).padStart(2, '0')}`;
  return { nowMs, day, isWeekend, sundayEndMs: sundayEndWibUtc, weekendKey };
}

function getSortedTournamentScores() {
  const list = Array.isArray(villageData.fishing.tournament.scores)
    ? villageData.fishing.tournament.scores
    : [];
  return [...list].sort((a, b) => b.points - a.points || b.catches - a.catches);
}

function getPublicFishingPayload() {
  const t = villageData.fishing.tournament;
  return {
    leaderboard: getFishingLeaderboard(),
    tournament: {
      active: t.active,
      mode: t.mode,
      title: t.title,
      startedAt: t.startedAt,
      endsAt: t.endsAt,
      startedBy: t.startedBy,
      scores: getSortedTournamentScores(),
    },
    championCitizenId: villageData.fishing.championCitizenId,
    championName: villageData.fishing.championName,
    history: villageData.fishing.history,
  };
}

function startFishingTournament({ mode, durationKey, startedBy }) {
  const wib = getWibContext();
  let durationMs = 60 * 60 * 1000; // default 1 hour
  let endsAt = wib.nowMs + durationMs;
  let title = 'Lomba Mancing Akhir Pekan';

  if (durationKey === '15m') {
    durationMs = 15 * 60 * 1000;
    endsAt = wib.nowMs + durationMs;
    title = 'Lomba Mancing Kilat (15 Menit)';
  } else if (durationKey === '1h') {
    durationMs = 60 * 60 * 1000;
    endsAt = wib.nowMs + durationMs;
    title = 'Lomba Mancing Kampung (1 Jam)';
  } else {
    // 'weekend' — ends Sunday 23:59:59 WIB
    endsAt = wib.sundayEndMs > wib.nowMs + 60000 ? wib.sundayEndMs : wib.nowMs + 24 * 60 * 60 * 1000;
    title = 'Lomba Mancing Akhir Pekan';
  }

  villageData.fishing.tournament = {
    active: true,
    mode: mode === 'weekend' ? 'weekend' : 'manual',
    title,
    startedAt: wib.nowMs,
    endsAt,
    startedBy: startedBy || 'Sistem Akhir Pekan',
    manualEndedWeekendKey: '',
    scores: [],
  };
  saveVillageData(villageData);

  const payload = getPublicFishingPayload();
  io.emit('tournament:updated', {
    ...payload,
    event: 'started',
    startedBy: villageData.fishing.tournament.startedBy,
  });

  const sysMsg = {
    id: makeId('trn'),
    system: true,
    text: `🏆 ${title} resmi dimulai${startedBy ? ` oleh ${startedBy}` : ''}! Ayo ke Dermaga Mancing dan raih gelar Juara 1! 🎣`,
    timestamp: Date.now(),
  };
  recentChat.push(sysMsg);
  if (recentChat.length > 50) recentChat.shift();
  io.emit('chat:message', sysMsg);

  return payload;
}

function endFishingTournament({ endedBy, isManual }) {
  const t = villageData.fishing.tournament;
  if (!t.active) return null;

  const ranked = getSortedTournamentScores();
  const winners = ranked.slice(0, 3).map((entry, idx) => ({
    rank: idx + 1,
    citizenId: entry.citizenId,
    name: entry.name,
    role: entry.role,
    points: entry.points,
    catches: entry.catches,
    bestCatch: entry.bestCatch,
  }));

  const finishedTitle = t.title || 'Lomba Mancing Akhir Pekan';
  const wib = getWibContext();

  if (winners.length > 0) {
    villageData.fishing.championCitizenId = winners[0].citizenId;
    villageData.fishing.championName = winners[0].name;
    villageData.fishing.history.unshift({
      id: makeId('his'),
      title: finishedTitle,
      endedAt: new Date().toISOString(),
      endedBy: endedBy || 'Waktu Lomba Selesai',
      winners,
    });
    if (villageData.fishing.history.length > 20) {
      villageData.fishing.history.length = 20;
    }
  }

  // Update champion crown flag on all online players immediately
  onlinePlayers.forEach((p) => {
    p.isFishingChampion = Boolean(
      villageData.fishing.championCitizenId &&
        p.citizenId === villageData.fishing.championCitizenId
    );
  });

  villageData.fishing.tournament = {
    ...createEmptyTournament(),
    manualEndedWeekendKey: isManual && wib.isWeekend ? wib.weekendKey : '',
  };
  saveVillageData(villageData);

  const payload = getPublicFishingPayload();
  io.emit('tournament:ended', {
    title: finishedTitle,
    winners,
    endedBy: endedBy || 'Waktu Lomba Selesai',
    ...payload,
  });

  const winnerSummary =
    winners.length > 0
      ? winners.map((w) => `Juara ${w.rank}: ${w.name} (${w.points} poin)`).join(' · ')
      : 'Belum ada peserta yang menangkap ikan pada sesi lomba ini.';

  const sysMsg = {
    id: makeId('trn'),
    system: true,
    text: `🏆 ${finishedTitle} telah berakhir! ${winnerSummary}${
      winners.length > 0 ? ` — Selamat kepada 🏅 ${winners[0].name} sebagai Juara Mancing!` : ''
    }`,
    timestamp: Date.now(),
  };
  recentChat.push(sysMsg);
  if (recentChat.length > 50) recentChat.shift();
  io.emit('chat:message', sysMsg);

  return { title: finishedTitle, winners, ...payload };
}

function checkTournamentSchedule() {
  const wib = getWibContext();
  const t = villageData.fishing.tournament;
  if (t.active && t.endsAt && wib.nowMs >= t.endsAt) {
    endFishingTournament({ endedBy: 'Waktu Lomba Selesai', isManual: false });
    return;
  }
  if (!t.active && wib.isWeekend && t.manualEndedWeekendKey !== wib.weekendKey) {
    startFishingTournament({
      mode: 'weekend',
      durationKey: 'weekend',
      startedBy: 'Jadwal Akhir Pekan (WIB)',
    });
  }
}

function getFishingLeaderboard() {
  const list = Array.isArray(villageData.fishing.anglers) ? villageData.fishing.anglers : [];
  return [...list]
    .filter((a) => a.totalPoints > 0 || a.totalCatches > 0)
    .sort((a, b) => b.totalPoints - a.totalPoints || b.totalCatches - a.totalCatches)
    .slice(0, 5);
}

function rollFishingCatch() {
  const table = WORLD.FISHING_CATCHES;
  const totalWeight = table.reduce((sum, item) => sum + item.weight, 0);
  let r = Math.random() * totalWeight;
  for (let i = 0; i < table.length; i++) {
    r -= table[i].weight;
    if (r <= 0) return table[i];
  }
  return table[0];
}

function clearFishingSession(socketId, broadcastIdle) {
  const sess = fishingSessions.get(socketId);
  if (sess) {
    if (sess.waitTimer) clearTimeout(sess.waitTimer);
    if (sess.escapeTimer) clearTimeout(sess.escapeTimer);
    fishingSessions.delete(socketId);
  }
  const p = onlinePlayers.get(socketId);
  if (p) p.fishing = null;
  if (broadcastIdle) {
    io.emit('player:fishingState', { socketId, state: 'idle' });
  }
}

function canUseMegaphone(socketId, player) {
  if (!player) return false;
  if (adminSockets.has(socketId)) return true;
  return villageData.settings.megaphoneAllowedIds.includes(player.citizenId);
}

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

function sanitizeText(str, maxLen) {
  if (typeof str !== 'string') return '';
  return str.replace(/\s+/g, ' ').trim().slice(0, maxLen);
}

function sanitizeAvatar(avatar) {
  const validColors = new Set(WORLD.SHIRT_COLORS.map((c) => c.hex.toLowerCase()));
  const validHairs = new Set(WORLD.HAIR_STYLES.map((h) => h.id));
  const rawColor = avatar && typeof avatar.shirtColor === 'string' ? avatar.shirtColor.toLowerCase() : '';
  const rawHair = avatar && typeof avatar.hairStyle === 'string' ? avatar.hairStyle : '';
  return {
    shirtColor: validColors.has(rawColor) ? rawColor : WORLD.SHIRT_COLORS[0].hex,
    hairStyle: validHairs.has(rawHair) ? rawHair : WORLD.HAIR_STYLES[0].id,
  };
}

function getStats() {
  return {
    onlineCount: onlinePlayers.size,
    totalCitizens: villageData.citizens.length,
    totalBuildings: villageData.buildings.length,
    totalMading: villageData.mading.length,
  };
}

function pickSpawnPosition() {
  // Spawn around the southern entrance of the Alun-alun so newcomers immediately see the plaza, mading, pond, and plots
  const angle = (Math.random() - 0.5) * Math.PI * 0.65;
  const x = Math.round(WORLD.PLAZA.x + Math.sin(angle) * 95 + (Math.random() - 0.5) * 40);
  const y = Math.round(742 + (Math.random() - 0.5) * 42);
  return { x, y };
}

app.use(express.static(path.join(__dirname, 'public')));

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true, status: 'healthy', uptime: Math.round(process.uptime()) });
});

app.get('/api/stats', (_req, res) => {
  res.json({
    ...getStats(),
    storageMode: 'local-json',
  });
});

app.get('/api/storage-status', (_req, res) => {
  res.json({
    mode: 'local-json',
    file: 'data-kampung.json',
    counts: {
      citizens: villageData.citizens.length,
      buildings: villageData.buildings.length,
      mading: villageData.mading.length,
      kavlings: villageData.housingCluster ? villageData.housingCluster.kavlings.length : 0,
    },
  });
});

io.on('connection', (socket) => {
  socket.emit('stats:update', getStats());

  socket.on('citizen:join', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const name = sanitizeText(payload && payload.name, 24);
    if (!name) {
      safeCallback({ ok: false, error: 'Nama panggilan wajib diisi.' });
      return;
    }

    const role = sanitizeText(payload && payload.role, 32) || 'Warga Kampung';
    const avatar = sanitizeAvatar(payload && payload.avatar);
    const requestedId =
      payload && typeof (payload.playerId || payload.citizenId) === 'string'
        ? String(payload.playerId || payload.citizenId).trim()
        : '';
    const isReconnect = Boolean(payload && payload.reconnect);

    let citizen = null;
    if (requestedId) {
      const candidate = villageData.citizens.find((c) => c.id === requestedId);
      // Lock onto permanent playerId on refresh/reconnect or matching name
      if (candidate && (isReconnect || candidate.name.toLowerCase() === name.toLowerCase())) {
        citizen = candidate;
      }
    }
    if (!citizen) {
      // Match existing citizen by exact case-insensitive name so returning citizens keep ownership
      citizen = villageData.citizens.find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
    }

    let isNewCitizen = false;
    if (citizen) {
      citizen.name = name;
      citizen.role = role;
      citizen.avatar = avatar;
      citizen.lastSeenAt = new Date().toISOString();
    } else {
      isNewCitizen = true;
      const newId =
        requestedId && requestedId.startsWith('cit_') && !villageData.citizens.some((c) => c.id === requestedId)
          ? requestedId
          : makeId('cit');
      citizen = {
        id: newId,
        name,
        role,
        avatar,
        joinedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      };
      villageData.citizens.push(citizen);
    }
    saveVillageData(villageData);

    const preserved = payload && payload.preservePosition;
    const usePreserved =
      preserved &&
      Number.isFinite(Number(preserved.x)) &&
      Number.isFinite(Number(preserved.y)) &&
      WORLD.isWalkable(Number(preserved.x), Number(preserved.y));
    const spawn = usePreserved
      ? { x: Math.round(Number(preserved.x)), y: Math.round(Number(preserved.y)) }
      : pickSpawnPosition();

    const player = {
      socketId: socket.id,
      playerId: citizen.id,
      citizenId: citizen.id,
      name: citizen.name,
      role: citizen.role,
      status: isNewCitizen ? 'Warga Baru' : 'Warga Tetap',
      isAdmin: adminSockets.has(socket.id),
      isFishingChampion: Boolean(
        villageData.fishing.championCitizenId &&
          citizen.id === villageData.fishing.championCitizenId
      ),
      avatar: citizen.avatar,
      x: spawn.x,
      y: spawn.y,
      dir: 'down',
      moving: false,
    };

    onlinePlayers.set(socket.id, player);

    const worldState = {
      me: player,
      players: Array.from(onlinePlayers.values()),
      buildings: villageData.buildings,
      mading: villageData.mading,
      kopdes: villageData.kopdes,
      fishingLeaderboard: getFishingLeaderboard(),
      fishingState: getPublicFishingPayload(),
      recentChat,
      stats: getStats(),
      settings: villageData.settings,
      housingCluster: villageData.housingCluster,
      nightMarket: {
        myPoints: villageData.nightMarket.pointsByCitizen[citizen.id] || 0,
        wheelCooldownUntil: wheelCooldowns.get(citizen.id) || 0,
      },
      isAdmin: adminSockets.has(socket.id),
      canMegaphone: canUseMegaphone(socket.id, player),
      isNewCitizen,
    };

    safeCallback({ ok: true, world: worldState });
    socket.broadcast.emit('player:joined', player);
    io.emit('stats:update', getStats());

    if (!isReconnect) {
      const systemMsg = {
        id: makeId('sys'),
        system: true,
        text: isNewCitizen
          ? `${player.name} resmi menjadi warga baru Kampung Hijau! 🌱`
          : `${player.name} kembali menyapa di Kampung Hijau. 🏡`,
        timestamp: Date.now(),
      };
      recentChat.push(systemMsg);
      if (recentChat.length > 50) recentChat.shift();
      io.emit('chat:message', systemMsg);
    }
  });

  socket.on('citizen:updateProfile', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    const newName = sanitizeText(payload.name, 24);
    if (!newName) {
      safeCallback({ ok: false, error: 'Nama panggilan tidak boleh kosong.' });
      return;
    }

    const newRole = sanitizeText(payload.role, 32) || 'Warga Kampung';
    const oldName = player.name;
    const nameChanged = oldName !== newName;

    // 1. Update persistent citizen record
    const citizen = villageData.citizens.find((c) => c.id === player.citizenId);
    if (citizen) {
      citizen.name = newName;
      citizen.role = newRole;
      citizen.updatedAt = new Date().toISOString();
    }

    // 2. Update active online player(s) sharing this citizenId (handles multi-tab cleanly)
    const updatedSocketIds = [];
    onlinePlayers.forEach((p, sid) => {
      if (p.citizenId === player.citizenId) {
        p.name = newName;
        p.role = newRole;
        updatedSocketIds.push(sid);
      }
    });

    // 3. Update house ownership & labels in data-kampung.json
    const escapedOld = oldName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const oldNameRegex = new RegExp(escapedOld, 'gi');
    const updatedBuildings = [];

    villageData.buildings.forEach((b) => {
      const ownedByCitizen =
        b.ownerId === player.citizenId ||
        (!b.ownerId && b.ownerName && b.ownerName.toLowerCase() === oldName.toLowerCase());
      if (!ownedByCitizen) return;

      b.ownerId = player.citizenId;
      b.ownerName = newName;
      if (b.type === 'rumah' && nameChanged) {
        if (!b.label || b.label.toLowerCase() === `rumah ${oldName.toLowerCase()}` || b.label.toLowerCase() === oldName.toLowerCase()) {
          b.label = `Rumah ${newName}`;
        } else if (oldNameRegex.test(b.label)) {
          b.label = b.label.replace(oldNameRegex, newName).slice(0, 24);
        }
      }
      updatedBuildings.push(b);
    });

    // 4. Keep Mading author metadata consistent for notes written by this citizen
    let madingChanged = false;
    villageData.mading.forEach((note) => {
      if (note.authorId === player.citizenId) {
        note.author = newName;
        note.role = newRole;
        madingChanged = true;
      }
    });

    syncHousingClusterState();
    saveVillageData(villageData);

    const updatePayload = {
      socketId: socket.id,
      socketIds: updatedSocketIds,
      citizenId: player.citizenId,
      oldName,
      name: newName,
      role: newRole,
      updatedBuildings,
      mading: madingChanged ? villageData.mading : null,
    };

    io.emit('player:profileUpdated', updatePayload);
    io.emit('cluster:updated', { housingCluster: villageData.housingCluster });

    if (nameChanged) {
      const sysMsg = {
        id: makeId('sys'),
        system: true,
        text: `✏️ ${oldName} berganti nama menjadi ${newName}.`,
        timestamp: Date.now(),
      };
      recentChat.push(sysMsg);
      if (recentChat.length > 50) recentChat.shift();
      io.emit('chat:message', sysMsg);
    }

    safeCallback({
      ok: true,
      me: player,
      updatedBuildings,
    });
  });

  socket.on('player:move', (payload) => {
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload) return;

    const x = Number(payload.x);
    const y = Number(payload.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    const clampedX = Math.max(48, Math.min(WORLD.WORLD_WIDTH - 48, x));
    const clampedY = Math.max(56, Math.min(WORLD.WORLD_HEIGHT - 22, y));

    if (!WORLD.isWalkable(clampedX, clampedY)) return;

    player.x = Math.round(clampedX * 10) / 10;
    player.y = Math.round(clampedY * 10) / 10;
    if (player.performing && !WORLD.isOnStage(player.x, player.y, 26)) {
      clearStagePerform(socket.id, true);
    }
    if (player.ferrisRide && Math.hypot(player.x - WORLD.NIGHT_MARKET.ferrisWheel.x, player.y - WORLD.NIGHT_MARKET.ferrisWheel.y) > 120) {
      clearFerrisRide(socket.id, true);
    }
    if (['up', 'down', 'left', 'right'].includes(payload.dir)) {
      player.dir = payload.dir;
    }
    player.moving = Boolean(payload.moving);

    socket.broadcast.emit('player:moved', {
      socketId: socket.id,
      x: player.x,
      y: player.y,
      dir: player.dir,
      moving: player.moving,
    });
  });

  socket.on('chat:send', (payload) => {
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload) return;

    const text = sanitizeText(payload.text, 160);
    if (!text) return;

    const message = {
      id: makeId('msg'),
      system: false,
      socketId: socket.id,
      citizenId: player.citizenId,
      name: player.name,
      role: player.role,
      avatar: player.avatar,
      text,
      timestamp: Date.now(),
    };

    recentChat.push(message);
    if (recentChat.length > 50) recentChat.shift();
    io.emit('chat:message', message);
  });

  socket.on('reaction:send', (payload) => {
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload) return;

    const reaction = WORLD.QUICK_REACTIONS.find((r) => r.type === payload.type);
    if (!reaction) return;

    io.emit('player:reaction', {
      id: makeId('rx'),
      socketId: socket.id,
      name: player.name,
      type: reaction.type,
      emoji: reaction.emoji,
      label: reaction.label,
      timestamp: Date.now(),
    });
  });

  socket.on('player:greetTarget', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const sender = onlinePlayers.get(socket.id);
    if (!sender || !payload || typeof payload.targetSocketId !== 'string') {
      safeCallback({ ok: false, error: 'Permintaan tidak valid.' });
      return;
    }

    const target = onlinePlayers.get(payload.targetSocketId);
    if (!target || target.socketId === socket.id) {
      safeCallback({ ok: false, error: 'Warga tujuan sedang tidak online.' });
      return;
    }

    const greetEvent = {
      id: makeId('grt'),
      fromSocketId: sender.socketId,
      fromName: sender.name,
      targetSocketId: target.socketId,
      targetName: target.name,
      message: `Halo ${target.name}! Salam kenal 👋`,
      timestamp: Date.now(),
    };

    io.emit('player:targetedGreet', greetEvent);
    safeCallback({ ok: true, greet: greetEvent });
  });

  socket.on('dm:send', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const sender = onlinePlayers.get(socket.id);
    if (!sender || !payload || typeof payload.targetSocketId !== 'string') {
      safeCallback({ ok: false, error: 'Permintaan tidak valid.' });
      return;
    }

    const target = onlinePlayers.get(payload.targetSocketId);
    if (!target || target.socketId === socket.id) {
      safeCallback({ ok: false, error: 'Penerima sedang tidak berada di kampung.' });
      return;
    }

    const text = sanitizeText(payload.text, 160);
    if (!text) {
      safeCallback({ ok: false, error: 'Pesan pribadi tidak boleh kosong.' });
      return;
    }

    const dm = {
      id: makeId('dm'),
      fromSocketId: sender.socketId,
      fromName: sender.name,
      fromRole: sender.role,
      fromAvatar: sender.avatar,
      targetSocketId: target.socketId,
      targetName: target.name,
      text,
      timestamp: Date.now(),
    };

    // Deliver ONLY to the recipient and the sender — never broadcast to public chat!
    io.to(target.socketId).emit('dm:received', dm);
    socket.emit('dm:received', dm);
    safeCallback({ ok: true, dm });
  });

  socket.on('mading:add', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    const text = sanitizeText(payload.text, 280);
    if (!text) {
      safeCallback({ ok: false, error: 'Catatan tidak boleh kosong.' });
      return;
    }

    const allowedCategories = ['Pengumuman', 'Perkenalan', 'Ajakan', 'Tips'];
    const category = allowedCategories.includes(payload.category)
      ? payload.category
      : 'Pengumuman';

    const allowedColors = WORLD.MADING_COLORS.map((c) => c.id);
    const color = allowedColors.includes(payload.color) ? payload.color : 'cream';

    const note = {
      id: makeId('mad'),
      author: player.name,
      authorId: player.citizenId,
      role: player.role,
      category,
      color,
      text,
      createdAt: new Date().toISOString(),
    };

    villageData.mading.unshift(note);
    if (villageData.mading.length > 100) {
      villageData.mading.length = 100;
    }
    saveVillageData(villageData);

    io.emit('mading:added', note);
    io.emit('stats:update', getStats());
    safeCallback({ ok: true, note });
  });

  socket.on('build:place', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload) {
      safeCallback({ ok: false, error: 'Silakan gabung terlebih dahulu.' });
      return;
    }

    const type = typeof payload.type === 'string' ? payload.type : '';
    const itemMeta = WORLD.BUILD_CATALOG_MAP[type];
    if (!itemMeta) {
      safeCallback({ ok: false, error: 'Item bangunan tidak ditemukan.' });
      return;
    }

    if (itemMeta.adminOnly && !adminSockets.has(socket.id)) {
      safeCallback({ ok: false, error: 'Gedung KOPDES hanya dapat dibangun oleh Pak Kades (Mode Kades).' });
      return;
    }

    let x = Number(payload.x);
    let y = Number(payload.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      safeCallback({ ok: false, error: 'Koordinat tidak valid.' });
      return;
    }

    const snap = itemMeta.snap || 20;
    let snappedKavling = null;
    if (type === 'rumah') {
      const candidate =
        (typeof payload.kavlingId === 'string' &&
          villageData.housingCluster.kavlings.find((k) => k.id === payload.kavlingId)) ||
        WORLD.findClusterKavlingAt(x, y, villageData.housingCluster.kavlings, 18);
      if (candidate) {
        snappedKavling = candidate;
        x = candidate.centerX;
        y = candidate.centerY - 4;
      } else {
        x = Math.round(x / snap) * snap;
        y = Math.round(y / snap) * snap;
      }
    } else {
      x = Math.round(x / snap) * snap;
      y = Math.round(y / snap) * snap;
    }

    const validation = WORLD.validatePlacement(
      type,
      x,
      y,
      villageData.buildings,
      villageData.housingCluster
    );
    if (!validation.ok) {
      safeCallback({ ok: false, error: validation.reason });
      return;
    }

    // Enforce maxHousesPerCitizen configured by Pak Kades (0 = unlimited)
    if (type === 'rumah' && villageData.settings.maxHousesPerCitizen > 0) {
      const ownedCount = villageData.buildings.filter(
        (b) =>
          b.type === 'rumah' &&
          (b.ownerId === player.citizenId ||
            (!b.ownerId && b.ownerName && b.ownerName.toLowerCase() === player.name.toLowerCase()))
      ).length;
      if (ownedCount >= villageData.settings.maxHousesPerCitizen) {
        safeCallback({
          ok: false,
          error: `Batas maksimal rumah per warga adalah ${villageData.settings.maxHousesPerCitizen} rumah (diatur oleh Pak Kades).`,
        });
        return;
      }
    }

    let label = '';
    let businessData = null;

    if (type === 'usaha') {
      const rawBiz = payload.business && typeof payload.business === 'object' ? payload.business : {};
      const bizName = sanitizeText(rawBiz.name, 28);
      if (!bizName) {
        safeCallback({ ok: false, error: 'Nama usaha wajib diisi.' });
        return;
      }
      const allowedCats = WORLD.BUSINESS_CATEGORIES.map((c) => c.id);
      const bizCategory = allowedCats.includes(rawBiz.category)
        ? rawBiz.category
        : WORLD.BUSINESS_CATEGORIES[0].id;
      const bizPromo = sanitizeText(rawBiz.promo, 160);
      label = bizName;
      businessData = {
        name: bizName,
        category: bizCategory,
        promo: bizPromo,
      };
    } else if (type === 'kopdes') {
      label = 'KOPDES';
    } else if (itemMeta.hasLabel) {
      label = sanitizeText(payload.label, 24) || `Rumah ${player.name}`;
    }

    const building = {
      id: makeId('bld'),
      type,
      x,
      y,
      label,
      ownerName: player.name,
      ownerId: player.citizenId,
      createdAt: new Date().toISOString(),
    };

    if (businessData) {
      building.business = businessData;
      building.likes = 0;
      building.likedBy = [];
    }

    if (snappedKavling) {
      building.kavlingId = snappedKavling.id;
    }

    villageData.buildings.push(building);
    syncHousingClusterState();
    saveVillageData(villageData);

    io.emit('build:placed', building);
    if (snappedKavling) {
      io.emit('cluster:updated', {
        housingCluster: villageData.housingCluster,
        event: 'occupied',
        kavlingCode: snappedKavling.code,
        ownerName: player.name,
      });
    }
    io.emit('stats:update', getStats());
    safeCallback({
      ok: true,
      building,
      kavlingCode: snappedKavling ? snappedKavling.code : '',
      housingCluster: villageData.housingCluster,
    });
  });

  // ==================== KOPDES (Koperasi Desa) & Tempat Usaha Warga ====================
  socket.on('kopdes:claimDaily', (callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    const today = getLocalDateKey();
    let member = villageData.kopdes.members.find((m) => m.citizenId === player.citizenId);
    if (!member) {
      member = {
        citizenId: player.citizenId,
        name: player.name,
        role: player.role,
        points: 0,
        lastClaimDate: '',
        joinedAt: new Date().toISOString(),
      };
      villageData.kopdes.members.unshift(member);
    }

    if (member.lastClaimDate === today) {
      safeCallback({
        ok: false,
        error: 'Kamu sudah mengklaim poin harian hari ini. Kembali lagi besok ya!',
        kopdes: villageData.kopdes,
      });
      return;
    }

    member.name = player.name;
    member.role = player.role;
    member.points += 25;
    member.lastClaimDate = today;
    villageData.kopdes.treasury += 10;
    saveVillageData(villageData);

    io.emit('kopdes:updated', {
      kopdes: villageData.kopdes,
      actorName: player.name,
      action: 'claim',
    });
    safeCallback({ ok: true, kopdes: villageData.kopdes, member });
  });

  socket.on('kopdes:contribute', (callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    const member = villageData.kopdes.members.find((m) => m.citizenId === player.citizenId);
    if (!member || member.points < 10) {
      safeCallback({ ok: false, error: 'Poinmu belum cukup (minimal 10 poin untuk menyumbang ke Kas Bersama).' });
      return;
    }

    member.points -= 10;
    villageData.kopdes.treasury += 10;
    saveVillageData(villageData);

    io.emit('kopdes:updated', {
      kopdes: villageData.kopdes,
      actorName: player.name,
      action: 'contribute',
    });
    safeCallback({ ok: true, kopdes: villageData.kopdes, member });
  });

  socket.on('business:support', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload || typeof payload.id !== 'string') {
      safeCallback({ ok: false, error: 'Permintaan tidak valid.' });
      return;
    }

    const building = villageData.buildings.find((b) => b.id === payload.id && b.type === 'usaha');
    if (!building) {
      safeCallback({ ok: false, error: 'Tempat usaha tidak ditemukan.' });
      return;
    }

    if (!Array.isArray(building.likedBy)) {
      building.likedBy = [];
    }

    const idx = building.likedBy.indexOf(player.citizenId);
    let supported = false;
    if (idx === -1) {
      building.likedBy.push(player.citizenId);
      supported = true;
    } else {
      building.likedBy.splice(idx, 1);
      supported = false;
    }
    building.likes = building.likedBy.length;
    saveVillageData(villageData);

    io.emit('build:updated', building);
    io.emit('business:supported', {
      buildingId: building.id,
      businessName: (building.business && building.business.name) || building.label,
      fromName: player.name,
      likes: building.likes,
      supported,
    });

    safeCallback({ ok: true, supported, building });
  });

  socket.on('build:rename', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload || typeof payload.id !== 'string') {
      safeCallback({ ok: false, error: 'Permintaan tidak valid.' });
      return;
    }

    const building = villageData.buildings.find((b) => b.id === payload.id);
    if (!building || building.type !== 'rumah') {
      safeCallback({ ok: false, error: 'Rumah tidak ditemukan.' });
      return;
    }

    const isOwner =
      building.ownerId === player.citizenId ||
      (building.ownerName && building.ownerName.toLowerCase() === player.name.toLowerCase());
    if (!isOwner) {
      safeCallback({ ok: false, error: 'Hanya pemilik rumah yang dapat mengganti papan nama rumah ini.' });
      return;
    }

    const newLabel = sanitizeText(payload.label, 24);
    if (!newLabel) {
      safeCallback({ ok: false, error: 'Nama papan rumah tidak boleh kosong.' });
      return;
    }

    building.label = newLabel;
    building.ownerId = player.citizenId;
    building.ownerName = player.name;
    building.updatedAt = new Date().toISOString();
    syncHousingClusterState();
    saveVillageData(villageData);

    io.emit('build:updated', building);
    io.emit('cluster:updated', { housingCluster: villageData.housingCluster });
    safeCallback({ ok: true, building });
  });

  socket.on('build:remove', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload || typeof payload.id !== 'string') {
      safeCallback({ ok: false, error: 'Permintaan tidak valid.' });
      return;
    }

    const idx = villageData.buildings.findIndex((b) => b.id === payload.id);
    if (idx === -1) {
      safeCallback({ ok: false, error: 'Elemen tidak ditemukan.' });
      return;
    }

    const [removed] = villageData.buildings.splice(idx, 1);
    syncHousingClusterState();
    saveVillageData(villageData);

    io.emit('build:removed', { id: removed.id });
    io.emit('cluster:updated', { housingCluster: villageData.housingCluster });
    io.emit('stats:update', getStats());
    safeCallback({ ok: true, id: removed.id });
  });

  // ==================== Kontrol Komplek Perumahan Pak Kades (Admin) ====================
  socket.on('admin:addClusterBlock', (callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !adminSockets.has(socket.id)) {
      safeCallback({ ok: false, error: 'Akses ditolak. Masuk Mode Pak Kades terlebih dahulu.' });
      return;
    }

    const current = villageData.housingCluster.blockCount;
    if (current >= WORLD.HOUSING_CLUSTER.maxBlockCount) {
      safeCallback({
        ok: false,
        error: `Seluruh blok komplek (Blok A–${WORLD.HOUSING_CLUSTER.blockLetters[current - 1]}) sudah dibuka.`,
      });
      return;
    }

    villageData.housingCluster.blockCount = current + 1;
    const newLetter = WORLD.HOUSING_CLUSTER.blockLetters[current];
    syncHousingClusterState();
    saveVillageData(villageData);

    io.emit('cluster:updated', {
      housingCluster: villageData.housingCluster,
      event: 'blockAdded',
      blockLetter: newLetter,
      actorName: player.name,
    });

    const sysMsg = {
      id: makeId('cls'),
      system: true,
      text: `🏘️✨ ${player.name} membuka Blok ${newLetter} (${newLetter}-01 s.d. ${newLetter}-04) di Komplek Hunian Warga!`,
      timestamp: Date.now(),
    };
    recentChat.push(sysMsg);
    if (recentChat.length > 50) recentChat.shift();
    io.emit('chat:message', sysMsg);

    safeCallback({
      ok: true,
      blockLetter: newLetter,
      housingCluster: villageData.housingCluster,
    });
  });

  socket.on('admin:clearKavling', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !adminSockets.has(socket.id)) {
      safeCallback({ ok: false, error: 'Akses ditolak. Masuk Mode Pak Kades terlebih dahulu.' });
      return;
    }

    const kavlingId = payload && typeof payload.kavlingId === 'string' ? payload.kavlingId.trim() : '';
    const kavling = villageData.housingCluster.kavlings.find((k) => k.id === kavlingId);
    if (!kavling) {
      safeCallback({ ok: false, error: 'Nomor kavling tidak ditemukan.' });
      return;
    }

    if (!kavling.occupiedByBuildingId) {
      safeCallback({ ok: false, error: `${kavling.code} sudah kosong (Tersedia).` });
      return;
    }

    const bIdx = villageData.buildings.findIndex((b) => b.id === kavling.occupiedByBuildingId);
    let removedId = kavling.occupiedByBuildingId;
    if (bIdx !== -1) {
      removedId = villageData.buildings[bIdx].id;
      villageData.buildings.splice(bIdx, 1);
    }

    syncHousingClusterState();
    saveVillageData(villageData);

    io.emit('build:removed', { id: removedId });
    io.emit('cluster:updated', {
      housingCluster: villageData.housingCluster,
      event: 'kavlingCleared',
      kavlingCode: kavling.code,
      actorName: player.name,
    });
    io.emit('stats:update', getStats());

    safeCallback({
      ok: true,
      kavlingCode: kavling.code,
      housingCluster: villageData.housingCluster,
    });
  });

  // ==================== Panel Kontrol Pak Kades (Admin Mode) ====================
  socket.on('admin:auth', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player) {
      safeCallback({ ok: false, error: 'Silakan gabung ke kampung terlebih dahulu.' });
      return;
    }

    const pin = payload && payload.pin !== undefined ? String(payload.pin).trim() : '';
    if (pin !== ADMIN_PIN) {
      safeCallback({ ok: false, error: 'PIN salah. Masukkan PIN rahasia Pak Kades.' });
      return;
    }

    adminSockets.add(socket.id);
    player.isAdmin = true;
    io.emit('player:adminStatus', { socketId: socket.id, isAdmin: true });
    safeCallback({
      ok: true,
      settings: villageData.settings,
      isAdmin: true,
      canMegaphone: true,
    });
  });

  socket.on('admin:logout', (callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    adminSockets.delete(socket.id);
    const player = onlinePlayers.get(socket.id);
    if (player) {
      player.isAdmin = false;
      io.emit('player:adminStatus', { socketId: socket.id, isAdmin: false });
    }
    safeCallback({
      ok: true,
      isAdmin: false,
      canMegaphone: canUseMegaphone(socket.id, player),
    });
  });

  socket.on('admin:updateSettings', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !adminSockets.has(socket.id)) {
      safeCallback({ ok: false, error: 'Akses ditolak. Aktifkan Mode Kades terlebih dahulu.' });
      return;
    }
    if (!payload || typeof payload !== 'object') {
      safeCallback({ ok: false, error: 'Pengaturan tidak valid.' });
      return;
    }

    let ambianceChanged = false;
    let maxHousesChanged = false;
    let festivalChanged = false;

    if (payload.maxHousesPerCitizen !== undefined) {
      const nextMax = Number(payload.maxHousesPerCitizen);
      if (Number.isInteger(nextMax) && nextMax >= 0 && nextMax <= 20) {
        if (villageData.settings.maxHousesPerCitizen !== nextMax) {
          villageData.settings.maxHousesPerCitizen = nextMax;
          maxHousesChanged = true;
        }
      }
    }

    if (typeof payload.ambiance === 'string' && ['pagi', 'sore', 'senja'].includes(payload.ambiance)) {
      if (villageData.settings.ambiance !== payload.ambiance) {
        villageData.settings.ambiance = payload.ambiance;
        ambianceChanged = true;
      }
    }

    if (typeof payload.festivalMode === 'boolean') {
      if (villageData.settings.festivalMode !== payload.festivalMode) {
        villageData.settings.festivalMode = payload.festivalMode;
        festivalChanged = true;
      }
    }

    if (typeof payload.toggleMegaphoneCitizenId === 'string' && payload.toggleMegaphoneCitizenId.trim()) {
      const targetCitId = payload.toggleMegaphoneCitizenId.trim();
      const list = villageData.settings.megaphoneAllowedIds;
      const idx = list.indexOf(targetCitId);
      if (idx === -1) {
        list.push(targetCitId);
      } else {
        list.splice(idx, 1);
      }
    }

    saveVillageData(villageData);

    io.emit('village:settingsUpdated', {
      settings: villageData.settings,
      changedBy: player.name,
      ambianceChanged,
      maxHousesChanged,
      festivalChanged,
    });

    if (festivalChanged) {
      const festMsg = {
        id: makeId('fst'),
        system: true,
        text: villageData.settings.festivalMode
          ? `🎆🎪 ${player.name} menyalakan MODE FESTIVAL PASAR MALAM! Lampu hias & kembang api menyala di seluruh kampung!`
          : `🏮 ${player.name} mengakhiri mode Festival Pasar Malam. Pasar Malam tetap buka dengan suasana hangat.`,
        timestamp: Date.now(),
      };
      recentChat.push(festMsg);
      if (recentChat.length > 50) recentChat.shift();
      io.emit('chat:message', festMsg);
    }

    safeCallback({ ok: true, settings: villageData.settings });
  });

  // ==================== Megafon Suara (Push-to-Talk Real-Time Broadcast) ====================
  socket.on('megaphone:talking', (payload) => {
    const player = onlinePlayers.get(socket.id);
    if (!player || !canUseMegaphone(socket.id, player)) return;
    io.emit('megaphone:status', {
      socketId: socket.id,
      name: player.name,
      talking: Boolean(payload && payload.talking),
    });
  });

  socket.on('megaphone:broadcast', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !canUseMegaphone(socket.id, player)) {
      safeCallback({ ok: false, error: 'Anda belum memiliki izin Megafon Kampung.' });
      return;
    }

    const chimeOnly = Boolean(payload && payload.chimeOnly);
    const audioBase64 = payload && typeof payload.audioBase64 === 'string' ? payload.audioBase64 : '';
    const mimeType =
      payload && typeof payload.mimeType === 'string' && payload.mimeType.startsWith('audio/')
        ? payload.mimeType.slice(0, 64)
        : 'audio/webm';
    const durationMs = Math.max(400, Math.min(15000, Number(payload && payload.durationMs) || 2500));

    if (!chimeOnly && (!audioBase64 || audioBase64.length > 1800000)) {
      safeCallback({ ok: false, error: 'Rekaman suara kosong atau melebihi batas ukuran.' });
      return;
    }

    const broadcastData = {
      id: makeId('meg'),
      fromSocketId: socket.id,
      fromName: player.name,
      fromRole: player.role,
      chimeOnly,
      audioBase64: chimeOnly ? '' : audioBase64,
      mimeType,
      durationMs,
      timestamp: Date.now(),
    };

    // Stop live recording status indicator
    io.emit('megaphone:status', { socketId: socket.id, name: player.name, talking: false });

    // Deliver audio playback & megaphone visual to all other online citizens
    socket.broadcast.emit('megaphone:play', broadcastData);

    const listenersCount = Math.max(0, onlinePlayers.size - 1);
    safeCallback({ ok: true, listenersCount, broadcast: broadcastData });
  });

  // ==================== Area Mancing Mania (Interactive Fishing Mini-Game) ====================
  socket.on('fishing:cast', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    if (!WORLD.isNearFishingPier(player.x, player.y)) {
      safeCallback({ ok: false, error: 'Berjalanlah mendekati Dermaga Kayu Mancing terlebih dahulu.' });
      return;
    }

    clearFishingSession(socket.id, false);

    const bobber = WORLD.getBobberSpot(player.x, player.y);
    const session = {
      state: 'waiting',
      bobberX: bobber.x,
      bobberY: bobber.y,
      castX: player.x,
      castY: player.y,
      waitTimer: null,
      escapeTimer: null,
    };

    player.fishing = { state: 'waiting', bobberX: bobber.x, bobberY: bobber.y };
    fishingSessions.set(socket.id, session);

    io.emit('player:fishingState', {
      socketId: socket.id,
      state: 'waiting',
      bobberX: bobber.x,
      bobberY: bobber.y,
    });

    // Random wait between 3 and 7 seconds before STRIKE!
    const waitMs = 3000 + Math.floor(Math.random() * 4000);
    session.waitTimer = setTimeout(() => {
      const liveSess = fishingSessions.get(socket.id);
      const livePlayer = onlinePlayers.get(socket.id);
      if (!liveSess || !livePlayer || liveSess.state !== 'waiting') return;

      liveSess.state = 'strike';
      livePlayer.fishing = {
        state: 'strike',
        bobberX: liveSess.bobberX,
        bobberY: liveSess.bobberY,
      };

      io.emit('player:fishingState', {
        socketId: socket.id,
        state: 'strike',
        bobberX: liveSess.bobberX,
        bobberY: liveSess.bobberY,
        windowMs: 3000,
      });

      // Player has 3 seconds to press "Tarik Kail!" before the fish escapes
      liveSess.escapeTimer = setTimeout(() => {
        const curSess = fishingSessions.get(socket.id);
        if (!curSess || curSess.state !== 'strike') return;
        clearFishingSession(socket.id, true);
        socket.emit('fishing:escaped', {
          message: 'Yah, ikannya lepas! Coba lempar kail lagi ya.',
        });
      }, 3050);
    }, waitMs);

    safeCallback({ ok: true, bobberX: bobber.x, bobberY: bobber.y });
  });

  socket.on('fishing:reel', (callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    const session = fishingSessions.get(socket.id);
    if (!player || !session) {
      safeCallback({ ok: false, error: 'Tidak sedang memancing.' });
      return;
    }

    if (session.state !== 'strike') {
      clearFishingSession(socket.id, true);
      safeCallback({ ok: false, error: 'Terlalu cepat! Tunggu tanda ❗ STRIKE! dulu sebelum menarik kail.' });
      return;
    }

    clearFishingSession(socket.id, true);

    const catchItem = rollFishingCatch();
    let angler = villageData.fishing.anglers.find((a) => a.citizenId === player.citizenId);
    if (!angler) {
      angler = {
        citizenId: player.citizenId,
        name: player.name,
        role: player.role,
        totalPoints: 0,
        totalCatches: 0,
        bestCatch: '',
        bestPoints: 0,
        updatedAt: new Date().toISOString(),
      };
      villageData.fishing.anglers.push(angler);
    }

    angler.name = player.name;
    angler.role = player.role;
    angler.totalPoints += catchItem.points;
    angler.totalCatches += 1;
    if (catchItem.points >= angler.bestPoints) {
      angler.bestPoints = catchItem.points;
      angler.bestCatch = `${catchItem.name} ${catchItem.emoji}`;
    }
    angler.updatedAt = new Date().toISOString();

    // Also record separately into active Tournament standings if a tournament is running!
    let tournamentScore = null;
    if (villageData.fishing.tournament && villageData.fishing.tournament.active) {
      let tEntry = villageData.fishing.tournament.scores.find(
        (s) => s.citizenId === player.citizenId
      );
      if (!tEntry) {
        tEntry = {
          citizenId: player.citizenId,
          name: player.name,
          role: player.role,
          points: 0,
          catches: 0,
          bestCatch: '',
          bestPoints: 0,
        };
        villageData.fishing.tournament.scores.push(tEntry);
      }
      tEntry.name = player.name;
      tEntry.role = player.role;
      tEntry.points += catchItem.points;
      tEntry.catches += 1;
      if (catchItem.points >= tEntry.bestPoints) {
        tEntry.bestPoints = catchItem.points;
        tEntry.bestCatch = `${catchItem.name} ${catchItem.emoji}`;
      }
      tournamentScore = tEntry.points;
    }

    saveVillageData(villageData);

    const fishingPayload = getPublicFishingPayload();
    const leaderboard = fishingPayload.leaderboard;

    io.emit('fishing:caught', {
      socketId: socket.id,
      citizenId: player.citizenId,
      name: player.name,
      catchItem,
      anglerTotalPoints: angler.totalPoints,
      tournamentScore,
      leaderboard,
      fishingState: fishingPayload,
      timestamp: Date.now(),
    });

    // Announce rare catches in public live chat!
    if (catchItem.rare) {
      const rareMsg = {
        id: makeId('fsh'),
        system: true,
        text: `🎣🏆 Hebat! ${player.name} berhasil menangkap ${catchItem.name} ${catchItem.emoji} (+${catchItem.points} poin) di Dermaga Mancing!`,
        timestamp: Date.now(),
      };
      recentChat.push(rareMsg);
      if (recentChat.length > 50) recentChat.shift();
      io.emit('chat:message', rareMsg);
    }

    safeCallback({
      ok: true,
      catchItem,
      anglerTotalPoints: angler.totalPoints,
      leaderboard,
    });
  });

  socket.on('fishing:cancel', () => {
    clearFishingSession(socket.id, true);
  });

  // ==================== Kontrol Lomba Mancing Pak Kades (Admin) ====================
  socket.on('admin:startTournament', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !adminSockets.has(socket.id)) {
      safeCallback({ ok: false, error: 'Akses ditolak. Masuk Mode Kades terlebih dahulu.' });
      return;
    }
    if (villageData.fishing.tournament.active) {
      safeCallback({ ok: false, error: 'Lomba Mancing sedang berlangsung.' });
      return;
    }
    const allowedDurations = ['15m', '1h', 'weekend'];
    const durationKey =
      payload && allowedDurations.includes(payload.durationKey) ? payload.durationKey : '1h';
    const resPayload = startFishingTournament({
      mode: durationKey === 'weekend' ? 'weekend' : 'manual',
      durationKey,
      startedBy: player.name,
    });
    safeCallback({ ok: true, fishingState: resPayload });
  });

  socket.on('admin:endTournament', (callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !adminSockets.has(socket.id)) {
      safeCallback({ ok: false, error: 'Akses ditolak. Masuk Mode Kades terlebih dahulu.' });
      return;
    }
    if (!villageData.fishing.tournament.active) {
      safeCallback({ ok: false, error: 'Tidak ada lomba yang sedang berlangsung.' });
      return;
    }
    const result = endFishingTournament({ endedBy: player.name, isManual: true });
    safeCallback({ ok: true, result });
  });

  // ==================== Area Pasar Malam & Hiburan (Real-Time Multiplayer) ====================
  socket.on('nightMarket:orderSnack', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player || !payload || typeof payload.stallId !== 'string') {
      safeCallback({ ok: false, error: 'Stand jajanan tidak ditemukan.' });
      return;
    }

    const stall = WORLD.NIGHT_MARKET.foodStalls.find((s) => s.id === payload.stallId);
    if (!stall) {
      safeCallback({ ok: false, error: 'Stand kuliner tidak dikenal.' });
      return;
    }

    const now = Date.now();
    const snack = {
      id: stall.id,
      icon: stall.icon,
      name: stall.shortName,
      until: now + 35000,
    };
    player.heldSnack = snack;

    io.emit('nightMarket:snackOrdered', {
      socketId: socket.id,
      name: player.name,
      stallId: stall.id,
      snack,
      bubble: stall.bubble,
      timestamp: now,
    });

    safeCallback({ ok: true, snack, bubble: stall.bubble });
  });

  socket.on('nightMarket:rideFerris', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    const action = payload && payload.action === 'exit' ? 'exit' : 'board';
    if (action === 'exit') {
      clearFerrisRide(socket.id, true);
      safeCallback({ ok: true, riding: false });
      return;
    }

    clearFishingSession(socket.id, true);
    clearStagePerform(socket.id, true);
    clearFerrisRide(socket.id, false);

    // Find an unoccupied cabin (0..5)
    const usedCabins = new Set();
    onlinePlayers.forEach((p) => {
      if (p.ferrisRide && typeof p.ferrisRide.cabinIndex === 'number') {
        usedCabins.add(p.ferrisRide.cabinIndex);
      }
    });
    const cabinCount = WORLD.NIGHT_MARKET.ferrisWheel.cabinCount || 6;
    let cabinIndex = 0;
    for (let i = 0; i < cabinCount; i++) {
      if (!usedCabins.has(i)) {
        cabinIndex = i;
        break;
      }
    }

    const now = Date.now();
    const durationMs = WORLD.NIGHT_MARKET.ferrisWheel.rideDurationMs || 10000;
    const ride = {
      cabinIndex,
      startedAt: now,
      endsAt: now + durationMs,
    };
    player.ferrisRide = ride;
    player.moving = false;

    const timer = setTimeout(() => {
      clearFerrisRide(socket.id, true);
    }, durationMs);
    ferrisTimers.set(socket.id, timer);

    io.emit('nightMarket:ferrisUpdate', {
      socketId: socket.id,
      name: player.name,
      riding: true,
      ride,
      bubble: 'Seru banget naik Bianglala Mini! 🎡✨',
      timestamp: now,
    });

    safeCallback({ ok: true, riding: true, ride });
  });

  socket.on('nightMarket:spinWheel', (callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    const now = Date.now();
    const cooldownUntil = wheelCooldowns.get(player.citizenId) || 0;
    if (now < cooldownUntil) {
      const waitSec = Math.ceil((cooldownUntil - now) / 1000);
      safeCallback({
        ok: false,
        error: `Roda Keberuntungan sedang istirahat. Coba lagi dalam ${waitSec} detik ya!`,
        cooldownUntil,
      });
      return;
    }

    const prize = rollWheelPrize();
    const nextCooldown = now + (WORLD.NIGHT_MARKET.luckyWheel.cooldownMs || 60000);
    wheelCooldowns.set(player.citizenId, nextCooldown);

    const prevPts = villageData.nightMarket.pointsByCitizen[player.citizenId] || 0;
    const totalPoints = prevPts + prize.points;
    villageData.nightMarket.pointsByCitizen[player.citizenId] = totalPoints;
    saveVillageData(villageData);

    let funTitle = null;
    if (prize.funTitle) {
      funTitle = {
        label: prize.funTitle,
        expiresAt: now + 10 * 60 * 1000, // 10 menit gelar hiburan lucu
      };
      player.funTitle = funTitle;
    }

    const bubble = prize.funTitle
      ? `Hore! Dapat ${prize.funTitle} & +${prize.points} poin! 🎯`
      : `Putar Roda Hiburan dapat +${prize.points} poin! ${prize.emoji}`;

    io.emit('nightMarket:wheelResult', {
      socketId: socket.id,
      citizenId: player.citizenId,
      name: player.name,
      prize,
      totalPoints,
      funTitle,
      bubble,
      cooldownUntil: nextCooldown,
      timestamp: now,
    });

    if (prize.funTitle || prize.points >= 20) {
      const winMsg = {
        id: makeId('whl'),
        system: true,
        text: `🎯✨ ${player.name} memutar Roda Keberuntungan di Pasar Malam dan memenangkan ${prize.label}!`,
        timestamp: now,
      };
      recentChat.push(winMsg);
      if (recentChat.length > 50) recentChat.shift();
      io.emit('chat:message', winMsg);
    }

    safeCallback({
      ok: true,
      prize,
      totalPoints,
      funTitle,
      cooldownUntil: nextCooldown,
    });
  });

  socket.on('nightMarket:stagePerform', (payload, callback) => {
    const safeCallback = typeof callback === 'function' ? callback : () => {};
    const player = onlinePlayers.get(socket.id);
    if (!player) {
      safeCallback({ ok: false, error: 'Silakan gabung sebagai warga terlebih dahulu.' });
      return;
    }

    const action = payload && payload.action === 'stop' ? 'stop' : 'start';
    if (action === 'stop') {
      clearStagePerform(socket.id, true);
      safeCallback({ ok: true, performing: false });
      return;
    }

    clearFishingSession(socket.id, true);
    clearFerrisRide(socket.id, true);
    clearStagePerform(socket.id, false);

    const now = Date.now();
    const durationMs = WORLD.NIGHT_MARKET.stage.performDurationMs || 25000;
    const perf = {
      startedAt: now,
      endsAt: now + durationMs,
    };
    player.performing = perf;

    const timer = setTimeout(() => {
      clearStagePerform(socket.id, true);
    }, durationMs);
    stageTimers.set(socket.id, timer);

    io.emit('nightMarket:stageUpdate', {
      socketId: socket.id,
      name: player.name,
      performing: true,
      perf,
      bubble: '🎸 Sedang tampil main musik di Panggung Pasar Malam! 🎶',
      timestamp: now,
    });

    safeCallback({ ok: true, performing: true, perf });
  });

  socket.on('disconnect', () => {
    clearFishingSession(socket.id, false);
    clearFerrisRide(socket.id, true);
    clearStagePerform(socket.id, true);
    adminSockets.delete(socket.id);
    const player = onlinePlayers.get(socket.id);
    if (player) {
      onlinePlayers.delete(socket.id);
      io.emit('player:left', { socketId: socket.id, name: player.name });
      io.emit('stats:update', getStats());
    }
  });
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} sudah digunakan proses lain. Tutup proses lama atau ubah PORT.`);
  } else {
    console.error('Kesalahan server HTTP:', err ? err.message : err);
  }
});

checkTournamentSchedule();
setInterval(checkTournamentSchedule, 10000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Kampung Hijau Harmoni berjalan di http://localhost:${PORT} (bind 0.0.0.0, penyimpanan lokal data-kampung.json)`);
});
