import requests
import json
import os
from datetime import datetime

# Configuração do Supabase
supabase_url = "https://wayzhnpwphekjuznwqnr.supabase.co"
supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndheXpobnB3cGhla2p1em53cW5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NjYwMzgsImV4cCI6MjA2NjE0MjAzOH0.fM0gVuYknsybGsw6z7cKf5KcRwCCFfok9W0NPx93yT8"

# Headers para requisições
headers = {
    "apikey": supabase_key,
    "Authorization": f"Bearer {supabase_key}",
    "Content-Type": "application/json"
}

def extract_database_info():
    print("🔍 Extraindo informações do banco de dados...\n")
    
    db_info = {
        "blogs": [],
        "posts_stats": {},
        "keywords_stats": {},
        "analytics_stats": {},
        "extracted_at": datetime.now().isoformat()
    }
    
    try:
        # 1. Buscar blogs
        print("📊 Buscando informações dos blogs...")
        response = requests.get(f"{supabase_url}/rest/v1/blogs", headers=headers)
        
        if response.status_code == 200:
            blogs = response.json()
            db_info["blogs"] = blogs
            print(f"✅ Encontrados {len(blogs)} blogs:")
            for blog in blogs:
                print(f"  - {blog.get('name', 'N/A')} (ID: {blog.get('id', 'N/A')})")
                print(f"    URL: {blog.get('url', 'N/A')}")
                print(f"    Domínio: {blog.get('domain', 'N/A')}")
                print(f"    Status: {blog.get('status', 'N/A')}")
                print()
        else:
            print(f"❌ Erro ao buscar blogs: {response.status_code}")
            print(f"Resposta: {response.text}")
            
        # 2. Buscar posts
        print("📝 Buscando posts...")
        response = requests.get(f"{supabase_url}/rest/v1/content_posts?select=blog_id,status,title&limit=1000", headers=headers)
        
        if response.status_code == 200:
            posts = response.json()
            # Agrupar por blog_id
            for post in posts:
                blog_id = post.get('blog_id')
                if blog_id not in db_info["posts_stats"]:
                    db_info["posts_stats"][blog_id] = {"total": 0, "published": 0, "draft": 0}
                
                db_info["posts_stats"][blog_id]["total"] += 1
                if post.get('status') == 'publish':
                    db_info["posts_stats"][blog_id]["published"] += 1
                elif post.get('status') == 'draft':
                    db_info["posts_stats"][blog_id]["draft"] += 1
                    
            print(f"✅ Encontrados {len(posts)} posts no total")
            
        # 3. Buscar keywords
        print("🔍 Buscando keywords...")
        response = requests.get(f"{supabase_url}/rest/v1/keywords?select=blog_id,status&limit=1000", headers=headers)
        
        if response.status_code == 200:
            keywords = response.json()
            # Agrupar por blog_id
            for keyword in keywords:
                blog_id = keyword.get('blog_id')
                if blog_id not in db_info["keywords_stats"]:
                    db_info["keywords_stats"][blog_id] = {"total": 0, "active": 0}
                
                db_info["keywords_stats"][blog_id]["total"] += 1
                if keyword.get('status') == 'active':
                    db_info["keywords_stats"][blog_id]["active"] += 1
                    
            print(f"✅ Encontradas {len(keywords)} keywords no total")
            
        # 4. Buscar analytics
        print("📈 Buscando métricas de analytics...")
        response = requests.get(f"{supabase_url}/rest/v1/analytics_metrics?select=blog_id,metric_type&limit=1000", headers=headers)
        
        if response.status_code == 200:
            analytics = response.json()
            # Agrupar por blog_id
            for metric in analytics:
                blog_id = metric.get('blog_id')
                if blog_id not in db_info["analytics_stats"]:
                    db_info["analytics_stats"][blog_id] = {}
                
                metric_type = metric.get('metric_type', 'unknown')
                if metric_type not in db_info["analytics_stats"][blog_id]:
                    db_info["analytics_stats"][blog_id][metric_type] = 0
                
                db_info["analytics_stats"][blog_id][metric_type] += 1
                
            print(f"✅ Encontradas {len(analytics)} métricas no total")
            
        # Salvar informações
        with open('db-info.json', 'w', encoding='utf-8') as f:
            json.dump(db_info, f, indent=2, ensure_ascii=False)
        
        print("\n✅ Informações extraídas e salvas em db-info.json")
        
        # Mostrar resumo
        print("\n📊 RESUMO:")
        print(f"Blogs: {len(db_info['blogs'])}")
        print(f"Posts: {sum(stats['total'] for stats in db_info['posts_stats'].values())}")
        print(f"Keywords: {sum(stats['total'] for stats in db_info['keywords_stats'].values())}")
        print(f"Métricas: {sum(sum(metrics.values()) for metrics in db_info['analytics_stats'].values())}")
        
        return db_info
        
    except Exception as e:
        print(f"❌ Erro durante extração: {e}")
        return None

if __name__ == "__main__":
    extract_database_info()