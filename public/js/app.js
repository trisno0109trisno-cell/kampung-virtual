(function () {
  const W = window.WORLD_CONFIG;
  const R = window.VILLAGE_RENDERER;

  const STORAGE_KEY = 'kampung_hijau_profile_v1';
  const PLAYER_ID_KEY = 'kampung_hijau_player_id';
  const PLAYER_NAME_KEY = 'kampung_hijau_player_name';

  // DOM references
  const canvas = document.getElementById('villageCanvas');
  const ctx = canvas.getContext('2d');

  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const welcomeOnline = document.getElementById('welcomeOnline');
  const welcomeTotal = document.getElementById('welcomeTotal');
  const joinForm = document.getElementById('joinForm');
  const inputName = document.getElementById('inputName');
  const inputRole = document.getElementById('inputRole');
  const shirtColorPicker = document.getElementById('shirtColorPicker');
  const hairStylePicker = document.getElementById('hairStylePicker');
  const joinError = document.getElementById('joinError');
  const avatarPreviewCanvas = document.getElementById('avatarPreview');
  const avatarPreviewCtx = avatarPreviewCanvas.getContext('2d');

  const gameHud = document.getElementById('gameHud');
  const hudMyProfile = document.getElementById('hudMyProfile');
  const btnEditProfile = document.getElementById('btnEditProfile');
  const hudOnlineCount = document.getElementById('hudOnlineCount');
  const hudTotalCitizens = document.getElementById('hudTotalCitizens');
  const madingBadgeCount = document.getElementById('madingBadgeCount');

  const btnActiveCitizens = document.getElementById('btnActiveCitizens');
  const onlinePanel = document.getElementById('onlinePanel');
  const btnCloseCitizens = document.getElementById('btnCloseCitizens');
  const activeCitizensList = document.getElementById('activeCitizensList');

  const cameraFocusBanner = document.getElementById('cameraFocusBanner');
  const cameraFocusLabel = document.getElementById('cameraFocusLabel');
  const btnReturnCamera = document.getElementById('btnReturnCamera');

  const minimapCanvas = document.getElementById('minimapCanvas');
  const minimapCtx = minimapCanvas ? minimapCanvas.getContext('2d') : null;

  const btnCameraCycle = document.getElementById('btnCameraCycle');
  const cameraModeLabel = document.getElementById('cameraModeLabel');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  const btnZoomIn = document.getElementById('btnZoomIn');

  const editProfileModal = document.getElementById('editProfileModal');
  const btnCloseEditProfile = document.getElementById('btnCloseEditProfile');
  const btnCancelEditProfile = document.getElementById('btnCancelEditProfile');
  const editProfileForm = document.getElementById('editProfileForm');
  const editName = document.getElementById('editName');
  const editRole = document.getElementById('editRole');
  const editProfileError = document.getElementById('editProfileError');

  const editHouseModal = document.getElementById('editHouseModal');
  const btnCloseEditHouse = document.getElementById('btnCloseEditHouse');
  const btnCancelEditHouse = document.getElementById('btnCancelEditHouse');
  const editHouseForm = document.getElementById('editHouseForm');
  const editHouseName = document.getElementById('editHouseName');
  const editHouseError = document.getElementById('editHouseError');

  const btnOpenMading = document.getElementById('btnOpenMading');
  const madingModal = document.getElementById('madingModal');
  const btnCloseMading = document.getElementById('btnCloseMading');
  const madingForm = document.getElementById('madingForm');
  const madingCategory = document.getElementById('madingCategory');
  const madingColorPicker = document.getElementById('madingColorPicker');
  const madingText = document.getElementById('madingText');
  const madingCharCount = document.getElementById('madingCharCount');
  const madingList = document.getElementById('madingList');

  const chatPanel = document.getElementById('chatPanel');
  const btnToggleChat = document.getElementById('btnToggleChat');
  const btnCloseChat = document.getElementById('btnCloseChat');
  const chatUnreadDot = document.getElementById('chatUnreadDot');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const floatingReactions = document.getElementById('floatingReactions');

  const buildCatalogList = document.getElementById('buildCatalogList');
  const buildStatusText = document.getElementById('buildStatusText');
  const houseLabelBar = document.getElementById('houseLabelBar');
  const inputHouseLabel = document.getElementById('inputHouseLabel');
  const btnDeleteMode = document.getElementById('btnDeleteMode');
  const btnCancelBuild = document.getElementById('btnCancelBuild');

  const mobileJoystick = document.getElementById('mobileJoystick');
  const joystickBase = document.getElementById('joystickBase');
  const joystickKnob = document.getElementById('joystickKnob');
  const toastContainer = document.getElementById('toastContainer');

  const playerInteractionCard = document.getElementById('playerInteractionCard');
  const playerCardAvatarDot = document.getElementById('playerCardAvatarDot');
  const playerCardName = document.getElementById('playerCardName');
  const playerCardRole = document.getElementById('playerCardRole');
  const playerCardStatus = document.getElementById('playerCardStatus');
  const btnClosePlayerCard = document.getElementById('btnClosePlayerCard');
  const btnGreetTarget = document.getElementById('btnGreetTarget');
  const btnToggleDmInput = document.getElementById('btnToggleDmInput');
  const cardDmForm = document.getElementById('cardDmForm');
  const cardDmInput = document.getElementById('cardDmInput');
  const dmNotificationStack = document.getElementById('dmNotificationStack');

  const btnKadesMenu = document.getElementById('btnKadesMenu');
  const kadesBtnIcon = document.getElementById('kadesBtnIcon');
  const kadesBtnLabel = document.getElementById('kadesBtnLabel');
  const kadesPinModal = document.getElementById('kadesPinModal');
  const btnCloseKadesPin = document.getElementById('btnCloseKadesPin');
  const btnCancelKadesPin = document.getElementById('btnCancelKadesPin');
  const kadesPinForm = document.getElementById('kadesPinForm');
  const inputKadesPin = document.getElementById('inputKadesPin');
  const kadesPinError = document.getElementById('kadesPinError');

  const kadesPanelModal = document.getElementById('kadesPanelModal');
  const btnCloseKadesPanel = document.getElementById('btnCloseKadesPanel');
  const btnKadesDone = document.getElementById('btnKadesDone');
  const btnKadesLogout = document.getElementById('btnKadesLogout');
  const kadesCurrentHouseLimit = document.getElementById('kadesCurrentHouseLimit');
  const kadesDeleteStateBadge = document.getElementById('kadesDeleteStateBadge');
  const btnKadesToggleDelete = document.getElementById('btnKadesToggleDelete');
  const kadesMegaphoneList = document.getElementById('kadesMegaphoneList');

  const megaphoneDock = document.getElementById('megaphoneDock');
  const btnMegaphonePtt = document.getElementById('btnMegaphonePtt');
  const megPttLabel = document.getElementById('megPttLabel');
  const megTimer = document.getElementById('megTimer');
  const btnMegaphoneChime = document.getElementById('btnMegaphoneChime');
  const megaphoneBanner = document.getElementById('megaphoneBanner');
  const megaphoneBannerText = document.getElementById('megaphoneBannerText');
  const btnReplayMegaphone = document.getElementById('btnReplayMegaphone');

  const kopdesModal = document.getElementById('kopdesModal');
  const btnCloseKopdes = document.getElementById('btnCloseKopdes');
  const kopdesTreasury = document.getElementById('kopdesTreasury');
  const kopdesMemberCount = document.getElementById('kopdesMemberCount');
  const kopdesMyPoints = document.getElementById('kopdesMyPoints');
  const kopdesClaimBadge = document.getElementById('kopdesClaimBadge');
  const btnKopdesClaim = document.getElementById('btnKopdesClaim');
  const btnKopdesContribute = document.getElementById('btnKopdesContribute');
  const kopdesMembersList = document.getElementById('kopdesMembersList');

  const createBusinessModal = document.getElementById('createBusinessModal');
  const btnCloseCreateBiz = document.getElementById('btnCloseCreateBiz');
  const btnCancelCreateBiz = document.getElementById('btnCancelCreateBiz');
  const createBusinessForm = document.getElementById('createBusinessForm');
  const inputBizName = document.getElementById('inputBizName');
  const inputBizCategory = document.getElementById('inputBizCategory');
  const inputBizPromo = document.getElementById('inputBizPromo');
  const createBizError = document.getElementById('createBizError');

  const businessProfileModal = document.getElementById('businessProfileModal');
  const btnCloseBizProfile = document.getElementById('btnCloseBizProfile');
  const bizProfileCategory = document.getElementById('bizProfileCategory');
  const bizProfileTitle = document.getElementById('bizProfileTitle');
  const bizProfileOwner = document.getElementById('bizProfileOwner');
  const bizProfilePromo = document.getElementById('bizProfilePromo');
  const bizLikesCount = document.getElementById('bizLikesCount');
  const btnSupportBusiness = document.getElementById('btnSupportBusiness');

  const btnFishingLeaderboard = document.getElementById('btnFishingLeaderboard');
  const fishingActionBar = document.getElementById('fishingActionBar');
  const btnFishAction = document.getElementById('btnFishAction');
  const fishActionText = document.getElementById('fishActionText');
  const fishStrikeProgressWrap = document.getElementById('fishStrikeProgressWrap');
  const fishStrikeBar = document.getElementById('fishStrikeBar');
  const btnFishBoardQuick = document.getElementById('btnFishBoardQuick');
  const fishingLeaderboardModal = document.getElementById('fishingLeaderboardModal');
  const btnCloseFishBoard = document.getElementById('btnCloseFishBoard');
  const btnDoneFishBoard = document.getElementById('btnDoneFishBoard');
  const btnWalkToPier = document.getElementById('btnWalkToPier');
  const fishingLeaderboardList = document.getElementById('fishingLeaderboardList');

  const tournamentBanner = document.getElementById('tournamentBanner');
  const tournamentBannerTitle = document.getElementById('tournamentBannerTitle');
  const tournamentCountdown = document.getElementById('tournamentCountdown');
  const btnOpenTournamentStandings = document.getElementById('btnOpenTournamentStandings');
  const kadesTournamentBadge = document.getElementById('kadesTournamentBadge');
  const btnKadesTournamentToggle = document.getElementById('btnKadesTournamentToggle');

  const reigningChampionBanner = document.getElementById('reigningChampionBanner');
  const reigningChampionName = document.getElementById('reigningChampionName');
  const fishTabTournament = document.getElementById('fishTabTournament');
  const fishTabAlltime = document.getElementById('fishTabAlltime');
  const fishTabHistory = document.getElementById('fishTabHistory');
  const fishTourneyTabTitle = document.getElementById('fishTourneyTabTitle');
  const fishTourneyStatusPill = document.getElementById('fishTourneyStatusPill');
  const fishTourneySubtext = document.getElementById('fishTourneySubtext');
  const tournamentStandingsList = document.getElementById('tournamentStandingsList');
  const tournamentHistoryList = document.getElementById('tournamentHistoryList');

  const tournamentWinnerModal = document.getElementById('tournamentWinnerModal');
  const btnCloseWinnerModal = document.getElementById('btnCloseWinnerModal');
  const btnOkWinnerModal = document.getElementById('btnOkWinnerModal');
  const winnerModalTitle = document.getElementById('winnerModalTitle');
  const winnerModalSub = document.getElementById('winnerModalSub');
  const winnerPodiumList = document.getElementById('winnerPodiumList');

  const btnGoNightMarket = document.getElementById('btnGoNightMarket');
  const festivalBanner = document.getElementById('festivalBanner');
  const btnFestivalVisit = document.getElementById('btnFestivalVisit');
  const nightMarketActionBar = document.getElementById('nightMarketActionBar');
  const btnNightMarketAction = document.getElementById('btnNightMarketAction');
  const nmActionText = document.getElementById('nmActionText');
  const btnStageAudioMute = document.getElementById('btnStageAudioMute');
  const nmPointsBadge = document.getElementById('nmPointsBadge');
  const kadesFestivalBadge = document.getElementById('kadesFestivalBadge');
  const btnKadesFestivalToggle = document.getElementById('btnKadesFestivalToggle');

  const btnGoCluster = document.getElementById('btnGoCluster');
  const clusterDirectoryModal = document.getElementById('clusterDirectoryModal');
  const btnCloseClusterDir = document.getElementById('btnCloseClusterDir');
  const btnDoneClusterDir = document.getElementById('btnDoneClusterDir');
  const btnDirStartBuildHouse = document.getElementById('btnDirStartBuildHouse');
  const cdTotalKavling = document.getElementById('cdTotalKavling');
  const cdOccupiedCount = document.getElementById('cdOccupiedCount');
  const cdAvailableCount = document.getElementById('cdAvailableCount');
  const clusterDirectoryList = document.getElementById('clusterDirectoryList');
  const kadesClusterBadge = document.getElementById('kadesClusterBadge');
  const btnKadesAddClusterBlock = document.getElementById('btnKadesAddClusterBlock');
  const kadesOccupiedKavlingList = document.getElementById('kadesOccupiedKavlingList');

  // Application state
  const socket = io();
  let joined = false;
  let mySocketId = null;
  let myCitizenId = null;
  let ambiance = 'sore';
  let isAdmin = false;
  let canMegaphone = false;
  let villageSettings = {
    maxHousesPerCitizen: 3,
    ambiance: 'sore',
    megaphoneAllowedIds: [],
    festivalMode: false,
  };

  let nightMarketPoints = 0;
  let wheelCooldownUntil = 0;
  let hoveredNightMarket = null;
  let nearbyNightMarket = null;
  let hoveredClusterDirectory = false;
  let cameraVisitTarget = null; // { x, y, label } when visiting a cluster house/kavling from Directory
  let housingCluster = {
    blockCount: W.HOUSING_CLUSTER ? W.HOUSING_CLUSTER.defaultBlockCount : 2,
    kavlings: W.generateClusterKavlings ? W.generateClusterKavlings(2) : [],
  };
  let stageAudioMuted = false;
  let stageMusicInterval = null;
  let stageMusicStep = 0;
  const wheelSpinAnim = {
    active: false,
    startedAt: 0,
    durationMs: 2600,
    startAngle: 0,
    totalSpin: 0,
  };

  let selectedAvatar = {
    shirtColor: W.SHIRT_COLORS[0].hex,
    hairStyle: W.HAIR_STYLES[0].id,
  };
  let selectedMadingColor = W.MADING_COLORS[0].id;

  const players = new Map(); // socketId -> player (with targetX/targetY for remote smoothing)
  let buildings = [];
  let madingNotes = [];
  let kopdesData = { treasury: 150, members: [] };
  let fishingLeaderboard = [];
  let fishingState = {
    leaderboard: [],
    tournament: { active: false, title: 'Lomba Mancing Akhir Pekan', endsAt: null, scores: [] },
    championCitizenId: null,
    championName: '',
    history: [],
  };
  let selectedTourneyDur = '1h';
  let activeFishTab = 'tournament';
  let myFishingState = 'idle'; // 'idle' | 'waiting' | 'strike'
  let strikeDeadline = 0;
  let hoveredFishingBoard = false;
  const bubbles = new Map(); // socketId -> { text, isGreeting, createdAt }
  const whispers = new Map(); // socketId -> { fromName, text, createdAt } (private only!)
  const greetEffects = new Map(); // socketId -> { fromName, createdAt }
  const megaphoneSpeakers = new Map(); // socketId -> { talking, until }
  const offscreenHits = []; // clickable edge arrow indicators for off-screen visitors
  let focusSocketId = null; // null = follow local player, or socketId of spotlighted visitor
  let selectedPlayerId = null; // socketId of visitor whose floating profile card is open

  let viewportW = window.innerWidth;
  let viewportH = window.innerHeight;

  const CAMERA_MODE_ORDER = ['klasik', 'iso', 'drone'];
  const CAMERA_MODES = {
    klasik: {
      label: 'Klasik',
      toast: '🎥 Mode Kamera: Klasik (Top-Down)',
      tiltY: 1.0,
      skewX: 0,
      elevation: 0,
    },
    iso: {
      label: 'Iso 2.5D',
      toast: '🎥 Mode Kamera: Isometrik 2.5D (Perspektif)',
      tiltY: 0.74,
      skewX: -0.22,
      elevation: 1.0,
    },
    drone: {
      label: 'Drone',
      toast: '🎥 Mode Kamera: Panorama Drone (Wide View)',
      tiltY: 1.0,
      skewX: 0,
      elevation: 0,
    },
  };
  let cameraMode = 'klasik';
  let userZoomMult = 1.0;
  const MIN_ZOOM_MULT = 0.65;
  const MAX_ZOOM_MULT = 1.75;
  const ZOOM_STEP = 0.15;

  const camera = {
    cx: W.PLAZA.x,
    cy: W.PLAZA.y,
    x: W.PLAZA.x - window.innerWidth / 2,
    y: W.PLAZA.y - window.innerHeight / 2,
    zoom: 1.0,
    tiltY: 1.0,
    skewX: 0,
    elevation: 0,
  };

  // Input state
  const keys = { up: false, down: false, left: false, right: false };
  const joystickVec = { x: 0, y: 0, active: false, pointerId: null };
  let walkTarget = null;
  let lastEmitTime = 0;
  let lastSentPos = { x: 0, y: 0, moving: false };

  // Pointer & hover state
  const pointerWorld = { x: W.PLAZA.x, y: W.PLAZA.y, active: false };
  const pointerScreen = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
  let hoveredMading = false;
  let hoveredPlayerId = null;
  let hoveredInteractiveBuilding = null;
  let editingHouseId = null;
  let pendingBusinessPos = null;
  let viewingBusinessId = null;
  let activeProfileSnapshot = null;

  // Co-building state
  const buildState = {
    selectedType: null,
    deleteMode: false,
    previewPos: null,
    validation: null,
    hoveredBuilding: null,
    snappedKavlingId: null,
    houseLabel: '',
  };

  // ==================== Helpers ====================
  function showToast(message, isError) {
    const el = document.createElement('div');
    el.className = `toast${isError ? ' error' : ''}`;
    el.textContent = message;
    toastContainer.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-6px)';
      el.style.transition = 'opacity 0.25s, transform 0.25s';
      setTimeout(() => el.remove(), 260);
    }, 2700);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTime(ts) {
    const d = new Date(ts);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }

  function formatDateShort(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function isTypingInField() {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewportW = window.innerWidth;
    viewportH = window.innerHeight;
    canvas.width = Math.floor(viewportW * dpr);
    canvas.height = Math.floor(viewportH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function getDroneFitZoom() {
    const padX = viewportW > 860 ? 56 : 24;
    const padY = viewportH > 640 ? 96 : 44;
    const zx = (viewportW - padX) / W.WORLD_WIDTH;
    const zy = (viewportH - padY) / W.WORLD_HEIGHT;
    return Math.max(0.36, Math.min(0.86, Math.min(zx, zy)));
  }

  function getCameraTargetPreset() {
    const preset = CAMERA_MODES[cameraMode] || CAMERA_MODES.klasik;
    let baseZoom = 1.0;
    if (cameraMode === 'iso') {
      baseZoom = 1.06;
    } else if (cameraMode === 'drone') {
      baseZoom = getDroneFitZoom();
    }
    return {
      zoom: Math.max(0.32, Math.min(2.2, baseZoom * userZoomMult)),
      tiltY: preset.tiltY,
      skewX: preset.skewX,
      elevation: preset.elevation,
    };
  }

  function clampCameraCenter(targetX, targetY, zoom, tiltY, elevation) {
    const z = zoom || 1;
    const ty = tiltY || 1;
    const halfVisW = viewportW / (2 * z);
    const halfVisH = viewportH / (2 * z * ty);
    const isoPadX = 85 * (elevation || 0);
    const isoPadY = 48 * (elevation || 0);

    let cx = targetX;
    if (halfVisW * 2 >= W.WORLD_WIDTH + isoPadX * 2) {
      cx = W.WORLD_WIDTH / 2;
    } else {
      cx = Math.max(halfVisW - isoPadX, Math.min(W.WORLD_WIDTH - halfVisW + isoPadX, targetX));
    }

    let cy = targetY;
    if (halfVisH * 2 >= W.WORLD_HEIGHT + isoPadY * 2) {
      cy = W.WORLD_HEIGHT / 2;
    } else {
      cy = Math.max(halfVisH - isoPadY, Math.min(W.WORLD_HEIGHT - halfVisH + isoPadY, targetY));
    }

    return { cx, cy };
  }

  function syncCameraLegacyXY() {
    camera.x = camera.cx - viewportW / 2;
    camera.y = camera.cy - viewportH / 2;
  }

  function clientToCanvasScreen(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }

  function screenToWorld(clientX, clientY) {
    const sp = clientToCanvasScreen(clientX, clientY);
    return R.screenToWorld(sp.x, sp.y, camera, viewportW, viewportH);
  }

  // Exact inverse of renderer's withUpright(ctx, ax, ay, camProj, ...) so clicking
  // elevated 2.5D buildings, signs, trees, and characters is pixel-accurate in all modes!
  function screenToUprightLocal(sx, sy, ax, ay) {
    const anchor = R.worldToScreen(ax, ay, camera, viewportW, viewportH);
    const z = camera.zoom || 1;
    const h = 1 + (camera.elevation || 0) * 0.1;
    return {
      x: ax + (sx - anchor.x) / z,
      y: ay + (sy - anchor.y) / (z * h),
    };
  }

  function syncCameraControlsUI() {
    const preset = CAMERA_MODES[cameraMode] || CAMERA_MODES.klasik;
    if (cameraModeLabel) {
      cameraModeLabel.textContent = preset.label;
    }
    if (btnZoomReset) {
      btnZoomReset.textContent = `${Math.round(userZoomMult * 100)}%`;
    }
    document.querySelectorAll('[data-camera-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-camera-mode') === cameraMode);
    });
  }

  function setCameraMode(nextMode, silent) {
    if (!CAMERA_MODES[nextMode]) return;
    cameraMode = nextMode;
    // Reset user zoom multiplier cleanly when entering Panorama Drone so full village fits right away
    if (cameraMode === 'drone') {
      userZoomMult = 1.0;
    }
    syncCameraControlsUI();
    if (!silent) {
      showToast(CAMERA_MODES[cameraMode].toast);
    }
  }

  function adjustZoom(delta) {
    userZoomMult = Math.max(
      MIN_ZOOM_MULT,
      Math.min(MAX_ZOOM_MULT, Math.round((userZoomMult + delta) * 100) / 100)
    );
    syncCameraControlsUI();
  }

  if (btnCameraCycle) {
    btnCameraCycle.addEventListener('click', () => {
      const idx = CAMERA_MODE_ORDER.indexOf(cameraMode);
      const next = CAMERA_MODE_ORDER[(idx + 1) % CAMERA_MODE_ORDER.length];
      setCameraMode(next, false);
    });
  }

  document.querySelectorAll('[data-camera-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-camera-mode');
      setCameraMode(mode, false);
    });
  });

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => adjustZoom(ZOOM_STEP));
  }
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => adjustZoom(-ZOOM_STEP));
  }
  if (btnZoomReset) {
    btnZoomReset.addEventListener('click', () => {
      userZoomMult = 1.0;
      syncCameraControlsUI();
    });
  }

  canvas.addEventListener(
    'wheel',
    (e) => {
      if (!joined) return;
      e.preventDefault();
      adjustZoom(e.deltaY < 0 ? 0.1 : -0.1);
    },
    { passive: false }
  );

  function updateStatsUI(stats) {
    if (!stats) return;
    welcomeOnline.textContent = stats.onlineCount;
    welcomeTotal.textContent = stats.totalCitizens;
    hudOnlineCount.textContent = stats.onlineCount;
    hudTotalCitizens.textContent = stats.totalCitizens;
    if (typeof stats.totalMading === 'number') {
      madingBadgeCount.textContent = stats.totalMading;
    }
  }

  // ==================== Welcome Card & Locked Identity Setup ====================
  function loadSavedProfile() {
    try {
      const savedPlayerId = localStorage.getItem(PLAYER_ID_KEY);
      const savedPlayerName = localStorage.getItem(PLAYER_NAME_KEY);
      if (savedPlayerId) myCitizenId = savedPlayerId;
      if (savedPlayerName) inputName.value = savedPlayerName;

      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.playerId || saved.citizenId) {
        myCitizenId = saved.playerId || saved.citizenId;
      }
      if (saved.name) inputName.value = saved.name;
      if (saved.role) inputRole.value = saved.role;
      if (saved.avatar) {
        if (saved.avatar.shirtColor) selectedAvatar.shirtColor = saved.avatar.shirtColor;
        if (saved.avatar.hairStyle) selectedAvatar.hairStyle = saved.avatar.hairStyle;
      }
    } catch (_err) {
      // Ignore malformed localStorage
    }
  }

  function saveProfile(me) {
    const pid = me.playerId || me.citizenId;
    activeProfileSnapshot = {
      playerId: pid,
      citizenId: pid,
      name: me.name,
      role: me.role,
      avatar: me.avatar,
    };
    try {
      if (pid) localStorage.setItem(PLAYER_ID_KEY, pid);
      if (me.name) localStorage.setItem(PLAYER_NAME_KEY, me.name);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeProfileSnapshot));
    } catch (_err) {
      // Ignore storage quota errors
    }
  }

  function buildWelcomePickers() {
    shirtColorPicker.innerHTML = '';
    W.SHIRT_COLORS.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `color-swatch${selectedAvatar.shirtColor.toLowerCase() === c.hex.toLowerCase() ? ' active' : ''}`;
      btn.style.backgroundColor = c.hex;
      btn.title = c.name;
      btn.setAttribute('aria-label', c.name);
      btn.addEventListener('click', () => {
        selectedAvatar.shirtColor = c.hex;
        shirtColorPicker.querySelectorAll('.color-swatch').forEach((el) => el.classList.remove('active'));
        btn.classList.add('active');
      });
      shirtColorPicker.appendChild(btn);
    });

    hairStylePicker.innerHTML = '';
    W.HAIR_STYLES.forEach((h) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `style-pill${selectedAvatar.hairStyle === h.id ? ' active' : ''}`;
      btn.textContent = h.name;
      btn.addEventListener('click', () => {
        selectedAvatar.hairStyle = h.id;
        hairStylePicker.querySelectorAll('.style-pill').forEach((el) => el.classList.remove('active'));
        btn.classList.add('active');
      });
      hairStylePicker.appendChild(btn);
    });
  }

  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = inputName.value.trim();
    const role = inputRole.value.trim();
    if (!name) {
      joinError.textContent = 'Mohon isi nama panggilanmu terlebih dahulu.';
      joinError.hidden = false;
      inputName.focus();
      return;
    }

    joinError.hidden = true;
    socket.emit(
      'citizen:join',
      {
        playerId: myCitizenId,
        citizenId: myCitizenId,
        name,
        role,
        avatar: selectedAvatar,
      },
      (res) => {
        if (!res || !res.ok) {
          joinError.textContent = (res && res.error) || 'Gagal bergabung. Coba lagi.';
          joinError.hidden = false;
          return;
        }

        const world = res.world;
        joined = true;
        mySocketId = world.me.socketId;
        myCitizenId = world.me.citizenId;
        saveProfile(world.me);

        players.clear();
        world.players.forEach((p) => {
          players.set(p.socketId, { ...p, targetX: p.x, targetY: p.y });
        });

        buildings = world.buildings || [];
        madingNotes = world.mading || [];
        if (world.kopdes) kopdesData = world.kopdes;
        if (world.fishingState) {
          applyFishingState(world.fishingState);
        } else if (Array.isArray(world.fishingLeaderboard)) {
          fishingLeaderboard = world.fishingLeaderboard;
        }
        if (world.settings) {
          applyVillageSettings(world.settings);
        }
        if (world.housingCluster) {
          applyHousingCluster(world.housingCluster);
        }
        if (world.nightMarket) {
          nightMarketPoints = Number(world.nightMarket.myPoints) || 0;
          wheelCooldownUntil = Number(world.nightMarket.wheelCooldownUntil) || 0;
          syncNightMarketPointsUI();
        }
        isAdmin = Boolean(world.isAdmin);
        canMegaphone = Boolean(world.canMegaphone);
        syncKadesUI();

        updateStatsUI(world.stats);
        renderMadingNotes();
        renderActiveCitizens();

        // Populate recent chat
        chatMessages.innerHTML = '';
        (world.recentChat || []).forEach((msg) => appendChatMessage(msg, false));
        scrollChatBottom();

        // Update HUD labels & house default name
        hudMyProfile.textContent = `${world.me.name} · ${world.me.role}`;
        inputHouseLabel.value = `Rumah ${world.me.name}`;
        buildState.houseLabel = inputHouseLabel.value;

        // Center camera right away on player
        const preset = getCameraTargetPreset();
        camera.zoom = preset.zoom;
        camera.tiltY = preset.tiltY;
        camera.skewX = preset.skewX;
        camera.elevation = preset.elevation;
        const camCenter = clampCameraCenter(
          world.me.x,
          world.me.y,
          camera.zoom,
          camera.tiltY,
          camera.elevation
        );
        camera.cx = camCenter.cx;
        camera.cy = camCenter.cy;
        syncCameraLegacyXY();
        syncCameraControlsUI();

        welcomeOverlay.classList.remove('visible');
        setTimeout(() => {
          welcomeOverlay.hidden = true;
        }, 280);
        gameHud.classList.remove('hidden');

        // Start side panels collapsed on small screens so the village map breathes cleanly
        if (window.innerWidth <= 820) {
          setChatCollapsed(true);
          onlinePanel.classList.add('collapsed');
        } else {
          setChatCollapsed(false);
          onlinePanel.classList.remove('collapsed');
        }

        showToast(
          world.isNewCitizen
            ? `Selamat datang di Kampung Hijau, ${world.me.name}! 🌿`
            : `Senang bertemu lagi, ${world.me.name}! 🏡`
        );
      }
    );
  });

  // ==================== Chat & Quick Reactions ====================
  function setChatCollapsed(collapsed) {
    if (collapsed) {
      chatPanel.classList.add('collapsed');
      floatingReactions.classList.add('visible');
    } else {
      chatPanel.classList.remove('collapsed');
      floatingReactions.classList.remove('visible');
      chatUnreadDot.hidden = true;
      scrollChatBottom();
    }
  }

  btnToggleChat.addEventListener('click', () => {
    setChatCollapsed(!chatPanel.classList.contains('collapsed'));
  });

  btnCloseChat.addEventListener('click', () => {
    setChatCollapsed(true);
  });

  function scrollChatBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function appendChatMessage(msg, triggerBubble) {
    const item = document.createElement('div');
    if (msg.system) {
      item.className = 'chat-msg system';
      item.textContent = msg.text;
    } else {
      const isMine = msg.socketId === mySocketId;
      item.className = `chat-msg${isMine ? ' mine' : ''}`;
      const color = (msg.avatar && msg.avatar.shirtColor) || '#5f8d63';
      item.innerHTML = `
        <div class="chat-msg-meta">
          <span class="chat-author">
            <i class="author-dot" style="background:${escapeHtml(color)}"></i>
            ${escapeHtml(msg.name)}
            ${msg.role ? `<span class="chat-role-tag">· ${escapeHtml(msg.role)}</span>` : ''}
          </span>
          <span class="chat-time">${formatTime(msg.timestamp)}</span>
        </div>
        <div class="chat-text">${escapeHtml(msg.text)}</div>
      `;

      if (triggerBubble && msg.socketId) {
        bubbles.set(msg.socketId, {
          text: msg.text,
          isGreeting: false,
          createdAt: Date.now(),
        });
      }
    }

    chatMessages.appendChild(item);
    while (chatMessages.children.length > 60) {
      chatMessages.removeChild(chatMessages.firstChild);
    }
    scrollChatBottom();

    if (chatPanel.classList.contains('collapsed') && !msg.system && msg.socketId !== mySocketId) {
      chatUnreadDot.hidden = false;
    }
  }

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || !joined) return;
    socket.emit('chat:send', { text });
    chatInput.value = '';
  });

  document.querySelectorAll('[data-reaction]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!joined) return;
      const type = btn.getAttribute('data-reaction');
      socket.emit('reaction:send', { type });
    });
  });

  // ==================== Ambiance Toggle ====================
  document.querySelectorAll('.amb-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      ambiance = btn.getAttribute('data-ambiance') || 'sore';
      document.querySelectorAll('.amb-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ==================== Mading Kampung ====================
  function buildMadingColorPicker() {
    madingColorPicker.innerHTML = '';
    W.MADING_COLORS.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `note-color-btn${selectedMadingColor === c.id ? ' active' : ''}`;
      btn.style.backgroundColor = c.bg;
      btn.title = c.name;
      btn.addEventListener('click', () => {
        selectedMadingColor = c.id;
        madingColorPicker.querySelectorAll('.note-color-btn').forEach((el) => el.classList.remove('active'));
        btn.classList.add('active');
      });
      madingColorPicker.appendChild(btn);
    });
  }

  function renderMadingNotes() {
    madingBadgeCount.textContent = madingNotes.length;
    madingList.innerHTML = '';
    if (!madingNotes.length) {
      madingList.innerHTML =
        '<p style="color:#4e3620;font-weight:600;">Belum ada catatan. Jadilah warga pertama yang menulis di Mading Kampung!</p>';
      return;
    }

    madingNotes.forEach((note) => {
      const pal = W.MADING_COLORS.find((c) => c.id === note.color) || W.MADING_COLORS[0];
      const card = document.createElement('article');
      card.className = 'mading-note';
      card.style.backgroundColor = pal.bg;
      card.style.borderColor = pal.border;
      card.innerHTML = `
        <span class="note-category">${escapeHtml(note.category || 'Pengumuman')}</span>
        <p class="note-body">${escapeHtml(note.text)}</p>
        <div class="note-footer">
          <div>
            <div class="note-author">${escapeHtml(note.author)}</div>
            <div class="note-role">${escapeHtml(note.role || 'Warga Kampung')}</div>
          </div>
          <span class="note-date">${formatDateShort(note.createdAt)}</span>
        </div>
      `;
      madingList.appendChild(card);
    });
  }

  function openMadingModal() {
    if (!joined) return;
    walkTarget = null;
    madingModal.hidden = false;
    requestAnimationFrame(() => madingModal.classList.add('visible'));
  }

  function closeMadingModal() {
    madingModal.classList.remove('visible');
    setTimeout(() => {
      madingModal.hidden = true;
    }, 220);
  }

  btnOpenMading.addEventListener('click', openMadingModal);
  btnCloseMading.addEventListener('click', closeMadingModal);
  madingModal.addEventListener('click', (e) => {
    if (e.target === madingModal) closeMadingModal();
  });

  madingText.addEventListener('input', () => {
    madingCharCount.textContent = madingText.value.length;
  });

  madingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = madingText.value.trim();
    if (!text) return;

    socket.emit(
      'mading:add',
      {
        text,
        category: madingCategory.value,
        color: selectedMadingColor,
      },
      (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal menempel catatan.', true);
          return;
        }
        madingText.value = '';
        madingCharCount.textContent = '0';
        showToast('Catatan berhasil ditempel ke Mading Kampung! 📌');
      }
    );
  });

  // ==================== Active Citizens, Camera Spotlight & Edit Profile ====================
  function updateCameraFocusUI() {
    if (cameraVisitTarget) {
      cameraFocusLabel.textContent = `🏡 ${cameraVisitTarget.label}`;
      cameraFocusBanner.hidden = false;
      return;
    }
    if (!focusSocketId || focusSocketId === mySocketId) {
      focusSocketId = null;
      cameraFocusBanner.hidden = true;
      return;
    }
    const target = players.get(focusSocketId);
    if (!target) {
      focusSocketId = null;
      cameraFocusBanner.hidden = true;
      return;
    }
    cameraFocusLabel.textContent = `👁️ Menyorot lokasi ${target.name}`;
    cameraFocusBanner.hidden = false;
  }

  function focusOnPlayer(socketId) {
    if (!socketId || socketId === mySocketId) {
      focusSocketId = null;
      updateCameraFocusUI();
      renderActiveCitizens();
      return;
    }
    const target = players.get(socketId);
    if (!target) {
      focusSocketId = null;
      updateCameraFocusUI();
      renderActiveCitizens();
      return;
    }
    focusSocketId = socketId;
    walkTarget = null;
    updateCameraFocusUI();
    renderActiveCitizens();
  }

  btnReturnCamera.addEventListener('click', () => {
    cameraVisitTarget = null;
    focusOnPlayer(mySocketId);
  });

  function renderActiveCitizens() {
    if (!activeCitizensList) return;
    activeCitizensList.innerHTML = '';
    const list = Array.from(players.values());
    list.sort((a, b) => {
      if (a.socketId === mySocketId) return -1;
      if (b.socketId === mySocketId) return 1;
      return a.name.localeCompare(b.name);
    });

    if (!list.length) {
      activeCitizensList.innerHTML = '<li class="citizen-row"><span class="citizen-row-role">Belum ada warga online.</span></li>';
      return;
    }

    list.forEach((p) => {
      const isMe = p.socketId === mySocketId;
      const isFocused = Boolean(focusSocketId && p.socketId === focusSocketId);
      const li = document.createElement('li');
      li.className = `citizen-row${isMe ? ' is-me' : ''}${isFocused ? ' is-focused' : ''}`;
      li.title = isMe
        ? 'Klik untuk kembali menyorot karaktermu'
        : `Klik untuk menggeser kamera ke lokasi ${p.name}`;
      const color = (p.avatar && p.avatar.shirtColor) || '#5f8d63';
      const isChamp = Boolean(
        p.isFishingChampion ||
          (fishingState.championCitizenId && p.citizenId === fishingState.championCitizenId)
      );
      li.innerHTML = `
        <div class="citizen-row-left">
          <span class="citizen-dot" style="background:${escapeHtml(color)}"></span>
          <div style="min-width:0">
            <div class="citizen-row-name">${escapeHtml(p.name)}${isMe ? ' (Kamu)' : ''}${
        isChamp ? '<span class="champ-badge">🏅 Juara Mancing</span>' : ''
      }</div>
            <div class="citizen-row-role">${escapeHtml(p.role || 'Warga Kampung')}</div>
          </div>
        </div>
        ${
          isMe
            ? `<button type="button" class="btn-edit-pencil" data-action="edit-self" title="Edit Profil / Ganti Nama" aria-label="Edit Profil">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
              </button>`
            : `<span class="citizen-locate-tag">${isFocused ? '👁️ Disorot' : '📍 Lihat'}</span>`
        }
      `;

      li.addEventListener('click', () => {
        focusOnPlayer(p.socketId);
        if (!isMe) {
          openPlayerCard(p.socketId, false);
        } else {
          closePlayerCard();
        }
        if (window.innerWidth <= 820) {
          onlinePanel.classList.add('collapsed');
        }
      });

      const editBtn = li.querySelector('[data-action="edit-self"]');
      if (editBtn) {
        editBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openEditProfileModal();
        });
      }
      activeCitizensList.appendChild(li);
    });
  }

  btnActiveCitizens.addEventListener('click', () => {
    onlinePanel.classList.toggle('collapsed');
    if (!onlinePanel.classList.contains('collapsed')) {
      renderActiveCitizens();
    }
  });

  btnCloseCitizens.addEventListener('click', () => {
    onlinePanel.classList.add('collapsed');
  });

  if (minimapCanvas) {
    minimapCanvas.addEventListener('pointerdown', (e) => {
      if (!joined) return;
      e.stopPropagation();
      const rect = minimapCanvas.getBoundingClientRect();
      const wx = ((e.clientX - rect.left) / rect.width) * W.WORLD_WIDTH;
      const wy = ((e.clientY - rect.top) / rect.height) * W.WORLD_HEIGHT;

      // If clicked near another online visitor on the minimap, spotlight that visitor!
      let nearest = null;
      let bestDist = 110;
      players.forEach((p) => {
        if (p.socketId === mySocketId) return;
        const d = Math.hypot(p.x - wx, p.y - wy);
        if (d < bestDist) {
          bestDist = d;
          nearest = p;
        }
      });

      if (nearest) {
        focusOnPlayer(nearest.socketId);
      } else {
        focusOnPlayer(mySocketId);
      }
    });
  }

  // ==================== Player Interaction Card, Targeted Greet & Private Messages ====================
  function syncPlayerCardContent(p) {
    if (!p) return;
    const color = (p.avatar && p.avatar.shirtColor) || '#5f8d63';
    playerCardAvatarDot.style.backgroundColor = color;
    playerCardName.textContent = p.name;
    playerCardRole.textContent = p.role || 'Warga Kampung';
    playerCardStatus.textContent = `🌿 ${p.status || 'Warga Tetap'} · Online`;
    btnGreetTarget.textContent = `👋 Sapa ${p.name}`;
    cardDmInput.placeholder = `Tulis bisikan untuk ${p.name}...`;
  }

  function positionPlayerCard() {
    if (!selectedPlayerId || playerInteractionCard.hidden) return;
    const p = players.get(selectedPlayerId);
    if (!p) {
      closePlayerCard();
      return;
    }

    const pt = R.worldToScreen(p.x, p.y, camera, viewportW, viewportH);
    const sx = pt.x;
    const sy = pt.y;
    const cardW = playerInteractionCard.offsetWidth || 248;
    const cardH = playerInteractionCard.offsetHeight || 170;

    // Prefer placing to the right of the character; flip left if near right HUD or viewport edge
    const rightLimit = viewportW > 860 ? viewportW - 344 : viewportW - 14;
    let left = sx + 32;
    if (left + cardW > rightLimit) {
      left = sx - cardW - 32;
    }
    left = Math.max(12, Math.min(rightLimit - cardW, left));

    let top = sy - cardH * 0.55;
    top = Math.max(68, Math.min(viewportH - cardH - 118, top));

    playerInteractionCard.style.left = `${Math.round(left)}px`;
    playerInteractionCard.style.top = `${Math.round(top)}px`;
  }

  function openPlayerCard(socketId, openDmInitially) {
    if (!joined || !socketId || socketId === mySocketId) return;
    const p = players.get(socketId);
    if (!p) return;

    selectedPlayerId = socketId;
    syncPlayerCardContent(p);
    cardDmForm.hidden = !openDmInitially;
    cardDmInput.value = '';
    playerInteractionCard.hidden = false;
    positionPlayerCard();

    if (openDmInitially) {
      setTimeout(() => cardDmInput.focus(), 40);
    }
  }

  function closePlayerCard() {
    selectedPlayerId = null;
    playerInteractionCard.hidden = true;
    cardDmForm.hidden = true;
    cardDmInput.value = '';
  }

  function hitOtherPlayer(sx, sy) {
    let best = null;
    let bestDist = Infinity;
    const zoomPad = camera.zoom < 0.8 ? 8 / Math.max(0.35, camera.zoom) : 0;
    players.forEach((p, sid) => {
      if (sid === mySocketId) return;
      const loc = screenToUprightLocal(sx, sy, p.x, p.y);
      const dBody = Math.hypot(loc.x - p.x, loc.y - (p.y - 16));
      const hitName = Math.abs(loc.x - p.x) <= 52 + zoomPad && Math.abs(loc.y - (p.y + 21)) <= 13 + zoomPad * 0.5;
      if ((dBody <= 32 + zoomPad || hitName) && dBody < bestDist) {
        best = p;
        bestDist = dBody;
      }
    });
    return best;
  }

  btnClosePlayerCard.addEventListener('click', closePlayerCard);

  btnGreetTarget.addEventListener('click', () => {
    if (!selectedPlayerId || !joined) return;
    const targetId = selectedPlayerId;
    socket.emit('player:greetTarget', { targetSocketId: targetId }, (res) => {
      if (!res || !res.ok) {
        showToast((res && res.error) || 'Gagal menyapa warga.', true);
        return;
      }
      closePlayerCard();
    });
  });

  btnToggleDmInput.addEventListener('click', () => {
    if (!selectedPlayerId) return;
    cardDmForm.hidden = !cardDmForm.hidden;
    positionPlayerCard();
    if (!cardDmForm.hidden) {
      cardDmInput.focus();
    }
  });

  cardDmForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedPlayerId || !joined) return;
    const text = cardDmInput.value.trim();
    if (!text) return;

    const targetId = selectedPlayerId;
    socket.emit('dm:send', { targetSocketId: targetId, text }, (res) => {
      if (!res || !res.ok) {
        showToast((res && res.error) || 'Gagal mengirim pesan pribadi.', true);
        return;
      }
      cardDmInput.value = '';
      closePlayerCard();
    });
  });

  function pushDmNotification(dm) {
    if (!dmNotificationStack) return;
    const card = document.createElement('div');
    card.className = 'dm-card';
    const color = (dm.fromAvatar && dm.fromAvatar.shirtColor) || '#5f8d63';
    card.innerHTML = `
      <div class="dm-card-header">
        <div class="dm-card-sender">
          <span class="citizen-dot" style="background:${escapeHtml(color)}"></span>
          <span>💌 Bisikan dari ${escapeHtml(dm.fromName)}</span>
        </div>
        <span class="dm-card-time">${formatTime(dm.timestamp)}</span>
        <button type="button" class="icon-btn mini dm-close-btn" title="Tutup Pesan" aria-label="Tutup Pesan">✕</button>
      </div>
      <div class="dm-card-body">${escapeHtml(dm.text)}</div>
      <div class="dm-card-footer">
        <button type="button" class="dm-action-btn dm-reply-btn">↩️ Balas</button>
        <button type="button" class="dm-action-btn dm-locate-btn">📍 Lihat Lokasi</button>
      </div>
      <form class="dm-reply-form" hidden autocomplete="off">
        <input type="text" maxlength="160" placeholder="Balas ${escapeHtml(dm.fromName)}..." aria-label="Balas pesan pribadi" />
        <button type="submit" class="btn-send pcard-dm-send">Kirim</button>
      </form>
    `;

    const closeBtn = card.querySelector('.dm-close-btn');
    const replyBtn = card.querySelector('.dm-reply-btn');
    const locateBtn = card.querySelector('.dm-locate-btn');
    const replyForm = card.querySelector('.dm-reply-form');
    const replyInput = replyForm.querySelector('input');

    closeBtn.addEventListener('click', () => card.remove());

    replyBtn.addEventListener('click', () => {
      replyForm.hidden = !replyForm.hidden;
      if (!replyForm.hidden) {
        replyInput.focus();
      }
    });

    locateBtn.addEventListener('click', () => {
      if (players.has(dm.fromSocketId)) {
        focusOnPlayer(dm.fromSocketId);
        openPlayerCard(dm.fromSocketId, false);
      } else {
        showToast(`${dm.fromName} sedang tidak berada di kampung.`, true);
      }
    });

    replyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const replyText = replyInput.value.trim();
      if (!replyText) return;
      socket.emit('dm:send', { targetSocketId: dm.fromSocketId, text: replyText }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal membalas pesan pribadi.', true);
          return;
        }
        card.remove();
      });
    });

    dmNotificationStack.prepend(card);
    while (dmNotificationStack.children.length > 4) {
      dmNotificationStack.removeChild(dmNotificationStack.lastChild);
    }
  }

  function openEditProfileModal() {
    if (!joined) return;
    const me = mySocketId ? players.get(mySocketId) : null;
    if (!me) return;

    walkTarget = null;
    editName.value = me.name || '';
    editRole.value = me.role === 'Warga Kampung' ? '' : me.role || '';
    editProfileError.hidden = true;
    editProfileModal.hidden = false;
    requestAnimationFrame(() => {
      editProfileModal.classList.add('visible');
      editName.focus();
      editName.select();
    });
  }

  function closeEditProfileModal() {
    editProfileModal.classList.remove('visible');
    setTimeout(() => {
      editProfileModal.hidden = true;
    }, 220);
  }

  btnEditProfile.addEventListener('click', openEditProfileModal);
  btnCloseEditProfile.addEventListener('click', closeEditProfileModal);
  btnCancelEditProfile.addEventListener('click', closeEditProfileModal);
  editProfileModal.addEventListener('click', (e) => {
    if (e.target === editProfileModal) closeEditProfileModal();
  });

  editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = editName.value.trim();
    const newRole = editRole.value.trim();
    if (!newName) {
      editProfileError.textContent = 'Nama panggilan tidak boleh kosong.';
      editProfileError.hidden = false;
      editName.focus();
      return;
    }

    editProfileError.hidden = true;
    socket.emit('citizen:updateProfile', { name: newName, role: newRole }, (res) => {
      if (!res || !res.ok) {
        editProfileError.textContent = (res && res.error) || 'Gagal memperbarui profil.';
        editProfileError.hidden = false;
        return;
      }

      const updatedMe = res.me;
      saveProfile(updatedMe);
      inputName.value = updatedMe.name;
      inputRole.value = updatedMe.role === 'Warga Kampung' ? '' : updatedMe.role;
      closeEditProfileModal();
      showToast(`✏️ Profil diperbarui: ${updatedMe.name}!`);
    });
  });

  // ==================== Panel Kontrol Pak Kades (Admin) & Megafon Suara ====================
  function getAmbianceLabel(amb) {
    if (amb === 'pagi') return '☀️ Pagi Cerah';
    if (amb === 'senja') return '🌙 Malam Berlampu';
    return '🌤️ Sore Hangat';
  }

  function applyAmbianceUI(nextAmbiance) {
    ambiance = ['pagi', 'sore', 'senja'].includes(nextAmbiance) ? nextAmbiance : 'sore';
    document.querySelectorAll('.amb-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-ambiance') === ambiance);
    });
    document.querySelectorAll('[data-kades-ambiance]').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-kades-ambiance') === ambiance);
    });
  }

  function applyVillageSettings(settings) {
    if (!settings) return;
    villageSettings = {
      maxHousesPerCitizen:
        typeof settings.maxHousesPerCitizen === 'number' ? settings.maxHousesPerCitizen : 3,
      ambiance: settings.ambiance || 'sore',
      megaphoneAllowedIds: Array.isArray(settings.megaphoneAllowedIds)
        ? settings.megaphoneAllowedIds
        : [],
      festivalMode: Boolean(settings.festivalMode),
    };
    applyAmbianceUI(villageSettings.ambiance);
    canMegaphone =
      isAdmin ||
      Boolean(myCitizenId && villageSettings.megaphoneAllowedIds.includes(myCitizenId));
    syncFestivalUI();
    syncKadesUI();
  }

  function renderKadesMegaphoneList() {
    if (!kadesMegaphoneList) return;
    kadesMegaphoneList.innerHTML = '';
    const others = Array.from(players.values()).filter((p) => p.socketId !== mySocketId);
    if (!others.length) {
      kadesMegaphoneList.innerHTML =
        '<li class="kades-meg-row"><span style="color:var(--text-muted)">Belum ada warga lain yang online saat ini.</span></li>';
      return;
    }

    others.forEach((p) => {
      const granted = villageSettings.megaphoneAllowedIds.includes(p.citizenId);
      const li = document.createElement('li');
      li.className = 'kades-meg-row';
      li.innerHTML = `
        <span><strong>${escapeHtml(p.name)}</strong> <span style="color:var(--text-muted)">· ${escapeHtml(p.role || 'Warga')}</span></span>
        <button type="button" class="kades-meg-toggle${granted ? ' granted' : ''}">
          ${granted ? '✓ Diizinkan' : '🎙️ Izinkan'}
        </button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        socket.emit('admin:updateSettings', { toggleMegaphoneCitizenId: p.citizenId }, (res) => {
          if (!res || !res.ok) {
            showToast((res && res.error) || 'Gagal memperbarui izin megafon.', true);
          }
        });
      });
      kadesMegaphoneList.appendChild(li);
    });
  }

  function syncKadesUI() {
    if (btnKadesMenu) {
      btnKadesMenu.classList.toggle('is-admin', isAdmin);
      kadesBtnIcon.textContent = '👑';
      kadesBtnLabel.textContent = 'Menu Pak Kades';
    }

    if (megaphoneDock) {
      megaphoneDock.hidden = !(joined && (isAdmin || canMegaphone));
    }

    const limit = villageSettings.maxHousesPerCitizen;
    if (kadesCurrentHouseLimit) {
      kadesCurrentHouseLimit.textContent = limit === 0 ? '∞ Tanpa Batas' : `Maks. ${limit} rumah`;
    }
    document.querySelectorAll('[data-max-houses]').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.getAttribute('data-max-houses')) === limit);
    });

    if (kadesDeleteStateBadge && btnKadesToggleDelete) {
      kadesDeleteStateBadge.textContent = buildState.deleteMode ? 'Aktif' : 'Nonaktif';
      btnKadesToggleDelete.classList.toggle('active', buildState.deleteMode);
      btnKadesToggleDelete.textContent = buildState.deleteMode
        ? '✓ Matikan Mode Hapus Bangunan'
        : '🗑️ Aktifkan Mode Hapus Bangunan';
    }

    applyAmbianceUI(ambiance);
    syncFestivalUI();
    syncTournamentUI();
    renderKadesClusterControls();
    buildCatalogUI();
    if (!isAdmin && buildState.selectedType === 'kopdes') {
      clearBuildMode();
    } else {
      syncBuildUI();
    }
    if (isAdmin) {
      renderKadesMegaphoneList();
    }
  }

  function openKadesPinModal() {
    if (!joined) return;
    walkTarget = null;
    closePlayerCard();
    inputKadesPin.value = '';
    kadesPinError.hidden = true;
    kadesPinModal.hidden = false;
    requestAnimationFrame(() => {
      kadesPinModal.classList.add('visible');
      inputKadesPin.focus();
    });
  }

  function closeKadesPinModal() {
    kadesPinModal.classList.remove('visible');
    setTimeout(() => {
      kadesPinModal.hidden = true;
    }, 220);
  }

  function openKadesPanelModal() {
    if (!joined || !isAdmin) return;
    walkTarget = null;
    closePlayerCard();
    syncKadesUI();
    kadesPanelModal.hidden = false;
    requestAnimationFrame(() => kadesPanelModal.classList.add('visible'));
  }

  function closeKadesPanelModal() {
    kadesPanelModal.classList.remove('visible');
    setTimeout(() => {
      kadesPanelModal.hidden = true;
    }, 220);
  }

  btnKadesMenu.addEventListener('click', () => {
    if (isAdmin) {
      openKadesPanelModal();
    } else {
      openKadesPinModal();
    }
  });

  btnCloseKadesPin.addEventListener('click', closeKadesPinModal);
  btnCancelKadesPin.addEventListener('click', closeKadesPinModal);
  kadesPinModal.addEventListener('click', (e) => {
    if (e.target === kadesPinModal) closeKadesPinModal();
  });

  kadesPinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = inputKadesPin.value.trim();
    if (!pin) return;

    kadesPinError.hidden = true;
    socket.emit('admin:auth', { pin }, (res) => {
      if (!res || !res.ok) {
        kadesPinError.textContent = (res && res.error) || 'PIN salah.';
        kadesPinError.hidden = false;
        inputKadesPin.select();
        return;
      }
      isAdmin = true;
      canMegaphone = true;
      if (res.settings) applyVillageSettings(res.settings);
      closeKadesPinModal();
      openKadesPanelModal();
      showToast('👑 Mode Pak Kades aktif! Megafon Kampung siap digunakan.');
    });
  });

  btnCloseKadesPanel.addEventListener('click', closeKadesPanelModal);
  btnKadesDone.addEventListener('click', closeKadesPanelModal);
  kadesPanelModal.addEventListener('click', (e) => {
    if (e.target === kadesPanelModal) closeKadesPanelModal();
  });

  document.querySelectorAll('[data-max-houses]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = Number(btn.getAttribute('data-max-houses'));
      socket.emit('admin:updateSettings', { maxHousesPerCitizen: val }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal menyimpan batas rumah.', true);
          return;
        }
        showToast(
          val === 0
            ? '🏡 Batas rumah diatur menjadi Tanpa Batas.'
            : `🏡 Batas maksimal rumah diatur menjadi ${val} rumah/warga.`
        );
      });
    });
  });

  btnKadesToggleDelete.addEventListener('click', () => {
    if (buildState.deleteMode) {
      clearBuildMode();
      syncKadesUI();
      showToast('Mode Hapus Bangunan dimatikan.');
    } else {
      buildState.selectedType = null;
      buildState.deleteMode = true;
      walkTarget = null;
      syncBuildUI();
      syncKadesUI();
      closeKadesPanelModal();
      showToast('🗑️ Mode Hapus Admin aktif — klik bangunan/item di peta untuk merapikan.');
    }
  });

  document.querySelectorAll('[data-kades-ambiance]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextAmb = btn.getAttribute('data-kades-ambiance');
      socket.emit('admin:updateSettings', { ambiance: nextAmb }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal mengubah suasana kampung.', true);
        }
      });
    });
  });

  btnKadesLogout.addEventListener('click', () => {
    socket.emit('admin:logout', (res) => {
      isAdmin = false;
      canMegaphone = Boolean(res && res.canMegaphone);
      if (buildState.deleteMode) clearBuildMode();
      syncKadesUI();
      closeKadesPanelModal();
      showToast('🔒 Keluar dari Mode Pak Kades.');
    });
  });

  if (btnKadesFestivalToggle) {
    btnKadesFestivalToggle.addEventListener('click', () => {
      const nextFestival = !villageSettings.festivalMode;
      socket.emit('admin:updateSettings', { festivalMode: nextFestival }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal mengubah mode Festival Pasar Malam.', true);
          return;
        }
        showToast(
          nextFestival
            ? '🎆 Mode Festival Pasar Malam dinyalakan! Lampu & kembang api menyala meriah!'
            : '🏮 Mode Festival Pasar Malam dimatikan.'
        );
      });
    });
  }

  // ==================== Area Komplek Perumahan (Cluster Hunian Warga) ====================
  function applyHousingCluster(data) {
    if (!data || typeof data !== 'object') return;
    const blockCount = Number(data.blockCount) || (W.HOUSING_CLUSTER ? W.HOUSING_CLUSTER.defaultBlockCount : 2);
    const kavlings = Array.isArray(data.kavlings)
      ? data.kavlings
      : W.generateClusterKavlings
      ? W.generateClusterKavlings(blockCount)
      : [];
    housingCluster = { blockCount, kavlings };
    renderKadesClusterControls();
    if (clusterDirectoryModal && !clusterDirectoryModal.hidden) {
      renderClusterDirectoryModal();
    }
    if (buildState.selectedType) {
      updateBuildPreview();
    }
  }

  function renderKadesClusterControls() {
    if (!W.HOUSING_CLUSTER) return;
    const hc = W.HOUSING_CLUSTER;
    const blockCount = housingCluster.blockCount || hc.defaultBlockCount;
    const kavlings = Array.isArray(housingCluster.kavlings) ? housingCluster.kavlings : [];

    if (kadesClusterBadge) {
      kadesClusterBadge.textContent = `${blockCount} Blok · ${kavlings.length} Kavling`;
    }
    if (btnKadesAddClusterBlock) {
      if (blockCount >= hc.maxBlockCount) {
        btnKadesAddClusterBlock.disabled = true;
        btnKadesAddClusterBlock.textContent = `✓ Semua Blok (Blok A–${hc.blockLetters[hc.maxBlockCount - 1]}) Terbuka`;
      } else {
        const nextLetter = hc.blockLetters[blockCount] || '';
        btnKadesAddClusterBlock.disabled = false;
        btnKadesAddClusterBlock.textContent = `➕ Tambah Blok Kavling Baru (Blok ${nextLetter})`;
      }
    }

    if (kadesOccupiedKavlingList) {
      kadesOccupiedKavlingList.innerHTML = '';
      const occupied = kavlings.filter((k) => Boolean(k.occupiedByBuildingId));
      if (!occupied.length) {
        kadesOccupiedKavlingList.innerHTML =
          '<li class="kades-meg-row"><span style="color:var(--text-muted)">Belum ada kavling komplek yang terisi rumah.</span></li>';
      } else {
        occupied.forEach((k) => {
          const li = document.createElement('li');
          li.className = 'kades-meg-row';
          li.innerHTML = `
            <span><strong>${escapeHtml(k.code)}</strong> · ${escapeHtml(k.houseLabel || 'Rumah Warga')} <span style="color:var(--text-muted)">(${escapeHtml(k.ownerName || 'Warga')})</span></span>
            <button type="button" class="kades-clear-kav-btn">🧹 Kosongkan</button>
          `;
          li.querySelector('button').addEventListener('click', () => {
            socket.emit('admin:clearKavling', { kavlingId: k.id }, (res) => {
              if (!res || !res.ok) {
                showToast((res && res.error) || 'Gagal mengosongkan kavling.', true);
                return;
              }
              if (res.housingCluster) applyHousingCluster(res.housingCluster);
              showToast(`🧹 ${res.kavlingCode} berhasil dikosongkan dan kembali Tersedia.`);
            });
          });
          kadesOccupiedKavlingList.appendChild(li);
        });
      }
    }
  }

  if (btnKadesAddClusterBlock) {
    btnKadesAddClusterBlock.addEventListener('click', () => {
      socket.emit('admin:addClusterBlock', (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal menambah blok kavling baru.', true);
          return;
        }
        if (res.housingCluster) applyHousingCluster(res.housingCluster);
        showToast(`🏘️✨ Blok ${res.blockLetter} (${res.blockLetter}-01 s.d. ${res.blockLetter}-04) berhasil dibuka!`);
      });
    });
  }

  function visitClusterKavling(kavling) {
    if (!kavling) return;
    closeClusterDirectoryModal();
    focusSocketId = null;
    cameraVisitTarget = {
      x: kavling.centerX,
      y: kavling.centerY,
      label: kavling.occupiedByBuildingId
        ? `Mengunjungi ${kavling.code} · ${kavling.houseLabel || 'Rumah Warga'} (${kavling.ownerName || 'Warga'})`
        : `Menyorot Kavling ${kavling.code} (Tersedia)`,
    };
    updateCameraFocusUI();
    walkTarget = { x: kavling.visitX, y: kavling.visitY };
    showToast(
      kavling.occupiedByBuildingId
        ? `📍 Mengunjungi ${kavling.houseLabel || 'Rumah'} di ${kavling.code}...`
        : `📍 Menuju Kavling ${kavling.code} (Siap Bangun)...`
    );
  }

  function renderClusterDirectoryModal() {
    if (!clusterDirectoryList) return;
    const kavlings = Array.isArray(housingCluster.kavlings) ? housingCluster.kavlings : [];
    const occupiedCount = kavlings.filter((k) => Boolean(k.occupiedByBuildingId)).length;
    const availableCount = Math.max(0, kavlings.length - occupiedCount);

    if (cdTotalKavling) cdTotalKavling.textContent = String(kavlings.length);
    if (cdOccupiedCount) cdOccupiedCount.textContent = String(occupiedCount);
    if (cdAvailableCount) cdAvailableCount.textContent = String(availableCount);

    clusterDirectoryList.innerHTML = '';
    kavlings.forEach((k) => {
      const occ = Boolean(k.occupiedByBuildingId);
      const li = document.createElement('li');
      li.className = `cluster-kavling-row${occ ? ' occupied' : ''}`;
      li.innerHTML = `
        <div class="ck-left">
          <span class="ck-code-badge">${escapeHtml(k.code)}</span>
          <div class="ck-info">
            <div class="ck-title">${occ ? escapeHtml(k.houseLabel || 'Rumah Warga') : 'Kavling Siap Bangun'}</div>
            <div class="ck-sub">${occ ? `Pemilik: ${escapeHtml(k.ownerName || 'Warga')}` : 'Tersedia · Auto-Snap saat bangun rumah'}</div>
          </div>
        </div>
        <button type="button" class="btn-visit-kavling">${occ ? '📍 Kunjungi Rumah' : '📍 Lihat Kavling'}</button>
      `;
      li.querySelector('button').addEventListener('click', () => {
        visitClusterKavling(k);
      });
      clusterDirectoryList.appendChild(li);
    });
  }

  function openClusterDirectoryModal() {
    if (!joined) return;
    walkTarget = null;
    closePlayerCard();
    renderClusterDirectoryModal();
    clusterDirectoryModal.hidden = false;
    requestAnimationFrame(() => clusterDirectoryModal.classList.add('visible'));
  }

  function closeClusterDirectoryModal() {
    clusterDirectoryModal.classList.remove('visible');
    setTimeout(() => {
      clusterDirectoryModal.hidden = true;
    }, 220);
  }

  if (btnCloseClusterDir) btnCloseClusterDir.addEventListener('click', closeClusterDirectoryModal);
  if (btnDoneClusterDir) btnDoneClusterDir.addEventListener('click', closeClusterDirectoryModal);
  if (clusterDirectoryModal) {
    clusterDirectoryModal.addEventListener('click', (e) => {
      if (e.target === clusterDirectoryModal) closeClusterDirectoryModal();
    });
  }
  if (btnDirStartBuildHouse) {
    btnDirStartBuildHouse.addEventListener('click', () => {
      const firstEmpty = (housingCluster.kavlings || []).find((k) => !k.occupiedByBuildingId);
      closeClusterDirectoryModal();
      if (firstEmpty) {
        cameraVisitTarget = {
          x: firstEmpty.centerX,
          y: firstEmpty.centerY,
          label: `Siap Bangun di ${firstEmpty.code} (Auto-Snap aktif)`,
        };
        updateCameraFocusUI();
        walkTarget = { x: firstEmpty.visitX, y: firstEmpty.visitY };
      }
      selectBuildType('rumah');
      showToast('🏡 Mode Bangun Rumah aktif — Arahkan kursor ke kavling hijau untuk Auto-Snap!');
    });
  }

  function walkToHousingCluster() {
    if (!joined || !W.HOUSING_CLUSTER) return;
    focusSocketId = null;
    cameraVisitTarget = {
      x: W.HOUSING_CLUSTER.gate.x,
      y: W.HOUSING_CLUSTER.gate.y - 120,
      label: 'Komplek Hunian Warga (Gerbang & Kavling)',
    };
    updateCameraFocusUI();
    walkTarget = { x: W.HOUSING_CLUSTER.gate.x, y: W.HOUSING_CLUSTER.gate.y - 54 };
    showToast('🏘️ Menuju Area Komplek Perumahan (Cluster Hunian Warga)...');
  }

  if (btnGoCluster) {
    btnGoCluster.addEventListener('click', walkToHousingCluster);
  }

  function isPointOnClusterDirectory(sx, sy) {
    if (!W.HOUSING_CLUSTER) return false;
    const db = W.HOUSING_CLUSTER.directoryBoard;
    const loc = screenToUprightLocal(sx, sy, db.x, db.y);
    const pad = camera.zoom < 0.8 ? 12 : 0;
    return (
      Math.abs(loc.x - db.x) <= 44 + pad &&
      loc.y >= db.y - 68 - pad &&
      loc.y <= db.y + 24 + pad
    );
  }

  // ==================== Area Pasar Malam & Hiburan (Web Audio + Interactions) ====================
  function syncNightMarketPointsUI() {
    if (nmPointsBadge) {
      nmPointsBadge.textContent = `🎟️ ${nightMarketPoints} Poin`;
    }
  }

  function syncFestivalUI() {
    const active = Boolean(villageSettings.festivalMode);
    if (festivalBanner) {
      festivalBanner.hidden = !(joined && active);
    }
    if (kadesFestivalBadge) {
      kadesFestivalBadge.textContent = active ? '🎆 Festival Aktif!' : 'Suasana Normal';
    }
    if (btnKadesFestivalToggle) {
      btnKadesFestivalToggle.classList.toggle('running', active);
      btnKadesFestivalToggle.textContent = active
        ? '✨ Matikan Mode Festival Pasar Malam'
        : '🎆 Nyalakan Mode Festival Pasar Malam';
    }
  }

  function walkToNightMarket() {
    if (!joined || !W.NIGHT_MARKET) return;
    if (focusSocketId) focusOnPlayer(mySocketId);
    walkTarget = { x: 1396, y: 214 };
    showToast('🎪 Menuju Area Pasar Malam & Hiburan...');
  }

  if (btnGoNightMarket) {
    btnGoNightMarket.addEventListener('click', walkToNightMarket);
  }
  if (btnFestivalVisit) {
    btnFestivalVisit.addEventListener('click', walkToNightMarket);
  }

  // Soft Cheerful Acoustic Guitar & Marimba Melody (Pure Web Audio API, no external files!)
  const STAGE_MELODY = [
    523.25, 659.25, 783.99, 659.25, // C5 E5 G5 E5
    587.33, 739.99, 880.0, 739.99,  // D5 F#5 A5 F#5
    659.25, 783.99, 987.77, 783.99, // E5 G5 B5 G5
    523.25, 659.25, 783.99, 1046.5, // C5 E5 G5 C6
  ];
  const STAGE_BASS = [261.63, 293.66, 329.63, 196.0]; // C4 D4 E4 G3

  function playAcousticStageNote(stepIdx) {
    if (stageAudioMuted) return;
    try {
      const ac = getAudioContext();
      if (!ac) return;
      const now = ac.currentTime;
      const freq = STAGE_MELODY[stepIdx % STAGE_MELODY.length];

      // Plucked acoustic warm triangle voice
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.075, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.36);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.38);

      // Gentle bass root on downbeat of each 4-note bar
      if (stepIdx % 4 === 0) {
        const bassFreq = STAGE_BASS[Math.floor(stepIdx / 4) % STAGE_BASS.length];
        const bOsc = ac.createOscillator();
        const bGain = ac.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bassFreq, now);
        bGain.gain.setValueAtTime(0.001, now);
        bGain.gain.exponentialRampToValueAtTime(0.055, now + 0.03);
        bGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.62);
        bOsc.connect(bGain);
        bGain.connect(ac.destination);
        bOsc.start(now);
        bOsc.stop(now + 0.65);
      }
    } catch (_err) {
      // AudioContext unavailable or suspended
    }
  }

  function playWheelSpinSound() {
    if (stageAudioMuted) return;
    try {
      const ac = getAudioContext();
      if (!ac) return;
      const now = ac.currentTime;
      [440, 523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.001, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.09, now + idx * 0.07 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.22);
      });
    } catch (_err) {
      // Ignore audio errors
    }
  }

  function syncStageAudioPlayback() {
    let anyPerformer = false;
    players.forEach((p) => {
      if (p.performing) anyPerformer = true;
    });

    if (anyPerformer && !stageAudioMuted) {
      if (!stageMusicInterval) {
        playAcousticStageNote(stageMusicStep++);
        stageMusicInterval = setInterval(() => {
          playAcousticStageNote(stageMusicStep++);
        }, 310);
      }
    } else if (stageMusicInterval) {
      clearInterval(stageMusicInterval);
      stageMusicInterval = null;
    }

    if (btnStageAudioMute) {
      btnStageAudioMute.classList.toggle('muted', stageAudioMuted);
      btnStageAudioMute.textContent = stageAudioMuted ? '🔇 Senyap' : '🔊 Musik';
    }
  }

  if (btnStageAudioMute) {
    btnStageAudioMute.addEventListener('click', () => {
      stageAudioMuted = !stageAudioMuted;
      syncStageAudioPlayback();
      showToast(stageAudioMuted ? '🔇 Musik Panggung Pasar Malam dimatikan.' : '🔊 Musik Panggung Pasar Malam dinyalakan.');
    });
  }

  function findNightMarketAttractionAt(sx, sy, wx, wy) {
    if (!W.NIGHT_MARKET) return null;
    const nm = W.NIGHT_MARKET;
    const pad = camera.zoom < 0.8 ? 10 : 0;

    // 1. 3 Food Stalls (upright)
    for (let i = 0; i < nm.foodStalls.length; i++) {
      const s = nm.foodStalls[i];
      const loc = screenToUprightLocal(sx, sy, s.x, s.y + 12);
      if (Math.abs(loc.x - s.x) <= 44 + pad && loc.y >= s.y - 52 - pad && loc.y <= s.y + 42 + pad) {
        return { kind: 'food', id: s.id, item: s };
      }
    }

    // 2. Bianglala Mini (upright)
    const fw = nm.ferrisWheel;
    const locFw = screenToUprightLocal(sx, sy, fw.x, fw.y + 8);
    if (Math.abs(locFw.x - fw.x) <= 48 + pad && locFw.y >= fw.y - 82 - pad && locFw.y <= fw.y + 38 + pad) {
      return { kind: 'ferris', id: fw.id, item: fw };
    }

    // 3. Booth Roda Keberuntungan (upright)
    const lw = nm.luckyWheel;
    const locLw = screenToUprightLocal(sx, sy, lw.x, lw.y + 10);
    if (Math.abs(locLw.x - lw.x) <= 38 + pad && locLw.y >= lw.y - 62 - pad && locLw.y <= lw.y + 38 + pad) {
      return { kind: 'wheel', id: lw.id, item: lw };
    }

    // 4. Panggung Hiburan Warga (ground platform)
    if (W.isOnStage(wx, wy, 4)) {
      return { kind: 'stage', id: nm.stage.id, item: nm.stage };
    }

    return null;
  }

  function triggerNightMarketAction(targetAttr) {
    if (!joined) return;
    const me = mySocketId ? players.get(mySocketId) : null;
    if (!me) return;

    // Exit Bianglala if currently riding
    if (me.ferrisRide) {
      socket.emit('nightMarket:rideFerris', { action: 'exit' });
      return;
    }

    // Stop performing if currently performing and clicked stage button
    if (me.performing && (!targetAttr || targetAttr.kind === 'stage')) {
      socket.emit('nightMarket:stagePerform', { action: 'stop' });
      return;
    }

    const attr = targetAttr || nearbyNightMarket;
    if (!attr) return;

    if (attr.kind === 'food') {
      socket.emit('nightMarket:orderSnack', { stallId: attr.item.id }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal memesan jajanan.', true);
        }
      });
    } else if (attr.kind === 'ferris') {
      walkTarget = null;
      socket.emit('nightMarket:rideFerris', { action: 'board' }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal naik Bianglala Mini.', true);
        }
      });
    } else if (attr.kind === 'wheel') {
      socket.emit('nightMarket:spinWheel', (res) => {
        if (!res || !res.ok) {
          if (res && res.cooldownUntil) wheelCooldownUntil = res.cooldownUntil;
          showToast((res && res.error) || 'Roda Keberuntungan belum siap diputar.', true);
        }
      });
    } else if (attr.kind === 'stage') {
      walkTarget = null;
      socket.emit('nightMarket:stagePerform', { action: 'start' }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal tampil di Panggung Hiburan.', true);
        }
      });
    }
  }

  if (btnNightMarketAction) {
    btnNightMarketAction.addEventListener('click', () => {
      triggerNightMarketAction(null);
    });
  }

  function syncNightMarketActionBar(me, now) {
    if (!nightMarketActionBar || !me) return;
    if (buildState.selectedType || buildState.deleteMode) {
      nightMarketActionBar.hidden = true;
      return;
    }

    let anyPerformer = false;
    players.forEach((p) => {
      if (p.performing) anyPerformer = true;
    });

    const inMarket = W.isInNightMarket(me.x, me.y, 44);
    nearbyNightMarket = W.getNearbyNightMarketAttraction(me.x, me.y);

    if (me.ferrisRide) {
      nightMarketActionBar.hidden = false;
      btnNightMarketAction.hidden = false;
      btnNightMarketAction.className = 'btn-nm-action ferris-active';
      nmActionText.textContent = '⬇️ Turun Bianglala';
    } else if (me.performing) {
      nightMarketActionBar.hidden = false;
      btnNightMarketAction.hidden = false;
      btnNightMarketAction.className = 'btn-nm-action stage-active';
      nmActionText.textContent = '⏹️ Berhenti Tampil';
    } else if (nearbyNightMarket) {
      nightMarketActionBar.hidden = false;
      btnNightMarketAction.hidden = false;
      btnNightMarketAction.className = 'btn-nm-action';
      if (nearbyNightMarket.kind === 'food') {
        nmActionText.textContent = `${nearbyNightMarket.item.icon} Jajan / Pesan ${nearbyNightMarket.item.shortName}`;
      } else if (nearbyNightMarket.kind === 'ferris') {
        nmActionText.textContent = '🎡 Naik Wahana Bianglala';
      } else if (nearbyNightMarket.kind === 'wheel') {
        const remSec = Math.ceil((wheelCooldownUntil - now) / 1000);
        nmActionText.textContent =
          remSec > 0 ? `⏳ Roda Hiburan (${remSec}d)` : '🎯 Putar Roda Hiburan';
      } else if (nearbyNightMarket.kind === 'stage') {
        btnNightMarketAction.className = 'btn-nm-action stage-active';
        nmActionText.textContent = '🎸 Tampil / Main Musik';
      }
    } else if (anyPerformer || inMarket) {
      nightMarketActionBar.hidden = false;
      btnNightMarketAction.hidden = true;
    } else {
      nightMarketActionBar.hidden = true;
    }

    if (btnStageAudioMute) {
      btnStageAudioMute.hidden = !(anyPerformer || inMarket);
    }
    if (nmPointsBadge) {
      nmPointsBadge.hidden = !inMarket;
    }
  }

  // ---- Web Audio Chime + Push-to-Talk MediaRecorder Megafon Suara ----
  let sharedAudioCtx = null;
  function getAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  }

  function playVillageChime() {
    try {
      const ac = getAudioContext();
      if (!ac) return;
      const now = ac.currentTime;
      const notes = [523.25, 659.25, 783.99]; // Warm C5-E5-G5 wooden chime
      notes.forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + idx * 0.12 + 0.55);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.6);
      });
    } catch (_err) {
      // AudioContext blocked or unavailable
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = String(reader.result || '');
        const comma = res.indexOf(',');
        resolve(comma >= 0 ? res.slice(comma + 1) : res);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  let megRecorder = null;
  let megStream = null;
  let megChunks = [];
  let megStartedAt = 0;
  let megTimerInterval = null;
  let megMaxTimeout = null;
  let megIsPressing = false;
  let megBannerTimeout = null;
  let pendingMegaphoneAudioSrc = null;

  function showMegaphoneBanner(text, durationMs, replaySrc) {
    megaphoneBannerText.textContent = text;
    pendingMegaphoneAudioSrc = replaySrc || null;
    btnReplayMegaphone.hidden = !replaySrc;
    megaphoneBanner.hidden = false;
    if (megBannerTimeout) clearTimeout(megBannerTimeout);
    megBannerTimeout = setTimeout(() => {
      megaphoneBanner.hidden = true;
      btnReplayMegaphone.hidden = true;
      pendingMegaphoneAudioSrc = null;
    }, Math.max(3000, durationMs + 900));
  }

  btnReplayMegaphone.addEventListener('click', () => {
    if (!pendingMegaphoneAudioSrc) return;
    const audio = new Audio(pendingMegaphoneAudioSrc);
    audio.play().catch(() => {});
    btnReplayMegaphone.hidden = true;
  });

  function resetMegaphoneUi() {
    megIsPressing = false;
    btnMegaphonePtt.classList.remove('recording');
    megPttLabel.textContent = 'Megafon Kampung (Tahan)';
    megTimer.hidden = true;
    megTimer.textContent = '00s';
    if (megTimerInterval) {
      clearInterval(megTimerInterval);
      megTimerInterval = null;
    }
    if (megMaxTimeout) {
      clearTimeout(megMaxTimeout);
      megMaxTimeout = null;
    }
  }

  function stopMegaphoneRecording() {
    megIsPressing = false;
    if (megRecorder && megRecorder.state === 'recording') {
      try {
        megRecorder.stop();
      } catch (_err) {
        resetMegaphoneUi();
      }
    } else {
      resetMegaphoneUi();
      socket.emit('megaphone:talking', { talking: false });
      if (mySocketId) megaphoneSpeakers.delete(mySocketId);
    }
  }

  async function startMegaphoneRecording() {
    if (!joined || !(isAdmin || canMegaphone)) return;
    if (megRecorder && megRecorder.state === 'recording') return;

    megIsPressing = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
      resetMegaphoneUi();
      showToast('🎙️ Mikrofon tidak didukung browser ini. Gunakan tombol 🔔 Lonceng!', true);
      return;
    }

    try {
      megStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!megIsPressing) {
        // User released button before mic permission resolved
        megStream.getTracks().forEach((t) => t.stop());
        megStream = null;
        return;
      }

      const preferredTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'];
      const chosenMime = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t)) || '';
      megChunks = [];
      megRecorder = chosenMime
        ? new MediaRecorder(megStream, { mimeType: chosenMime })
        : new MediaRecorder(megStream);

      megStartedAt = Date.now();
      btnMegaphonePtt.classList.add('recording');
      megPttLabel.textContent = '🔴 Merekam... Lepas untuk kirim';
      megTimer.hidden = false;
      megTimer.textContent = '00s';

      if (mySocketId) {
        megaphoneSpeakers.set(mySocketId, { talking: true, until: Date.now() + 15000 });
      }
      socket.emit('megaphone:talking', { talking: true });

      megTimerInterval = setInterval(() => {
        const sec = Math.floor((Date.now() - megStartedAt) / 1000);
        megTimer.textContent = `${String(sec).padStart(2, '0')}s`;
      }, 250);

      megMaxTimeout = setTimeout(() => {
        stopMegaphoneRecording();
      }, 12000);

      megRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          megChunks.push(ev.data);
        }
      };

      megRecorder.onstop = async () => {
        const durationMs = Math.max(400, Date.now() - megStartedAt);
        const mimeType = (megRecorder && megRecorder.mimeType) || chosenMime || 'audio/webm';
        const streamToStop = megStream;
        megStream = null;
        megRecorder = null;
        resetMegaphoneUi();

        if (streamToStop) {
          streamToStop.getTracks().forEach((t) => t.stop());
        }
        if (mySocketId) {
          megaphoneSpeakers.set(mySocketId, { talking: false, until: Date.now() + Math.min(3500, durationMs) });
        }

        if (!megChunks.length) {
          socket.emit('megaphone:talking', { talking: false });
          return;
        }

        try {
          const blob = new Blob(megChunks, { type: mimeType });
          megChunks = [];
          const audioBase64 = await blobToBase64(blob);
          socket.emit(
            'megaphone:broadcast',
            { audioBase64, mimeType, durationMs, chimeOnly: false },
            (res) => {
              if (!res || !res.ok) {
                showToast((res && res.error) || 'Gagal menyiarkan suara megafon.', true);
                return;
              }
              showToast(
                res.listenersCount > 0
                  ? `📢 Suara Megafon diputar di layar ${res.listenersCount} warga!`
                  : '📢 Rekaman Megafon terkirim (belum ada warga lain online).'
              );
            }
          );
        } catch (_encErr) {
          showToast('Gagal memproses rekaman audio.', true);
        }
      };

      megRecorder.start(200);
    } catch (_micErr) {
      resetMegaphoneUi();
      showToast('🎙️ Izin mikrofon ditolak atau tidak tersedia. Gunakan tombol 🔔 Lonceng!', true);
    }
  }

  btnMegaphonePtt.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startMegaphoneRecording();
  });
  window.addEventListener('pointerup', () => {
    if (megIsPressing || (megRecorder && megRecorder.state === 'recording')) {
      stopMegaphoneRecording();
    }
  });
  window.addEventListener('pointercancel', () => {
    if (megIsPressing || (megRecorder && megRecorder.state === 'recording')) {
      stopMegaphoneRecording();
    }
  });

  btnMegaphoneChime.addEventListener('click', () => {
    if (!joined || !(isAdmin || canMegaphone)) return;
    playVillageChime();
    if (mySocketId) {
      megaphoneSpeakers.set(mySocketId, { talking: false, until: Date.now() + 2800 });
    }
    socket.emit('megaphone:broadcast', { chimeOnly: true, durationMs: 2600 }, (res) => {
      if (!res || !res.ok) {
        showToast((res && res.error) || 'Gagal membunyikan lonceng megafon.', true);
        return;
      }
      showToast(
        res.listenersCount > 0
          ? `🔔 Lonceng Megafon berbunyi di layar ${res.listenersCount} warga!`
          : '🔔 Lonceng Megafon dibunyikan!'
      );
    });
  });

  // ==================== Own House Signboard Rename ====================
  function isOwnedHouse(b) {
    if (!b || b.type !== 'rumah') return false;
    const me = mySocketId ? players.get(mySocketId) : null;
    if (myCitizenId && b.ownerId === myCitizenId) return true;
    if (me && b.ownerName && b.ownerName.toLowerCase() === me.name.toLowerCase()) return true;
    return false;
  }

  function findOwnedHouseAt(wx, wy) {
    for (let i = buildings.length - 1; i >= 0; i--) {
      const b = buildings[i];
      if (!isOwnedHouse(b)) continue;
      if (Math.abs(wx - b.x) <= 58 && wy >= b.y - 52 && wy <= b.y + 54) {
        return b;
      }
    }
    return null;
  }

  function openEditHouseModal(building) {
    if (!joined || !building) return;
    walkTarget = null;
    closePlayerCard();
    editingHouseId = building.id;
    editHouseName.value = building.label || '';
    editHouseError.hidden = true;
    editHouseModal.hidden = false;
    requestAnimationFrame(() => {
      editHouseModal.classList.add('visible');
      editHouseName.focus();
      editHouseName.select();
    });
  }

  function closeEditHouseModal() {
    editingHouseId = null;
    editHouseModal.classList.remove('visible');
    setTimeout(() => {
      editHouseModal.hidden = true;
    }, 220);
  }

  btnCloseEditHouse.addEventListener('click', closeEditHouseModal);
  btnCancelEditHouse.addEventListener('click', closeEditHouseModal);
  editHouseModal.addEventListener('click', (e) => {
    if (e.target === editHouseModal) closeEditHouseModal();
  });

  editHouseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editingHouseId) return;
    const label = editHouseName.value.trim();
    if (!label) {
      editHouseError.textContent = 'Nama papan rumah tidak boleh kosong.';
      editHouseError.hidden = false;
      editHouseName.focus();
      return;
    }

    editHouseError.hidden = true;
    socket.emit('build:rename', { id: editingHouseId, label }, (res) => {
      if (!res || !res.ok) {
        editHouseError.textContent = (res && res.error) || 'Gagal mengganti nama rumah.';
        editHouseError.hidden = false;
        return;
      }
      closeEditHouseModal();
      showToast(`🏡 Papan nama rumah diubah menjadi "${res.building.label}"!`);
    });
  });

  // ==================== Area Mancing Mania (Interactive Fishing Mini-Game) ====================
  function playStrikeAlertSound() {
    try {
      const ac = getAudioContext();
      if (!ac) return;
      const now = ac.currentTime;
      [740, 987.77].forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);
        gain.gain.setValueAtTime(0.001, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.16, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.18);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.2);
      });
    } catch (_err) {
      // Ignore audio errors
    }
  }

  function playCatchSuccessSound(isRare) {
    try {
      const ac = getAudioContext();
      if (!ac) return;
      const now = ac.currentTime;
      const notes = isRare ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.34);
      });
    } catch (_err) {
      // Ignore audio errors
    }
  }

  function isPointOnFishingBoard(sx, sy) {
    const loc = screenToUprightLocal(sx, sy, W.FISHING_BOARD.x, W.FISHING_BOARD.y + 12);
    const pad = camera.zoom < 0.8 ? 10 : 0;
    return (
      Math.abs(loc.x - W.FISHING_BOARD.x) <= 34 + pad &&
      loc.y >= W.FISHING_BOARD.y - 52 - pad &&
      loc.y <= W.FISHING_BOARD.y + 22 + pad
    );
  }

  function syncFishingButtonUI() {
    if (!btnFishAction) return;
    btnFishAction.classList.remove('waiting', 'strike');
    if (myFishingState === 'waiting') {
      btnFishAction.classList.add('waiting');
      fishActionText.textContent = '⏳ Menunggu Ikan... (Batal)';
      fishStrikeProgressWrap.hidden = true;
    } else if (myFishingState === 'strike') {
      btnFishAction.classList.add('strike');
      fishActionText.textContent = '⚡ Tarik Kail!';
      fishStrikeProgressWrap.hidden = false;
    } else {
      fishActionText.textContent = '🎣 Lempar Kail';
      fishStrikeProgressWrap.hidden = true;
    }
  }

  function formatCountdown(msRemaining) {
    const totalSec = Math.max(0, Math.floor(msRemaining / 1000));
    const days = Math.floor(totalSec / 86400);
    const hrs = Math.floor((totalSec % 86400) / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const pad = (n) => String(n).padStart(2, '0');
    if (days > 0) {
      return `${days}h ${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  function applyFishingState(nextState) {
    if (!nextState) return;
    fishingState = {
      leaderboard: Array.isArray(nextState.leaderboard) ? nextState.leaderboard : fishingLeaderboard,
      tournament: nextState.tournament || fishingState.tournament,
      championCitizenId: nextState.championCitizenId || null,
      championName: nextState.championName || '',
      history: Array.isArray(nextState.history) ? nextState.history : [],
    };
    fishingLeaderboard = fishingState.leaderboard;

    // Sync champion crown badge across all online players
    players.forEach((p) => {
      p.isFishingChampion = Boolean(
        fishingState.championCitizenId && p.citizenId === fishingState.championCitizenId
      );
    });

    syncTournamentUI();
    renderActiveCitizens();
    if (!fishingLeaderboardModal.hidden) {
      renderFishingLeaderboard();
    }
  }

  function syncTournamentUI() {
    const t = fishingState.tournament || {};
    const active = Boolean(t.active);

    if (tournamentBanner) {
      tournamentBanner.hidden = !(joined && active);
      if (active) {
        tournamentBannerTitle.textContent = `🏆 ${(t.title || 'LOMBA MANCING AKHIR PEKAN').toUpperCase()} SEDANG BERLANGSUNG!`;
        updateTournamentCountdownText();
      }
    }

    if (kadesTournamentBadge && btnKadesTournamentToggle) {
      kadesTournamentBadge.textContent = active ? '🔴 Sedang Berlangsung' : 'Belum Dimulai';
      btnKadesTournamentToggle.classList.toggle('running', active);
      btnKadesTournamentToggle.textContent = active
        ? '🛑 Akhiri Lomba & Umumkan Juara'
        : '🏁 Mulai Lomba Mancing Manual';
    }
  }

  function updateTournamentCountdownText() {
    const t = fishingState.tournament || {};
    if (!t.active || !t.endsAt) return;
    const rem = Math.max(0, t.endsAt - Date.now());
    const text = `⏱️ ${formatCountdown(rem)}`;
    if (tournamentCountdown) tournamentCountdown.textContent = text;
    if (fishTourneyStatusPill && !fishingLeaderboardModal.hidden) {
      fishTourneyStatusPill.textContent = `Aktif · ${text}`;
    }
  }

  setInterval(updateTournamentCountdownText, 1000);

  document.querySelectorAll('[data-tourney-dur]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedTourneyDur = btn.getAttribute('data-tourney-dur') || '1h';
      document.querySelectorAll('[data-tourney-dur]').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  if (btnKadesTournamentToggle) {
    btnKadesTournamentToggle.addEventListener('click', () => {
      const active = Boolean(fishingState.tournament && fishingState.tournament.active);
      if (active) {
        socket.emit('admin:endTournament', (res) => {
          if (!res || !res.ok) {
            showToast((res && res.error) || 'Gagal mengakhiri lomba.', true);
            return;
          }
          closeKadesPanelModal();
        });
      } else {
        socket.emit('admin:startTournament', { durationKey: selectedTourneyDur }, (res) => {
          if (!res || !res.ok) {
            showToast((res && res.error) || 'Gagal memulai lomba.', true);
            return;
          }
          if (res.fishingState) applyFishingState(res.fishingState);
          closeKadesPanelModal();
          showToast('🏆 Lomba Mancing resmi dimulai untuk seluruh kampung!');
        });
      }
    });
  }

  function setActiveFishTab(tabName) {
    activeFishTab = tabName;
    document.querySelectorAll('[data-fish-tab]').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-fish-tab') === tabName);
    });
    fishTabTournament.hidden = tabName !== 'tournament';
    fishTabAlltime.hidden = tabName !== 'alltime';
    fishTabHistory.hidden = tabName !== 'history';
  }

  document.querySelectorAll('[data-fish-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveFishTab(btn.getAttribute('data-fish-tab') || 'tournament');
    });
  });

  function renderFishingLeaderboard() {
    // 1. Reigning Champion Banner
    if (reigningChampionBanner) {
      if (fishingState.championName) {
        reigningChampionBanner.hidden = false;
        reigningChampionName.textContent = fishingState.championName;
      } else {
        reigningChampionBanner.hidden = true;
      }
    }

    // 2. Active Tournament Standings Tab
    const t = fishingState.tournament || {};
    if (fishTourneyTabTitle) {
      fishTourneyTabTitle.textContent = `🏆 ${t.title || 'Klasemen Lomba Mancing'}`;
    }
    if (fishTourneyStatusPill) {
      if (t.active && t.endsAt) {
        fishTourneyStatusPill.textContent = `Aktif · ⏱️ ${formatCountdown(Math.max(0, t.endsAt - Date.now()))}`;
      } else {
        fishTourneyStatusPill.textContent = 'Belum Berlangsung';
      }
    }
    if (fishTourneySubtext) {
      fishTourneySubtext.textContent = t.active
        ? `Setiap tangkapan saat lomba masuk ke klasemen khusus ini. Juara 1 berhak atas lencana 🏅 Juara Mancing!`
        : `Lomba otomatis aktif setiap Sabtu–Minggu (WIB) atau dapat dimulai kapan saja oleh Pak Kades di Menu Kades.`;
    }

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

    if (tournamentStandingsList) {
      tournamentStandingsList.innerHTML = '';
      const scores = Array.isArray(t.scores) ? t.scores : [];
      if (!scores.length) {
        tournamentStandingsList.innerHTML = `<li class="fish-lb-row"><span class="fish-lb-meta">${
          t.active
            ? 'Belum ada tangkapan pada sesi lomba ini. Lempar kailmu sekarang di Dermaga Mancing! 🎣'
            : 'Saat ini belum ada lomba yang sedang berjalan.'
        }</span></li>`;
      } else {
        scores.slice(0, 10).forEach((s, idx) => {
          const isMe = s.citizenId === myCitizenId;
          const li = document.createElement('li');
          li.className = `fish-lb-row${idx === 0 ? ' rank-1' : ''}${isMe ? ' is-me' : ''}`;
          li.innerHTML = `
            <div class="fish-lb-left">
              <span class="fish-rank-medal">${medals[idx] || idx + 1}</span>
              <div style="min-width:0">
                <div class="fish-lb-name">${escapeHtml(s.name)}${isMe ? ' (Kamu)' : ''}</div>
                <div class="fish-lb-meta">${s.catches} tangkapan${s.bestCatch ? ` · Terbaik: ${escapeHtml(s.bestCatch)}` : ''}</div>
              </div>
            </div>
            <span class="fish-lb-score">🏆 ${s.points} Poin</span>
          `;
          tournamentStandingsList.appendChild(li);
        });
      }
    }

    // 3. All-time Top 5 Leaderboard Tab
    if (fishingLeaderboardList) {
      fishingLeaderboardList.innerHTML = '';
      if (!fishingLeaderboard.length) {
        fishingLeaderboardList.innerHTML =
          '<li class="fish-lb-row"><span class="fish-lb-meta">Belum ada tangkapan. Jadilah warga pertama yang memancing di Dermaga Kayu! 🎣</span></li>';
      } else {
        fishingLeaderboard.forEach((a, idx) => {
          const isMe = a.citizenId === myCitizenId;
          const isChamp = Boolean(
            fishingState.championCitizenId && a.citizenId === fishingState.championCitizenId
          );
          const li = document.createElement('li');
          li.className = `fish-lb-row${idx === 0 ? ' rank-1' : ''}${isMe ? ' is-me' : ''}`;
          li.innerHTML = `
            <div class="fish-lb-left">
              <span class="fish-rank-medal">${medals[idx] || idx + 1}</span>
              <div style="min-width:0">
                <div class="fish-lb-name">${escapeHtml(a.name)}${isMe ? ' (Kamu)' : ''}${
            isChamp ? '<span class="champ-badge">🏅 Juara</span>' : ''
          }</div>
                <div class="fish-lb-meta">${a.totalCatches} tangkapan${a.bestCatch ? ` · Terbaik: ${escapeHtml(a.bestCatch)}` : ''}</div>
              </div>
            </div>
            <span class="fish-lb-score">🏆 ${a.totalPoints} Poin</span>
          `;
          fishingLeaderboardList.appendChild(li);
        });
      }
    }

    // 4. Past Tournament Champions History Tab
    if (tournamentHistoryList) {
      tournamentHistoryList.innerHTML = '';
      const history = Array.isArray(fishingState.history) ? fishingState.history : [];
      if (!history.length) {
        tournamentHistoryList.innerHTML =
          '<div class="fish-history-card"><span class="fish-lb-meta">Belum ada riwayat lomba selesai. Juara lomba akan diabadikan di sini!</span></div>';
      } else {
        history.forEach((item) => {
          const card = document.createElement('div');
          card.className = 'fish-history-card';
          const winnersHtml = (item.winners || [])
            .map((w) => {
              const m = w.rank === 1 ? '🥇' : w.rank === 2 ? '🥈' : '🥉';
              return `<div>${m} <strong>Juara ${w.rank}: ${escapeHtml(w.name)}</strong> — ${w.points} Poin (${w.catches} ikan)</div>`;
            })
            .join('');
          card.innerHTML = `
            <div class="fh-head">
              <span class="fh-title">🏆 ${escapeHtml(item.title || 'Lomba Mancing')}</span>
              <span class="fh-date">${formatDateShort(item.endedAt)}</span>
            </div>
            <div class="fh-winners">${winnersHtml || '<span>Tidak ada peserta</span>'}</div>
          `;
          tournamentHistoryList.appendChild(card);
        });
      }
    }
  }

  function openFishingLeaderboardModal(initialTab) {
    if (!joined) return;
    walkTarget = null;
    closePlayerCard();
    const defaultTab =
      initialTab ||
      (fishingState.tournament && fishingState.tournament.active ? 'tournament' : 'alltime');
    setActiveFishTab(defaultTab);
    renderFishingLeaderboard();
    fishingLeaderboardModal.hidden = false;
    requestAnimationFrame(() => fishingLeaderboardModal.classList.add('visible'));
  }

  function closeFishingLeaderboardModal() {
    fishingLeaderboardModal.classList.remove('visible');
    setTimeout(() => {
      fishingLeaderboardModal.hidden = true;
    }, 220);
  }

  function openWinnerAnnouncementModal(data) {
    if (!data) return;
    winnerModalTitle.textContent = `🏆 ${data.title || 'Lomba Mancing'} Selesai!`;
    const winners = Array.isArray(data.winners) ? data.winners : [];
    winnerPodiumList.innerHTML = '';

    if (!winners.length) {
      winnerModalSub.textContent = 'Lomba telah berakhir. Belum ada ikan yang tertangkap pada sesi ini.';
      winnerPodiumList.innerHTML =
        '<li class="fish-lb-row"><span class="fish-lb-meta">Yuk ikuti Lomba Mancing berikutnya di Dermaga Kayu! 🎣</span></li>';
    } else {
      winnerModalSub.innerHTML = `Selamat kepada para pemenang! <strong>${escapeHtml(
        winners[0].name
      )}</strong> resmi menyandang lencana <strong>🏅 Juara Mancing</strong>.`;
      const medals = ['🥇', '🥈', '🥉'];
      winners.forEach((w, idx) => {
        const li = document.createElement('li');
        li.className = `fish-lb-row${idx === 0 ? ' rank-1' : ''}`;
        li.innerHTML = `
          <div class="fish-lb-left">
            <span class="fish-rank-medal">${medals[idx] || idx + 1}</span>
            <div>
              <div class="fish-lb-name">Juara ${w.rank}: ${escapeHtml(w.name)}${
          idx === 0 ? '<span class="champ-badge">🏅 Juara Mancing</span>' : ''
        }</div>
              <div class="fish-lb-meta">${w.catches} tangkapan${w.bestCatch ? ` · Terbaik: ${escapeHtml(w.bestCatch)}` : ''}</div>
            </div>
          </div>
          <span class="fish-lb-score">🏆 ${w.points} Poin</span>
        `;
        winnerPodiumList.appendChild(li);
      });
    }

    tournamentWinnerModal.hidden = false;
    requestAnimationFrame(() => tournamentWinnerModal.classList.add('visible'));
  }

  function closeWinnerAnnouncementModal() {
    tournamentWinnerModal.classList.remove('visible');
    setTimeout(() => {
      tournamentWinnerModal.hidden = true;
    }, 220);
  }

  btnCloseWinnerModal.addEventListener('click', closeWinnerAnnouncementModal);
  btnOkWinnerModal.addEventListener('click', closeWinnerAnnouncementModal);
  tournamentWinnerModal.addEventListener('click', (e) => {
    if (e.target === tournamentWinnerModal) closeWinnerAnnouncementModal();
  });

  if (btnOpenTournamentStandings) {
    btnOpenTournamentStandings.addEventListener('click', () => {
      openFishingLeaderboardModal('tournament');
    });
  }

  btnFishingLeaderboard.addEventListener('click', () => openFishingLeaderboardModal());
  btnFishBoardQuick.addEventListener('click', () => openFishingLeaderboardModal());
  btnCloseFishBoard.addEventListener('click', closeFishingLeaderboardModal);
  btnDoneFishBoard.addEventListener('click', closeFishingLeaderboardModal);
  fishingLeaderboardModal.addEventListener('click', (e) => {
    if (e.target === fishingLeaderboardModal) closeFishingLeaderboardModal();
  });

  btnWalkToPier.addEventListener('click', () => {
    closeFishingLeaderboardModal();
    if (focusSocketId) focusOnPlayer(mySocketId);
    walkTarget = { x: 1276, y: 816 };
    showToast('🎣 Menuju Dermaga Kayu Mancing...');
  });

  btnFishAction.addEventListener('click', () => {
    if (!joined) return;
    if (myFishingState === 'idle') {
      walkTarget = null;
      socket.emit('fishing:cast', {}, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal melempar kail.', true);
          return;
        }
        myFishingState = 'waiting';
        syncFishingButtonUI();
      });
    } else if (myFishingState === 'waiting') {
      socket.emit('fishing:cancel');
      myFishingState = 'idle';
      syncFishingButtonUI();
    } else if (myFishingState === 'strike') {
      socket.emit('fishing:reel', (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Ikan keburu lepas!', true);
        }
      });
    }
  });

  // ==================== KOPDES (Koperasi Desa) & Tempat Usaha Warga ====================
  function getTodayDateKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function linkifySafeText(rawText) {
    const safe = escapeHtml(rawText || '');
    return safe.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  function populateBusinessCategories() {
    if (!inputBizCategory) return;
    inputBizCategory.innerHTML = '';
    (W.BUSINESS_CATEGORIES || []).forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat.id;
      opt.textContent = `${cat.icon} ${cat.id}`;
      inputBizCategory.appendChild(opt);
    });
  }

  function renderKopdesModal() {
    if (!kopdesData) return;
    const members = Array.isArray(kopdesData.members) ? kopdesData.members : [];
    const today = getTodayDateKey();
    const myMember = members.find((m) => m.citizenId === myCitizenId);
    const myPts = myMember ? myMember.points : 0;
    const claimedToday = Boolean(myMember && myMember.lastClaimDate === today);

    kopdesTreasury.textContent = `${kopdesData.treasury || 0} Poin`;
    kopdesMemberCount.textContent = `${members.length} Warga`;
    kopdesMyPoints.textContent = `${myPts} Poin`;

    kopdesClaimBadge.textContent = claimedToday ? '✓ Sudah Diklaim Hari Ini' : 'Tersedia Hari Ini';
    btnKopdesClaim.disabled = claimedToday;
    btnKopdesClaim.textContent = claimedToday
      ? '✓ Poin Harian Sudah Diklaim'
      : '🎁 Klaim Poin Harian (+25 Poin)';

    btnKopdesContribute.disabled = myPts < 10;

    kopdesMembersList.innerHTML = '';
    if (!members.length) {
      kopdesMembersList.innerHTML =
        '<li class="kopdes-member-row"><span style="color:var(--text-muted)">Belum ada anggota koperasi. Klaim poin harian untuk bergabung!</span></li>';
      return;
    }

    const sorted = [...members].sort((a, b) => (b.points || 0) - (a.points || 0));
    sorted.forEach((m) => {
      const isMe = m.citizenId === myCitizenId;
      const li = document.createElement('li');
      li.className = `kopdes-member-row${isMe ? ' is-me' : ''}`;
      li.innerHTML = `
        <div>
          <strong>${escapeHtml(m.name)}${isMe ? ' (Kamu)' : ''}</strong>
          <div style="font-size:0.7rem;color:var(--text-muted)">${escapeHtml(m.role || 'Warga Kampung')}</div>
        </div>
        <span class="kopdes-member-pts">⭐ ${Number(m.points) || 0} Poin</span>
      `;
      kopdesMembersList.appendChild(li);
    });
  }

  function openKopdesModal() {
    if (!joined) return;
    walkTarget = null;
    closePlayerCard();
    renderKopdesModal();
    kopdesModal.hidden = false;
    requestAnimationFrame(() => kopdesModal.classList.add('visible'));
  }

  function closeKopdesModal() {
    kopdesModal.classList.remove('visible');
    setTimeout(() => {
      kopdesModal.hidden = true;
    }, 220);
  }

  btnCloseKopdes.addEventListener('click', closeKopdesModal);
  kopdesModal.addEventListener('click', (e) => {
    if (e.target === kopdesModal) closeKopdesModal();
  });

  btnKopdesClaim.addEventListener('click', () => {
    socket.emit('kopdes:claimDaily', (res) => {
      if (!res || !res.ok) {
        showToast((res && res.error) || 'Gagal mengklaim poin harian.', true);
        if (res && res.kopdes) {
          kopdesData = res.kopdes;
          renderKopdesModal();
        }
        return;
      }
      kopdesData = res.kopdes;
      renderKopdesModal();
      showToast('🎁 Klaim berhasil! +25 Poin Warga & +10 Poin Kas Bersama Kampung!');
    });
  });

  btnKopdesContribute.addEventListener('click', () => {
    socket.emit('kopdes:contribute', (res) => {
      if (!res || !res.ok) {
        showToast((res && res.error) || 'Gagal menyumbang ke Kas Bersama.', true);
        return;
      }
      kopdesData = res.kopdes;
      renderKopdesModal();
      showToast('🤝 Terima kasih! +10 Poin disumbangkan ke Kas Bersama Kampung.');
    });
  });

  function openCreateBusinessModal(pos) {
    if (!joined || !pos) return;
    pendingBusinessPos = { x: pos.x, y: pos.y };
    walkTarget = null;
    closePlayerCard();
    inputBizName.value = '';
    inputBizPromo.value = '';
    createBizError.hidden = true;
    createBusinessModal.hidden = false;
    requestAnimationFrame(() => {
      createBusinessModal.classList.add('visible');
      inputBizName.focus();
    });
  }

  function closeCreateBusinessModal() {
    pendingBusinessPos = null;
    createBusinessModal.classList.remove('visible');
    setTimeout(() => {
      createBusinessModal.hidden = true;
    }, 220);
  }

  btnCloseCreateBiz.addEventListener('click', closeCreateBusinessModal);
  btnCancelCreateBiz.addEventListener('click', closeCreateBusinessModal);
  createBusinessModal.addEventListener('click', (e) => {
    if (e.target === createBusinessModal) closeCreateBusinessModal();
  });

  createBusinessForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!pendingBusinessPos) return;
    const bizName = inputBizName.value.trim();
    const bizCategory = inputBizCategory.value;
    const bizPromo = inputBizPromo.value.trim();
    if (!bizName) {
      createBizError.textContent = 'Nama usaha wajib diisi.';
      createBizError.hidden = false;
      inputBizName.focus();
      return;
    }

    createBizError.hidden = true;
    const pos = pendingBusinessPos;
    socket.emit(
      'build:place',
      {
        type: 'usaha',
        x: pos.x,
        y: pos.y,
        business: {
          name: bizName,
          category: bizCategory,
          promo: bizPromo,
        },
      },
      (res) => {
        if (!res || !res.ok) {
          createBizError.textContent = (res && res.error) || 'Gagal mendirikan tempat usaha.';
          createBizError.hidden = false;
          return;
        }
        closeCreateBusinessModal();
        clearBuildMode();
        showToast(`🏪 Tempat Usaha "${bizName}" berhasil didirikan!`);
      }
    );
  });

  function renderBusinessProfileModal(building) {
    if (!building || building.type !== 'usaha') return;
    const biz = building.business || {};
    const catMeta =
      (W.BUSINESS_CATEGORIES || []).find((c) => c.id === biz.category) ||
      { id: biz.category || 'Usaha Warga', icon: '🏪' };
    const likes = Number(building.likes) || 0;
    const likedBy = Array.isArray(building.likedBy) ? building.likedBy : [];
    const hasSupported = Boolean(myCitizenId && likedBy.includes(myCitizenId));

    bizProfileCategory.textContent = `${catMeta.icon} ${catMeta.id}`;
    bizProfileTitle.textContent = biz.name || building.label || 'Tempat Usaha Warga';
    bizProfileOwner.textContent = `Dimiliki oleh ${building.ownerName || 'Warga Kampung'}`;

    if (biz.promo && biz.promo.trim()) {
      bizProfilePromo.innerHTML = linkifySafeText(biz.promo);
    } else {
      bizProfilePromo.innerHTML =
        '<span style="color:var(--text-muted);font-style:italic">Belum ada catatan promosi. Mampir dan beri dukungan hangat untuk usaha warga ini!</span>';
    }

    bizLikesCount.textContent = String(likes);
    btnSupportBusiness.classList.toggle('supported', hasSupported);
    btnSupportBusiness.textContent = hasSupported
      ? `✓ Sudah Didukung (👍 ${likes})`
      : '👍 Dukung / Beri Jempol';
  }

  function openBusinessProfileModal(building) {
    if (!joined || !building) return;
    walkTarget = null;
    closePlayerCard();
    viewingBusinessId = building.id;
    renderBusinessProfileModal(building);
    businessProfileModal.hidden = false;
    requestAnimationFrame(() => businessProfileModal.classList.add('visible'));
  }

  function closeBusinessProfileModal() {
    viewingBusinessId = null;
    businessProfileModal.classList.remove('visible');
    setTimeout(() => {
      businessProfileModal.hidden = true;
    }, 220);
  }

  btnCloseBizProfile.addEventListener('click', closeBusinessProfileModal);
  businessProfileModal.addEventListener('click', (e) => {
    if (e.target === businessProfileModal) closeBusinessProfileModal();
  });

  btnSupportBusiness.addEventListener('click', () => {
    if (!viewingBusinessId) return;
    socket.emit('business:support', { id: viewingBusinessId }, (res) => {
      if (!res || !res.ok) {
        showToast((res && res.error) || 'Gagal memberi dukungan.', true);
        return;
      }
      renderBusinessProfileModal(res.building);
      showToast(
        res.supported
          ? `👍 Kamu mendukung "${(res.building.business && res.building.business.name) || res.building.label}"!`
          : 'Dukungan jempol dibatalkan.'
      );
    });
  });

  function findInteractiveBuildingAt(sx, sy) {
    for (let i = buildings.length - 1; i >= 0; i--) {
      const b = buildings[i];
      if (b.type === 'kopdes') {
        const loc = screenToUprightLocal(sx, sy, b.x, b.y + 12);
        if (Math.abs(loc.x - b.x) <= 74 && loc.y >= b.y - 62 && loc.y <= b.y + 60) {
          return { building: b, id: b.id, hint: '🏛️ Klik buka KOPDES' };
        }
      } else if (b.type === 'usaha') {
        const loc = screenToUprightLocal(sx, sy, b.x, b.y + 12);
        if (Math.abs(loc.x - b.x) <= 58 && loc.y >= b.y - 54 && loc.y <= b.y + 56) {
          return { building: b, id: b.id, hint: '🏪 Klik lihat profil usaha' };
        }
      } else if (isOwnedHouse(b)) {
        const loc = screenToUprightLocal(sx, sy, b.x, b.y + 12);
        if (Math.abs(loc.x - b.x) <= 58 && loc.y >= b.y - 54 && loc.y <= b.y + 54) {
          return { building: b, id: b.id, hint: '✏️ Klik ubah papan nama' };
        }
      }
    }
    return null;
  }

  // ==================== Co-Building ('Bangun & Tanam') ====================
  function buildCatalogUI() {
    buildCatalogList.innerHTML = '';
    W.BUILD_CATALOG.forEach((item) => {
      if (item.adminOnly && !isAdmin) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `build-item-btn${item.adminOnly ? ' admin-build' : ''}`;
      btn.dataset.type = item.type;
      btn.title = `${item.name} — ${item.desc}`;
      btn.innerHTML = `
        <span class="b-icon">${item.icon}</span>
        <span class="b-label">${item.shortName}</span>
      `;
      btn.addEventListener('click', () => {
        if (buildState.selectedType === item.type) {
          clearBuildMode();
        } else {
          selectBuildType(item.type);
        }
      });
      buildCatalogList.appendChild(btn);
    });
  }

  function syncBuildUI() {
    buildCatalogList.querySelectorAll('.build-item-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.type === buildState.selectedType);
    });
    btnDeleteMode.classList.toggle('active-danger', buildState.deleteMode);

    const anyMode = Boolean(buildState.selectedType || buildState.deleteMode);
    btnCancelBuild.hidden = !anyMode;
    canvas.classList.toggle('build-cursor', anyMode);

    if (buildState.selectedType) {
      const meta = W.BUILD_CATALOG_MAP[buildState.selectedType];
      houseLabelBar.hidden = !meta.hasLabel;
      buildStatusText.textContent = `Mode Bangun: ${meta.name} — Klik lahan hijau`;
      updateBuildPreview();
    } else if (buildState.deleteMode) {
      houseLabelBar.hidden = true;
      buildStatusText.textContent = 'Mode Hapus: Klik bangunan/tanaman yang ingin dihapus';
      updateDeleteHover();
    } else {
      houseLabelBar.hidden = true;
      buildStatusText.textContent = 'WASD / Panah / Tap untuk jalan · Klik Mading untuk menulis';
      buildState.previewPos = null;
      buildState.validation = null;
      buildState.hoveredBuilding = null;
      buildState.snappedKavlingId = null;
    }
  }

  function selectBuildType(type) {
    buildState.selectedType = type;
    buildState.deleteMode = false;
    walkTarget = null;
    syncBuildUI();
  }

  function clearBuildMode() {
    buildState.selectedType = null;
    buildState.deleteMode = false;
    buildState.snappedKavlingId = null;
    syncBuildUI();
  }

  btnDeleteMode.addEventListener('click', () => {
    if (buildState.deleteMode) {
      clearBuildMode();
    } else {
      buildState.selectedType = null;
      buildState.deleteMode = true;
      walkTarget = null;
      syncBuildUI();
    }
  });

  btnCancelBuild.addEventListener('click', clearBuildMode);

  inputHouseLabel.addEventListener('input', () => {
    buildState.houseLabel = inputHouseLabel.value;
  });

  function updateBuildPreview() {
    if (!buildState.selectedType) return;
    const meta = W.BUILD_CATALOG_MAP[buildState.selectedType];
    const snap = meta.snap || 20;
    let sx = Math.round(pointerWorld.x / snap) * snap;
    let sy = Math.round(pointerWorld.y / snap) * snap;
    buildState.snappedKavlingId = null;

    // Auto-Snap-to-Kavling when building a house over/near an active Cluster Kavling!
    if (buildState.selectedType === 'rumah' && W.findClusterKavlingAt) {
      const candidate = W.findClusterKavlingAt(
        pointerWorld.x,
        pointerWorld.y,
        housingCluster.kavlings || [],
        22
      );
      if (candidate) {
        buildState.snappedKavlingId = candidate.id;
        sx = candidate.centerX;
        sy = candidate.centerY - 4;
      }
    }

    buildState.previewPos = { x: sx, y: sy };
    buildState.validation = W.validatePlacement(
      buildState.selectedType,
      sx,
      sy,
      buildings,
      housingCluster
    );

    if (buildState.selectedType === 'rumah' && buildState.snappedKavlingId && buildStatusText) {
      const snappedKav = (housingCluster.kavlings || []).find((k) => k.id === buildState.snappedKavlingId);
      if (snappedKav) {
        buildStatusText.textContent = buildState.validation.ok
          ? `🏡 Auto-Snap ${snappedKav.code} (Tersedia) — Klik untuk mendirikan rumah!`
          : `⚠️ ${buildState.validation.reason}`;
      }
    }
  }

  function findBuildingAt(sx, sy, wx, wy) {
    let best = null;
    let bestDist = Infinity;
    for (let i = buildings.length - 1; i >= 0; i--) {
      const b = buildings[i];
      const meta = W.BUILD_CATALOG_MAP[b.type];
      const hitR = meta ? Math.max(meta.width, meta.height) * 0.52 : 34;
      let d;
      if (b.type === 'jalan') {
        d = Math.hypot(wx - b.x, wy - b.y);
      } else {
        const loc = screenToUprightLocal(sx, sy, b.x, b.y + 12);
        d = Math.hypot(loc.x - b.x, loc.y - b.y);
      }
      if (d <= hitR && d < bestDist) {
        best = b;
        bestDist = d;
      }
    }
    return best;
  }

  function updateDeleteHover() {
    if (!buildState.deleteMode) return;
    buildState.hoveredBuilding = findBuildingAt(
      pointerScreen.x,
      pointerScreen.y,
      pointerWorld.x,
      pointerWorld.y
    );
  }

  function isPointOnMading(sx, sy) {
    const loc = screenToUprightLocal(sx, sy, W.MADING.x, W.MADING.y + 18);
    const pad = camera.zoom < 0.8 ? 10 : 0;
    return (
      Math.abs(loc.x - W.MADING.x) <= 52 + pad &&
      loc.y >= W.MADING.y - 64 - pad &&
      loc.y <= W.MADING.y + 30 + pad
    );
  }

  // ==================== Canvas Pointer & Keyboard Input ====================
  canvas.addEventListener('pointermove', (e) => {
    if (!joined) return;
    const sp = clientToCanvasScreen(e.clientX, e.clientY);
    const wp = R.screenToWorld(sp.x, sp.y, camera, viewportW, viewportH);
    pointerScreen.x = sp.x;
    pointerScreen.y = sp.y;
    pointerScreen.active = true;
    pointerWorld.x = wp.x;
    pointerWorld.y = wp.y;
    pointerWorld.active = true;

    hoveredMading = !buildState.selectedType && !buildState.deleteMode && isPointOnMading(sp.x, sp.y);
    hoveredFishingBoard =
      !buildState.selectedType && !buildState.deleteMode && isPointOnFishingBoard(sp.x, sp.y);
    hoveredClusterDirectory =
      !buildState.selectedType && !buildState.deleteMode && isPointOnClusterDirectory(sp.x, sp.y);

    hoveredPlayerId = null;
    players.forEach((p, sid) => {
      const loc = screenToUprightLocal(sp.x, sp.y, p.x, p.y);
      const hitBody = Math.hypot(loc.x - p.x, loc.y - (p.y - 18)) < 28;
      const hitEdit =
        sid === mySocketId &&
        p._editBtnHit &&
        Math.hypot(loc.x - p._editBtnHit.x, loc.y - p._editBtnHit.y) <= p._editBtnHit.r + 3;
      if (hitBody || hitEdit) {
        hoveredPlayerId = sid;
      }
    });

    if (
      !buildState.selectedType &&
      !buildState.deleteMode &&
      !hoveredMading &&
      !hoveredFishingBoard &&
      !hoveredClusterDirectory &&
      !hoveredPlayerId
    ) {
      hoveredInteractiveBuilding = findInteractiveBuildingAt(sp.x, sp.y);
      hoveredNightMarket = hoveredInteractiveBuilding
        ? null
        : findNightMarketAttractionAt(sp.x, sp.y, wp.x, wp.y);
    } else {
      hoveredInteractiveBuilding = null;
      hoveredNightMarket = null;
    }

    if (buildState.selectedType) {
      updateBuildPreview();
    } else if (buildState.deleteMode) {
      updateDeleteHover();
    }
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (!joined || e.button !== 0) return;
    const sp = clientToCanvasScreen(e.clientX, e.clientY);
    const sx = sp.x;
    const sy = sp.y;
    const wp = R.screenToWorld(sx, sy, camera, viewportW, viewportH);
    pointerScreen.x = sx;
    pointerScreen.y = sy;
    pointerWorld.x = wp.x;
    pointerWorld.y = wp.y;

    if (buildState.selectedType) {
      updateBuildPreview();
      if (!buildState.validation || !buildState.validation.ok) {
        showToast((buildState.validation && buildState.validation.reason) || 'Lokasi tidak dapat dibangun', true);
        return;
      }
      const type = buildState.selectedType;
      const pos = buildState.previewPos;
      const meta = W.BUILD_CATALOG_MAP[type];

      // For Tempat Usaha Warga, open the Business Setup Form before placing!
      if (type === 'usaha') {
        openCreateBusinessModal(pos);
        return;
      }

      socket.emit(
        'build:place',
        {
          type,
          x: pos.x,
          y: pos.y,
          kavlingId: type === 'rumah' && buildState.snappedKavlingId ? buildState.snappedKavlingId : undefined,
          label: meta.hasLabel ? inputHouseLabel.value.trim() : '',
        },
        (res) => {
          if (!res || !res.ok) {
            showToast((res && res.error) || 'Gagal membangun elemen.', true);
            return;
          }
          if (res.housingCluster) {
            applyHousingCluster(res.housingCluster);
          }
          showToast(
            res.kavlingCode
              ? `🏡 Rumah berhasil dibangun di ${res.kavlingCode}!`
              : `${meta.icon} ${meta.name} berhasil dipasang!`
          );
          updateBuildPreview();
        }
      );
      return;
    }

    if (buildState.deleteMode) {
      const target = findBuildingAt(sx, sy, wp.x, wp.y);
      if (!target) {
        showToast('Klik tepat pada bangunan atau tanaman untuk menghapus.', true);
        return;
      }
      socket.emit('build:remove', { id: target.id }, (res) => {
        if (!res || !res.ok) {
          showToast((res && res.error) || 'Gagal menghapus elemen.', true);
          return;
        }
        showToast('Elemen berhasil dihapus dari lahan.');
        buildState.hoveredBuilding = null;
      });
      return;
    }

    // Check click on off-screen visitor directional arrow pills first (screen coordinates)
    for (let i = 0; i < offscreenHits.length; i++) {
      const h = offscreenHits[i];
      if (sx >= h.x && sx <= h.x + h.w && sy >= h.y && sy <= h.y + h.h) {
        focusOnPlayer(h.socketId);
        openPlayerCard(h.socketId, false);
        return;
      }
    }

    // Check click on local player's pencil edit badge beside nameplate (upright local coords)
    const me = mySocketId ? players.get(mySocketId) : null;
    if (me && me._editBtnHit) {
      const locMe = screenToUprightLocal(sx, sy, me.x, me.y);
      if (Math.hypot(locMe.x - me._editBtnHit.x, locMe.y - me._editBtnHit.y) <= me._editBtnHit.r + 4) {
        closePlayerCard();
        openEditProfileModal();
        return;
      }
    }

    // Check click / tap on another online visitor's character or nameplate -> open floating interaction card!
    const clickedOther = hitOtherPlayer(sx, sy);
    if (clickedOther) {
      openPlayerCard(clickedOther.socketId, false);
      return;
    }

    // Clicking empty map area closes any open floating player profile card
    if (selectedPlayerId) {
      closePlayerCard();
    }

    // Check Mading Kampung click
    if (isPointOnMading(sx, sy)) {
      openMadingModal();
      return;
    }

    // Check Fishing Leaderboard wooden board click beside the pier
    if (isPointOnFishingBoard(sx, sy)) {
      openFishingLeaderboardModal();
      return;
    }

    // Check Papan Direktori Komplek click near Pos Keamanan
    if (isPointOnClusterDirectory(sx, sy)) {
      openClusterDirectoryModal();
      return;
    }

    // Check click on Area Pasar Malam & Hiburan attractions (Stalls, Bianglala, Roda Hiburan, Panggung)
    const hitNm = findNightMarketAttractionAt(sx, sy, wp.x, wp.y);
    if (hitNm && me) {
      if (focusSocketId) focusOnPlayer(mySocketId);
      const targetX = hitNm.kind === 'stage' ? hitNm.item.centerX : hitNm.item.x;
      const targetY =
        hitNm.kind === 'stage'
          ? hitNm.item.centerY
          : hitNm.kind === 'ferris'
          ? hitNm.item.y + 28
          : hitNm.item.y + 34;
      const dist = Math.hypot(me.x - targetX, me.y - targetY);
      if (dist <= 95) {
        triggerNightMarketAction(hitNm);
      } else {
        walkTarget = { x: targetX, y: targetY };
        showToast(`🎪 Berjalan mendekati ${hitNm.item.name}...`);
      }
      return;
    }

    // Check click on interactive buildings: KOPDES, Tempat Usaha Warga, or Own House!
    const hitInteractive = findInteractiveBuildingAt(sx, sy);
    if (hitInteractive && hitInteractive.building) {
      const b = hitInteractive.building;
      if (b.type === 'kopdes') {
        openKopdesModal();
        return;
      }
      if (b.type === 'usaha') {
        openBusinessProfileModal(b);
        return;
      }
      if (b.type === 'rumah') {
        openEditHouseModal(b);
        return;
      }
    }

    // Otherwise tap-to-walk to target location (and return camera to local player)
    if (focusSocketId || cameraVisitTarget) {
      cameraVisitTarget = null;
      focusOnPlayer(mySocketId);
    }
    walkTarget = {
      x: Math.max(52, Math.min(W.WORLD_WIDTH - 52, wp.x)),
      y: Math.max(60, Math.min(W.WORLD_HEIGHT - 24, wp.y)),
    };
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (clusterDirectoryModal && !clusterDirectoryModal.hidden) {
        closeClusterDirectoryModal();
      } else if (!tournamentWinnerModal.hidden) {
        closeWinnerAnnouncementModal();
      } else if (!fishingLeaderboardModal.hidden) {
        closeFishingLeaderboardModal();
      } else if (!kopdesModal.hidden) {
        closeKopdesModal();
      } else if (!createBusinessModal.hidden) {
        closeCreateBusinessModal();
      } else if (!businessProfileModal.hidden) {
        closeBusinessProfileModal();
      } else if (!kadesPinModal.hidden) {
        closeKadesPinModal();
      } else if (!kadesPanelModal.hidden) {
        closeKadesPanelModal();
      } else if (!editHouseModal.hidden) {
        closeEditHouseModal();
      } else if (!editProfileModal.hidden) {
        closeEditProfileModal();
      } else if (!madingModal.hidden) {
        closeMadingModal();
      } else if (selectedPlayerId) {
        closePlayerCard();
      } else if (focusSocketId || cameraVisitTarget) {
        cameraVisitTarget = null;
        focusOnPlayer(mySocketId);
      } else if (buildState.selectedType || buildState.deleteMode) {
        clearBuildMode();
      }
      return;
    }

    if (
      !joined ||
      isTypingInField() ||
      !madingModal.hidden ||
      !editProfileModal.hidden ||
      !editHouseModal.hidden ||
      !kadesPinModal.hidden ||
      !kadesPanelModal.hidden ||
      !kopdesModal.hidden ||
      !createBusinessModal.hidden ||
      !businessProfileModal.hidden ||
      !fishingLeaderboardModal.hidden ||
      !tournamentWinnerModal.hidden ||
      (clusterDirectoryModal && !clusterDirectoryModal.hidden)
    ) {
      return;
    }

    let handled = false;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        keys.up = true;
        handled = true;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        keys.down = true;
        handled = true;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        keys.left = true;
        handled = true;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        keys.right = true;
        handled = true;
        break;
    }
    if (handled) {
      walkTarget = null;
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        keys.up = false;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        keys.down = false;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        keys.left = false;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        keys.right = false;
        break;
    }
  });

  window.addEventListener('blur', () => {
    keys.up = keys.down = keys.left = keys.right = false;
  });

  // ==================== Mobile Virtual Joystick ====================
  function updateJoystickFromPointer(clientX, clientY) {
    const rect = joystickBase.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width * 0.38;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }
    joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    joystickVec.x = dx / maxR;
    joystickVec.y = dy / maxR;
    walkTarget = null;
  }

  joystickBase.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    joystickVec.active = true;
    joystickVec.pointerId = e.pointerId;
    joystickBase.setPointerCapture(e.pointerId);
    updateJoystickFromPointer(e.clientX, e.clientY);
  });

  joystickBase.addEventListener('pointermove', (e) => {
    if (!joystickVec.active || e.pointerId !== joystickVec.pointerId) return;
    e.stopPropagation();
    updateJoystickFromPointer(e.clientX, e.clientY);
  });

  function resetJoystick(e) {
    if (!joystickVec.active) return;
    if (e && joystickVec.pointerId !== null && e.pointerId !== joystickVec.pointerId) return;
    joystickVec.active = false;
    joystickVec.pointerId = null;
    joystickVec.x = 0;
    joystickVec.y = 0;
    joystickKnob.style.transform = 'translate(0px, 0px)';
  }

  joystickBase.addEventListener('pointerup', resetJoystick);
  joystickBase.addEventListener('pointercancel', resetJoystick);

  // ==================== Socket.io Real-time Listeners ====================
  socket.on('connect', () => {
    // Seamless auto-rejoin with locked playerId when server restarts while user is already in village
    if (!joined || !activeProfileSnapshot) return;
    const prevMe = mySocketId ? players.get(mySocketId) : null;
    socket.emit(
      'citizen:join',
      {
        playerId: activeProfileSnapshot.playerId,
        citizenId: activeProfileSnapshot.citizenId,
        name: activeProfileSnapshot.name,
        role: activeProfileSnapshot.role,
        avatar: activeProfileSnapshot.avatar,
        reconnect: true,
        preservePosition: prevMe ? { x: prevMe.x, y: prevMe.y } : null,
      },
      (res) => {
        if (!res || !res.ok) return;
        const world = res.world;
        mySocketId = world.me.socketId;
        myCitizenId = world.me.playerId || world.me.citizenId;
        saveProfile(world.me);

        players.clear();
        world.players.forEach((p) => {
          players.set(p.socketId, { ...p, targetX: p.x, targetY: p.y });
        });
        buildings = world.buildings || [];
        madingNotes = world.mading || [];
        if (world.kopdes) kopdesData = world.kopdes;
        if (world.fishingState) {
          applyFishingState(world.fishingState);
        } else if (Array.isArray(world.fishingLeaderboard)) {
          fishingLeaderboard = world.fishingLeaderboard;
        }
        if (world.settings) {
          applyVillageSettings(world.settings);
        }
        if (world.housingCluster) {
          applyHousingCluster(world.housingCluster);
        }
        if (world.nightMarket) {
          nightMarketPoints = Number(world.nightMarket.myPoints) || 0;
          wheelCooldownUntil = Number(world.nightMarket.wheelCooldownUntil) || 0;
          syncNightMarketPointsUI();
        }
        isAdmin = Boolean(world.isAdmin);
        canMegaphone = Boolean(world.canMegaphone);
        syncKadesUI();

        updateStatsUI(world.stats);
        renderMadingNotes();
        renderActiveCitizens();
        showToast('🔄 Tersambung kembali ke Kampung Hijau!');
      }
    );
  });

  socket.on('stats:update', (stats) => {
    updateStatsUI(stats);
  });

  socket.on('player:joined', (player) => {
    players.set(player.socketId, { ...player, targetX: player.x, targetY: player.y });
    renderActiveCitizens();
    syncStageAudioPlayback();
    if (isAdmin) renderKadesMegaphoneList();
  });

  socket.on('player:moved', (data) => {
    const p = players.get(data.socketId);
    if (!p) return;
    p.targetX = data.x;
    p.targetY = data.y;
    p.dir = data.dir;
    p.moving = data.moving;
  });

  socket.on('player:left', (data) => {
    players.delete(data.socketId);
    bubbles.delete(data.socketId);
    whispers.delete(data.socketId);
    greetEffects.delete(data.socketId);
    megaphoneSpeakers.delete(data.socketId);
    if (focusSocketId === data.socketId) {
      focusSocketId = null;
      updateCameraFocusUI();
    }
    if (selectedPlayerId === data.socketId) {
      closePlayerCard();
    }
    renderActiveCitizens();
    syncStageAudioPlayback();
    if (isAdmin) renderKadesMegaphoneList();
  });

  socket.on('player:profileUpdated', (data) => {
    if (!data) return;

    const targetIds = Array.isArray(data.socketIds) && data.socketIds.length
      ? data.socketIds
      : [data.socketId];

    targetIds.forEach((sid) => {
      const p = players.get(sid);
      if (p) {
        p.name = data.name;
        p.role = data.role;
      }
    });

    if (Array.isArray(data.updatedBuildings) && data.updatedBuildings.length) {
      const byId = new Map(data.updatedBuildings.map((b) => [b.id, b]));
      buildings = buildings.map((b) => (byId.has(b.id) ? byId.get(b.id) : b));
    }

    if (Array.isArray(data.mading)) {
      madingNotes = data.mading;
      renderMadingNotes();
    }

    if (targetIds.includes(mySocketId)) {
      hudMyProfile.textContent = `${data.name} · ${data.role}`;
      if (
        !inputHouseLabel.value.trim() ||
        inputHouseLabel.value.trim().toLowerCase() === `rumah ${String(data.oldName || '').toLowerCase()}`
      ) {
        inputHouseLabel.value = `Rumah ${data.name}`;
        buildState.houseLabel = inputHouseLabel.value;
      }
    }

    if (focusSocketId && targetIds.includes(focusSocketId)) {
      updateCameraFocusUI();
    }
    if (selectedPlayerId && targetIds.includes(selectedPlayerId)) {
      syncPlayerCardContent(players.get(selectedPlayerId));
    }

    renderActiveCitizens();
  });

  socket.on('chat:message', (msg) => {
    if (!joined) return;
    appendChatMessage(msg, true);
  });

  socket.on('player:reaction', (rx) => {
    if (!joined) return;
    // Show warm cream floating greeting bubble above the speaker's head for 6 seconds!
    bubbles.set(rx.socketId, {
      text: `${rx.label} ${rx.emoji}`,
      isGreeting: true,
      createdAt: Date.now(),
    });
  });

  socket.on('player:targetedGreet', (data) => {
    if (!joined || !data) return;
    const now = Date.now();
    // Sender gets warm cream targeted greeting bubble above head for 6s
    bubbles.set(data.fromSocketId, {
      text: data.message,
      isGreeting: true,
      createdAt: now,
    });
    // Target gets floating waving-hand & heart sparkle effect above head
    greetEffects.set(data.targetSocketId, {
      fromName: data.fromName,
      createdAt: now,
    });
    if (data.targetSocketId === mySocketId) {
      showToast(`👋 ${data.fromName} menyapamu: "${data.message}"`);
    }
  });

  socket.on('dm:received', (dm) => {
    if (!joined || !dm) return;
    // Private whisper bubble above recipient's head — only sender & recipient ever receive this event!
    whispers.set(dm.targetSocketId, {
      fromName: dm.fromName,
      text: dm.text,
      createdAt: Date.now(),
    });
    if (dm.targetSocketId === mySocketId) {
      pushDmNotification(dm);
    } else if (dm.fromSocketId === mySocketId) {
      showToast(`💌 Pesan pribadi terkirim ke ${dm.targetName}`);
    }
  });

  socket.on('mading:added', (note) => {
    if (madingNotes.some((n) => n.id === note.id)) return;
    madingNotes.unshift(note);
    renderMadingNotes();
    if (joined && madingModal.hidden) {
      showToast(`📌 ${note.author} menulis catatan baru di Mading Kampung!`);
    }
  });

  socket.on('build:placed', (building) => {
    if (buildings.some((b) => b.id === building.id)) return;
    buildings.push(building);
    if (buildState.selectedType) updateBuildPreview();
  });

  socket.on('build:updated', (building) => {
    if (!building || !building.id) return;
    const idx = buildings.findIndex((b) => b.id === building.id);
    if (idx !== -1) {
      buildings[idx] = building;
    } else {
      buildings.push(building);
    }
    if (viewingBusinessId === building.id && !businessProfileModal.hidden) {
      renderBusinessProfileModal(building);
    }
  });

  socket.on('kopdes:updated', (data) => {
    if (!data || !data.kopdes) return;
    kopdesData = data.kopdes;
    if (!kopdesModal.hidden) {
      renderKopdesModal();
    }
  });

  socket.on('business:supported', (data) => {
    if (!joined || !data || !data.supported) return;
    const me = mySocketId ? players.get(mySocketId) : null;
    if (me && data.fromName !== me.name) {
      showToast(`👍 ${data.fromName} mendukung usaha "${data.businessName}"!`);
    }
  });

  socket.on('player:fishingState', (data) => {
    if (!joined || !data) return;
    const p = players.get(data.socketId);
    if (p) {
      p.fishing =
        data.state === 'idle'
          ? null
          : { state: data.state, bobberX: data.bobberX, bobberY: data.bobberY };
      if (data.state !== 'idle') {
        p.dir = 'up';
      }
    }
    if (data.socketId === mySocketId) {
      myFishingState = data.state || 'idle';
      if (myFishingState === 'strike') {
        strikeDeadline = Date.now() + (data.windowMs || 3000);
        playStrikeAlertSound();
      }
      syncFishingButtonUI();
    }
  });

  socket.on('fishing:caught', (data) => {
    if (!joined || !data) return;
    if (data.fishingState) {
      applyFishingState(data.fishingState);
    } else if (Array.isArray(data.leaderboard)) {
      fishingLeaderboard = data.leaderboard;
      if (!fishingLeaderboardModal.hidden) {
        renderFishingLeaderboard();
      }
    }
    if (data.catchItem) {
      // Automatic 6-second warm-cream chat bubble above angler's head!
      bubbles.set(data.socketId, {
        text: data.catchItem.bubble,
        isGreeting: true,
        createdAt: Date.now(),
      });
      if (data.socketId === mySocketId) {
        playCatchSuccessSound(Boolean(data.catchItem.rare));
        const tourneyNote =
          typeof data.tournamentScore === 'number'
            ? ` · Skor Lomba: ${data.tournamentScore}`
            : '';
        showToast(
          `🎣 ${data.catchItem.bubble} (Total: ${data.anglerTotalPoints} poin${tourneyNote})`
        );
      }
    }
  });

  socket.on('fishing:escaped', (data) => {
    if (!joined) return;
    myFishingState = 'idle';
    syncFishingButtonUI();
    showToast((data && data.message) || '😅 Yah, ikannya lepas! Coba lempar kail lagi.', true);
  });

  socket.on('tournament:updated', (data) => {
    if (!data) return;
    applyFishingState(data);
    if (joined && data.event === 'started') {
      playVillageChime();
      showToast(`🏆 ${data.tournament.title} sedang berlangsung! Ayo ke Dermaga Mancing!`);
    }
  });

  socket.on('tournament:ended', (data) => {
    if (!data) return;
    applyFishingState(data);
    if (joined) {
      playCatchSuccessSound(true);
      openWinnerAnnouncementModal(data);
    }
  });

  socket.on('build:removed', (data) => {
    buildings = buildings.filter((b) => b.id !== data.id);
    if (buildState.selectedType) updateBuildPreview();
    if (buildState.deleteMode) updateDeleteHover();
  });

  socket.on('cluster:updated', (data) => {
    if (!data || !data.housingCluster) return;
    applyHousingCluster(data.housingCluster);
    if (joined && data.event === 'blockAdded' && data.blockLetter) {
      showToast(`🏘️✨ ${data.actorName || 'Pak Kades'} membuka Blok ${data.blockLetter} di Komplek Hunian Warga!`);
    } else if (joined && data.event === 'kavlingCleared' && data.kavlingCode) {
      showToast(`🧹 ${data.kavlingCode} dikosongkan oleh ${data.actorName || 'Pak Kades'} dan kini Tersedia.`);
    }
  });

  socket.on('player:adminStatus', (data) => {
    if (!data) return;
    const p = players.get(data.socketId);
    if (p) p.isAdmin = Boolean(data.isAdmin);
    renderActiveCitizens();
  });

  socket.on('village:settingsUpdated', (data) => {
    if (!data || !data.settings) return;
    applyVillageSettings(data.settings);
    if (joined && data.festivalChanged) {
      if (data.settings.festivalMode) {
        playCatchSuccessSound(true);
        showToast(`🎆 ${data.changedBy || 'Pak Kades'} menyalakan MODE FESTIVAL PASAR MALAM!`);
      } else {
        showToast(`🏮 ${data.changedBy || 'Pak Kades'} mengakhiri Mode Festival Pasar Malam.`);
      }
    } else if (joined && data.ambianceChanged) {
      showToast(`${getAmbianceLabel(data.settings.ambiance)} — diubah oleh ${data.changedBy || 'Pak Kades'}`);
    } else if (joined && data.maxHousesChanged) {
      const lim = data.settings.maxHousesPerCitizen;
      showToast(
        lim === 0
          ? `🏡 ${data.changedBy || 'Pak Kades'} membuka batas rumah tanpa batas.`
          : `🏡 ${data.changedBy || 'Pak Kades'} mengatur batas maksimal ${lim} rumah per warga.`
      );
    }
  });

  // ---- Real-Time Area Pasar Malam & Hiburan Socket Listeners ----
  socket.on('nightMarket:snackOrdered', (data) => {
    if (!joined || !data) return;
    const p = players.get(data.socketId);
    if (p && data.snack) {
      p.heldSnack = data.snack;
    }
    if (data.bubble) {
      bubbles.set(data.socketId, {
        text: data.bubble,
        isGreeting: true,
        createdAt: Date.now(),
      });
    }
    if (data.socketId === mySocketId && data.snack) {
      showToast(`${data.snack.icon} Pesanan ${data.snack.name} siap dinikmati!`);
    }
  });

  socket.on('nightMarket:ferrisUpdate', (data) => {
    if (!joined || !data) return;
    const p = players.get(data.socketId);
    if (p) {
      p.ferrisRide = data.riding ? data.ride : null;
      if (data.riding) p.moving = false;
    }
    if (data.riding && data.bubble) {
      bubbles.set(data.socketId, {
        text: data.bubble,
        isGreeting: true,
        createdAt: Date.now(),
      });
    }
    if (data.socketId === mySocketId) {
      if (data.riding) {
        walkTarget = null;
        showToast('🎡 Naik Bianglala Mini! Nikmati pemandangan Pasar Malam dari atas!');
      } else {
        showToast('🎡 Selesai menaiki Bianglala Mini.');
      }
    }
  });

  socket.on('nightMarket:wheelResult', (data) => {
    if (!joined || !data) return;
    const now = Date.now();
    wheelSpinAnim.active = true;
    wheelSpinAnim.startedAt = now;
    wheelSpinAnim.durationMs = 2400;
    wheelSpinAnim.startAngle = (now * 0.00035) % (Math.PI * 2);
    wheelSpinAnim.totalSpin = Math.PI * 10 + Math.random() * Math.PI * 2;
    playWheelSpinSound();

    const p = players.get(data.socketId);
    if (p && data.funTitle) {
      p.funTitle = data.funTitle;
    }
    if (data.bubble) {
      bubbles.set(data.socketId, {
        text: data.bubble,
        isGreeting: true,
        createdAt: now,
      });
    }
    if (data.socketId === mySocketId) {
      if (typeof data.totalPoints === 'number') {
        nightMarketPoints = data.totalPoints;
        syncNightMarketPointsUI();
      }
      if (data.cooldownUntil) {
        wheelCooldownUntil = data.cooldownUntil;
      }
      if (data.prize) {
        showToast(`🎯 Roda Keberuntungan berhenti! Kamu dapat ${data.prize.label}!`);
      }
    }
  });

  socket.on('nightMarket:stageUpdate', (data) => {
    if (!joined || !data) return;
    const p = players.get(data.socketId);
    if (p) {
      p.performing = data.performing ? data.perf || true : null;
    }
    if (data.performing && data.bubble) {
      bubbles.set(data.socketId, {
        text: data.bubble,
        isGreeting: true,
        createdAt: Date.now(),
      });
    }
    syncStageAudioPlayback();
    if (data.socketId === mySocketId) {
      showToast(
        data.performing
          ? '🎸 Kamu sedang tampil main musik di Panggung Pasar Malam! 🎶'
          : '🎸 Penampilan musik di panggung selesai.'
      );
    }
  });

  socket.on('megaphone:status', (data) => {
    if (!joined || !data) return;
    if (data.talking) {
      megaphoneSpeakers.set(data.socketId, { talking: true, until: Date.now() + 15000 });
      if (data.socketId !== mySocketId) {
        showMegaphoneBanner(`🎙️ ${data.name} sedang bersiap berbicara lewat Megafon...`, 4000, null);
      }
    } else {
      const cur = megaphoneSpeakers.get(data.socketId);
      if (cur && cur.talking) {
        megaphoneSpeakers.delete(data.socketId);
      }
    }
  });

  socket.on('megaphone:play', (data) => {
    if (!joined || !data) return;
    const dur = Math.max(2400, Number(data.durationMs) || 3000);
    megaphoneSpeakers.set(data.fromSocketId, { talking: false, until: Date.now() + dur });

    if (data.chimeOnly || !data.audioBase64) {
      playVillageChime();
      showMegaphoneBanner(`🔔 ${data.fromName} membunyikan Lonceng Megafon Kampung!`, 3400, null);
      return;
    }

    const src = `data:${data.mimeType || 'audio/webm'};base64,${data.audioBase64}`;
    showMegaphoneBanner(`📢 ${data.fromName} menyapa lewat Megafon...`, dur, null);
    try {
      const audio = new Audio(src);
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Browser autoplay policy blocked before user gesture -> show 1-click play button in banner!
          showMegaphoneBanner(`📢 Pesan suara Megafon dari ${data.fromName}`, Math.max(dur, 7000), src);
        });
      }
    } catch (_playErr) {
      showMegaphoneBanner(`📢 Pesan suara Megafon dari ${data.fromName}`, Math.max(dur, 7000), src);
    }
  });

  // ==================== Main Simulation & Render Loop ====================
  let lastFrameTime = performance.now();

  function stepSimulation(dt, now) {
    const me = mySocketId ? players.get(mySocketId) : null;
    if (me && joined) {
      let vx = 0;
      let vy = 0;

      if (keys.left) vx -= 1;
      if (keys.right) vx += 1;
      if (keys.up) vy -= 1;
      if (keys.down) vy += 1;

      if (joystickVec.active && (Math.abs(joystickVec.x) > 0.12 || Math.abs(joystickVec.y) > 0.12)) {
        vx = joystickVec.x;
        vy = joystickVec.y;
      } else if (vx === 0 && vy === 0 && walkTarget) {
        const dx = walkTarget.x - me.x;
        const dy = walkTarget.y - me.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 8) {
          walkTarget = null;
        } else {
          vx = dx / dist;
          vy = dy / dist;
        }
      }

      const mag = Math.hypot(vx, vy);
      const onPaved = Boolean(
        W.isOnPavedSurface && W.isOnPavedSurface(me.x, me.y, buildings, housingCluster.blockCount)
      );
      me.onPavedRoad = onPaved;
      // Walking on sidewalks, neighborhood roads, or citizen-built paving blocks is smoother & faster (+27%)!
      const speed = onPaved ? 248 : 195;
      let moved = false;

      if (mag > 0.05) {
        // Pressing movement keys while riding Bianglala cleanly exits the ride
        if (me.ferrisRide) {
          socket.emit('nightMarket:rideFerris', { action: 'exit' });
          me.ferrisRide = null;
        }
        // Return camera to local player automatically when user uses keyboard/joystick
        if ((keys.up || keys.down || keys.left || keys.right || joystickVec.active) && (focusSocketId || cameraVisitTarget)) {
          cameraVisitTarget = null;
          focusOnPlayer(mySocketId);
        } else if (focusSocketId) {
          focusOnPlayer(mySocketId);
        }
        // Walking away cleanly cancels an active cast
        if (myFishingState !== 'idle') {
          socket.emit('fishing:cancel');
          myFishingState = 'idle';
          syncFishingButtonUI();
        }
        const nx = (vx / Math.max(1, mag)) * speed * dt;
        const ny = (vy / Math.max(1, mag)) * speed * dt;

        // Smooth axis-separated collision so character glides around pond shoreline
        const tryX = me.x + nx;
        const tryY = me.y + ny;

        if (W.isWalkable(tryX, tryY)) {
          me.x = tryX;
          me.y = tryY;
          moved = true;
        } else if (W.isWalkable(tryX, me.y)) {
          me.x = tryX;
          moved = true;
        } else if (W.isWalkable(me.x, tryY)) {
          me.y = tryY;
          moved = true;
        } else {
          walkTarget = null;
        }

        if (Math.abs(vx) > Math.abs(vy)) {
          me.dir = vx < 0 ? 'left' : 'right';
        } else {
          me.dir = vy < 0 ? 'up' : 'down';
        }
      }

      me.moving = moved;

      // Subtle pavement speed feedback in status bar when not building
      if (!buildState.selectedType && !buildState.deleteMode && buildStatusText) {
        const nextText = onPaved
          ? '🛣️ Di atas jalan paving/trotoar · Langkah lebih lancar & cepat (+27%)'
          : 'WASD / Panah / Tap untuk jalan · Klik Mading untuk menulis';
        if (buildStatusText.textContent !== nextText) {
          buildStatusText.textContent = nextText;
        }
      }

      // Throttle movement packets to server (~20fps + stop event)
      const posChanged = Math.hypot(me.x - lastSentPos.x, me.y - lastSentPos.y) > 1.2;
      const stateChanged = me.moving !== lastSentPos.moving;
      if ((posChanged && now - lastEmitTime >= 48) || stateChanged) {
        socket.emit('player:move', {
          x: me.x,
          y: me.y,
          dir: me.dir,
          moving: me.moving,
        });
        lastEmitTime = now;
        lastSentPos = { x: me.x, y: me.y, moving: me.moving };
      }

      // Smoothly transition camera angle, zoom, perspective tilt & follow anchor (smooth lerp!)
      const camPreset = getCameraTargetPreset();
      const angleLerp = Math.min(1, dt * 6.5);
      camera.zoom += (camPreset.zoom - camera.zoom) * angleLerp;
      camera.tiltY += (camPreset.tiltY - camera.tiltY) * angleLerp;
      camera.skewX += (camPreset.skewX - camera.skewX) * angleLerp;
      camera.elevation += (camPreset.elevation - camera.elevation) * angleLerp;

      const camAnchor =
        cameraVisitTarget || (focusSocketId && players.get(focusSocketId)) || me;
      let desiredX = camAnchor.x;
      let desiredY = camAnchor.y;
      if (cameraMode === 'drone' && !focusSocketId && !cameraVisitTarget && userZoomMult <= 1.05) {
        // Panorama Drone showcases the whole eco-village centered cleanly in frame
        desiredX = W.WORLD_WIDTH / 2;
        desiredY = W.WORLD_HEIGHT / 2;
      }
      const targetCenter = clampCameraCenter(
        desiredX,
        desiredY,
        camera.zoom,
        camera.tiltY,
        camera.elevation
      );
      const posLerp = Math.min(1, dt * 7.5);
      camera.cx += (targetCenter.cx - camera.cx) * posLerp;
      camera.cy += (targetCenter.cy - camera.cy) * posLerp;
      syncCameraLegacyXY();

      // Show/hide Fishing Action Bar automatically when near Dermaga Kayu Mancing
      const nearPier =
        W.isNearFishingPier(me.x, me.y) && !buildState.selectedType && !buildState.deleteMode;
      if (fishingActionBar) {
        fishingActionBar.hidden = !(nearPier || myFishingState !== 'idle');
      }
      if (myFishingState === 'strike' && fishStrikeBar) {
        const pct = Math.max(0, Math.min(100, ((strikeDeadline - now) / 3000) * 100));
        fishStrikeBar.style.width = `${pct.toFixed(1)}%`;
      }

      // Update Area Pasar Malam & Hiburan contextual action bar & wheel spin animation
      syncNightMarketActionBar(me, now);
      if (wheelSpinAnim.active && now - wheelSpinAnim.startedAt > wheelSpinAnim.durationMs + 100) {
        wheelSpinAnim.active = false;
      }
    } else {
      // Gentle scenic camera drift over Alun-alun while Welcome Card is open
      const scenicX = W.PLAZA.x + Math.sin(now * 0.00025) * 90;
      const scenicY = W.PLAZA.y + Math.cos(now * 0.0002) * 45;
      const targetCenter = clampCameraCenter(scenicX, scenicY, 1.0, 1.0, 0);
      camera.cx = targetCenter.cx;
      camera.cy = targetCenter.cy;
      camera.zoom = 1.0;
      camera.tiltY = 1.0;
      camera.skewX = 0;
      camera.elevation = 0;
      syncCameraLegacyXY();
    }

    // Smoothly interpolate remote players
    players.forEach((p, sid) => {
      if (sid === mySocketId) return;
      const k = Math.min(1, dt * 11);
      p.x += (p.targetX - p.x) * k;
      p.y += (p.targetY - p.y) * k;
    });

    // Expire old bubbles, private whispers, and greet effects cleanly
    bubbles.forEach((b, sid) => {
      if (now - b.createdAt > 6100) bubbles.delete(sid);
    });
    whispers.forEach((w, sid) => {
      if (now - w.createdAt > 6100) whispers.delete(sid);
    });
    greetEffects.forEach((g, sid) => {
      if (now - g.createdAt > 3900) greetEffects.delete(sid);
    });
    megaphoneSpeakers.forEach((m, sid) => {
      if (!m.talking && now > m.until) megaphoneSpeakers.delete(sid);
    });
  }

  function tick(perfNow) {
    const dt = Math.min(0.05, (perfNow - lastFrameTime) / 1000);
    lastFrameTime = perfNow;
    const time = perfNow / 1000;
    const now = Date.now();

    stepSimulation(dt, now);

    const playerList = Array.from(players.values());
    const renderState = {
      viewportW,
      viewportH,
      camera,
      time,
      now,
      ambiance,
      players: playerList,
      mySocketId,
      focusSocketId,
      selectedPlayerId,
      offscreenHits,
      buildings,
      madingCount: madingNotes.length,
      hoveredMading,
      hoveredFishingBoard,
      hoveredClusterDirectory,
      hoveredPlayerId,
      hoveredInteractiveBuilding,
      hoveredNightMarket,
      housingCluster,
      festivalMode: Boolean(villageSettings.festivalMode),
      wheelSpinAnim,
      buildState,
      walkTarget,
      bubbles,
      whispers,
      greetEffects,
      megaphoneSpeakers,
    };

    R.renderWorld(ctx, renderState);
    positionPlayerCard();

    if (joined && minimapCtx && minimapCanvas) {
      R.renderMinimap(minimapCtx, minimapCanvas.width, minimapCanvas.height, renderState);
    }

    if (!joined) {
      R.renderAvatarPreview(
        avatarPreviewCtx,
        avatarPreviewCanvas.width,
        avatarPreviewCanvas.height,
        selectedAvatar,
        time
      );
    }

    requestAnimationFrame(tick);
  }

  // ==================== Initialize ====================
  loadSavedProfile();
  buildWelcomePickers();
  buildMadingColorPicker();
  populateBusinessCategories();
  buildCatalogUI();
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Fetch initial village stats for welcome card
  fetch('/api/stats')
    .then((r) => r.json())
    .then(updateStatsUI)
    .catch(() => {});

  // Detect touch device for joystick helper
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    mobileJoystick.classList.add('visible');
  }

  requestAnimationFrame(tick);
})();
