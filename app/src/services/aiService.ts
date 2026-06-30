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

export const aiService = {
  // Synthesize dashboard statistics report
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

  // Synthesize customer segmentation report
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

  // Synthesize deals status report
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

  // Synthesize tasks status report
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

  // Abstract Chat Entry Point (ready for OpenAI/Gemini/Claude integrations)
  async chat(message: string, _history: ChatMessage[]): Promise<string> {
    // Simulate a brief delay to feel realistic and allow typing indicator visibility
    await new Promise((resolve) => setTimeout(resolve, 800));

    const msg = message.toLowerCase().trim();

    if (msg.includes('dashboard') || msg.includes('overview') || msg.includes('stats')) {
      return this.summarizeDashboard();
    }
    if (msg.includes('customer') || msg.includes('clients')) {
      return this.summarizeCustomers();
    }
    if (msg.includes('deal') || msg.includes('pipeline') || msg.includes('sales')) {
      return this.summarizeDeals();
    }
    if (msg.includes('task') || msg.includes('todo') || msg.includes('checklist')) {
      return this.summarizeTasks();
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('help') || msg.includes('hey')) {
      return `Hello! I am Orbit AI, your virtual assistant. I can analyze CRM data and summarize records.

Try asking me to:
• *Summarize my dashboard*
• *Review customer stats*
• *List pipeline deals*
• *Check checklist tasks*`;
    }

    return `I received your message: "${message}".

I am currently in *Abstract Foundation Mode*. I can summarize your active CRM modules.

Try asking me to:
• **Summarize dashboard**
• **Summarize customers**
• **Summarize deals**
• **Summarize tasks**`;
  },
};
