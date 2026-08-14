import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Priority } from '@prisma/client';

export interface AiAgentClassification {
  category: string;
  priority: Priority;
}

@Injectable()
export class AiAgentService {
  private readonly logger = new Logger(AiAgentService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private hasApiKey = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.hasApiKey = true;
    } else {
      this.logger.warn('GEMINI_API_KEY não encontrada. O sistema utilizará a heurística local de triagem.');
    }
  }

  async classifyTicket(
    title: string, 
    description: string
  ): Promise<AiAgentClassification> {
    if (!this.hasApiKey || !this.genAI) {
      return this.mockClassification(title, description);
    }

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' }
      });

      const prompt = `Você é uma IA de triagem de um helpdesk.
        Analise o chamado abaixo e retorne um JSON com exatas duas chaves:
        "category" (string curta categorizando o problema, ex: Hardware, Software, Rede, Acessos, etc.) e
        "priority" (string com exatamente um destes valores: BAIXA, MEDIA, ALTA).
      
        Título do chamado: ${title}
        Descrição: ${description}`;

      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());

      const priorityMap = { 
        'BAIXA': Priority.BAIXA, 
        'MEDIA': Priority.MEDIA, 
        'ALTA': Priority.ALTA 
      };
      const priority = priorityMap[parsed.priority?.toUpperCase()] || Priority.MEDIA;

      return { 
        category: parsed.category || 'Geral', 
        priority 
      }
    } catch (error) {
      this.logger.error('Erro ao consultar o Gemini API. Caindo para a heurística (Mock)...', error);
      return this.mockClassification(title, description);
    }
  }

  private mockClassification(
    title: string, 
    description: string
  ): AiAgentClassification {
    const content = `${title} ${description}`.toLowerCase();
    
    if (content.includes('urgente') || content.includes('quebrou') || content.includes('parou') || content.includes('travado')) {
      return { 
        category: 'Hardware/Crítico', 
        priority: Priority.ALTA 
      }
    } else if (content.includes('senha') || content.includes('acesso') || content.includes('login') || content.includes('email')) {
      return { 
        category: 'Acessos', 
        priority: Priority.MEDIA 
      }
    }
    
    return { 
      category: 'Dúvidas/Geral', 
      priority: Priority.BAIXA 
    }
  }
}