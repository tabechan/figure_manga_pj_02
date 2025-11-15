import { prisma } from './db.js';
import { hashPassword } from './auth.js';

async function main() {
  console.log('🌱 Starting seed...');

  const demoPassword = await hashPassword('password123');
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      passwordHash: demoPassword,
    },
  });
  console.log('✓ Created demo user:', user.email);

  const series1 = await prisma.series.upsert({
    where: { id: 'series-1' },
    update: {},
    create: {
      id: 'series-1',
      title: '魔法学園アドベンチャー',
      description: '魔法の力を持つ少年少女たちが学ぶ学園を舞台にした青春ファンタジー',
      author: '山田太郎',
      genre: 'ファンタジー',
      coverUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=800',
    },
  });
  console.log('✓ Created series:', series1.title);

  const series2 = await prisma.series.upsert({
    where: { id: 'series-2' },
    update: {},
    create: {
      id: 'series-2',
      title: '時代劇サムライ',
      description: '江戸時代を舞台に、若き侍が剣の道を極めていく成長物語',
      author: '佐藤一郎',
      genre: '時代劇',
      coverUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800',
    },
  });
  console.log('✓ Created series:', series2.title);

  const volumes1 = [
    {
      id: 'vol-1-1',
      volumeNo: 1,
      title: '第1巻：魔法学園への入学',
      coverUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400',
      fileUrl: 'https://example.com/manga/vol1.pdf',
      price: 500,
      pageCount: 200,
      releaseDate: new Date('2023-01-15'),
    },
    {
      id: 'vol-1-2',
      volumeNo: 2,
      title: '第2巻：初めての試練',
      coverUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
      fileUrl: 'https://example.com/manga/vol2.pdf',
      price: 500,
      pageCount: 198,
      releaseDate: new Date('2023-04-20'),
    },
    {
      id: 'vol-1-3',
      volumeNo: 3,
      title: '第3巻：禁断の魔法',
      coverUrl: 'https://images.unsplash.com/photo-1607428272602-5faa630f431c?w=400',
      fileUrl: 'https://example.com/manga/vol3.pdf',
      price: 500,
      pageCount: 205,
      releaseDate: new Date('2023-07-10'),
    },
    {
      id: 'vol-1-4',
      volumeNo: 4,
      title: '第4巻：闇の魔王',
      coverUrl: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400',
      fileUrl: 'https://example.com/manga/vol4.pdf',
      price: 500,
      pageCount: 210,
      releaseDate: new Date('2023-10-05'),
    },
    {
      id: 'vol-1-5',
      volumeNo: 5,
      title: '第5巻：最終決戦',
      coverUrl: 'https://images.unsplash.com/photo-1634655377961-1c73f0e5e5e0?w=400',
      fileUrl: 'https://example.com/manga/vol5.pdf',
      price: 500,
      pageCount: 215,
      releaseDate: new Date('2024-01-20'),
    },
    {
      id: 'vol-1-6',
      volumeNo: 6,
      title: '第6巻：新たな冒険',
      coverUrl: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400',
      fileUrl: 'https://example.com/manga/vol6.pdf',
      price: 500,
      pageCount: 220,
      releaseDate: new Date('2024-04-15'),
    },
    {
      id: 'vol-1-7',
      volumeNo: 7,
      title: '第7巻：光と影の対決',
      coverUrl: 'https://images.unsplash.com/photo-1634655377961-1c73f0e5e5e0?w=400',
      fileUrl: 'https://example.com/manga/vol7.pdf',
      price: 500,
      pageCount: 225,
      releaseDate: new Date('2024-07-20'),
    },
  ];

  for (const vol of volumes1) {
    await prisma.volume.upsert({
      where: { id: vol.id },
      update: {},
      create: {
        ...vol,
        seriesId: series1.id,
      },
    });
  }
  console.log(`✓ Created ${volumes1.length} volumes for ${series1.title}`);

  const volumes2 = [
    {
      id: 'vol-2-1',
      volumeNo: 1,
      title: '第1巻：剣士への道',
      coverUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400',
      fileUrl: 'https://example.com/manga/samurai-vol1.pdf',
      price: 550,
      pageCount: 180,
      releaseDate: new Date('2023-02-10'),
    },
    {
      id: 'vol-2-2',
      volumeNo: 2,
      title: '第2巻：宿敵との出会い',
      coverUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
      fileUrl: 'https://example.com/manga/samurai-vol2.pdf',
      price: 550,
      pageCount: 190,
      releaseDate: new Date('2023-05-15'),
    },
    {
      id: 'vol-2-3',
      volumeNo: 3,
      title: '第3巻：試練の旅',
      coverUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      fileUrl: 'https://example.com/manga/samurai-vol3.pdf',
      price: 550,
      pageCount: 195,
      releaseDate: new Date('2023-08-20'),
    },
    {
      id: 'vol-2-4',
      volumeNo: 4,
      title: '第4巻：師匠との再会',
      coverUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
      fileUrl: 'https://example.com/manga/samurai-vol4.pdf',
      price: 550,
      pageCount: 200,
      releaseDate: new Date('2023-11-10'),
    },
    {
      id: 'vol-2-5',
      volumeNo: 5,
      title: '第5巻：最強の剣',
      coverUrl: 'https://images.unsplash.com/photo-1607428272602-5faa630f431c?w=400',
      fileUrl: 'https://example.com/manga/samurai-vol5.pdf',
      price: 550,
      pageCount: 205,
      releaseDate: new Date('2024-02-15'),
    },
  ];

  for (const vol of volumes2) {
    await prisma.volume.upsert({
      where: { id: vol.id },
      update: {},
      create: {
        ...vol,
        seriesId: series2.id,
      },
    });
  }
  console.log(`✓ Created ${volumes2.length} volumes for ${series2.title}`);

  const figure1 = await prisma.figure.upsert({
    where: { tagUid: 'DEMO-TAG-001' },
    update: {},
    create: {
      id: 'fig-1',
      seriesId: series1.id,
      title: '花子 ちびフィギュア',
      tagUid: 'DEMO-TAG-001',
      imageUrl: '/assets/chibi-figure.png',
      description: 'サブキャラクター花子のかわいいちびフィギュア。付属：第1-3巻閲覧権',
      price: 2980,
      status: 'claimed',
      ownerUserId: user.id,
    },
  });
  console.log('✓ Created figure:', figure1.title);

  const figure2 = await prisma.figure.upsert({
    where: { tagUid: 'DEMO-TAG-002' },
    update: {},
    create: {
      id: 'fig-2',
      seriesId: series1.id,
      title: 'レナ＆ユウキ デラックスフィギュア',
      tagUid: 'DEMO-TAG-002',
      imageUrl: '/assets/magical-girl-figure.png',
      description: '主人公2人の躍動感あふれるポーズのフィギュア。付属：第4-5巻閲覧権',
      price: 4980,
      status: 'claimed',
      ownerUserId: user.id,
    },
  });
  console.log('✓ Created figure:', figure2.title);

  const figure3 = await prisma.figure.upsert({
    where: { tagUid: 'DEMO-TAG-003' },
    update: {},
    create: {
      id: 'fig-3',
      seriesId: series2.id,
      title: 'さくら 和服フィギュア',
      tagUid: 'DEMO-TAG-003',
      imageUrl: '/assets/kimono-girl-figure.png',
      description: 'ヒロインさくらの華やかな和服姿のフィギュア。付属：第1-2巻閲覧権',
      price: 5980,
      status: 'claimed',
      ownerUserId: user.id,
    },
  });
  console.log('✓ Created figure:', figure3.title);

  const figure4 = await prisma.figure.upsert({
    where: { tagUid: 'DEMO-TAG-004' },
    update: {},
    create: {
      id: 'fig-4',
      seriesId: series2.id,
      title: '竜馬 戦闘ポーズフィギュア',
      tagUid: 'DEMO-TAG-004',
      imageUrl: '/assets/samurai-boy-figure.png',
      description: '主人公竜馬の迫力ある戦闘ポーズのフィギュア。付属：第3-5巻閲覧権',
      price: 6980,
      status: 'unclaimed',
    },
  });
  console.log('✓ Created figure:', figure4.title);

  for (let i = 1; i <= 3; i++) {
    await prisma.volumeRange.upsert({
      where: { id: `range-fig1-vol${i}` },
      update: {},
      create: {
        id: `range-fig1-vol${i}`,
        figureId: figure1.id,
        volumeId: `vol-1-${i}`,
      },
    });
  }
  console.log('✓ Created volume ranges for figure 1 (vol 1-3)');

  for (let i = 4; i <= 5; i++) {
    await prisma.volumeRange.upsert({
      where: { id: `range-fig2-vol${i}` },
      update: {},
      create: {
        id: `range-fig2-vol${i}`,
        figureId: figure2.id,
        volumeId: `vol-1-${i}`,
      },
    });
  }
  console.log('✓ Created volume ranges for figure 2 (vol 4-5)');

  for (let i = 1; i <= 3; i++) {
    await prisma.volumeOwnership.upsert({
      where: { id: `ownership-demo-fig1-vol${i}` },
      update: {},
      create: {
        id: `ownership-demo-fig1-vol${i}`,
        userId: user.id,
        volumeId: `vol-1-${i}`,
        figureId: figure1.id,
        purchaseType: 'figure_bundle',
      },
    });
  }
  console.log('✓ Created volume ownerships for figure 1 (vol 1-3)');

  for (let i = 4; i <= 5; i++) {
    await prisma.volumeOwnership.upsert({
      where: { id: `ownership-demo-fig2-vol${i}` },
      update: {},
      create: {
        id: `ownership-demo-fig2-vol${i}`,
        userId: user.id,
        volumeId: `vol-1-${i}`,
        figureId: figure2.id,
        purchaseType: 'figure_bundle',
      },
    });
  }
  console.log('✓ Created volume ownerships for figure 2 (vol 4-5)');

  for (let i = 1; i <= 2; i++) {
    await prisma.volumeRange.upsert({
      where: { id: `range-fig3-vol${i}` },
      update: {},
      create: {
        id: `range-fig3-vol${i}`,
        figureId: figure3.id,
        volumeId: `vol-2-${i}`,
      },
    });
  }
  console.log('✓ Created volume ranges for figure 3 (vol 1-2)');

  for (let i = 3; i <= 5; i++) {
    await prisma.volumeRange.upsert({
      where: { id: `range-fig4-vol${i}` },
      update: {},
      create: {
        id: `range-fig4-vol${i}`,
        figureId: figure4.id,
        volumeId: `vol-2-${i}`,
      },
    });
  }
  console.log('✓ Created volume ranges for figure 4 (vol 3-5)');

  for (let i = 1; i <= 2; i++) {
    await prisma.volumeOwnership.upsert({
      where: { id: `ownership-demo-fig3-vol${i}` },
      update: {},
      create: {
        id: `ownership-demo-fig3-vol${i}`,
        userId: user.id,
        volumeId: `vol-2-${i}`,
        figureId: figure3.id,
        purchaseType: 'figure_bundle',
      },
    });
  }
  console.log('✓ Created volume ownerships for figure 3 (vol 1-2)');

  // Create transactions for purchased figures (purchased by demo user)
  const transaction1 = await prisma.figureTransaction.upsert({
    where: { id: 'txn-demo-fig1' },
    update: {},
    create: {
      id: 'txn-demo-fig1',
      figureId: figure1.id,
      purchasedBy: user.id, // Demo user purchased this
      status: 'pending',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  });
  console.log('✓ Created transaction for figure 1:', transaction1.id);

  const transaction3 = await prisma.figureTransaction.upsert({
    where: { id: 'txn-demo-fig3' },
    update: {},
    create: {
      id: 'txn-demo-fig3',
      figureId: figure3.id,
      purchasedBy: user.id, // Demo user purchased this
      status: 'pending',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  });
  console.log('✓ Created transaction for figure 3:', transaction3.id);

  const transaction4 = await prisma.figureTransaction.upsert({
    where: { id: 'txn-demo-fig4' },
    update: {},
    create: {
      id: 'txn-demo-fig4',
      figureId: figure4.id,
      purchasedBy: user.id, // Demo user purchased this
      status: 'pending',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    },
  });
  console.log('✓ Created transaction for figure 4:', transaction4.id);

  const license = await prisma.license.upsert({
    where: { id: `license-${figure2.id}` },
    update: {},
    create: {
      id: `license-${figure2.id}`,
      figureId: figure2.id,
      ownerUserId: user.id,
    },
  });
  console.log('✓ Created license for demo user');

  await prisma.readRights.upsert({
    where: { figureId: figure1.id },
    update: {},
    create: {
      figureId: figure1.id,
      activeUserId: user.id,
      state: 'owner',
    },
  });
  await prisma.readRights.upsert({
    where: { figureId: figure2.id },
    update: {},
    create: {
      figureId: figure2.id,
      activeUserId: user.id,
      state: 'owner',
    },
  });
  await prisma.readRights.upsert({
    where: { figureId: figure3.id },
    update: {},
    create: {
      figureId: figure3.id,
      activeUserId: user.id,
      state: 'owner',
    },
  });
  console.log('✓ Created read rights for demo user (3 figures)');

  await prisma.review.upsert({
    where: { id: 'review-1' },
    update: {},
    create: {
      id: 'review-1',
      userId: user.id,
      seriesId: series1.id,
      rating: 5,
      comment: '最高の作品です！キャラクターが魅力的で、ストーリーも面白い。',
    },
  });
  console.log('✓ Created review');

  const products = [
    {
      id: 'prod-fig-1',
      type: 'figure',
      figureId: figure1.id,
      title: 'レナ＆ユウキ デラックスフィギュア（第1-3巻付き）',
      price: 4980,
      imageUrl: 'https://images.unsplash.com/photo-1705927450843-3c1abe9b17d6?w=400',
      badges: { new: true, popular: true },
    },
    {
      id: 'prod-fig-2',
      type: 'figure',
      figureId: figure2.id,
      title: '花子 ちびフィギュア（第4-5巻付き）',
      price: 2980,
      imageUrl: 'https://images.unsplash.com/photo-1569803237283-4af155d9e52b?w=400',
      badges: { new: true },
    },
    {
      id: 'prod-fig-3',
      type: 'figure',
      figureId: figure3.id,
      title: 'さくら 和服フィギュア（第1-2巻付き）',
      price: 5980,
      imageUrl: '/assets/kimono-girl-figure.png',
      badges: { new: true, popular: true },
    },
    {
      id: 'prod-fig-4',
      type: 'figure',
      figureId: figure4.id,
      title: '竜馬 戦闘ポーズフィギュア（第3-5巻付き）',
      price: 6980,
      imageUrl: '/assets/samurai-boy-figure.png',
      badges: { new: true },
    },
    {
      id: 'prod-vol-1-4',
      type: 'volume',
      volumeId: 'vol-1-4',
      title: '魔法学園アドベンチャー 第4巻',
      price: 500,
      imageUrl: 'https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400',
    },
    {
      id: 'prod-vol-1-5',
      type: 'volume',
      volumeId: 'vol-1-5',
      title: '魔法学園アドベンチャー 第5巻',
      price: 500,
      imageUrl: 'https://images.unsplash.com/photo-1634655377961-1c73f0e5e5e0?w=400',
      badges: { new: true },
    },
    {
      id: 'prod-merch-1',
      type: 'merchandise',
      title: 'アクリルスタンド',
      price: 1500,
      imageUrl: 'https://images.unsplash.com/photo-1569803237283-4af155d9e52b?w=400',
      badges: { popular: true },
    },
    {
      id: 'prod-merch-2',
      type: 'merchandise',
      title: 'オリジナルトートバッグ',
      price: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    },
  ];

  for (const prod of products) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {},
      create: prod,
    });
  }
  console.log(`✓ Created ${products.length} products`);

  const newsItems = [
    {
      id: 'news-1',
      title: '新刊第6巻発売決定！',
      date: new Date('2024-10-15'),
      thumbnailUrl: 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400',
      body: '待望の第6巻が2025年4月に発売決定！ファン待望の新展開が繰り広げられます。',
    },
    {
      id: 'news-2',
      title: '作者サイン会開催のお知らせ',
      date: new Date('2024-10-10'),
      thumbnailUrl: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400',
      body: '12月に東京・大阪でサイン会を開催します。詳細は公式サイトをご確認ください。',
    },
  ];

  for (const news of newsItems) {
    await prisma.news.upsert({
      where: { id: news.id },
      update: {},
      create: news,
    });
  }
  console.log(`✓ Created ${newsItems.length} news items`);

  const events = [
    {
      id: 'event-1',
      title: '作者サイン会 - 東京',
      date: new Date('2024-12-15T14:00:00Z'),
      location: '東京国際フォーラム',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      body: 'サイン会の詳細情報です。参加には事前予約が必要です。',
    },
    {
      id: 'event-2',
      title: '作者サイン会 - 大阪',
      date: new Date('2024-12-20T14:00:00Z'),
      location: '大阪国際会議場',
      thumbnailUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      body: 'サイン会の詳細情報です。参加には事前予約が必要です。',
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
  }
  console.log(`✓ Created ${events.length} events`);

  console.log('\n✨ Seed completed successfully!');
  console.log('\n📝 Demo credentials:');
  console.log('   Email: demo@example.com');
  console.log('   Password: password123');
  console.log('\n📚 Demo data:');
  console.log(`   - Series: ${series1.title}, ${series2.title}`);
  console.log(`   - Figures: ${figure1.title} (claimed by demo user)`);
  console.log(`   - Volumes owned: 1-3 (via figure)`);
  console.log(`   - Unclaimed figures for series2: ${figure3.title}, ${figure4.title}`);
  console.log('   - NFC Tag UID: DEMO-TAG-001');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
