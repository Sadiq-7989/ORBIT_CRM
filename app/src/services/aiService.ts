import { GoogleGenerativeAI } from '@google/generative-ai';
import { analyticsService } from './analyticsService';
import { customerService } from './customerService';
import { dealService } from './dealService';
import { taskService } from './taskService';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Smart context loader based on user keywords to reduce latency and token usage
async function loadCrmContext(message: string): Promise<string> {
  const query = message.toLowerCase().trim();
  
  const includesCustomer = query.includes('customer') || query.includes('client') || query.includes('account') || query.includes('lead');
  const includesDeal = query.includes('deal') || query.includes('pipeline') || query.includes('sales') || query.includes('revenue') || query.includes('won') || query.includes('lost') || query.includes('negotiation');
  const includesTask = query.includes('task') || query.includes('todo') || query.includes('checklist') || query.includes('priority') || query.includes('pending');
  const includesDashboard = query.includes('dashboard') || query.includes('overview') || query.includes('stats') || query.includes('kpi');
  
  // Decide which data modules to load. If general query, load basic aggregates of everything
  const loadCustomer = includesCustomer || (!includesDeal && !includesTask && !includesDashboard);
  const loadDeal = includesDeal || (!includesCustomer && !includesTask && !includesDashboard);
  const loadTask = includesTask || (!includesCustomer && !includesDeal && !includesDashboard);
  const loadDashboard = includesDashboard || (!includesCustomer && !includesDeal && !includesTask);
  
  const promises: any[] = [];
  
  let statsIdx = -1;
  let customersIdx = -1;
  let customerAnalyticsIdx = -1;
  let dealsIdx = -1;
  let revenueAnalyticsIdx = -1;
  let pipelineAnalyticsIdx = -1;
  let tasksIdx = -1;
  let taskAnalyticsIdx = -1;
  
  if (loadDashboard) {
    statsIdx = promises.length;
    promises.push(analyticsService.getDashboardStats());
  }
  
  if (loadCustomer) {
    customersIdx = promises.length;
    promises.push(customerService.getCustomers());
    customerAnalyticsIdx = promises.length;
    promises.push(analyticsService.getCustomerAnalytics('30d'));
  }
  
  if (loadDeal) {
    dealsIdx = promises.length;
    promises.push(dealService.getDeals());
    revenueAnalyticsIdx = promises.length;
    promises.push(analyticsService.getRevenueAnalytics('30d'));
    pipelineAnalyticsIdx = promises.length;
    promises.push(analyticsService.getPipelineAnalytics());
  }
  
  if (loadTask) {
    tasksIdx = promises.length;
    promises.push(taskService.getTasks());
    taskAnalyticsIdx = promises.length;
    promises.push(analyticsService.getTaskAnalytics('30d'));
  }
  
  const results = await Promise.all(promises);
  let contextStr = "CRM Database Context:\n";
  
  if (statsIdx !== -1 && results[statsIdx]) {
    const stats = results[statsIdx];
    contextStr += `\nDashboard Overview KPIs:\n- Total Customers: ${stats.totalCustomers}\n- Total Deals: ${stats.totalDeals}\n- Pipeline Total Value: $${stats.pipelineValue}\n- Open Tasks: ${stats.openTasks}\n- Completed Tasks: ${stats.completedTasks}\n`;
  }
  
  if (customersIdx !== -1 && results[customersIdx]) {
    const list = results[customersIdx] || [];
    const analytics = results[customerAnalyticsIdx];
    const recent = list.slice(0, 5);
    if (analytics) {
      contextStr += `\nCustomer Acquisition Summary (30d):\n- Total Directory accounts: ${analytics.totalCustomers}\n- New accounts in range: ${analytics.newCustomers}\n- Growth velocity rate: ${analytics.growthRate.toFixed(1)}%\n- Source Attribution: ${analytics.sourceBreakdown.map((s: any) => `${s.source}: ${s.count}`).join(', ')}\n`;
    }
    contextStr += `\nRecent 5 Customer Registrations:\n`;
    if (recent.length === 0) {
      contextStr += `  (No customer records registered)\n`;
    } else {
      recent.forEach((c: any) => {
        contextStr += `  - Name: ${c.name}, Company: ${c.company || 'N/A'}, Status: ${c.status || 'N/A'}, Source: ${c.source || 'N/A'}\n`;
      });
    }
  }
  
  if (dealsIdx !== -1 && results[dealsIdx]) {
    const list = results[dealsIdx] || [];
    const revAnalytics = results[revenueAnalyticsIdx];
    const pipeAnalytics = results[pipelineAnalyticsIdx] || [];
    const recent = list.slice(0, 5);
    if (revAnalytics) {
      contextStr += `\nSales Revenue & Pipeline Summary (30d):\n- Total Won Revenue: $${revAnalytics.totalRevenue}\n- Open Pipeline Potential: $${revAnalytics.pipelineValue}\n- Average deal valuation size: $${revAnalytics.averageDealValue.toFixed(0)}\n- Won deals count: ${revAnalytics.wonDealsCount}\n- Revenue Period growth: ${revAnalytics.growthRate.toFixed(1)}%\n- Pipeline stages breakdown: ${pipeAnalytics.map((p: any) => `${p.stage}: $${p.value} (${p.count} deals)`).join(', ')}\n`;
    }
    contextStr += `\nRecent 5 Deal Records:\n`;
    if (recent.length === 0) {
      contextStr += `  (No deal records registered)\n`;
    } else {
      recent.forEach((d: any) => {
        contextStr += `  - Title: ${d.title}, Value: $${d.value || 0}, Stage: ${d.stage}, Close Prob: ${d.probability || 10}%, Expected Close: ${d.expected_close || 'N/A'}\n`;
      });
    }
  }
  
  if (tasksIdx !== -1 && results[tasksIdx]) {
    const list = results[tasksIdx] || [];
    const analytics = results[taskAnalyticsIdx];
    const pending = list.filter((t: any) => t.status !== 'Completed').slice(0, 5);
    if (analytics) {
      contextStr += `\nTasks Checklist Summary (30d):\n- Total Active Range Tasks: ${analytics.totalTasks}\n- Completed tasks: ${analytics.completedTasks}\n- Pending tasks: ${analytics.pendingTasks}\n- Operational efficiency rate: ${analytics.completionRate.toFixed(1)}%\n- Overdue Checklist backlog: ${analytics.overdueTasks}\n`;
    }
    contextStr += `\nRecent 5 Pending Tasks:\n`;
    if (pending.length === 0) {
      contextStr += `  (No pending tasks registered)\n`;
    } else {
      pending.forEach((t: any) => {
        contextStr += `  - Title: ${t.title}, Priority: ${t.priority || 'Medium'}, Status: ${t.status || 'Pending'}, Due Date: ${t.due_date || 'N/A'}\n`;
      });
    }
  }
  
  return contextStr;
}

export const aiService = {
  // Synthesize dashboard statistics report (Mock fallback helper)
  async summarizeDashboard(): Promise<string> {
    const stats = await analyticsService.getDashboardStats();
    const formattedVal = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(stats.pipelineValue);

    return `Here is your Orbit CRM Dashboard summary:

• **Total Customers**: ${stats.totalCustomers} registered accounts.
• **Pipeline Volume**: ${stats.totalDeals} active deals valued at **${formattedVal}** in total.
• **Checklist status**: You have **${stats.openTasks}** pending tasks remaining, and **${stats.completedTasks}** completed.

*Orbit Recommendation*: Try following up on deals in the 'Negotiation' stage to keep sales targets active.`;
  },

  // Synthesize customer directory report (Mock fallback helper)
  async summarizeCustomers(): Promise<string> {
    const list = await customerService.getCustomers();
    if (list.length === 0) {
      return "You do not have any customer records registered in your directory yet.";
    }

    const activeCount = list.filter((c) => c.status?.toLowerCase() === 'active').length;
    const leadCount = list.filter((c) => c.status?.toLowerCase() === 'lead').length;
    const companyNames = Array.from(new Set(list.map((c) => c.company).filter(Boolean)))
      .slice(0, 3)
      .join(', ');

    return `Here is a summary of your customer directory:

• **Total Profiles**: ${list.length} accounts.
• **Status Splits**: ${activeCount} active client relationships and ${leadCount} leads.
• **Core Partnerships**: ${companyNames ? `Key organizations include: ${companyNames}` : 'Mainly individual accounts.'}

Would you like me to search high-value customer details or check pending tasks?`;
  },

  // Synthesize deals status report (Mock fallback helper)
  async summarizeDeals(): Promise<string> {
    const list = await dealService.getDeals();
    if (list.length === 0) {
      return "Your sales pipeline is empty. You do not have any deal records registered.";
    }

    const totalVal = list.reduce((sum, d) => sum + (d.value || 0), 0);
    const formattedVal = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(totalVal);

    const stages: Record<string, number> = {};
    list.forEach((d) => {
      stages[d.stage] = (stages[d.stage] || 0) + 1;
    });

    const stageDetails = Object.entries(stages)
      .map(([stage, count]) => `• **${stage}**: ${count} ${count === 1 ? 'deal' : 'deals'}`)
      .join('\n');

    return `Here is a summary of your active sales pipeline:

• **Active Deals**: ${list.length} deals in progress.
• **Pipeline Worth**: **${formattedVal}** total potential value.
• **Stage Breakdown**:
${stageDetails}

Would you like to list closing dates or see stage value breakdown?`;
  },

  // Synthesize tasks status report (Mock fallback helper)
  async summarizeTasks(): Promise<string> {
    const list = await taskService.getTasks();
    const pending = list.filter((t) => t.status !== 'Completed');
    if (list.length === 0) {
      return "You have no checklist tasks registered.";
    }

    const highPriority = pending.filter((t) => t.priority === 'High').length;
    const overdue = pending.filter((t) => t.due_date && new Date(t.due_date) < new Date()).length;

    return `Here is your Checklist summary:

• **Checklist Volume**: ${list.length} tasks registered.
• **Pending Items**: ${pending.length} tasks remaining.
• **Overdue Checklist**: ${overdue} tasks have passed their due dates.
• **Priority Alert**: There are ${highPriority} high-priority tasks requiring focus.

I recommend completing overdue tasks first. Would you like me to display them?`;
  },

  // Generate suggested quick prompt chips
  async generateSuggestions(): Promise<string[]> {
    const [tasks, deals] = await Promise.all([
      taskService.getTasks(),
      dealService.getDeals(),
    ]);

    const suggestions: string[] = [];
    const pending = tasks.filter((t) => t.status !== 'Completed');
    const highPriority = pending.find((t) => t.priority === 'High');

    if (highPriority) {
      suggestions.push(`Complete task "${highPriority.title}"`);
    }

    const negotiationDeals = deals.filter((d) => d.stage === 'Negotiation');
    if (negotiationDeals.length > 0) {
      suggestions.push(`Follow up on "${negotiationDeals[0].title}"`);
    }

    suggestions.push("Summarize my sales pipeline");
    suggestions.push("Check my dashboard overview");

    return suggestions.slice(0, 3);
  },

  // Connects with Gemini 2.5 Flash API
  async chatWithGemini(message: string, history: ChatMessage[]): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey.trim() === '') {
      return "Authentication Error: The Google Gemini API key (`VITE_GEMINI_API_KEY`) is missing. Please configure it in your `.env` settings to enable the Business Copilot.";
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const context = await loadCrmContext(message);

      const systemInstruction = `You are Orbit AI, a professional Enterprise CRM Business Copilot for Orbit CRM.
Your objective is to help the user understand and analyze their CRM data, offering concise, professional, and business-oriented responses.

CRITICAL RULES:
1. Never invent, fabricate, or assume any customers, deals, tasks, analytics, or business records that are not explicitly present in the provided context.
2. Rely ONLY on the supplied "CRM Database Context" provided in the prompt context.
3. If requested information is unavailable or not present in the supplied context, clearly explain that the CRM database does not currently contain that information. Never guess.
4. When appropriate, format responses using Markdown tables, bullet lists, numbered lists, and bold text.
5. Wherever possible, include:
   - **Summary**: A concise description.
   - **Business Insight**: An analytical observation from the data.
   - **Recommended Next Action**: An actionable recommendation (e.g. following up on high-value negotiation deals, resolving overdue checklist tasks).`;

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
      });

      // Filter messages to match Gemini's strict ChatSession history schema: { role: 'user' | 'model', parts: [{ text: string }] }
      const geminiHistory = history
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role === 'user' ? 'user' : ('model' as const),
          parts: [{ text: msg.content }],
        }));

      const chatSession = model.startChat({
        history: geminiHistory,
      });

      const promptContent = `
=== CRM DATABASE CONTEXT ===
${context}
============================

User Query: "${message}"

Please respond using the above context and rules.`;

      const result = await chatSession.sendMessage(promptContent);
      const responseText = result.response.text();
      return responseText.trim();

    } catch (err: any) {
      console.error('Error contacting Gemini API:', err);
      
      const errorMsg = String(err?.message || '').toLowerCase();
      
      if (!window.navigator.onLine) {
        return "Network Failure: You appear to be offline. Please verify your network connection and try again.";
      }
      if (errorMsg.includes('api_key_invalid') || errorMsg.includes('api key') || errorMsg.includes('key not valid') || errorMsg.includes('auth')) {
        return "Authentication Error: The configured `VITE_GEMINI_API_KEY` is invalid or unauthorized. Please verify your Google AI Studio credentials.";
      }
      if (errorMsg.includes('resource_exhausted') || errorMsg.includes('quota') || errorMsg.includes('rate limit') || errorMsg.includes('429')) {
        return "Rate Limit Exceeded: You have reached the Gemini API quota limit. Please wait a moment before clicking retry.";
      }
      
      return "Gemini API Error: I encountered an issue retrieving insights. Please check your internet connection, verify your API Key, and try again.";
    }
  },

  // Abstract Chat Entry Point (ready for OpenAI/Gemini/Claude integrations)
  async chat(message: string, history: ChatMessage[]): Promise<string> {
    // Under the hood, this uses Gemini provider, but remains pluggable for future provider switching
    return this.chatWithGemini(message, history);
  },
};
