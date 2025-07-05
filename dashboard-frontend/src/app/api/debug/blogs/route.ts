import { NextResponse } from 'next/server'
import { createSupabaseServiceClient } from '@/lib/supabase'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createSupabaseServiceClient()

    console.log('🔍 Diagnostic: Testing blog connectivity...')

    // Test 1: Count all blogs
    const { count: totalBlogs, error: countError } = await supabase
      .from('blogs')
      .select('*', { count: 'exact', head: true })

    console.log('📊 Total blogs in database:', totalBlogs)

    // Test 2: List all blogs with basic info
    const { data: allBlogs, error: listError } = await supabase
      .from('blogs')
      .select('id, name, domain, is_active')
      .order('created_at', { ascending: false })

    console.log('📋 All blogs:', allBlogs)

    // Test 3: Specific searches for our blogs
    const { data: einsof7, error: einsof7Error } = await supabase
      .from('blogs')
      .select('*')
      .eq('domain', 'einsof7.com')
      .single()

    const { data: opetmil, error: opetmilError } = await supabase
      .from('blogs')
      .select('*')
      .eq('domain', 'opetmil.com')
      .single()

    console.log('🤖 Einsof7 blog:', einsof7)
    console.log('📈 Opetmil blog:', opetmil)

    // Test 4: Check service vs anon key behavior
    const serviceKeyStatus = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'configured' : 'missing'
    const anonKeyStatus = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'configured' : 'missing'

    return NextResponse.json({
      success: true,
      diagnostics: {
        total_blogs: totalBlogs || 0,
        database_errors: {
          count_error: countError?.message,
          list_error: listError?.message,
          einsof7_error: einsof7Error?.message,
          opetmil_error: opetmilError?.message
        },
        blog_data: {
          all_blogs: allBlogs || [],
          einsof7_found: !!einsof7,
          einsof7_data: einsof7,
          opetmil_found: !!opetmil,
          opetmil_data: opetmil
        },
        api_keys: {
          service_role_key: serviceKeyStatus,
          anon_key: anonKeyStatus
        },
        rls_analysis: {
          service_role_query_worked: !countError && !listError,
          specific_queries_worked: !einsof7Error && !opetmilError,
          recommendation: totalBlogs === 0 
            ? 'No blogs found - check if data was inserted properly'
            : einsof7Error || opetmilError
            ? 'RLS policies may be blocking access - check Supabase RLS settings'
            : 'Database connectivity working normally'
        }
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 Diagnostic error:', error)
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      recommendation: 'Check Supabase configuration and API keys'
    }, { status: 500 })
  }
}