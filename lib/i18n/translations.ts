export type Language = 'en' | 'zh' | 'es' | 'fr' | 'ja' | 'ko';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const languageOptions: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

export interface Translations {
  // Onboarding Screen
  onboarding: {
    title: string;
    subtitle: string;
    scanMenuButton: string;
    demoButton: string;
    languageSelector: string;
  };

  // Camera Scanner
  camera: {
    title: string;
    subtitle: string;
    takePhotoButton: string;
    selectPhotoButton: string;
    processingText: string;
    retryButton: string;
    tips: {
      0: string;
      1: string;
      2: string;
      3: string;
    };
  };

  // Restaurant Selection
  restaurant: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    noResults: string;
    noData: string;
    manualInputButton: string;
    manualInputTitle: string;
    manualInputPlaceholder: string;
    confirmButton: string;
    cancelButton: string;
    selectRestaurant: string;
  };

  // Menu Display
  menu: {
    title: string;
    categories: {
      all: string;
      recommended: string;
      popular: string;
      new: string;
    };
    searchPlaceholder: string;
    noDishes: string;
    searchTitle: string;
    searchDescription: string;
    searchTips: string;
    searchTip1: string;
    searchTip2: string;
    searchTip3: string;
  };

  // Dish Details
  dish: {
    detailTitle: string;
    imageTitle: string;
    imageDescription: string;
    vegetarian: string;
    detailedDescription: string;
    spiceLevel: string;
    allergyInfo: string;
    vegetarianInfo: string;
    favorited: string;
    favorite: string;
    share: string;
    close: string;
  };

  // Common
  common: {
    loading: string;
    error: string;
    retry: string;
    back: string;
    next: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    search: string;
    filter: string;
    sort: string;
    view: string;
    add: string;
    remove: string;
    tips: string;
    match: string;
    menu: string;
    close: string;
  };

  // Error Messages
  errors: {
    networkError: string;
    uploadError: string;
    processingError: string;
    generalError: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    onboarding: {
      title: 'Welcome to SnapFood',
      subtitle: 'Scan your menu and discover amazing dishes',
      scanMenuButton: 'Scan Menu',
      demoButton: 'Try Demo',
      languageSelector: 'Select Language',
    },
    camera: {
      title: 'Scan Menu',
      subtitle: 'Take a photo of your menu or select from gallery',
      takePhotoButton: 'Take Photo',
      selectPhotoButton: 'Select from Gallery',
      processingText: 'Processing your menu...',
      retryButton: 'Retry',
      tips: {
        0: 'Ensure good lighting',
        1: 'Keep the menu flat',
        2: 'Include all text clearly',
        3: 'Avoid shadows and glare',
      },
    },
    restaurant: {
      title: 'Select Restaurant',
      subtitle: 'Choose the restaurant from the list below',
      searchPlaceholder: 'Search restaurants...',
      noResults: 'No matching restaurants found',
      noData: 'No restaurant data available',
      manualInputButton: 'Enter Restaurant Name Manually',
      manualInputTitle: 'Enter Restaurant Name',
      manualInputPlaceholder: 'Type restaurant name...',
      confirmButton: 'Confirm',
      cancelButton: 'Cancel',
      selectRestaurant: 'Select Restaurant',
    },
    menu: {
      title: 'Menu',
      categories: {
        all: 'All',
        recommended: 'Recommended',
        popular: 'Popular',
        new: 'New',
      },
      searchPlaceholder: 'Search dishes...',
      noDishes: 'No dishes found',
      searchTitle: 'Search Your Favorite Dishes',
      searchDescription:
        'Enter dish name, description or category to find the food you want',
      searchTips: 'Search Tips',
      searchTip1: 'Enter dish name, such as "Kung Pao Chicken"',
      searchTip2: 'Search by category, such as "Main Course", "Soup"',
      searchTip3: 'Search by features, such as "Vegetarian", "Spicy"',
    },
    dish: {
      detailTitle: 'Dish Details',
      imageTitle: 'Dish Image',
      imageDescription:
        'Backend team is developing real dish image API, currently showing placeholder image',
      vegetarian: 'Vegetarian',
      detailedDescription: 'Detailed Description',
      spiceLevel: 'Spice Level',
      allergyInfo: 'Allergy Information',
      vegetarianInfo: 'Vegetarian Information',
      favorited: 'Favorited',
      favorite: 'Favorite',
      share: 'Share',
      close: 'Close',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      back: 'Back',
      next: 'Next',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      view: 'View',
      add: 'Add',
      remove: 'Remove',
      tips: 'Tips',
      match: 'Match',
      menu: 'Menu',
      close: 'Close',
    },
    errors: {
      networkError: 'Network error. Please check your connection.',
      uploadError: 'Failed to upload image. Please try again.',
      processingError: 'Failed to process menu. Please try again.',
      generalError: 'Something went wrong. Please try again.',
    },
  },
  zh: {
    onboarding: {
      title: '欢迎使用 SnapFood',
      subtitle: '扫描菜单，发现美味佳肴',
      scanMenuButton: '扫描菜单',
      demoButton: '试用演示',
      languageSelector: '选择语言',
    },
    camera: {
      title: '扫描菜单',
      subtitle: '拍摄菜单照片或从相册选择',
      takePhotoButton: '拍照',
      selectPhotoButton: '从相册选择',
      processingText: '正在处理您的菜单...',
      retryButton: '重试',
      tips: {
        0: '确保光线充足',
        1: '保持菜单平整',
        2: '清晰包含所有文字',
        3: '避免阴影和反光',
      },
    },
    restaurant: {
      title: '选择餐厅',
      subtitle: '从以下列表中选择餐厅',
      searchPlaceholder: '搜索餐厅...',
      noResults: '未找到匹配的餐厅',
      noData: '暂无餐厅数据',
      manualInputButton: '手动输入餐厅名称',
      manualInputTitle: '输入餐厅名称',
      manualInputPlaceholder: '输入餐厅名称...',
      confirmButton: '确认',
      cancelButton: '取消',
      selectRestaurant: '选择餐厅',
    },
    menu: {
      title: '菜单',
      categories: {
        all: '全部',
        recommended: '推荐',
        popular: '热门',
        new: '新菜',
      },
      searchPlaceholder: '搜索菜品...',
      noDishes: '未找到相关菜品',
      searchTitle: '搜索您喜欢的菜品',
      searchDescription: '输入菜品名称、描述或分类来查找您想要的美食',
      searchTips: '搜索技巧',
      searchTip1: '输入菜品名称，如"宫保鸡丁"',
      searchTip2: '搜索分类，如"主菜"、"汤类"',
      searchTip3: '搜索特色，如"素食"、"辣"',
    },
    dish: {
      detailTitle: '菜品详情',
      imageTitle: '菜品图片',
      imageDescription: '后端同学正在开发真实的菜品图片API，当前显示占位图片',
      vegetarian: '素食',
      detailedDescription: '详细描述',
      spiceLevel: '辣度等级',
      allergyInfo: '过敏信息',
      vegetarianInfo: '素食信息',
      favorited: '已收藏',
      favorite: '收藏',
      share: '分享',
      close: '关闭',
    },
    common: {
      loading: '加载中...',
      error: '错误',
      retry: '重试',
      back: '返回',
      next: '下一步',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      search: '搜索',
      filter: '筛选',
      sort: '排序',
      view: '查看',
      add: '添加',
      remove: '移除',
      tips: '提示',
      match: '匹配',
      menu: '菜单',
      close: '关闭',
    },
    errors: {
      networkError: '网络错误，请检查网络连接。',
      uploadError: '图片上传失败，请重试。',
      processingError: '菜单处理失败，请重试。',
      generalError: '出现错误，请重试。',
    },
  },
  es: {
    onboarding: {
      title: 'Bienvenido a SnapFood',
      subtitle: 'Escanea tu menú y descubre platos increíbles',
      scanMenuButton: 'Escanear Menú',
      demoButton: 'Probar Demo',
      languageSelector: 'Seleccionar Idioma',
    },
    camera: {
      title: 'Escanear Menú',
      subtitle: 'Toma una foto de tu menú o selecciona de la galería',
      takePhotoButton: 'Tomar Foto',
      selectPhotoButton: 'Seleccionar de Galería',
      processingText: 'Procesando tu menú...',
      retryButton: 'Reintentar',
      tips: {
        0: 'Asegura buena iluminación',
        1: 'Mantén el menú plano',
        2: 'Incluye todo el texto claramente',
        3: 'Evita sombras y reflejos',
      },
    },
    restaurant: {
      title: 'Seleccionar Restaurante',
      subtitle: 'Elige el restaurante de la lista',
      searchPlaceholder: 'Buscar restaurantes...',
      noResults: 'No se encontraron restaurantes',
      noData: 'No hay datos de restaurantes',
      manualInputButton: 'Ingresar Nombre Manualmente',
      manualInputTitle: 'Ingresar Nombre del Restaurante',
      manualInputPlaceholder: 'Escribe el nombre del restaurante...',
      confirmButton: 'Confirmar',
      cancelButton: 'Cancelar',
      selectRestaurant: 'Seleccionar Restaurante',
    },
    menu: {
      title: 'Menú',
      categories: {
        all: 'Todos',
        recommended: 'Recomendado',
        popular: 'Popular',
        new: 'Nuevo',
      },
      searchPlaceholder: 'Buscar platos...',
      noDishes: 'No se encontraron platos',
      searchTitle: 'Buscar',
      searchDescription: 'Encuentra tu plato favorito',
      searchTips: 'Sugerencias para buscar',
      searchTip1: 'Usa palabras clave',
      searchTip2: 'Revisa la ortografía',
      searchTip3: 'Intenta diferentes categorías',
    },
    dish: {
      detailTitle: 'Detalles del Plato',
      imageTitle: 'Imagen del Plato',
      imageDescription:
        'El equipo de backend está desarrollando la API de imágenes de platos reales, actualmente mostrando imagen de marcador de posición',
      vegetarian: 'Vegetariano',
      detailedDescription: 'Descripción Detallada',
      spiceLevel: 'Nivel de Picante',
      allergyInfo: 'Información de Alergias',
      vegetarianInfo: 'Información Vegetariana',
      favorited: 'Favorito',
      favorite: 'Favorito',
      share: 'Compartir',
      close: 'Cerrar',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      retry: 'Reintentar',
      back: 'Atrás',
      next: 'Siguiente',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      view: 'Ver',
      add: 'Agregar',
      remove: 'Remover',
      tips: 'Consejos',
      match: 'Coincidir',
      menu: 'Menú',
      close: 'Cerrar',
    },
    errors: {
      networkError: 'Error de red. Verifica tu conexión.',
      uploadError: 'Error al subir imagen. Intenta de nuevo.',
      processingError: 'Error al procesar menú. Intenta de nuevo.',
      generalError: 'Algo salió mal. Intenta de nuevo.',
    },
  },
  fr: {
    onboarding: {
      title: 'Bienvenue sur SnapFood',
      subtitle: 'Scannez votre menu et découvrez des plats incroyables',
      scanMenuButton: 'Scanner le Menu',
      demoButton: 'Essayer la Démo',
      languageSelector: 'Sélectionner la Langue',
    },
    camera: {
      title: 'Scanner le Menu',
      subtitle:
        'Prenez une photo de votre menu ou sélectionnez depuis la galerie',
      takePhotoButton: 'Prendre une Photo',
      selectPhotoButton: 'Sélectionner depuis la Galerie',
      processingText: 'Traitement de votre menu...',
      retryButton: 'Réessayer',
      tips: {
        0: 'Assurez un bon éclairage',
        1: 'Gardez le menu à plat',
        2: 'Incluez tout le texte clairement',
        3: 'Évitez les ombres et reflets',
      },
    },
    restaurant: {
      title: 'Sélectionner le Restaurant',
      subtitle: 'Choisissez le restaurant dans la liste',
      searchPlaceholder: 'Rechercher des restaurants...',
      noResults: 'Aucun restaurant trouvé',
      noData: 'Aucune donnée de restaurant',
      manualInputButton: 'Saisir le Nom Manuellement',
      manualInputTitle: 'Saisir le Nom du Restaurant',
      manualInputPlaceholder: 'Tapez le nom du restaurant...',
      confirmButton: 'Confirmer',
      cancelButton: 'Annuler',
      selectRestaurant: 'Sélectionner le Restaurant',
    },
    menu: {
      title: 'Menu',
      categories: {
        all: 'Tous',
        recommended: 'Recommandé',
        popular: 'Populaire',
        new: 'Nouveau',
      },
      searchPlaceholder: 'Rechercher des plats...',
      noDishes: 'Aucun plat trouvé',
      searchTitle: 'Rechercher',
      searchDescription: 'Trouvez votre plat préféré',
      searchTips: 'Conseils pour rechercher',
      searchTip1: 'Utilisez des mots-clés',
      searchTip2: "Vérifiez l'orthographe",
      searchTip3: 'Essayez différentes catégories',
    },
    dish: {
      detailTitle: 'Détails du Plat',
      imageTitle: 'Image du Plat',
      imageDescription:
        "L'équipe backend développe l'API d'images de plats réels, affichant actuellement une image d'espace réservé",
      vegetarian: 'Végétarien',
      detailedDescription: 'Description Détaillée',
      spiceLevel: "Niveau d'Épice",
      allergyInfo: 'Informations Allergies',
      vegetarianInfo: 'Informations Végétariennes',
      favorited: 'Favori',
      favorite: 'Favori',
      share: 'Partager',
      close: 'Fermer',
    },
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      retry: 'Réessayer',
      back: 'Retour',
      next: 'Suivant',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      view: 'Voir',
      add: 'Ajouter',
      remove: 'Supprimer',
      tips: 'Conseils',
      match: 'Coincider',
      menu: 'Menu',
      close: 'Fermer',
    },
    errors: {
      networkError: 'Erreur réseau. Vérifiez votre connexion.',
      uploadError: "Échec du téléchargement d'image. Réessayez.",
      processingError: 'Échec du traitement du menu. Réessayez.',
      generalError: "Quelque chose s'est mal passé. Réessayez.",
    },
  },
  ja: {
    onboarding: {
      title: 'SnapFoodへようこそ',
      subtitle: 'メニューをスキャンして素晴らしい料理を発見',
      scanMenuButton: 'メニューをスキャン',
      demoButton: 'デモを試す',
      languageSelector: '言語を選択',
    },
    camera: {
      title: 'メニューをスキャン',
      subtitle: 'メニューの写真を撮るか、ギャラリーから選択',
      takePhotoButton: '写真を撮る',
      selectPhotoButton: 'ギャラリーから選択',
      processingText: 'メニューを処理中...',
      retryButton: '再試行',
      tips: {
        0: '十分な照明を確保',
        1: 'メニューを平らに保つ',
        2: 'すべてのテキストを明確に含める',
        3: '影や反射を避ける',
      },
    },
    restaurant: {
      title: 'レストランを選択',
      subtitle: '以下のリストからレストランを選択',
      searchPlaceholder: 'レストランを検索...',
      noResults: '一致するレストランが見つかりません',
      noData: 'レストランデータがありません',
      manualInputButton: 'レストラン名を手動入力',
      manualInputTitle: 'レストラン名を入力',
      manualInputPlaceholder: 'レストラン名を入力...',
      confirmButton: '確認',
      cancelButton: 'キャンセル',
      selectRestaurant: 'レストランを選択',
    },
    menu: {
      title: 'メニュー',
      categories: {
        all: 'すべて',
        recommended: 'おすすめ',
        popular: '人気',
        new: '新しい',
      },
      searchPlaceholder: '料理を検索...',
      noDishes: '料理が見つかりません',
      searchTitle: '検索',
      searchDescription: 'お気に入りの料理を見つける',
      searchTips: '検索のヒント',
      searchTip1: 'キーワードを使用',
      searchTip2: 'スペルを確認',
      searchTip3: '異なるカテゴリを試す',
    },
    dish: {
      detailTitle: '料理の詳細',
      imageTitle: '料理の画像',
      imageDescription:
        'バックエンドチームが実際の料理画像APIを開発中です。現在はプレースホルダー画像を表示しています',
      vegetarian: 'ベジタリアン',
      detailedDescription: '詳細な説明',
      spiceLevel: '辛さのレベル',
      allergyInfo: 'アレルギー情報',
      vegetarianInfo: 'ベジタリアン情報',
      favorited: 'お気に入り済み',
      favorite: 'お気に入り',
      share: '共有',
      close: '閉じる',
    },
    common: {
      loading: '読み込み中...',
      error: 'エラー',
      retry: '再試行',
      back: '戻る',
      next: '次へ',
      cancel: 'キャンセル',
      confirm: '確認',
      save: '保存',
      delete: '削除',
      edit: '編集',
      search: '検索',
      filter: 'フィルター',
      sort: '並び替え',
      view: '表示',
      add: '追加',
      remove: '削除',
      tips: 'ヒント',
      match: '一致',
      menu: 'メニュー',
      close: '閉じる',
    },
    errors: {
      networkError: 'ネットワークエラー。接続を確認してください。',
      uploadError: '画像のアップロードに失敗しました。再試行してください。',
      processingError: 'メニューの処理に失敗しました。再試行してください。',
      generalError: 'エラーが発生しました。再試行してください。',
    },
  },
  ko: {
    onboarding: {
      title: 'SnapFood에 오신 것을 환영합니다',
      subtitle: '메뉴를 스캔하고 놀라운 요리를 발견하세요',
      scanMenuButton: '메뉴 스캔',
      demoButton: '데모 시도',
      languageSelector: '언어 선택',
    },
    camera: {
      title: '메뉴 스캔',
      subtitle: '메뉴 사진을 찍거나 갤러리에서 선택',
      takePhotoButton: '사진 촬영',
      selectPhotoButton: '갤러리에서 선택',
      processingText: '메뉴를 처리 중...',
      retryButton: '다시 시도',
      tips: {
        0: '충분한 조명 확보',
        1: '메뉴를 평평하게 유지',
        2: '모든 텍스트를 명확하게 포함',
        3: '그림자와 반사를 피하세요',
      },
    },
    restaurant: {
      title: '레스토랑 선택',
      subtitle: '아래 목록에서 레스토랑을 선택하세요',
      searchPlaceholder: '레스토랑 검색...',
      noResults: '일치하는 레스토랑을 찾을 수 없습니다',
      noData: '레스토랑 데이터가 없습니다',
      manualInputButton: '레스토랑 이름 수동 입력',
      manualInputTitle: '레스토랑 이름 입력',
      manualInputPlaceholder: '레스토랑 이름을 입력하세요...',
      confirmButton: '확인',
      cancelButton: '취소',
      selectRestaurant: '레스토랑 선택',
    },
    menu: {
      title: '메뉴',
      categories: {
        all: '모든',
        recommended: '추천',
        popular: '인기',
        new: '새로운',
      },
      searchPlaceholder: '요리 검색...',
      noDishes: '요리를 찾을 수 없습니다',
      searchTitle: '검색',
      searchDescription: '좋아하는 요리를 찾으세요',
      searchTips: '검색 팁',
      searchTip1: '키워드 사용',
      searchTip2: '맞춤법 확인',
      searchTip3: '다른 카테고리 시도',
    },
    dish: {
      detailTitle: '요리 세부 정보',
      imageTitle: '요리 이미지',
      imageDescription:
        '백엔드 팀이 실제 요리 이미지 API를 개발 중입니다. 현재는 플레이스홀더 이미지를 표시하고 있습니다',
      vegetarian: '채식',
      detailedDescription: '세부 설명',
      spiceLevel: '매운 정도',
      allergyInfo: '알레르기 정보',
      vegetarianInfo: '채식 정보',
      favorited: '즐겨찾기됨',
      favorite: '즐겨찾기',
      share: '공유',
      close: '닫기',
    },
    common: {
      loading: '로딩 중...',
      error: '오류',
      retry: '다시 시도',
      back: '뒤로',
      next: '다음',
      cancel: '취소',
      confirm: '확인',
      save: '저장',
      delete: '삭제',
      edit: '편집',
      search: '검색',
      filter: '필터',
      sort: '정렬',
      view: '보기',
      add: '추가',
      remove: '제거',
      tips: '팁',
      match: '일치',
      menu: '메뉴',
      close: '닫기',
    },
    errors: {
      networkError: '네트워크 오류. 연결을 확인하세요.',
      uploadError: '이미지 업로드 실패. 다시 시도하세요.',
      processingError: '메뉴 처리 실패. 다시 시도하세요.',
      generalError: '문제가 발생했습니다. 다시 시도하세요.',
    },
  },
};

export default translations;
