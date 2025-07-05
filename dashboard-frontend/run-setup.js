/**
 * Script para executar o setup dos blogs diretamente
 */

const { runBlogSetup } = require('./src/scripts/setup-blogs.ts')

async function main() {
  console.log('🚀 Executando setup dos blogs einsof7 e optemil...')
  
  try {
    const result = await runBlogSetup()
    
    if (result.success) {
      console.log('✅ Setup concluído com sucesso!')
      console.log('📊 Verificando configuração...')
      
      // Verificar se os blogs foram criados
      const { supabase } = require('./src/lib/supabase')
      const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .in('domain', ['einsof7.com', 'opetmil.com'])
      
      console.log(`📝 Blogs configurados: ${blogs?.length || 0}`)
      blogs?.forEach(blog => {
        console.log(`   - ${blog.name} (${blog.domain}) - ${blog.is_active ? 'Ativo' : 'Inativo'}`)
      })
      
    } else {
      console.error('❌ Erro no setup:', result.error)
    }
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

main()