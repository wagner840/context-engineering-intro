const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuração do Supabase - usando variáveis de ambiente diretas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function extractDatabaseInfo() {
  console.log('🔍 Extraindo informações do banco de dados...\n');

  try {
    // 1. Buscar todos os blogs
    console.log('📊 Buscando informações dos blogs...');
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });

    if (blogsError) {
      console.error('❌ Erro ao buscar blogs:', blogsError);
      return;
    }

    console.log(`✅ Encontrados ${blogs?.length || 0} blogs:`);
    blogs?.forEach(blog => {
      console.log(`   - ${blog.name} (ID: ${blog.id})`);
      console.log(`     URL: ${blog.url}`);
      console.log(`     Status: ${blog.status}`);
      console.log(`     Criado: ${blog.created_at}`);
      console.log('');
    });

    // 2. Buscar estatísticas de posts por blog
    console.log('📝 Buscando estatísticas de posts...');
    const { data: postStats, error: postStatsError } = await supabase
      .from('content_posts')
      .select('blog_id, status')
      .order('created_at', { ascending: false });

    if (postStatsError) {
      console.error('❌ Erro ao buscar posts:', postStatsError);
    } else {
      const statsMap = {};
      postStats?.forEach(post => {
        if (!statsMap[post.blog_id]) {
          statsMap[post.blog_id] = { total: 0, published: 0, draft: 0 };
        }
        statsMap[post.blog_id].total++;
        if (post.status === 'publish') statsMap[post.blog_id].published++;
        if (post.status === 'draft') statsMap[post.blog_id].draft++;
      });

      console.log('📊 Estatísticas de posts por blog:');
      Object.entries(statsMap).forEach(([blogId, stats]) => {
        const blog = blogs?.find(b => b.id === blogId);
        console.log(`   ${blog?.name || blogId}: ${stats.total} total, ${stats.published} publicados, ${stats.draft} rascunhos`);
      });
    }

    // 3. Buscar keywords por blog
    console.log('\n🔍 Buscando estatísticas de keywords...');
    const { data: keywordStats, error: keywordStatsError } = await supabase
      .from('keywords')
      .select('blog_id, status')
      .order('created_at', { ascending: false });

    if (keywordStatsError) {
      console.error('❌ Erro ao buscar keywords:', keywordStatsError);
    } else {
      const keywordMap = {};
      keywordStats?.forEach(keyword => {
        if (!keywordMap[keyword.blog_id]) {
          keywordMap[keyword.blog_id] = { total: 0, active: 0 };
        }
        keywordMap[keyword.blog_id].total++;
        if (keyword.status === 'active') keywordMap[keyword.blog_id].active++;
      });

      console.log('🔍 Estatísticas de keywords por blog:');
      Object.entries(keywordMap).forEach(([blogId, stats]) => {
        const blog = blogs?.find(b => b.id === blogId);
        console.log(`   ${blog?.name || blogId}: ${stats.total} total, ${stats.active} ativas`);
      });
    }

    // 4. Buscar métricas de analytics
    console.log('\n📈 Buscando métricas de analytics...');
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('analytics_metrics')
      .select('blog_id, metric_type, metric_value, metric_date')
      .order('metric_date', { ascending: false })
      .limit(100);

    if (analyticsError) {
      console.error('❌ Erro ao buscar analytics:', analyticsError);
    } else {
      const analyticsMap = {};
      analyticsData?.forEach(metric => {
        if (!analyticsMap[metric.blog_id]) {
          analyticsMap[metric.blog_id] = {};
        }
        if (!analyticsMap[metric.blog_id][metric.metric_type]) {
          analyticsMap[metric.blog_id][metric.metric_type] = 0;
        }
        analyticsMap[metric.blog_id][metric.metric_type]++;
      });

      console.log('📈 Métricas de analytics por blog:');
      Object.entries(analyticsMap).forEach(([blogId, metrics]) => {
        const blog = blogs?.find(b => b.id === blogId);
        console.log(`   ${blog?.name || blogId}:`);
        Object.entries(metrics).forEach(([type, count]) => {
          console.log(`     - ${type}: ${count} registros`);
        });
      });
    }

    // 5. Verificar estrutura das tabelas principais
    console.log('\n🏗️  Verificando estrutura das tabelas...');
    const tables = ['blogs', 'content_posts', 'keywords', 'analytics_metrics'];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (!error && data && data.length > 0) {
        console.log(`✅ Tabela ${table} - Colunas disponíveis:`);
        console.log(`   ${Object.keys(data[0]).join(', ')}`);
      }
    }

    // Salvar informações em arquivo JSON
    const dbInfo = {
      blogs: blogs || [],
      totalPosts: postStats?.length || 0,
      totalKeywords: keywordStats?.length || 0,
      totalAnalytics: analyticsData?.length || 0,
      extractedAt: new Date().toISOString()
    };

    require('fs').writeFileSync(
      '/home/wagner/context-engineering-intro/dashboard-frontend/db-info.json',
      JSON.stringify(dbInfo, null, 2)
    );

    console.log('\n✅ Informações extraídas e salvas em db-info.json');

  } catch (error) {
    console.error('❌ Erro durante extração:', error);
  }
}

// Executar extração
extractDatabaseInfo();