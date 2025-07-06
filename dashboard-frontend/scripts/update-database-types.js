const fs = require("fs");
const path = require("path");

// Ler os tipos gerados (você precisará copiar o conteúdo gerado aqui)
const generatedTypes = `export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // ... tipos gerados pelo Supabase
    }
    Views: {
      // ... views geradas pelo Supabase
    }
    Functions: {
      // ... funções geradas pelo Supabase
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ... resto dos tipos auxiliares
`;

// Salvar no arquivo de tipos
const outputPath = path.join(__dirname, "..", "src", "types", "database.ts");
fs.writeFileSync(outputPath, generatedTypes, "utf8");

console.log("Tipos do database atualizados com sucesso!");
